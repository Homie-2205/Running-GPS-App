 document.getElementById('submitBtn').addEventListener('click', function() {
            const statusText = document.getElementById('status');
            statusText.innerText = "Sending...";

            // 1. Define the API endpoint and your token
            const url = 'https://api.pushbullet.com/v2/pushes';
            const accessToken = 'o.3h7ESpakX1x5C6ayPfD1cx6pb5Xu6Gjz'; // Replace this!

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
 
