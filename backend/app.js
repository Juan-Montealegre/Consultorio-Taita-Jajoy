import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres', // Cambia por tu usuario
  host: 'localhost',
  database: 'consultorio_taita', // Cambia por el nombre de tu base de datos
  password: 'Sistemas', // Cambia por tu contraseña
  port: 5432,
});
// Ruta raíz para mostrar mensaje de bienvenida
app.get('/', (req, res) => {
  res.send('¡Bienvenido al backend del Consultorio Taita Jajoy!');
});

// Ruta de prueba para verificar conexión
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ejemplo: obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});