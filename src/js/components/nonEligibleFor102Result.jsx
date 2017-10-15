import React, { Component } from 'react';

class NonEligibleFor102Result extends Component {
    render() {
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
                    <div className="alert alert-warning" role="alert">אינך זכאית עדיין להטבת מס 102. הזכאות תתקיים  {this.props.result.daysUntileligibleFor102} ימים לאחר מועד המכירה הנבחר.</div>
                    <div className="panel panel-default">
                        <div className="panel-heading">מחיר למניה בתאריך הנבחר</div>
                        <div className="panel-body">${shareValue}</div>
                        <div className="panel-heading">הכנסה ממכירה (ללא הטבת מס 102)</div>
                        <div className="panel-body">${totalGain}</div>
                        <div className="panel-heading">הכנסה ממכירה אילו היית זכאית להטבת מס 102</div>
                        <div className="panel-body">${totalGainWith102}</div>
                    </div>
                </div>
            );
            return good;
        }
        return (<span>שגיאה, נסי שנית מאוחר יותר</span>);
    }
}

export default NonEligibleFor102Result;