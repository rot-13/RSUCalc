import React, {Component} from 'react';

class SubmitButton extends Component {
    render() {
        if (this.props.waitingForServer) {
            var spinner = <i className="fa fa-spinner fa-spin"></i>;
        }
        return (
            <button type="submit" className="btn btn-default" disabled={this.props.waitingForServer}><span>חשב הכנסה ממכירה </span>{spinner}</button>
        )
    }
}

export default SubmitButton;