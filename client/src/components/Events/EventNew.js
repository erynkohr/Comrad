import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import validate from '../../utils/validation';

import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';
import 'react-dates/lib/css/_datepicker.css';

import Button from '../../components/Button';
import Card from '../../components/Card';
import CardBody from '../../components/CardBody';
import CardImg from '../../components/CardImg';
import CardTitle from '../../components/CardTitle';
import Checkbox from '../../components/Checkbox';
import Form from '../../components/Form';
import FormGroup from '../../components/FormGroup';
import Input from '../../components/Input';
import Label from '../../components/Label';
import Select from '../../components/Select';

const initialState = {
  title: '',
  summary: '',
  description: '',
  producer: '',
  host: '',
  guests: '',
  playlist: '',

  show_start_time_utc: moment(),
  show_end_time_utc: moment().add(1, 'hour'),

  repeat: false,
  repeatType: '',
  repeat_start_date: moment(),
  repeat_end_date: moment(),

  start_focused: false,
  end_focused: false,
};

class EventNew extends Component {
  state = initialState;

  checkRepeatEndDate = repeat => {
    if (!repeat) {
      this.setState({
        repeat_end_date: this.state.repeat_start_date,
        repeatType: '',
      });
    }
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleCheckboxChange = e => {
    const { name, value } = e.target;
    const { repeat } = this.state;
    this.setState({ [name]: !repeat }, () =>
      this.checkRepeatEndDate(this.state.repeat),
    );
  };

  handleInputDateChange = (type, dateValue) => {
    this.setState({ [type]: dateValue }, () =>
      this.checkRepeatEndDate(this.state.repeat),
    );
  };

  handleInputChangeTime = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: moment(value, 'HH:mm'),
    });
  };

  handleInputBlur = e => {
    validate.input(e.target);
  };

  handleFormSubmit = e => {
    e.preventDefault();
    const valid = validate.submit();

    //NEED TO SETUP VALIDATION
    this.props.postShow(this.state);

    if (valid) {
      //this.props.postShow(this.state);
    }
  };

  handleFormCancel = e => {
    e.preventDefault();
    this.setState(initialState);
  };

  render() {
    return (
      <main className="event">
        <section className="event__body">
          {console.log(this.state)}

          <Card>
            <CardBody>
              <CardTitle className="text-center">Create New Event:</CardTitle>

              <Form>
                <FormGroup>
                  <Label>Title</Label>
                  <Input
                    name="title"
                    onChange={this.handleInputChange}
                    onBlur={this.handleInputBlur}
                    type="text"
                    value={this.state.title}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Show Start Date</Label>
                  <SingleDatePicker
                    date={this.state.repeat_start_date} // momentPropTypes.momentObj or null
                    onDateChange={repeat_start_date =>
                      this.handleInputDateChange(
                        'repeat_start_date',
                        repeat_start_date,
                      )
                    } // PropTypes.func.isRequired
                    focused={this.state.start_focused} // PropTypes.bool
                    onFocusChange={({ focused }) =>
                      this.setState({ start_focused: focused })
                    } // PropTypes.func.isRequired
                    id="show_start_date_picker" // PropTypes.string.isRequired,
                    isOutsideRange={() => false}
                    numberOfMonths={1}
                  />
                  <Label>Repeat</Label>
                  <Checkbox
                    name="repeat"
                    onChange={this.handleCheckboxChange}
                    onBlur={this.handleInputBlur}
                    type="checkbox"
                    defaultChecked={this.state.repeat}
                  />
                </FormGroup>

                {this.state.repeat && (
                  <div>
                    <FormGroup>
                      <Label>Repeat End Date</Label>
                      <SingleDatePicker
                        date={this.state.repeat_end_date} // momentPropTypes.momentObj or null
                        onDateChange={repeat_end_date =>
                          this.handleInputDateChange(
                            'repeat_end_date',
                            repeat_end_date,
                          )
                        } // PropTypes.func.isRequired
                        focused={this.state.end_focused} // PropTypes.bool
                        onFocusChange={({ focused }) =>
                          this.setState({ end_focused: focused })
                        } // PropTypes.func.isRequired
                        id="show_end_date_picker" // PropTypes.string.isRequired,
                        isOutsideRange={() => false}
                        numberOfMonths={1}
                      />

                      <Label>Repeat Type</Label>
                      <Select
                        selectOptions={['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']}
                        name="repeatType"
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputBlur}
                        value={this.state.repeatType}
                      />
                    </FormGroup>
                  </div>
                )}

                <FormGroup>
                  <Label>Show Start Time</Label>
                  <Input
                    name="show_start_time_utc"
                    onChange={this.handleInputChangeTime}
                    onBlur={this.handleInputBlur}
                    type="time"
                    value={moment(this.state.show_start_time_utc).format(
                      'HH:mm',
                    )}
                  />

                  <Label>Show End Time</Label>
                  <Input
                    name="show_end_time_utc"
                    onChange={this.handleInputChangeTime}
                    onBlur={this.handleInputBlur}
                    type="time"
                    value={moment(this.state.show_end_time_utc).format('HH:mm')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Summary</Label>
                  <Input
                    name="summary"
                    onChange={this.handleInputChange}
                    onBlur={this.handleInputBlur}
                    type="text"
                    value={this.state.summary}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Description</Label>
                  <Input
                    name="description"
                    onChange={this.handleInputChange}
                    onBlur={this.handleInputBlur}
                    type="text"
                    value={this.state.description}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Producer</Label>
                  <Input
                    name="producer"
                    onChange={this.handleInputChange}
                    onBlur={this.handleInputBlur}
                    type="text"
                    value={this.state.producer}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Host</Label>
                  <Input
                    name="host"
                    onChange={this.handleInputChange}
                    onBlur={this.handleInputBlur}
                    type="text"
                    value={this.state.host}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Guests</Label>
                  <Input
                    name="guests"
                    onChange={this.handleInputChange}
                    onBlur={this.handleInputBlur}
                    type="text"
                    value={this.state.guests}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Playlist</Label>
                  <Input
                    name="playlist"
                    onChange={this.handleInputChange}
                    onBlur={this.handleInputBlur}
                    type="text"
                    value={this.state.playlist}
                  />
                </FormGroup>

                <FormGroup className="text-center">
                  <Button onClick={this.handleFormSubmit} type="primary">
                    Create Event
                  </Button>

                  <Button onClick={this.handleFormCancel} type="secondary">
                    Cancel
                  </Button>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </section>
      </main>
    );
  }
}

export default connect(
  null,
  actions,
)(EventNew);
