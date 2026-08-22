const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { requireAuth } = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir la carpeta public estáticamente
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', requireAuth, adminRoutes);

// El archivo principal es magnet-portfolio.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'magnet-portfolio.html'));
});

// El panel de admin
app.get('/admin', (req, res) => res.redirect('/admin/dashboard.html'));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
