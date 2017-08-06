import React, {Component} from 'react';
import NonEligibleFor102Result from './nonEligibleFor102Result.jsx';
import EligibleFor102Result from './eligibleFor102Result.jsx';
import CalculationExplanationContainer from './calculationExplanationContainer.jsx';

class Result extends Component {

    constructor(props) {
        super(props);
        this.onExplanationToggle = this.onExplanationToggle.bind(this);
        this.state = {
            displayingExplanation: false
        }
    }

    onExplanationToggle() {
        this.setState({displayingExplanation: !this.state.displayingExplanation})
    }
    
    render() {
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
        }
        return (<span/>);
    }
}

export default Result;