let conn = null; 
let myUserId = "";
let targetPeerId = "";

// DOM Elements References
const loginBtn = document.getElementById('login-btn');
const sendBtn = document.getElementById('send-btn');
const usernameInput = document.getElementById('username-input');
const peerInput = document.getElementById('peer-input');
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const statusDiv = document.getElementById('status');
const authPanel = document.getElementById('auth-panel');
const messageForm = document.getElementById('message-form');

loginBtn.addEventListener('click', async () => {
    myUserId = usernameInput.value.trim();
    targetPeerId = peerInput.value.trim();

    if (!myUserId || !targetPeerId) {
        alert("Please specify your identity and target destination.");
        return;
    }

    statusDiv.innerText = "Extracting token authorization matrices...";
    
    try {
        // 1. Safely retrieve credentials from the Node server endpoint
        const response = await fetch('/api/get-chat-credentials');
        const credentials = await response.json();

        // 2. Instantiate connection instance using the parsed configuration parameters
        conn = new AgoraChat.connection({
            appId: credentials.appId // Binds to your APP_ID: e4fd483a899746719051a0cfe66641c5
        });

        // 3. Mount monitoring hook parameters to parse chat events
        setupChatEventListeners();

        // 4. Authenticate directly using the generated/static token property
        conn.open({
            user: myUserId.toLowerCase(), // Agora IDs require lower-case formats natively
            accessToken: credentials.token
        });

    } catch (error) {
        console.error("Critical client authorization failure:", error);
        statusDiv.innerText = "Could not map backend network parameters successfully.";
    }
});

function setupChatEventListeners() {
    conn.addEventHandler("CHAT_ENGINE_EVENTS", {
        onConnected: () => {
            statusDiv.innerText = `Logged in as: ${myUserId} | Target: ${targetPeerId}`;
            authPanel.style.display = "none";
            chatBox.style.display = "block";
            messageForm.style.display = "flex";
        },
        onTextMessage: (message) => {
            if (message.from === targetPeerId.toLowerCase()) {
                appendMessage(message.msg, "received");
            }
        },
        onDisconnected: () => {
            statusDiv.innerText = "Session cluster network terminated.";
        },
        onError: (err) => {
            console.error("Agora operational event pipeline error:", err);
        }
    });
}

sendBtn.addEventListener('click', sendTextMessage);
messageInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendTextMessage(); });

function sendTextMessage() {
    const content = messageInput.value.trim();
    if (!content || !conn) return;

    let option = {
        chatType: 'singleChat',
        type: 'txt',
        to: targetPeerId.toLowerCase(),
        msg: content
    };

    let msg = AgoraChat.message.create(option);

    conn.send(msg).then(() => {
        appendMessage(content, "sent");
        messageInput.value = "";
    }).catch((error) => {
        console.error("Outbound stream structural handling failure:", error);
    });
}

function appendMessage(text, side) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', side);
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
