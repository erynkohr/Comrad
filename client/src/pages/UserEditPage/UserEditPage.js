import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserEditForm from '../../components/UserEditForm';

class UserEditPage extends Component {
  state = {};

  static propTypes = {
    match: PropTypes.object,
  };

  render() {
    const { id } = this.props.match.params;
    const pageMode = /add/.test(this.props.match.path) ? 'Add' : 'Edit';

    return (
      <div>
        <h1>{pageMode} User</h1>
        <p>User ID: {id}</p>
        <UserEditForm />
      </div>
    );
  }
}

export default UserEditPage;
