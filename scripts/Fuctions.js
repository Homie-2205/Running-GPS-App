// 1. YOUR PUSHBULLET SCRIPT FUNCTION
async function sendPushNotification() {
    const statusText = document.getElementById('status');
    statusText.innerText = "Sending...";

    const url = 'https://pushbullet.com';
    const accessToken = 'o.k1v3f77NaxjtadBUPSJHrRL8iGJd6Y4J'; // Replace this!

    const data = {
        "email": "cqacqacqaamerica@gmail.com",
        "body": "Space Elevator, Mars Hyperloop, Space Model S (Model Space?)",
        "title": "Space Travel Ideas",
        "type": "note"
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Access-Token': accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const result = await response.json();
        statusText.innerText = "Success! Push sent.";
        console.log(result);
    } catch (error) {
        statusText.innerText = "Error sending push. Check console.";
        console.error('Error:', error);
    }
}

// 2. YOUR HELLO WORLD SCRIPT FUNCTION
function sayHelloWorld() {
    console.log("Hello World!");
    alert("Hello World!");
}

// 3. THE MAIN EVENT LISTENER WRAPPER
document.getElementById('submitBtn').addEventListener('click', async function() {
    // This executes your Pushbullet script first and waits for it to finish
    await sendPushNotification();
    
    // This executes your Hello World script immediately after
    sayHelloWorld();
});
