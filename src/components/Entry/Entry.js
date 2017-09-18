import React, { Component } from 'react';
// import FontAwesome from 'react-fontawesome';
import Modal from 'react-modal';

import EditEntry from '../../components/EditEntry/EditEntry';

import './Entry.scss';

class Entry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      modalIsOpen: false,
    };

    this._onEditClick = this._onEditClick.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  _onEditClick() {
    this.openModal();
  }

  openModal() {
    this.setState({
      modalIsOpen: true,
    });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
    });
  }

  render() {
    const DATA = this.props.data;
    const AMOUNT_CLASS = DATA.amount >= 0 ? 'Entry--positiveAmount' : 'Entry--negativeAmount';
    const ENTRY_DATE = `${new Date(DATA.createdAt).toLocaleDateString()}`;

    return (
      <div className={`Entry ${AMOUNT_CLASS}`} onClick={() => this._onEditClick()}>
        <span className="Entry__title">{DATA.title}</span>
        <div className="Entry__kpi">
          <span className="Entry__amount">{DATA.amount} €</span>
          <span className="Entry__date">{ENTRY_DATE}</span>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
        >
          <EditEntry data={this.state.data} closeModal={() => this.closeModal()} />
        </Modal>
      </div>
    );
  }
}

export default Entry;
