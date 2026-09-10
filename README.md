# Chat P2P de 2 personas para Render

## Archivos
- server.js
- package.json
- public/index.html

## Render
Crear un Web Service desde GitHub.

Build Command:
npm install

Start Command:
npm start

No necesitas configurar un puerto manualmente: Render proporciona `PORT`.

## Uso
1. Abre la URL de Render.
2. Persona A escribe un código, por ejemplo `CRISTIAN123`.
3. Persona B abre la misma URL y escribe `CRISTIAN123`.
4. Cuando estén las dos personas, se crea la conexión WebRTC.
5. Los mensajes se envían por el canal de datos P2P.

## Nota
El servidor de Render se utiliza para la señalización. El contenido del chat no pasa por Socket.IO después de establecerse el canal WebRTC.

Para mayor compatibilidad en redes difíciles, se puede agregar un servidor TURN.
