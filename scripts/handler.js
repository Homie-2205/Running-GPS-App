// Locate the submit button in the DOM
const submitButton = document.getElementById('submitBtn');

// Attach the click event listener
submitButton.addEventListener('click', async (event) => {
    // Stop the form from submitting instantly so your scripts can finish loading
    event.preventDefault(); 
    
    try {
        // 1. Import both modules dynamically
        const dataModule = await import('./data.js');
        const pushModule = await import('./push.js');
        
        // 2. Execute functions from those modules
        // Replace 'initData' and 'sendPush' with the actual exported functions you have inside those files
        await dataModule.initData();
        await pushModule.sendPush();
        
        // 3. Submit the form manually now that the tasks are complete
        event.target.form.submit();

    } catch (error) {
        console.error("An error occurred while handling the submission:", error);
    }
});
