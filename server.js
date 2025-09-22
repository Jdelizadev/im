 
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

app.get('/api/history', async (req, res) => {
   try {
      const sqlQuery = 'SELECT operation_id, expression, result FROM operations ORDER BY operation_id DESC LIMIT 2'

         const [rows] = await pool.query(sqlQuery)
         res.status(200).json(rows)

   } catch (error) {
      console.error('Error al obtener el historial de la BD:', error)
      res.status(500).json({error: 'Error interno del servidor al obtener el historial'})
   }
})

app.get('/api/search', async (req, res) => {
    const { q } = req.query;
    console.log(req.query)

    if (!q) {
        return res.status(400).json({ error: 'El término de búsqueda es requerido.' });
    }

    try {
        const sqlQuery = 'SELECT expression, result FROM operations WHERE result = ? OR expression LIKE ?';
        
        const searchTermLike = `%${q}%`;

        const [rows] = await pool.query(sqlQuery, [q, searchTermLike]);

        res.status(200).json(rows);

    } catch (error) {
        console.error('Error al buscar en la base de datos:', error);
        res.status(500).json({ error: 'Error interno del servidor al realizar la búsqueda.' });
    }
});

app.delete('/api/operations/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const sqlQuery = 'DELETE FROM operations WHERE operation_id = ?';
        
        const [result] = await pool.query(sqlQuery, [id]);
        console.log(result)
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Operación eliminada exitosamente.' });
        } else {
            res.status(404).json({ error: 'No se encontró la operación con ese ID.' });
        }
    } catch (error) {
        console.error('Error al eliminar la operación:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

 app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}/`)
 })







