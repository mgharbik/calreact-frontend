import React from 'react'
import PropTypes from 'prop-types'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import moment from 'moment'
import { validations } from '../utils/validations';
import FormErrors from './FormErrors'
import update from 'immutability-helper'
import $ from 'jquery'

export default class AppointmentForm extends React.Component {
  static propTypes = {
    handleNewAppointment: PropTypes.func,
  }

  static formValidations = {
    title: [
      (s) => { return validations.checkMinLength(s, 3) },
      (s) => { return validations.checkMaxLength(s, 10) }
    ],
    appt_time: [
      (t) => { return validations.timeShouldBeInTheFuture(t) }
    ],
  }

  constructor (props) {
    super(props)
    this.state = {
      title: {value: '', valid: false},
      appt_time: {value: new Date(), valid: false},
      formErrors: {},
      formValid: false,
      editing: false,
    }
  }

  componentDidMount () {
    if (this.props.match) {
      $.ajax({
        type: 'GET',
        url: `http://localhost:3001/appointments/${this.props.match.params.id}`,
        dataType: 'JSON',
        headers: JSON.parse(sessionStorage.getItem('user')),
      }).done((data) => {
        this.setState({
          title: {value: data.title, valid: true},
          appt_time: {value: data.appt_time, valid: true},
          editing: this.props.match.path === '/appointments/:id/edit'
        });
      })
    }
  }

  handleUserInput = (fieldName, fieldValue, validations) => {
    const newFieldState = update(this.state[fieldName],
      {value: {$set: fieldValue}});
    this.setState({[fieldName]: newFieldState},
      () => { this.validateField(fieldName, fieldValue, validations) });
  }

  validateField (fieldName, fieldValue, validations) {
    let fieldValid;

    let fieldErrors = validations.reduce((errors, v) => {
      let e = v(fieldValue);
      if (e!=='') {
        errors.push(e);
      }
      return errors;
    }, []);

    fieldValid = fieldErrors.length === 0;

    const newFieldState = update(this.state[fieldName],
      {valid: {$set: fieldValid}});

    const newFormErrors = update(this.state.formErrors,
      {$merge: {[fieldName]: fieldErrors}});

    this.setState({[fieldName]: newFieldState,
      formErrors: newFormErrors}, this.validateForm);
  }

  validateForm () {
    this.setState({formValid: this.state.title.valid && this.state.appt_time.valid})
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.state.editing ?
      this.updateAppointment() :
      this.addAppointment();
  }

  addAppointment () {
    const appointment = {title: this.state.title.value, appt_time: this.state.appt_time.value}
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3001/appointments',
      data: {appointment: appointment},
      headers: JSON.parse(sessionStorage.getItem('user')),
    })
    .done((data) => {
      this.props.handleNewAppointment(data);
      this.resetFormErrors();
    })
    .fail((response) => {
      this.setState({formErrors: response.responseJSON, formValid: false})
    });
  }

  updateAppointment () {
    const appointment = {title: this.state.title.value, appt_time: this.state.appt_time.value}
    $.ajax({
      type: 'PATCH',
      url: `http://localhost:3001/appointments/${this.props.match.params.id}`,
      data: {appointment: appointment},
      headers: JSON.parse(sessionStorage.getItem('user')),
    })
    .done((data) => {
      console.log('appointment updated!');
      this.resetFormErrors();
    })
    .fail((response) => {
      this.setState({formErrors: response.responseJSON,
                      formValid: false})
    });
  }

  focus = () => {
    this.titleInput.focus();
  }

  deleteAppointment = () => {
    //if(confirm('Are you sure you want to delete this appointment?')) {
      $.ajax({
        type: 'DELETE',
        url: `http://localhost:3001/appointments/${this.props.match.params.id}`,
        headers: JSON.parse(sessionStorage.getItem('user')),
      })
      .done((data) => {
        this.props.history.push('/');
        this.resetFormErrors();
      })
      .fail((response) => {
        console.log('appointment deleting failed!');
      });
    //}
  }

  resetFormErrors () {
    this.setState({formErrors: {}});
  }

  handleChange = (e) => {
    const fieldName = this.titleInput.name;
    const fieldValue = this.titleInput.value;
    this.handleUserInput(fieldName, fieldValue, AppointmentForm.formValidations[fieldName]);
  }

  setAppointmentTime = (e) => {
    const fieldName = 'appt_time';
    const fieldValue = e.toDate();
    this.handleUserInput(fieldName, fieldValue, AppointmentForm.formValidations[fieldName]);
  }

  render () {
    const inputProps = {
      name: 'appt_time'
    }
    return (
      <div>
        <h3>
          { this.state.editing ?
             'Update appointment' :
             'Make a new Appointment' }
        </h3>
        <FormErrors formErrors={this.state.formErrors} />
        <form onSubmit={this.handleFormSubmit}>
          <input name='title' placeholder='Appointment Title'
            ref={(input) => { this.titleInput = input } }
            value={this.state.title.value}
            onChange={this.handleChange} />
          <input type='button' value='Focus the text input' onClick={this.focus} />
          <Datetime input={false} open={true} inputProps={inputProps}
            value={moment(this.state.appt_time.value)}
            onChange={this.setAppointmentTime} />
          <input type='submit'
            value={this.state.editing ?
                    'Update Appointment' :
                    'Make Appointment'}
            className='submit-button'
            disabled={!this.state.formValid} />
        </form>
        {this.state.editing && (
          <button onClick={this.deleteAppointment}>
            Delete Appointment
          </button>
        )}
      </div>
    )
  }
}
