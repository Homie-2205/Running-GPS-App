const express=require('express');const app=express();const http=require('http').createServer(app);
const io=require('socket.io')(http);app.use(express.static(__dirname));
io.on('connection',s=>{['offer','answer','candidate'].forEach(ev=>s.on(ev,d=>s.broadcast.emit(ev,d)));});
http.listen(3000);