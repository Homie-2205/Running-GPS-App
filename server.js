require('dotenv').config();
const express = require('express');
const path = require('path');
const { RtmTokenBuilder, RtmRole } = require('agora-access-token');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const AGORA_APP_ID = process.env.AGORA_APP_ID;
const AGORA_CERTIFICATE = process.env.AGORA_CERTIFICATE;

app.get('/api/agora-config', (req, res) => {
  res.json({
    appId: AGORA_APP_ID || '',
    tokenEndpoint: '/api/agora-token'
  });
});

app.post('/api/agora-token', (req, res) => {
  const uid = String(req.body?.uid || '').trim();

  if (!uid) {
    return res.status(400).json({ message: 'uid is required' });
  }

  if (!AGORA_APP_ID || !AGORA_CERTIFICATE) {
    return res.status(500).json({
      message: 'Missing AGORA_APP_ID or AGORA_CERTIFICATE. Set them in your environment variables.'
    });
  }

  try {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + 3600;

    const token = RtmTokenBuilder.buildToken(
      AGORA_APP_ID,
      AGORA_CERTIFICATE,
      uid,
      RtmRole.Rtm_User,
      privilegeExpiredTs
    );

    return res.json({ token });
  } catch (error) {
    console.error('Error generating RTM token:', error);
    return res.status(500).json({ message: 'Failed to generate Agora token' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
