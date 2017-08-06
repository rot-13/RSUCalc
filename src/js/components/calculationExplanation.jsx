import React, { Component } from 'react';

class CalculationExplanation extends Component {
    render() {
        if (!this.props.displayingExplanation) {
            return null;
        }
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

export default CalculationExplanation;