import React, { Component } from 'react';

class EligibleFor102Result extends Component {
    render() {
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
        }
        return (<span>שגיאה, נסי שנית מאוחר יותר</span>);
    }
}

export default EligibleFor102Result;