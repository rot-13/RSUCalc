var FieldClass = React.createClass({
  getInitialState: function() {
    return {value: this.props.value};
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
    if (this.props.onChange) {
      this.props.onChange(event.target.value);
    }
  },
  value: function() {
    return this.state.value;
  },
  render: function() {
    var input;
    if (this.props.mandatory) {
    var inputStyle = {
      width: "calc(100% - 14px)",
      display: "inline"
    };
    input = (
      <div>
      <span className="glyphicon glyphicon-asterisk text-danger" aria-hidden="true"/>
      <input style={inputStyle} ref="input" className="form-control" id={this.props.field}  placeholder={this.props.placeholder} value={this.state.value} onChange={this.handleChange} />
      </div>
      );

    } else {
    input = (
      <div>
      <input ref="input" className="form-control" id={this.props.field}  placeholder={this.props.placeholder} value={this.state.value} onChange={this.handleChange} />
      </div>
      );
    }

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

var SubmitButton = React.createClass({
  render: function() {
    if (this.props.waitingForServer) {
      var spinner = <i className="fa fa-spinner fa-spin"></i>;
    }
    return (
      <button type="submit" className="btn btn-default" disabled={this.props.waitingForServer}><span>חשב הכנסה ממכירה </span>{spinner}</button>
    )

  }
});

var CalculatorForm = React.createClass({
  getInitialState: function() {
    return {waitingForServer: false};
  },
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
    var that = this;
    rsu.getGrantInfo(data, function(error, result){
        that.setState({waitingForServer: false});
        if (result) {
            result.numberOfShares = data.numberOfShares;
        }
        resultSubmit(error, result);
    });
    this.setState({waitingForServer: true});
  },
  onNumberOfSharesChange: function(newNumber) {
    this.props.updateNumberOfShares(newNumber);
  },
  render: function() {
    return (
      <form className="calc-form" onSubmit={this.handleSubmit}>
        <FieldClass mandatory="true" ref="ticker" field="ticker" engLabel="ticker" label="מניה" placeholder="AAPL" value={this.props.data.ticker} />
        <FieldClass mandatory="true" ref="grantDate" field="grant-date" engLabel="grant date" label="תאריך הענקת המניות" placeholder="2015/03/15" value={this.props.data.grantDate} />
        <FieldClass mandatory="true" ref="incomeTax" field="income-tax" engLabel="personal income tax rate" label="מס שולי" placeholder="30%" value={this.props.data.incomeTax}/>
        <FieldClass ref="numShares" field="number-of-shares" onChange={this.onNumberOfSharesChange} engLabel="number of shares for sale" label="מספר מניות למכירה" placeholder="100" value={this.props.data.numberOfStock}/>
        <FieldClass ref="saleDate" field="sale-date" engLabel="sale date" label="תאריך מכירה" placeholder="100" value={this.props.data.saleDate}/>
        <span className="glyphicon glyphicon-asterisk text-danger" aria-hidden="true"/> שדות חובה
        <br/>
        <br/>
        <SubmitButton waitingForServer={this.state.waitingForServer}/>
      </form>
    );
  }
});


var Result = React.createClass({
  getInitialState: function() {
    return {displayingExplanation: false};
  },
  onExplanationToggle: function() {
    this.setState({displayingExplanation: !this.state.displayingExplanation})
  },
  render: function() {
    if (this.props.result) {
        if (this.props.result.eligibleFor102) {
            return (
              <span>
                <EligibleFor102Result result={this.props.result}/>
                <CalculationExplanationContainer onExplanationToggle={this.onExplanationToggle} result={this.props.result} displayingExplanation={this.state.displayingExplanation}/>
              </span>
              );
        } else {
            return (
              <span>
                <NonEligibleFor102Result result={this.props.result}/>
                <CalculationExplanationContainer onExplanationToggle={this.onExplanationToggle} result={this.props.result} displayingExplanation={this.state.displayingExplanation}/>
              </span>
              );
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
        var totalGain = res.totalGain * res.numberOfShares;
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

var ToggleCalcExplanation = React.createClass({
  getDefaultProps: function() {
    return {
      buttonDisplayText: "צפייה בפרטי החישוב",
      buttonCloseText: "סגור פרטי חישוב"
    };
  },
  render: function() {
    var buttonText = null;
    if (this.props.displayingExplanation) {
      buttonText = this.props.buttonCloseText;
    } else {
      buttonText = this.props.buttonDisplayText;
    }

    return (
      <button type="submit" onClick={this.props.onToggle} className="btn btn-default" >{buttonText}</button>
    )
  }
})

var CalculationExplanation = React.createClass({
  render: function() {
    if (!this.props.displayingExplanation) {
      return null;
    } else {
      console.log(this.props.result);
      return (
        <table className="table">
          <tbody>
            <tr>
              <td>מחיר בסיס</td>
              <td>{this.props.result.costBasis}</td>
            </tr>
          </tbody>
        </table>
      )
    }
  }
})

var CalculationExplanationContainer = React.createClass({
  render: function() {
    return (
      <div>
        <ToggleCalcExplanation onToggle={this.props.onExplanationToggle} displayingExplanation={this.props.displayingExplanation}/>
        <CalculationExplanation displayingExplanation={this.props.displayingExplanation} result={this.props.result}/>
      </div>
    )
  }
})

var CalculatorContainer = React.createClass({
  getInitialState: function() {
    return {
      result: null,
      displayingExplanation: false
    };
  },
  onFormSubmit: function(error, result) {
    if (error) {
        // TODO print error to user
        console.log(error);
    }
    console.log("New result from RSU form", result);
    this.setState({result: result});
  },
  onUpdateNumberOfShares: function(numberOfShares) {
    if (this.state.result) {
      this.setState({numberOfShares: numberOfShares});
    }
  },
  render: function() {
    return (
      <div>
        <CalculatorForm data={this.props.data} onSubmit={this.onFormSubmit} updateNumberOfShares={this.onUpdateNumberOfShares}/>
        <Result result={this.state.result} displayingExplanation={this.state.displayingExplanation}/>
      </div>
    )
  }
})

var initialData = {
  ticker: "pypl",
  grantDate: "2013/03/15",
  incomeTax: 0.3,
  numberOfStock: 1,
  saleDate: "Today"
};
window.debug = initialData;

ReactDOM.render(
  <CalculatorContainer data={ initialData } />,
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
