import React, { Component } from 'react';
import Result from './result.jsx';
import CalculatorForm from './calculatorForm.jsx';

class CalculatorContainer extends Component {
    
    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onUpdateNumberOfShares = this.onUpdateNumberOfShares.bind(this);
        this.state = {
            result: null,
            displayingExplanation: false
        };
    }

    onFormSubmit(error, result) {
        if (error) {
            // TODO print error to user
            console.log(error);
        }
        console.log("New result from RSU form", result);
        this.setState({ result });
    }

    onUpdateNumberOfShares(numberOfShares) {
        if (this.state.result) {
            this.setState({ numberOfShares });
        }
    }

    render() {
        return (
            <div>
                <CalculatorForm data={this.props.data} onSubmit={this.onFormSubmit} updateNumberOfShares={this.onUpdateNumberOfShares} />
                <Result result={this.state.result} displayingExplanation={this.state.displayingExplanation} />
            </div>
        )
    }
}

export default CalculatorContainer;