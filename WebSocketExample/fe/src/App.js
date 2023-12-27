import React, { useState } from 'react';
import useWebSocket from 'react-use-websocket';

import './App.css';

const WS_URL = 'ws://127.0.0.1:8000';
function App() {
  useWebSocket(WS_URL, {
    onOpen: () => console.log('WebSocket connection established.'),
  });

  return (
    <div>
      Hello WebSockets!
      <LoginSection />
      <History />
    </div>
  );
}

function LoginSection() {
  const [username, setUsername] = useState('');
  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: () => false,
  });

  function logInUser() {
    if (!username.trim()) {
      return;
    }
    sendJsonMessage({ type: 'login', username });
  }

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Enter Username"
      />
      <button onClick={logInUser}>Log In</button>
    </div>
  );
}

function History() {
  const { lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: (message) => message?.type === 'userEvent',
  });

  const activities = lastJsonMessage?.data?.userActivity || [];

  return (
    <ul>
      {activities.map((activity, index) => (
        <li key={`activity-${index}`}>{activity}</li>
      ))}
    </ul>
  );
}

export default App;
