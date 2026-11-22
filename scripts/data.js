
(function() {
    const form = document.getElementById('dataForm');
    const messageDiv = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); 

        submitBtn.disabled = true;
        messageDiv.style.display = "block";
        messageDiv.textContent = "Enviando pedido...";
        messageDiv.style.color = "black";

        // Convert form data directly to a clean URL search string format for Google Apps script
        const formData = new FormData(form);
        const urlEncodedData = new URLSearchParams();
        for (const pair of formData) {
            urlEncodedData.append(pair[0].trim(), pair[1]);
        }

        // Sending with method POST to Google Web App script URL
        fetch(form.action, {
            method: 'POST',
            mode: 'cors', // Enable standard cors handling for web app json response
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: urlEncodedData.toString()
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                messageDiv.textContent = "¡Pedido registrado con éxito!";
                messageDiv.style.color = "green";
                form.reset();
                
                if (typeof recalculatePrice === "function") {
                    recalculatePrice();
                }
                
                setTimeout(() => {
                    messageDiv.style.display = "none";
                }, 3500);
            } else {
                throw new Error(data.error || 'Unknown sheet writing issue.');
            }
        })
        .catch(error => {
            messageDiv.textContent = "Error al enviar. Por favor intente de nuevo.";
            messageDiv.style.color = "red";
            console.error("Submission Error Details:", error); 
        })
        .finally(() => {
            submitBtn.disabled = false;
        });
    });
})();


                
                



