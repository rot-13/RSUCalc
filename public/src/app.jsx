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

function calculate(input) {
  var soldForTotal = input.sellPrice * input.numberOfStock;
  var incomeTaxTotal = (input.grantPrice - input.buyPrice) * input.numberOfStock * input.incomeTax / 100;
  var capitalGainsTaxTotal = (input.sellPrice - input.grantPrice) * input.numberOfStock * input.capitalGainsTax / 100;
  return {
    soldForTotal: soldForTotal,
    incomeTaxTotal: incomeTaxTotal,
    capitalGainsTaxTotal: capitalGainsTaxTotal,
    net: soldForTotal - incomeTaxTotal - capitalGainsTaxTotal
  };
}

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
    var input = ( <input type="number" ref="input" className="form-control" id={this.props.field} placeholder={this.props.placeholder} value={this.state.value} onChange={this.handleChange} /> );
    if (this.props.prefix) {
      input = (
        <div className="input-group">
          <span className="input-group-addon">{ this.props.prefix }</span>
          { input }
        </div>
      );
    }
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
      buyPrice: this.refs.buyPrice.value(),
      grantPrice: this.refs.grantPrice.value(),
      sellPrice: this.refs.sellPrice.value(),
      incomeTax: this.refs.incomeTax.value(),
      capitalGainsTax: this.props.data.capitalGainsTax,
      numberOfStock: this.refs.numStocks.value(),
    }
    this.props.onSubmit(calculate(data));
  },
  render: function() {
    return (
      <form className="calc-form" onSubmit={this.handleSubmit}>
        <FieldClass ref="buyPrice" field="buy-price" label="Purchase Price" placeholder="Enter Purchase Price" value={this.props.data.buyPrice} prefix="$"  />
        <FieldClass ref="grantPrice" field="grant-price" label="Grant Price" placeholder="Enter Grant Price" value={this.props.data.grantPrice} prefix="$"  />
        <FieldClass ref="sellPrice" field="sell-price" label="Sell Price" placeholder="Enter Sell Price" value={this.props.data.sellPrice} prefix="$"  />
        <FieldClass ref="numStocks" field="number-of-stock" label="Number of Stock" placeholder="Enter the number of stock" value={this.props.data.numberOfStock}/>
        <FieldClass ref="incomeTax" field="income-tax" label="Your Income Tax" placeholder="Enter your Income Tax" value={this.props.data.incomeTax}/>
        <button type="submit" className="btn btn-default">Run</button>
      </form>
    );
  }
});


var Result = React.createClass({
  render: function() {
    if (this.props.results) {
      var total = this.props.results.soldForTotal.formatMoney(2, '.', ',');
      var capitalGainsTaxTotal = this.props.results.capitalGainsTaxTotal.formatMoney(2, '.', ',');
      var incomeTaxTotal = this.props.results.incomeTaxTotal.formatMoney(2, '.', ',');
      var net = this.props.results.net.formatMoney(2, '.', ',');
      var good = (
        <div className="alert alert-success">
<dl>
<dt> Sold for Total </dt>
<dd> ${ total } </dd>
<dt> Income Tax </dt>
<dd> ${ incomeTaxTotal } </dd>
<dt> Capital Gains </dt>
<dd> ${ capitalGainsTaxTotal } </dd>
<hr/>
<dt> Net Gains </dt>
<dd> ${ net } </dd>
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
    return {results: null};
  },
  onSubmit: function(results) {
    this.setState({results: results});
  },
  render: function() {
    return (
      <div>
        <CalculatorForm data={this.props.data} onSubmit={this.onSubmit} />
        <Result results={this.state.results} />
      </div>
    )
  }
})



var InitialData = {
  buyPrice: 0,
  grantPrice: 20,
  capitalGainsTax: 25,
  incomeTax: 62,
  sellPrice: 30,
  numberOfStock: 100
};
window.debug = InitialData;

React.render(
  <CalculatorContainer data={ InitialData } />,
  document.getElementById('example')
);
