import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { userCreate } from '../../redux/user';
import {
  emailValidate,
  passwordConfirmValidate,
  requiredValidate,
} from '../../utils/validation';

import Button from '../Button';
import Input from '../Input';

class FormUserCreate extends Component {
  submit = values => {
    const { history, userCreate } = this.props;

    return userCreate(values, () => {
      history.push('/');
    });
  };

  render() {
    const { props, submit } = this;
    const { handleSubmit, submitting } = props;

    return (
      <form onSubmit={handleSubmit(submit)}>
        <Field
          className="mb-3"
          component={Input}
          label="First Name"
          name="first_name"
          type="text"
          validate={requiredValidate}
        />
        <Field
          className="mb-3"
          component={Input}
          label="Last Name"
          name="last_name"
          type="text"
          validate={requiredValidate}
        />
        <Field
          className="mb-3"
          component={Input}
          label="Email Address"
          name="email"
          type="text"
          validate={[requiredValidate, emailValidate]}
        />
        <Field
          className="mb-3"
          component={Input}
          label="Password"
          name="password"
          type="password"
          validate={requiredValidate}
        />
        <Field
          className="mb-3"
          component={Input}
          label="Confirm Password"
          name="confirm_password"
          type="password"
          validate={[requiredValidate, passwordConfirmValidate]}
        />
        <Button submitting={submitting} type="submit">
          Submit
        </Button>
      </form>
    );
  }
}

const ReduxFormUserCreate = reduxForm({
  form: 'userCreate',
})(FormUserCreate);

function mapStateToProps({ user }) {
  return {
    user,
  };
}

export default connect(
  mapStateToProps,
  { userCreate },
)(ReduxFormUserCreate);
