import React, {Component} from 'react';
import Field from './field.jsx';
import SubmitButton from './submitButton.jsx';
import RSUTaxCalculator from './../rsuTaxCalc.js';
import Pikaday from 'pikaday';

var pikadayI18N = {
    previousMonth : 'חודש קודם',
    nextMonth     : 'חודש הבא',
    months        : ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'],
    weekdays      : ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'],
    weekdaysShort : ['א','ב','ג','ד','ה','ו','ש']
};

var yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

class CalculatorForm extends Component {
    
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            waitingForServer: false
        };
    }
    
    handleSubmit(event) {
        event.preventDefault();
        var saleDate = this.refs.saleDate.value == "אתמול" ? yesterday : this.saleDateValue;
        this.props.data.saleDate = saleDate;        
        var data = {
            ticker: this.refs.ticker.value,
            grantDate: this.refs.grantDate.value,
            marginalTaxRate: this.refs.incomeTax.value,
            saleDate: saleDate,
            numberOfShares: this.refs.numShares.value,
        }
        var rsu = new RSUTaxCalculator();
        var resultSubmit = this.props.onSubmit;
        rsu.getGrantInfo(data, (error, result) => {
            this.setState({waitingForServer: false});
            if (result) {
                result.numberOfShares = data.numberOfShares;
            }
            resultSubmit(error, result);
        });
        this.setState({waitingForServer: true});
    }
    
    onNumberOfSharesChange(newNumber) {
        this.props.updateNumberOfShares(newNumber);
    }

    componentDidMount() {
        var input = this.refs.saleDate;
        var that = this;
        var picker = new Pikaday({
        field: input.getInputElement(),
        isRTL: false,
        i18n: pikadayI18N,
        disableWeekends: true,
        maxDate: yesterday,
        position: "bottom right",
        onSelect: function(date) {
            input.setState({value: date.toDateString()});
            that.saleDateValue = date 
            console.log("Selected date ", date);
        }   
        });
        input.getInputElement().setAttribute('isPikaday', true);
    }    
    
    render() {
        return (
            <form className="calc-form" onSubmit={this.handleSubmit}>
                <Field mandatory="true" ref="ticker" field="ticker" engLabel="ticker" label="מניה" placeholder="AAPL" value={this.props.data.ticker} />
                <Field mandatory="true" ref="grantDate" field="grant-date" engLabel="grant date" label="תאריך הענקת המניות" placeholder="2015/03/15" value={this.props.data.grantDate} />
                <Field mandatory="true" ref="incomeTax" field="income-tax" engLabel="personal income tax rate" label="מס שולי" placeholder="30%" value={this.props.data.incomeTax}/>
                <Field ref="numShares" field="number-of-shares" onChange={this.onNumberOfSharesChange} engLabel="number of shares for sale" label="מספר מניות למכירה" placeholder="100" value={this.props.data.numberOfStock}/>
                <Field ref="saleDate" field="sale-date" engLabel="sale date" label="תאריך מכירה" placeholder="100" value={this.props.data.saleDate}/>
                <span className="glyphicon glyphicon-asterisk text-danger" aria-hidden="true"/> שדות חובה
                <br/>
                <br/>
                <SubmitButton waitingForServer={this.state.waitingForServer}/>
            </form>
        );
    }
}

export default CalculatorForm;