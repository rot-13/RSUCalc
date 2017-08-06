import React, { Component } from 'react';

class ToggleCalcExplanation extends Component {
    render() {
        var buttonText;
        if (this.props.displayingExplanation) {
            buttonText = this.props.buttonCloseText;
        } else {
            buttonText = this.props.buttonDisplayText;
        }

        return (
            <button type="submit" onClick={this.props.onToggle} className="btn btn-default" >{buttonText}</button>
        )
    }
}

ToggleCalcExplanation.defaultProps = {
    buttonDisplayText: "צפייה בפרטי החישוב",
    buttonCloseText: "סגור פרטי חישוב"
};

export default ToggleCalcExplanation;