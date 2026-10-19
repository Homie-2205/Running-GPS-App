import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// 1. Load the service account JSON key file safely
const serviceAccountUrl = new URL('./service-account.json', import.meta.url);
const serviceAccount = JSON.parse(readFileSync(serviceAccountUrl, 'utf8'));

// 2. Initialize the Admin SDK with the key file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log('Firebase Admin SDK initialized successfully!');

// --- Examples of backend operations you can now perform ---

const db = admin.firestore();

// Example: Retrieve documents from a Cloud Firestore collection
async function getMyData() {
  try {
    const snapshot = await db.collection('users').get();
    snapshot.forEach(doc => {
      console.log(`User ID: ${doc.id} =>`, doc.data());
    });
  } catch (error) {
    console.error('Error fetching Firestore data:', error);
  }
}

// Example: Verify a client-side ID token sent from the browser
async function verifyUserToken(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log(`Success! Authenticated User UID: ${decodedToken.uid}`);
    return decodedToken;
  } catch (error) {
    console.error('ID token verification failed:', error);
    throw error;
  }
}

// Run the Firestore example to test
getMyData();
