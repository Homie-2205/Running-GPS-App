// firebase-messaging-sw.js

// 1. Importa las librerías necesarias desde la CDN oficial de Firebase (v13)
importScripts('https://www.gstatic.com/firebasejs/13.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/13.0.0/firebase-messaging-compat.js');

// 2. Configura tu proyecto de Firebase
// REEMPLAZA estos valores con la configuración real de tu aplicación web de Firebase
const firebaseConfig = {
   apiKey: "AIzaSyDAL1E_a2OJrf0XxnMLRLgtm4QPgQMnoEQ",
  authDomain: "myfreeproject-b07fb.firebaseapp.com.",
  projectId: "myfreeproject-b07fb",
  storageBucket: "PROJECT_ID.firebasestorage.app",
  messagingSenderId: "682329799134",
  appId: "1:682329799134:web:8926def9d54f49939a054f"
};

// 3. Inicializa Firebase dentro de este Service Worker
firebase.initializeApp(firebaseConfig);

// 4. Recupera la instancia de Firebase Cloud Messaging para segundo plano
const messaging = firebase.messaging();

// 5. (Opcional) Personaliza cómo se mostrarán los mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Recibido mensaje en segundo plano: ', payload);

  const notificationTitle = payload.notification?.title || 'Nueva Notificación';
  const notificationOptions = {
    body: payload.notification?.body || 'Tienes un nuevo mensaje.',
    icon: '/firebase-logo.png' // Cambia esto por la ruta al logo de tu sitio
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
