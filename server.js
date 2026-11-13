const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname, { index: 'index.html' }));

const SECRET_PIN = process.env.SECRET_PIN || "220";
const STATUS_FILE = path.join(__dirname, 'status.json');

// Función para leer el estado guardado en disco
function getSavedStatus() {
    try {
        if (fs.existsSync(STATUS_FILE)) {
            const data = fs.readFileSync(STATUS_FILE, 'utf8');
            return JSON.parse(data).status || 'unavailable';
        }
    } catch (error) {
        console.error('Error al leer status.json:', error);
    }
    // Solo si el archivo nunca ha existido, crea uno por defecto
    saveStatus('unavailable');
    return 'unavailable';
}

// Función para guardar el estado de forma permanente en disco
function saveStatus(newStatus) {
    try {
        fs.writeFileSync(STATUS_FILE, JSON.stringify({ status: newStatus }, null, 2), 'utf8');
    } catch (error) {
        console.error('Error al guardar status.json:', error);
    }
}

// GET endpoint: lee siempre el valor guardado en el archivo
app.get('/api/get-status', (req, res) => {
    const currentStatus = getSavedStatus();
    res.json({ status: currentStatus });
});

// POST endpoint: actualiza el archivo solo cuando envías el PIN correcto
app.post('/api/update-status', (req, res) => {
    const { status, pin } = req.body;
    
    if (String(pin) !== SECRET_PIN) {
        return res.status(401).json({ error: 'Unauthorized: Invalid security code.' });
    }

    if (status === 'available' || status === 'unavailable') {
        saveStatus(status);
        return res.status(200).json({ message: 'Status updated successfully', status });
    }
    
    res.status(400).json({ error: 'Invalid status value' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}. Estado actual: ${getSavedStatus()}`);
});
