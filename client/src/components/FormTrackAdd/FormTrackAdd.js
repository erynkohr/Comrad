import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { requiredValidate } from '../../utils/validation';
import { trackAdd } from '../../redux/track'; //need to set up correct path

import Button from '../Button';
import Input from '../Input';

class FormTrackAdd extends Component {
  submit = (values, dispatch, props) => {
    const { trackAdd, submitCallback } = this.props;
    trackAdd(values, submitCallback);
  };

  render() {
    const { props, submit } = this;
    const { handleSubmit } = props;

    return (
      <form className="form-track-add" onSubmit={handleSubmit(submit)}>
        <Field
          component={Input}
          label="Disk Number"
          name="disk-number"
          type="number"
          autoFocus
          validate={requiredValidate}
        />
        <Field
          component={Input}
          label="Track Number"
          name="track-number"
          type="number"
          autoFocus
          validate={requiredValidate}
        />
        <Field
          component={Input}
          label="Name"
          name="name"
          autoFocus
          validate={requiredValidate}
        />
        <Field
          component={Input}
          label="Duration"
          name="duration"
          autoFocus
          validate={requiredValidate}
        />
        <div>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    );
  }
}

const ReduxFormTrackAdd = reduxForm({
  form: 'trackAdd',
})(FormTrackAdd);

export default connect(
  null,
  { trackAdd },
)(ReduxFormTrackAdd);