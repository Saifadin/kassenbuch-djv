import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import './EditEntry.scss';

const InputStyles = {
  width: '100%',
};

const UpdateEntryMutation = gql `
  mutation UpdateEntry($input: UpdateEntryInput!) {
    updateEntry(input: $input) {
      changedEntry {
        id
        title
        amount
        createdAt
        user {
          id
          username
          roles {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    }
  }
`;

const DeleteEntryMutation = gql `
  mutation DeleteEntry($entry: DeleteEntryInput!) {
    deleteEntry(input: $entry) {
      changedEntry {
        id
      }
    }
  }
`;

class EditEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.data.id,
      title: this.props.data.title,
      amount: this.props.data.amount,
      user: {
        username: this.props.data.user.username,
      },
    };

    this._handleTitleChange = this._handleTitleChange.bind(this);
    this._handleAmountChange = this._handleAmountChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this.updateEntry = this.updateEntry.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
  }

  _handleTitleChange(e) {
    this.setState({
      title: e.target.value,
    });
  }

  _handleAmountChange(e) {
    this.setState({
      amount: e.target.value,
    });
  }

  _handleSubmit(e) {
    e.preventDefault();
    this.updateEntry();
  }

  updateEntry() {
    this.props.updateEntry({
      id: this.state.id,
      title: this.state.title,
      amount: this.state.amount,
    }).then(() => {
      this.props.closeModal();
    }).catch(errors => {
      this.setState({ errors: errors.graphQLErrors });
    });
  }

  deleteEntry() {
    this.props.deleteEntry({
      id: this.state.id,
    }).then(() => {
      this.props.closeModal();
    }).catch(errors => {
      this.setState({ errors: errors.graphQLErrors });
    });
  }

  render() {
    // const DATA = this.state;
    // const ENTRY_DATE = `${new Date(DATA.createdAt).toLocaleDateString()}, ${new Date(DATA.createdAt).toLocaleTimeString()}`;

    return (
      <div className="EditEntry">
        <form className="EditEntry__form" onSubmit={this._handleSubmit}>
          <TextField type="text" onChange={this._handleTitleChange} floatingLabelText="Verwendungszweck" required="true" value={this.state.title} style={InputStyles} />
          <TextField type="number" onChange={this._handleAmountChange} floatingLabelText="Summe" required="true" value={this.state.amount} style={InputStyles} />
          <RaisedButton label="Speichern" onClick={this.updateEntry} primary fullWidth />
          <br />
          <RaisedButton label="Eintrag löschen" onClick={this.deleteEntry} secondary fullWidth />
        </form>
      </div>
    );
  }
}

const EditEntryWithData = compose(
  graphql(UpdateEntryMutation, {
    props: ({ mutate }) => ({
      updateEntry: (data) => mutate({
        variables: {
          input: data,
        },
        updateQueries: {
          GetAllEntries: (prev, { mutationResult }) => {
            const newProp = prev.viewer.allEntries.edges;
            prev.viewer.allEntries.edges.map((entry, index) => {
              if (entry.node.id === mutationResult.data.updateEntry.changedEntry.id) {
                newProp[index] = {
                  node: mutationResult.data.updateEntry.changedEntry,
                };
              }
              return entry;
            });
            return update(prev, {
              viewer: {
                allEntries: {
                  edges: {
                    $set: newProp,
                  },
                },
              },
            });
          },
        },
      }),
    }),
  }),
  graphql(DeleteEntryMutation, {
    props: ({ mutate }) => ({
      deleteEntry: (data) => mutate({
        variables: {
          entry: data,
        },
        updateQueries: {
          GetAllEntries: (prev, { mutationResult }) => {
            prev.viewer.allEntries.edges.map((entry, index) => {
              if (entry.node.id === mutationResult.data.deleteEntry.changedEntry.id) {
                prev.viewer.allEntries.edges.splice(index, 1);
              }
              return entry;
            });
            return update(prev, {
              viewer: {
                allEntries: {
                  edges: {
                    $set: prev.viewer.allEntries.edges,
                  },
                },
              },
            });
          },
        },
      }),
    }),
  }),
)(EditEntry);
export default EditEntryWithData;
