// Locate the submit button and the form in the DOM
const submitButton = document.getElementById('submitBtn');
// Safer to explicitly grab the form or fallback to the button's parent form
const form = submitButton.closest('form'); 

submitButton.addEventListener('click', async (event) => {
    // Prevent the default form submission immediately
    event.preventDefault(); 
    
    // Safety check: ensure the form exists before running heavy logic
    if (!form) {
        console.error("Form element could not be found.");
        return;
    }
    
    try {
        // 1. Dynamic imports (added leading slash for absolute root path routing)
     // Use ./ to tell the browser to look in the exact same folder
const dataModule = await import('./coco.js');
const pushModule = await import('./data.js');

        
        // 2. Execute module functions
        await dataModule.initData();
        await pushModule.sendPush();
        
        // 3. Submit the form safely
        form.submit();

    } catch (error) {
        console.error("An error occurred while handling the submission:", error);
    }
});
