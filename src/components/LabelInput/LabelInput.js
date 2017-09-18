import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

import './LabelInput.scss';

class LabelInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      htmlFor: '',
    };
  }

  componentWillMount() {
    const id = `input-${Math.ceil(Math.random() * 100000)}`;

    this.setState({
      htmlFor: id,
    });
  }

  render() {
    const positionClassName = `LabelInput--${this.props.position}`;
    const labelPositionClassName = `LabelInput__label--${this.props.position}`;
    const inputPositionClassName = `LabelInput__input--${this.props.position}`;

    let labelInputArea;

    if (this.props.type === 'area') {
      labelInputArea = 'LabelInput--hasArea';
    }

    return (
      <div className={`LabelInput ${positionClassName} ${labelInputArea}`}>
        <label htmlFor={this.state.htmlFor} className={`LabelInput__label ${labelPositionClassName}`}>
          {this.props.labelIcon && <FontAwesome className="LabelInput__label--icon" name={this.props.labelIcon} />} { this.props.labelText }
        </label>
        { this.props.type !== 'area' ?
          <input id={this.state.htmlFor} className={`LabelInput__input ${inputPositionClassName}`} type={this.props.type} required={this.props.required} onChange={this.props.onChange} value={this.props.value} /> :
          <textarea id={this.state.htmlFor} className={`LabelInput__input LabelInput__input--area ${inputPositionClassName}`} required={this.props.required} onChange={this.props.onChange} value={this.props.value} />
        }
      </div>
    );
  }
}

export default LabelInput;
