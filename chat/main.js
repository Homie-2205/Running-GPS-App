const TOKEN_API_URL = (() => {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:8080/api/chat-token';
  }
  return 'https://running-gps-app.onrender.com/api/chat-token';
})();

let chatClient;

const usernameInput = document.getElementById('username');
const peerInput = document.getElementById('peer-id');
const messageInput = document.getElementById('message-text');
const statusText = document.getElementById('status');
const sendButton = document.getElementById('send-btn');
const chatLog = document.getElementById('chat-log');

function appendMessage(text) {
  const div = document.createElement('div');
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

document.getElementById('login-btn').addEventListener('click', async () => {
  const userId = usernameInput.value.trim();

  if (!userId) {
    alert('Enter a username!');
    return;
  }

  statusText.textContent = 'Fetching token...';

  try {
    const response = await fetch(`${TOKEN_API_URL}?userId=${encodeURIComponent(userId)}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch token');
    }

    const data = await response.json();
    const token = data.token;

    chatClient = new AgoraChat.connection({
      appKey: data.appKey || `${data.appId || 'e4fd483a899746719051a0cfe66641c5'}#demo`
    });

    chatClient.addEventHandler('connection_event', {
      onTextMessage: (message) => {
        appendMessage(`${message.from}: ${message.msg}`);
      },
      onConnected: () => {
        statusText.textContent = `Logged in as: ${userId}`;
        sendButton.disabled = false;
      },
      onError: (error) => {
        console.error('Agora connection error:', error);
        statusText.textContent = 'Connection failed';
      }
    });

    await chatClient.open({
      user: userId,
      agoraToken: token
    });
  } catch (error) {
    console.error('Login failed:', error);
    statusText.textContent = 'Login failed';
    alert(error.message || 'Login failed');
  }
});

document.getElementById('send-btn').addEventListener('click', () => {
  const targetPeer = peerInput.value.trim();
  const text = messageInput.value.trim();

  if (!chatClient || !targetPeer || !text) {
    alert('Enter the receiver and message first.');
    return;
  }

  const message = AgoraChat.message.create({
    type: 'txt',
    msg: text,
    to: targetPeer,
    chatType: 'singleChat'
  });

  chatClient.send(message);
  appendMessage(`You: ${text}`);
  messageInput.value = '';
});
