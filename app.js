import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAL1E_a2OJrf0XxnMLRLgtm4QPgQMnoEQ",
  authDomain: "myfreeproject-b07fb.firebaseapp.com.",
  projectId: "myfreeproject-b07fb",
  storageBucket: "PROJECT_ID.firebasestorage.app",
  messagingSenderId: "682329799134",
  appId: "1:682329799134:web:8926def9d54f49939a054f"
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
