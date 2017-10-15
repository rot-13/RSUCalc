import React, {Component} from 'react';
import CalculatorContainer from './calculatorContainer.jsx';

var initialData = {
  ticker: "pypl",
  grantDate: "Mar 15 2015",
  incomeTax: 0.3,
  numberOfStock: 1,
  saleDate: "אתמול"
};

class App extends Component {
  render() {
    return (
      <CalculatorContainer data={ initialData } />
    );
  }
}

// ReactDOM.render(
//   <CalculatorContainer data={ initialData } />,
//   document.getElementById('rsuForm')
// );

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

 export default App;
