const app = require('./app');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Variables de entorno
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 5000;

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar Socket.IO con CORS compatible
const io = new Server(server, {
  cors: {
    origin: [
      'capacitor://localhost',
      'capacitor://127.0.0.1',
      'ionic://localhost',
      'http://localhost',
      'http://localhost:8100',
      'https://frontend-oficial.onrender.com',
      null
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Conexiones de Socket.IO
io.on('connection', (socket) => {
  console.log('⚡ Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('⚡ Cliente desconectado:', socket.id);
  });
});

// Rutas que dependen del socket
const notificacionesRoutes = require('./app/routes/notificacionesRoutes')(io);
app.use('/api/notificaciones', notificacionesRoutes);

// Conectar a MongoDB y levantar servidor
mongoose.connect(DB_URL)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  });
