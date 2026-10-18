// app.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-messaging.js";

// Configuración de tu proyecto (Encuéntrala en la consola de Firebase)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_ID_PROYECTO.firebaseapp.com",
  projectId: "TU_ID_PROYECTO",
  storageBucket: "TU_ID_PROYECTO.firebasestorage.app",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Solicita el permiso del usuario y recupera el token de dispositivo
async function obtenerTokenDePrueba() {
  try {
    const permiso = await Notification.requestPermission();
    
    if (permiso === "granted") {
      console.log("¡Permiso de notificaciones aprobado!");
      
      // Obtiene el token usando tu clave pública VAPID (de la consola de Firebase)
      const tokenActual = await getToken(messaging, { 
        vapidKey: "TU_CLAVE_VAPID_PUBLICA" 
      });
      
      if (tokenActual) {
        console.log("-----------------------------------------");
        console.log("TU TOKEN DE REGISTRO FCM:");
        console.log(tokenActual); // <--- Este es el token que usarás para tus pruebas
        console.log("-----------------------------------------");
      } else {
        console.log("No se pudo obtener el token. Asegúrate de que el archivo 'firebase-messaging-sw.js' esté cargado en la raíz de tu sitio.");
      }
    } else {
      console.log("El usuario rechazó los permisos de notificación.");
    }
  } catch (error) {
    console.error("Error al obtener el token:", error);
  }
}

// Ejecuta la función al cargar la página
obtenerTokenDePrueba();
