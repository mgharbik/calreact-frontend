import React from 'react'
import PropTypes from 'prop-types'
import Appointment from './Appointment'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

export const AppointmentsList = ({appointments}) =>
  <div>
    <CSSTransitionGroup
      transitionName="appointment"
      transitionEnterTimeOut={500} >
      {appointments.map(function(appointment) {
        return (
          <Appointment appointment={appointment} key={appointment.id} />
        )
      })}
    </CSSTransitionGroup>  
  </div>

AppointmentsList.propTypes = {
  appointments: PropTypes.array.isRequired,
}

AppointmentsList.defaultProps = {
  appointments: []
}

export default AppointmentsList
