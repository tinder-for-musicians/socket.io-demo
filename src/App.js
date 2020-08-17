import React, { useState, useEffect } from 'react';
import openSocket from 'socket.io-client';
import './App.css';

const socket = openSocket('http://localhost:4000')

const App = () => {

  const [timestamp, setTimeStamp] = useState('no timestamp yet');
  const [message, setMessage] = useState('');
  const [listMessages, setListMessages] = useState([]);
  const [mappedMessages, setMappedMessages] = useState([]);

  const subscribeToTimer = (cb) => {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
  }

  const chatMessage = (message) => {
    socket.emit('chatMessage', message);
    return false;
  }

  const messages = () => {
    socket.on('chatMessage', msg => {
      setListMessages([...listMessages, msg]);
    });
  }

  useEffect(() => {
    subscribeToTimer((err, timestamp) => setTimeStamp(timestamp));
  }, [])

  const sendMessage = (event) => {
    event.preventDefault();
    chatMessage(message);
    messages();
    setMessage('');
  }

  useEffect(() => {
    setMappedMessages(listMessages.map((element, index) => (
      <li key={index}>
        {element}
      </li>
    )));
  }, [listMessages]);

  

  return (
    <div className="App">
      <p className='app-intro'>
        This is the timer value: {timestamp}
        <ul id="messages">
          {mappedMessages}
        </ul>
        <form action="">
          <input id="m" autocomplete="off" value={message} onChange={e => setMessage(e.target.value)} /><button onClick={sendMessage}>Send</button>
        </form>
      </p>
    </div>
  ); 
}

export default App;
