import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request user permission and get the device token
async function initializeFCM() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Replace with your Web Push certificates (VAPID key) from console
      const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
      console.log('FCM Registration Token:', token);
    } else {
      console.warn('Notification permission denied.');
    }
  } catch (error) {
    console.error('Error during FCM setup:', error);
  }
}

// Handle incoming messages when the app is in the foreground
onMessage(messaging, (payload) => {
  console.log('Foreground message received:', payload);
  // Custom logic to display notification details in your UI
});

initializeFCM();
