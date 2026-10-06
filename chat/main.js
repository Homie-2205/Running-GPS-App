// CONFIGURATION (Only keep your public App ID here!)
const AGORA_APP_ID = "your_agora_app_id_here"; 
const RENDER_BACKEND_URL = "https://onrender.com";

let chatClient;

// HANDLE LOGIN
document.getElementById('login-btn').addEventListener('click', async () => {
    const userId = document.getElementById('username').value.trim();
    if (!userId) return alert("Enter a username!");

    document.getElementById('status').innerText = "Fetching token from Render...";

    try {
        // 1. Ask your backend server on Render to sign a token for this user ID
        const response = await fetch(`${RENDER_BACKEND_URL}?userId=${userId}`);
        const data = await response.json();
        const secureToken = data.token;

        // 2. Initialize the Agora Web Client
        chatClient = WebIM.config = new AgoraChat.connection({
            appKey: `${AGORA_APP_ID}#demo` // Agora app layout pattern
        });

        // 3. Set up event handlers to listen for incoming text messages
        chatClient.addEventHandler("connection_event", {
            onTextMessage: (message) => {
                appendMessage(`${message.from}: ${message.msg}`);
            }
        });

        // 4. Authenticate directly to Agora network using the fresh token
        await chatClient.open({
            user: userId,
            agoraToken: secureToken
        });

        document.getElementById('status').innerText = `Logged in as: ${userId}`;
        document.getElementById('send-btn').disabled = false;

    } catch (error) {
        document.getElementById('status').innerText = "Login failed.";
        console.error(error);
    }
});

// HANDLE SENDING MESSAGES
document.getElementById('send-btn').addEventListener('click', () => {
    const targetPeer = document.getElementById('peer-id').value.trim();
    const text = document.getElementById('message-text').value.trim();
    
    if (!targetPeer || !text) return;

    // Create a peer-to-peer message payload
    let msg = AgoraChat.message.create({
        type: 'txt',
        msg: text,
        to: targetPeer,
        chatType: 'singleChat'
    });

    // Send it through the Agora network
    chatClient.send(msg);
    appendMessage(`You: ${text}`);
    document.getElementById('message-text').value = "";
});

function appendMessage(text) {
    const log = document.getElementById('chat-log');
    log.innerHTML += `<div>${text}</div>`;
    log.scrollTop = log.scrollHeight;
}
