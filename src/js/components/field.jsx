import React, {Component} from 'react';

class Field extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: props.value
        };
    }

    get value() {
        return this.state.value;
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        if (this.props.onChange) {
            this.props.onChange(event.target.value);
        }
    }

    render() {
        var input;
        if (this.props.mandatory) {
            var inputStyle = {
                width: "calc(100% - 14px)",
                display: "inline"
            };
            input = (
                <div>
                    <span className="glyphicon glyphicon-asterisk text-danger" aria-hidden="true"/>
                    <input style={inputStyle} ref="input" className="form-control" id={this.props.field}  placeholder={this.props.placeholder} value={this.state.value} onChange={this.handleChange} />
                </div>
            );
        } else {
            input = (
                <div>
                    <input ref="input" className="form-control" id={this.props.field}  placeholder={this.props.placeholder} value={this.state.value} onChange={this.handleChange} />
                </div>
            );
        }

        // if (this.props.prefix) {
        //   input = (
        //     <div className="input-group">
        //       <span className="input-group-addon">{ this.props.prefix }</span>
        //       { input }
        //     </div>
        //   );
        // }
        return (
        <fieldset className="form-group">
            <label htmlFor={this.props.field} >{this.props.label}</label>
            <span> ({this.props.engLabel})</span>
            {input}
        </fieldset>
        );
    }
}

export default Field;