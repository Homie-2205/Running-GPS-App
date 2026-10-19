importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Must match the config used in app.js
const firebaseConfig = {
    apiKey: "AIzaSyDAL1E_a2OJrf0XxnMLRLgtm4QPgQMnoEQ",
  authDomain: "myfreeproject-b07fb.firebaseapp.com.",
  projectId: "myfreeproject-b07fb",
  storageBucket: "PROJECT_ID.firebasestorage.app",
  messagingSenderId: "682329799134",
  appId: "1:682329799134:web:8926def9d54f49939a054f"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background notifications when app is closed/in background
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  const { title, body, icon } = payload.notification;
  self.registration.showNotification(title, { body, icon });
});







const firebaseConfig = {
   apiKey: "AIzaSyDAL1E_a2OJrf0XxnMLRLgtm4QPgQMnoEQ",
  authDomain: "myfreeproject-b07fb.firebaseapp.com.",
  projectId: "myfreeproject-b07fb",
  storageBucket: "PROJECT_ID.firebasestorage.app",
  messagingSenderId: "682329799134",
  appId: "1:682329799134:web:8926def9d54f49939a054f"
};


