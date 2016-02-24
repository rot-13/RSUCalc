var FieldClass = React.createClass({
  getInitialState: function() {
    return {value: this.props.value};
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
  },
  value: function() {
    return this.state.value;
  },
  render: function() {
    var input = ( <input ref="input" className="form-control" id={this.props.field} placeholder={this.props.placeholder} value={this.state.value} onChange={this.handleChange} /> );
    // if (this.props.prefix) {
    //   input = (
    //     <div className="input-group">
    //       <span className="input-group-addon">{ this.props.prefix }</span>
    //       { input }
    //     </div>
    //   );
    // }
    return (
      <fieldset className="form-group">
        <label htmlFor={this.props.field} >{this.props.label}</label>
        <span> ({this.props.engLabel})</span>
        {input}
      </fieldset>
    );
  }
});

var CalculatorForm = React.createClass({
  handleSubmit: function(ev) {
    ev.preventDefault();
    var saleDate = this.refs.saleDate.value() == "Today" ? new Date() : this.refs.saleDate.value();
    var data = {
      ticker: this.refs.ticker.value(),
      grantDate: this.refs.grantDate.value(),
      marginalTaxRate: this.refs.incomeTax.value(),
      saleDate: saleDate,
      numberOfShares: this.refs.numShares.value(),
    }
    var rsu = new RSUTaxCalculator;
    var resultSubmit = this.props.onSubmit;
    rsu.getGrantInfo(data, function(error, result){
        if (result) {
            result.numberOfShares = data.numberOfShares;
        }
        resultSubmit(error, result);
    });
  },
  render: function() {
    return (
      <form className="calc-form" onSubmit={this.handleSubmit}>
        <FieldClass ref="ticker" field="ticker" engLabel="ticker" label="מניה" placeholder="AAPL" value={this.props.data.ticker} />
        <FieldClass ref="grantDate" field="grant-date" engLabel="grant date" label="תאריך הענקת המניות" placeholder="2015/03/15" value={this.props.data.grantDate} />
        <FieldClass ref="incomeTax" field="income-tax" engLabel="personal income tax rate" label="מס שולי" placeholder="30%" value={this.props.data.incomeTax}/>
        <FieldClass ref="numShares" field="number-of-shares" engLabel="number of shares for sale" label="מספר מניות למכירה" placeholder="100" value={this.props.data.numberOfStock}/>
        <FieldClass ref="saleDate" field="sale-date" engLabel="sale date" label="תאריך מכירה" placeholder="100" value={this.props.data.saleDate}/>
        <button type="submit" className="btn btn-default">חשב הכנסה ממכירה</button>
      </form>
    );
  }
});


var Result = React.createClass({
  render: function() {
    if (this.props.result) {
        if (this.props.result.eligibleFor102) {
            return (<EligibleFor102Result result={this.props.result}/>);
        } else {
            return (<NonEligibleFor102Result result={this.props.result}/>);
        }
    } else {
      return (<span/>);
    }
  }
});

var NonEligibleFor102Result = React.createClass({
  render: function() {
    if (this.props.result) {
        var res = this.props.result;
        var shareValue = res.lastPrice.formatMoney(2, '.', ','); 
        // var gainPerShare = res.totalGain.formatMoney(2, '.', ',');
        var totalGain = res.numberOfShares * res.totalGain;
        totalGain = totalGain.formatMoney(2, '.', ',');
        var gainPerShareWith102 = res.gainWith102.formatMoney(2, '.', ',');
        var totalGainWith102 = res.numberOfShares * gainPerShareWith102;
        totalGainWith102 = totalGainWith102.formatMoney(2, '.', ',');
        
      var good = (
          <div>
          <div className="alert alert-warning" role="alert">אינך זכאית עדיין להטבת מס 102. הזכאות תתקיים בעוד {this.props.result.daysUntileligibleFor102} ימים.</div>
          <div className="panel panel-default">
            <div className="panel-heading">מחיר למניה היום</div>
            <div className="panel-body">${shareValue}</div>
            <div className="panel-heading">הכנסה ממכירה (ללא הטבת מס 102)</div>
            <div className="panel-body">${totalGain}</div>
            <div className="panel-heading">הכנסה ממכירה אילו היית זכאית להטבת מס 102</div>
            <div className="panel-body">${totalGainWith102}</div>
          </div>
          </div>
      );
      return good;
    } else {
      return (<span>שגיאה, נסי שנית מאוחר יותר</span>);
    }
  }
});


var EligibleFor102Result = React.createClass({
  render: function() {
    if (this.props.result) {
        var res = this.props.result;
        var shareValue = res.lastPrice.formatMoney(2, '.', ','); 
        // var gainPerShare = res.totalGain.formatMoney(2, '.', ',');
        var totalGain = res.numberOfShares * res.totalGain;
        totalGain = totalGain.formatMoney(2, '.', ',');
        
      var good = (
          <div>
          <div className="alert alert-success" role="alert">זכאית להטבת מס 102</div>
          <div className="panel panel-default">
            <div className="panel-heading">מחיר למניה היום</div>
            <div className="panel-body">${shareValue}</div>
            <div className="panel-heading">הכנסה ממכירה</div>
            <div className="panel-body">${totalGain}</div>
          </div>
          </div>
      );
      return good;
    } else {
      return (<span>שגיאה, נסי שנית מאוחר יותר</span>);
    }
  }
});

var CalculatorContainer = React.createClass({
  getInitialState: function() {
    return {result: null};
  },
  onSubmit: function(error, result) {
    if (error) {
        // TODO print error to user
        console.log(error);
    }
    console.log("result", result);
    this.setState({result: result});
  },
  render: function() {
    return (
      <div>
        <CalculatorForm data={this.props.data} onSubmit={this.onSubmit} />
        <Result result={this.state.result} numberOfShares={4}/>
      </div>
    )
  }
})

var InitialData = {
  ticker: "ebay",
  grantDate: "2013/03/15",
  incomeTax: 0.3,
  numberOfStock: 1,
  saleDate: "Today"
};
window.debug = InitialData;

React.render(
  <CalculatorContainer data={ InitialData } />,
  document.getElementById('rsuForm')
);

/*************/
/* Utilities */
/*************/

// Taken from http://stackoverflow.com/a/149099/280503
Number.prototype.formatMoney = function(c, d, t){
var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };
