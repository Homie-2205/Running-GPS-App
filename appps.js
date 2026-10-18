// app.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-messaging.js";

// Configuración de tu proyecto (Encuéntrala en la consola de Firebase)
const firebaseConfig = {
   apiKey: "AIzaSyDAL1E_a2OJrf0XxnMLRLgtm4QPgQMnoEQ",
  authDomain: "myfreeproject-b07fb.firebaseapp.com.",
  projectId: "myfreeproject-b07fb",
  storageBucket: "PROJECT_ID.firebasestorage.app",
  messagingSenderId: "682329799134",
  appId: "1:682329799134:web:8926def9d54f49939a054f"
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
