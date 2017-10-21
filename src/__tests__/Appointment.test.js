import React from 'react';
import ReactDOM from 'react-dom';
import Appointment from '../components/Appointment';
import { BrowserRouter as Router } from 'react-router-dom'
import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

it('renders without crashing', () => {
  shallow(<Appointment />);
});

describe ('render', () => {
  it('should display the appointment title', () => {
    const appointment = mount(<Router><Appointment appointment={{id: 1, title: 'Team standup meeting', appt_time: new Date()}} /></Router>);
    const title = <h3>Team standup meeting</h3>;
    expect(appointment.contains(title)).toEqual(true);
  })

  it('should display the appointment time', () => {
    const appointment = mount(<Router><Appointment appointment={{id: 1, title: 'Team standup meeting', appt_time: new Date('04/11/2017, 12:00:00')}} /></Router>);
    const appt_time = <p>April 11 2017, 12:00:00 pm</p>;
    expect(appointment.contains(appt_time)).toEqual(true);
  })
})
