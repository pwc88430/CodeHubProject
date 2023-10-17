import React from 'react';
import LoginForm from './LoginForm';
import './LoginForm.css';
import RecordingPage from './RecordingPage'
import './RecordingPage.css'
import HomePage from './HomePage';
import { useState } from "react";

function App() {
  const [screen, setScreen] = useState('recordingPage')

  function toRecordingPage() {
    setScreen('recordingPage')
  }
  function toHomePage() {
    setScreen('homePage')
  }
  function toMainPage() {
    setScreen('main')
  }

  if (screen === 'main') {
    return (
      <div className="App">

        <LoginForm changeScreen={toRecordingPage} toHomePage={toHomePage} />
      </div>
    );
  }
  else if (screen === 'recordingPage') {
    return (
      <RecordingPage changeScreen={toMainPage} />
    )
  }
  else if (screen === 'homePage') {
    return <HomePage />;
  }
}

export default App;
