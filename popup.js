document.getElementById('myButton').addEventListener('click', () => {
    // Set small dimensions
    const width = 400;
    const height = 500;
    
    // Calculate center coordinates
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    // Pass features instead of '_blank'
    window.open(
        'target.html', 
        'popupWindow', 
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
});
