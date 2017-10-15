// Constants
const daysForEligibility = 365 * 2;
const nationalInsuranceTax = 0.12;
const capitalGainTax = 0.25;

// Stock exceptions
const stockExceptions = [
    {
        type: "split",
        action: ["adjust"],
        date: new Date("2015/07/20"),
        ticker: "ebay",
        relativeMultiplyer: 0.4259768491 
    },
    {
        type: "split",
        action: ["adjust", "rename"],
        date: new Date("2015/07/20"),
        ticker: "pypl",
        splitFrom: "ebay",
        relativeMultiplyer: 0.5740231509
    }
];

export default class RSUTaxCalculator {
    
    /*
	   stockSymbol: (String) AAPL, EBAY, NOB, etc`...
       startDate: (String) 2013/01/31
       endDate: ditto
       callback: (function)
	*/
	getQuandlFinanceData(stockSymbol, startDate, endDate, callback) {
		var start = new Date(startDate),
			end   = new Date(endDate),
			data  = [];
		
		var startDateString = "" + start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate();
		var endDateString = "" + end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate();
        
		
        // TODO allow GOOG retreivals from other stock markets, not just NASDAQ. for instance, Visa (V) is not on NASDAQ 
		var datasetGoogURLPrefix = "https://www.quandl.com/api/v3/datasets/GOOG/NASDAQ_";
		var datasetWIKIURLPrefix = "https://www.quandl.com/api/v3/datasets/WIKI/";
		var urlPath =  stockSymbol + "/data.json?column_index=4&start_date=" + startDateString + "&end_date=" + endDateString + "&order=desc";
		
		var urlGoog = datasetGoogURLPrefix + urlPath;
		var urlWIKI = datasetWIKIURLPrefix + urlPath;
		
        fetch(urlGoog).then((res) => {
            return res.json();
        }).then((json) => {
            const data = json.dataset_data.data;
            callback(null, data)
        }).catch((err) => {
            fetch(urlWIKI).then((res) => {
                return res.json();
            }).then((json) => {
                const data = json.dataset_data.data;
                callback(null, data)
            }).catch((err) => {
                callback(err);
            })
        })
	}
   
    /*
        data: {
            ticker: (String)
            grantDate: (String - for Date)
            marginalTaxRate: (int)
            saleDate: Date
        }
        callback: (function)
    */
	getGrantInfo(data, callback) {
        var ticker = data.ticker;
        var grantDate = data.grantDate;
        var marginalTaxRate = data.marginalTaxRate;
        var saleDate = data.saleDate;
        
        // add validity check? grant date is less than today
        var millisecOneDay = 24*60*60*1000;
        var millisec45Days = 45*millisecOneDay; 
        var millisec7Days = 7*millisecOneDay;
        var date45DaysBeforeGrant = new Date(grantDate.getTime() - millisec45Days);
        var today = saleDate;
        var lastWeek = new Date(today.getTime() - millisec7Days);
        var daysFromGrant = Math.floor((today.getTime() - grantDate.getTime())/millisecOneDay);
        var eligibleFor102 = daysFromGrant > 365*2;  
        var personalTaxRate = parseFloat(marginalTaxRate) + parseFloat(nationalInsuranceTax);
        var daysUntileligibleFor102 = Math.ceil((grantDate.getTime() + daysForEligibility * millisecOneDay - today.getTime()) / millisecOneDay);

        const getStockPriceForDate = (ticker, lastWeek, today) => {
            return new Promise((resolve, reject) => {
                this.getQuandlFinanceData(ticker, lastWeek, today, function(err, result){
                    if (err){
                        reject(err);
                        return;
                    }
                    var lastPrice = result[0][1];
                    resolve(lastPrice);
                });            
                
            });
        }

        const getCostBasisForGrantDate = (ticker, date45DaysBeforeGrant, grantDate) => {            
            return new Promise((resolve, reject) => {
                // special case for exceptions (pypl, ebay before the split)
                for (var i = 0 ; i < stockExceptions.length; i++){
                    if (stockExceptions[i].ticker == ticker && 
                        grantDate.getTime() < stockExceptions[i].date.getTime() && 
                        stockExceptions[i].splitFrom) {
                        ticker = stockExceptions[i].splitFrom;
                        break;            
                    }
                }

                this.getQuandlFinanceData(ticker, date45DaysBeforeGrant, grantDate, (err, result) => {
                    if (err){
                        reject(new Error("Quandle error: " + err));
                        return;
                    }
                    var sum = 0;
                    for (var i = 0 ; i < result.length && i < 30; i++){
                        sum += result[i][1];
                    }
                    var costBasis;
                    if (result.length < 30) {
                        reject(new Error("Not enough data to compute cost basis. Last data point is from " + result[result.length][0]));
                    } else {
                        costBasis = sum/30;
                    }
                    
                    resolve(costBasis);
                });
            });
        }
                 
        var promiseCostBasis = getCostBasisForGrantDate(ticker, date45DaysBeforeGrant, grantDate);
        var promiseStockPrice = getStockPriceForDate(ticker, lastWeek, today);
        var promises = [promiseStockPrice, promiseCostBasis];

        const computeGain = (lastPrice, costBasis, grantDate) => {
            // special case for exceptions (ebay, pypl)
            for (var i = 0 ; i < stockExceptions.length; i++){
                if ((stockExceptions[i].ticker == ticker) && (grantDate.getTime() < stockExceptions[i].date.getTime())) {
                    costBasis = costBasis * stockExceptions[i].relativeMultiplyer;
                    break;            
                }
            }

            var partEligibleFor102 = lastPrice - costBasis;
            var partOfSaleForIncomeTax = lastPrice > costBasis && eligibleFor102 ? costBasis : lastPrice;
            var partOfSaleForCapitalTax = lastPrice - partOfSaleForIncomeTax;
            var regularTax = partOfSaleForIncomeTax * personalTaxRate;
            var capitalTax = partOfSaleForCapitalTax * capitalGainTax;
            var totalTax = regularTax + capitalTax;
            var totalGain = lastPrice - totalTax; 
            
            var taxWithout102 = lastPrice * personalTaxRate;
            var gainWithout102 = lastPrice - taxWithout102;
            
            var taxWith102 = costBasis * personalTaxRate + partEligibleFor102 * capitalGainTax;
            var gainWith102 = lastPrice - taxWith102;
            
            var equilibriumCalculation = {};
            if (daysUntileligibleFor102 > 0) {
                equilibriumCalculation.gainOnCostBasis = costBasis * (1 - personalTaxRate);
                equilibriumCalculation.futureEquilibriumPrice = (gainWithout102 - equilibriumCalculation.gainOnCostBasis)/(1 - capitalTax) + costBasis;
            }
            
            callback(null, {
                daysFromGrant,
                eligibleFor102,
                daysUntileligibleFor102,
                lastPrice,
                costBasis,
                partEligibleFor102,
                partOfSaleForIncomeTax,
                partOfSaleForCapitalTax,
                regularTax,
                capitalTax,
                totalTax, 
                totalGain,
                gainWith102,
                taxWithout102,
                gainWithout102,
                equilibriumCalculation
            }); 
        }
        
        Promise.all(promises).then( (values) => {
            var lastPrice = values[0];
            var costBasis = values[1];
            computeGain(lastPrice, costBasis, grantDate);             
        }, function(error){
            callback(error)
        });
    };
};

