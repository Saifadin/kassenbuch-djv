import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import './NewEntryForm.scss';

const NewEntryMutation = gql `
  mutation NewEntryMutation($data: CreateEntryInput!) {
    createEntry(input: $data) {
      changedEntry {
        id
        title
        amount
        createdAt
        user {
          id
          username
        }
      }
    }
  }
`;

class NewEntryForm extends Component {
  constructor(props) {
    super(props);

    const user = JSON.parse(localStorage.user);

    this.state = {
      title: '',
      amount: 0,
      formValid: null,
      user,
    };

    this._handleEntryTitleChange = this._handleEntryTitleChange.bind(this);
    this._handleEntryAmountChange = this._handleEntryAmountChange.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.addEntry = this.addEntry.bind(this);
  }

  _handleEntryTitleChange(e) {
    this.setState({
      title: e.target.value,
    });
  }

  _handleEntryAmountChange(e) {
    this.setState({
      amount: e.target.value,
    });
  }

  validateInput() {
    this.setState({
      formValid: this.state.title && this.state.title.length &&
      this.state.amount && this.state.amount.length,
    });

    return this.state.title && this.state.title.length &&
    this.state.amount && this.state.amount.length;
  }

  addEntry(e) {
    e.preventDefault();
    if (this.validateInput()) {
      this.props.addEntry({
        title: this.state.title,
        amount: this.state.amount,
        userId: this.state.user.id,
      }).then(({ data }) => {
        if (!data.errors) {
          this.setState({ errors: [] });
          this.context.router.history.push('/dashboard');
        } else {
          this.setState({ errors: data.errors });
        }
      }).catch(errors => {
        console.log(errors.graphQLErrors);
      });
    } else {
      this.setState({
        errors: [{
          message: 'beep',
        }],
      });
    }
  }

  render() {
    return (
      <div className="NewEntryForm">
        <h2>Neuer Eintrag</h2>
        <form className="NewEntryForm__form">
          <TextField type="text" onChange={this._handleEntryTitleChange} floatingLabelText="Überschrift" required="true" value={this.state.title} fullWidth />
          <TextField type="number" onChange={this._handleEntryAmountChange} floatingLabelText="Betrag" required="true" value={this.state.amount} fullWidth />
          <RaisedButton label="Speichern" onClick={this.addEntry} primary fullWidth />
        </form>
      </div>
    );
  }
}

NewEntryForm.contextTypes = {
  router: PropTypes.object,
};

const NewEntryFormWithData = graphql(NewEntryMutation, {
  props: ({ mutate }) => ({
    addEntry: (data) => mutate({
      variables: {
        data,
      },
      updateQueries: {
        GetAllEntries: (prev, { mutationResult }) => {
          console.log(mutationResult);
          return update(prev, {
            viewer: {
              allEntries: {
                edges: {
                  $unshift: [{
                    node: mutationResult.data.createEntry.changedEntry,
                  }],
                },
              },
            },
          });
        },
      },
    }),
  }),
})(NewEntryForm);
export default NewEntryFormWithData;
