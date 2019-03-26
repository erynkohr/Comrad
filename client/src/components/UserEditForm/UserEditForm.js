import React from 'react';
import { Field, reduxForm } from 'redux-form';

let UserEditForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor="user-name">Name</label>
      <Field name="user-name" component="input" type="text" />
    </div>
    <div>
      <label htmlFor="on-air-name">On-Air Name</label>
      <Field name="on-air-name" component="input" type="text" />
    </div>
    <div>
      <label htmlFor="email">E-Mail</label>
      <Field name="email" component="input" type="email" />
    </div>
    <div>
      <label htmlFor="permissions-level">Permissions Level</label>
      <Field name="permissions-level" component="select">
        <option value="dj">DJ</option>
        <option value="underwriting">Underwriting</option>
        <option value="show-producer">Show Producer</option>
        <option value="full-access">Full Access</option>
        <option value="admin">Admin</option>
      </Field>
    </div>
    <div>
      <Field name="active" component="input" type="checkbox" />
      <label htmlFor="active">Active</label>
    </div>
    <button>Cancel</button>
    <button type="submit">Save</button>
  </form>
);

UserEditForm = reduxForm({
  form: 'UserEditForm',
})(UserEditForm);

export default UserEditForm;
