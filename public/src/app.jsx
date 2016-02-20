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
        {input}
      </fieldset>
    );
  }
});

var CalculatorForm = React.createClass({
  handleSubmit: function(ev) {
    ev.preventDefault();
    var data = {
      ticker: this.refs.ticker.value(),
      grantDate: this.refs.grantDate.value(),
      incomeTax: this.refs.incomeTax.value(),
      capitalGainsTax: this.props.data.capitalGainsTax,
      numberOfShares: this.refs.numShares.value(),
    }
    var rsu = new RSUTaxCalculator;
    var resultSubmit = this.props.onSubmit;
    rsu.getGrantInfo(data.ticker, data.grantDate, data.incomeTax, function(error, result){
        if (result) {
            result.numberOfShares = data.numberOfShares;
        }
        resultSubmit(error, result);
    });
  },
  render: function() {
    return (
      <form className="calc-form" onSubmit={this.handleSubmit}>
        <FieldClass ref="ticker" field="ticker" label="Ticker" placeholder="AAPL" value={this.props.data.ticker} />
        <FieldClass ref="grantDate" field="grant-date" label="Grant Date" placeholder="2015/03/15" value={this.props.data.grantDate} />
        <FieldClass ref="incomeTax" field="income-tax" label="Your Income Tax Rate" placeholder="30%" value={this.props.data.incomeTax}/>
        <FieldClass ref="numShares" field="number-of-shares" label="Number of Shares (optional)" placeholder="100" value={this.props.data.numberOfStock}/>
        <button type="submit" className="btn btn-default">Run</button>
      </form>
    );
  }
});


var Result = React.createClass({
  render: function() {
    if (this.props.result) {
        var res = this.props.result;
        var shareValue = res.lastPrice.formatMoney(2, '.', ','); 
        var gainPerShare = res.totalGain.formatMoney(2, '.', ',');
        var totalGain = res.numberOfShares * res.totalGain;
        var gainPerShareWith102 = res.gainWith102.formatMoney(2, '.', ',');
      var good = (
        <div className="alert alert-success">
<dl>
<dt> Current share value  </dt>
<dd> ${ shareValue } </dd>
<dt> Gain per share </dt>
<dd> ${ gainPerShare } </dd>
<dt> Total gain </dt>
<dd> ${ totalGain.formatMoney(2, '.', ',') } </dd>
<dt> Gain per share (assuming tax law 102 in effect) </dt>
<dd> ${ gainPerShareWith102 } </dd>
</dl>
        </div>
      );
      return good;
    } else {
      return (<span/>);
    }
  }
});

var CalculatorContainer = React.createClass({
  getInitialState: function() {
    return {result: null};
  },
  onSubmit: function(error, result) {
    console.log("Returned");
    console.log("Error: ", error); 
    console.log("Result: ", result);
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
  ticker: "AAPL",
  grantDate: "2014/03/15",
  incomeTax: 0.30,
  numberOfStock: 1
};
window.debug = InitialData;

React.render(
  <CalculatorContainer data={ InitialData } />,
  document.getElementById('rsuForm')
);
