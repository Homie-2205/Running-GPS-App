
    document.getElementById('submitBtn').addEventListener('click', function() {
        const statusText = document.getElementById('status');
        statusText.innerText = "Sending...";

        // 1. Define the API endpoint and your token
        const url = 'https://pushbullet.com';
        const accessToken = 'o.k1v3f77NaxjtadBUPSJHrRL8iGJd6Y4J'; // Remember to revoke your leaked token and put a new one here!

        // 2. Prepare the payload data
        const data = {
            "email": "cqacqacqaamerica@gmail.com",
            "body": "Space Elevator, Mars Hyperloop, Space Model S (Model Space?)",
            "title": "Space Travel Ideas",
            "type": "note"
        };

        // 3. Make the browser HTTP request
        fetch(url, {
            method: 'POST',
            headers: {
                'Access-Token': accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(result => {
            statusText.innerText = "Success! Push sent.";
            console.log(result);
        })
        .catch(error => {
            statusText.innerText = "Error sending push. Check console.";
            console.error('Error:', error);
        });
    });

