import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Replace with your actual Firebase configuration
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

async function initFCM() {
  try {
    // Explicitly prompt the user for notification permissions
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      // Register the service worker file
      const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      
      // Retrieve your FCM registration token
      const token = await getToken(messaging, { 
        vapidKey: 'BJPRUjr3eb4HAPrGuaNZhVUswLZWLB-61QLFLHkEt3Z4RSQSMPMTzP06EYgqLiKY7DL7vjPkHEXFYWl_SFliIdg', // Generate in Project Settings > Cloud Messaging
        serviceWorkerRegistration: reg 
      });
      console.log('FCM Token:', token);
    } else {
      console.warn('Permission not granted for notifications.');
    }
  } catch (err) {
    console.error('FCM initialization failed:', err);
  }
}

initFCM();

// Handle foreground notifications
onMessage(messaging, (payload) => {
  console.log('Foreground message received:', payload);
});














