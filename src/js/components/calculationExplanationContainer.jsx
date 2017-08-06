import React, { Component } from 'react';
import ToggleCalcExplanation from './toggleCalcExplanation.jsx';
import CalculationExplanation from './calculationExplanation.jsx';

class CalculationExplanationContainer extends Component {
    render() {
        return (
            <div>
                <ToggleCalcExplanation onToggle={this.props.onExplanationToggle} displayingExplanation={this.props.displayingExplanation} />
                <CalculationExplanation displayingExplanation={this.props.displayingExplanation} result={this.props.result} />
            </div>
        );
    }
}

export default CalculationExplanationContainer;