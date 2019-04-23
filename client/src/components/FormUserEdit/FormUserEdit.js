import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { userAdd, userUpdate } from '../../redux/user';

class FormUserEdit extends Component {
  submit = values => {
    const { userAdd, userUpdate, match, history } = this.props;
    const { path } = match;
    if (path === '/add') {
      userAdd(values, () => {
        history.push('/search');
      });
    } else if (path === '/edit/:id') {
      userUpdate(values, () => {
        history.push('/search');
      });
    }
  };

  render() {
    return (
      <form>
        <div />
      </form>
    );
  }
}

export default reduxForm({ form: 'userEdit' })(FormUserEdit);
