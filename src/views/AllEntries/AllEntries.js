import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import FontAwesome from 'react-fontawesome';

import Entry from '../../components/Entry/Entry';

import './AllEntries.scss';

const GetEntryQuery = gql `
query GetAllEntries {
  viewer {
    allEntries(first: 15) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      aggregations {
        sum {
          amount
        }
      }
      edges {
        node {
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
  }
}
`;

const subscribeToEntryUpdate = gql `
  subscription SubscribeToUpdate {
    subscribeToEntry(mutations: [updateEntry]) {
      mutation
      value {
        title
        amount
      }
    }
  }
`;

const subscribeToEntryDelete = gql `
  subscription SubscribeToDelete {
    subscribeToEntry(mutations: [deleteEntry]) {
      mutation
      value {
        title
        amount
      }
    }
  }
`;

class AllEntries extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      editedEntry: {},
    };
  }

  componentWillReceiveProps() {
    // this.subscribeToEntryDelete();
    // this.subscribeToEntryUpdate();
  }

  subscribeToEntryDelete() {
    this.subscription = this.props.data.subscribeToMore({
      document: subscribeToEntryDelete,
      updateQuery: (prev, { subscriptionData }) => {
        console.log(subscriptionData);
        console.log(prev);
      },
    });
  }

  subscribeToEntryUpdate() {
    this.subscription = this.props.data.subscribeToMore({
      document: subscribeToEntryUpdate,
      updateQuery: (prev, { subscriptionData }) => {
        console.log(subscriptionData);
        console.log(prev);
      },
    });
  }

  render() {
    const { data } = this.props;

    return data.viewer ? (
      <div className="AllEntries">
        <div className="AllEntries__header">
          <span className="AllEntries__title">Alle Einträge</span>
          <FontAwesome name="filter" className="AllEntries__filter" />
        </div>
        <div className="AllEntries__entries">
          { data.viewer.allEntries.edges.map(({ node }) => (
            <Entry key={node.id} data={node} />
          )) }
        </div>
        <div className="AllEntries__sum">
          <div className="AllEntries__sum-title">Summe</div>
          <div className="AllEntries__sum-amount">{data.viewer.allEntries.aggregations.sum.amount} €</div>
        </div>
      </div>
    ) : <h3>Einträge werden geladen...</h3>;
  }
}

const AllEntriesWithData = graphql(GetEntryQuery)(AllEntries);
export default AllEntriesWithData;
