import React from 'react';
import LoginForm from './LoginForm';
import './LoginForm.css';
import RecordingPage from './RecordingPage'
import './RecordingPage.css'
import { useState } from "react";

function App() {
  const [screen, setScreen] = useState('recordingPage')

  function toRecordingPage() {
    setScreen('recordingPage')
  }
  function toMainPage() {
    setScreen('main')
  }

  if (screen === 'main') {
    return (
      <div className="App">

        <LoginForm changeScreen={toRecordingPage} />
      </div>
    );
  }
  else if (screen === 'recordingPage') {
    return (
      <RecordingPage changeScreen={toMainPage} />
    )
  }
}

export default App;
