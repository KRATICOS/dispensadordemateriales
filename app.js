const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Lista de orígenes permitidos (web + apps móviles)
const allowedOrigins = [
  'capacitor://localhost',
  'capacitor://127.0.0.1',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8100',
  'https://frontend-oficial.onrender.com',
  null // permite requests sin origen (apps móviles)
];

// Configuración CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middlewares de seguridad y logging
app.use(helmet());
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parser
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

// Archivos estáticos (imágenes)
app.use('/uploads', cors(corsOptions), express.static(path.join(__dirname, 'uploads')));

// Rutas
const authRoutes = require('./app/routes/authRoutes');
const usuarioRoutes = require('./app/routes/usuarioRoutes');
const itemsRoutes = require('./app/routes/items');
const historialRoutes = require('./app/routes/historialRoutes');
const inventarioRoutes = require('./app/routes/inventarioRoutes');
const uploadRoutes = require('./app/routes/uploadRoutes');
const categoriaRoutes = require('./app/routes/categoriaRoutes');

// Prefijo /api
app.use('/api', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/categorias', categoriaRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Materials-Dispenser funcionando correctamente.' });
});

module.exports = app;
