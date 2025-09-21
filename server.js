 
 require('dotenv').config()
 const express = require('express')
 const app = express()
 const path = require('path')
 const mysql = require('mysql2/promise')
 const PORT = process.env.PORT || 3000
//T35t@2023!
//middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json({limit: '50mb'}))
app.use(express.static(path.join(__dirname, 'public')))

// --- Configuración de la Base de Datos ---
const pool = mysql.createPool({
            host: '127.0.0.1',
            user: 'user2',
            password: 'user2',
            database: 'rainde',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            port: 3307
            });

app.post('/api/operations', async (req, res) => {
const { expression, result } = req.body;
console.log(expression,result)

      if (!expression || !result) {
         return res.status(400).json({ error: 'La expresión y el resultado son requeridos.' });
         }

         try {
         const sqlQuery = 'INSERT INTO operations (expression, result) VALUES (?, ?)';

         await pool.query(sqlQuery, [expression, result]);

         res.status(201).json({ message: 'Operación guardada exitosamente.' });

         } catch (error) {
         console.error('Error al insertar en la base de datos:', error);

         res.status(500).json({ error: 'Error interno del servidor al guardar la operación.' });
         }
});

//select * from operations order by created_at limit 4
 
 app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}/`)
 })







