import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointments: []
    }
  }

  componentDidMount() {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3001/appointments',
    }).done(data => {
      this.setState({appointments: data});
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          {this.state.appointments.map(appointment => {
            return <p>{appointment.title}</p>;
          })}
        </p>
      </div>
    );
  }
}

export default App;
