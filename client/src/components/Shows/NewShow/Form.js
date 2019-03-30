import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import moment from 'moment';

import { requiredValidate } from '../../../utils/validation.js';

import Repeat from './Repeat';

import Button from '../../Button';
import Card from '../../Card';
import Input from '../../Input';
import PickerDate from './PickerDate';

import ModalClose from '../../Modal/Modal__Button_Close';

import { getShowSelected } from '../../../redux/show';

class NewShowForm extends Component {
  render() {
    const { isRepeat } = this.props;

    return (
      <main className="show show__padding">
        <section className="show__body">
          <Card>
            <form onSubmit={this.props.handleSubmit}>
              <div className="show__grid_container">
                <div className="show__grid_span_3">
                  <Field
                    component={Input}
                    label="Title"
                    name="title"
                    type="text"
                    autoFocus
                    validate={requiredValidate}
                  />
                </div>

                <div>
                  <Field
                    name="show_start_time_utc"
                    component={Input}
                    label="Start Time"
                    type="time"
                    format={value => moment(value).format('HH:mm')}
                    parse={value => moment(value, 'HH:mm')}
                    validate={requiredValidate}
                  />
                </div>

                <div>
                  <Field
                    name="show_end_time_utc"
                    component={Input}
                    label="End Time"
                    type="time"
                    format={value => moment(value).format('HH:mm')}
                    parse={value => moment(value, 'HH:mm')}
                    validate={requiredValidate}
                  />
                </div>

                <div className="show__grid_container show__grid_span_3">
                  <div className="show__date_picker_start">
                    <Field name="repeat_start_date" component={PickerDate} />
                  </div>

                  <div className="">
                    <label htmlFor="repeat">Repeat</label>
                    <Field name="repeat" component="input" type="checkbox" />
                  </div>

                  <div className="show__grid_span_3">
                    {isRepeat && <Repeat />}
                  </div>
                </div>

                <div className="show__grid_span_3">
                  <Field
                    name="summary"
                    component={Input}
                    label="Summary"
                    type="textarea"
                  />
                </div>

                <div className="show__grid_span_3">
                  <Field
                    name="description"
                    component={Input}
                    label="Description"
                    type="textarea"
                  />
                </div>

                <div>
                  <Field
                    name="producer"
                    label="Producer"
                    component={Input}
                    type="text"
                  />
                </div>

                <div>
                  <label htmlFor="Host">Host</label>
                  <Field name="host" component="input" type="text" />
                </div>

                <div>
                  <label htmlFor="Playlist">Playlist</label>
                  <Field name="playlist" component="input" type="text" />
                </div>

                <div className="show__grid_container show__grid_span_3">
                  <div className="">
                    <Button color="primary" type="submit">
                      Save
                    </Button>
                  </div>

                  <div>
                    <ModalClose />
                  </div>
                </div>
              </div>
            </form>
          </Card>
        </section>
      </main>
    );
  }
}

const selector = formValueSelector('newShow');
function mapStateToProps(state) {
  const isRepeat = selector(state, 'repeat');

  const initialValues = state => {
    const selectedShow = getShowSelected(state.show);
    return {
      show_start_time_utc: moment(selectedShow.start),
      show_end_time_utc: moment(selectedShow.end),
      repeat_start_date: moment(selectedShow.start),
      repeat_end_date: moment(selectedShow.end),
      repeat: false,
    };
  };

  return {
    initialValues: initialValues(state),
    isRepeat,
  };
}

NewShowForm = reduxForm({
  form: 'newShow',
})(NewShowForm);

export default connect(
  mapStateToProps,
  {},
)(NewShowForm);
