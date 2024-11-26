const express = require('express');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const {Pool} = require('pg');
const {Buffer} = require('buffer');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', socket => {
  console.log('Yeni kullanıcı bağlandı:', socket.id);

  socket.on('room', roomName => {
    socket.join(roomName);
    console.log(`${roomName} odasına katıldınız: ${socket.id}`);
  });

  socket.on('message', async data => {
    const {room_id, username, message, task_id, image, time} = data;

    const currentTime =
      time ||
      new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

    let imageBase64 = null;
    if (image) {
      const buffer = Buffer.from(image, 'binary');
      imageBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }

    const query = `
        INSERT INTO messages (room_id, username, message, task_id, image, time)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;

    try {
      const result = await pool.query(query, [
        room_id,
        username,
        message || null,
        task_id,
        imageBase64 || null,
        currentTime,
      ]);

      const savedMessage = result.rows[0];

      io.to(room_id).emit('messageReturn', {
        ...data,
        id: savedMessage.id,
        timestamp: savedMessage.timestamp,
        image: imageBase64,
      });

      console.log(
        `Message sent: ${
          message || 'Image'
        } - Room_id: ${room_id} - Task ID: ${task_id}`,
      );
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
});

app.post('/messages', async (req, res) => {
  const {room, room_id, username, image, task_id, ext} = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO messages (room, room_id, username, image, task_id, ext) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [room, room_id, username, image, task_id, ext],
    );

    if (result.rows.length > 0) {
      res.json({success: true, message: 'Giriş başarılı!'});
    } else {
      res.json({success: false, message: 'Giriş bilgileri hatalı.'});
    }
  } catch (error) {
    console.error('Sunucu hatası:', error);
    res.status(500).json({success: false, message: 'Sunucu hatası', error});
  }
});

app.post('/documents', async (req, res) => {
  const {task_id, dosya, ext} = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO DOCUMENTS (task_id, dosya, ext) VALUES ($1, $2, $3) RETURNING *;`,
      [task_id, dosya, ext],
    );

    if (result.rows.length > 0) {
      res.json({success: true, message: 'Giriş başarılı!'});
    } else {
      res.json({success: false, message: 'Giriş bilgileri hatalı.'});
    }
  } catch (error) {
    console.error('Sunucu hatası:', error);
    res.status(500).json({success: false, message: 'Sunucu hatası', error});
  }
});

app.post('/login', async (req, res) => {
  const {username, password} = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password],
    );

    if (result.rows.length > 0) {
      res.json({success: true, message: 'Giriş başarılı!'});
    } else {
      res.json({success: false, message: 'Giriş bilgileri hatalı.'});
    }
  } catch (error) {
    res.status(500).json({success: false, message: 'Sunucu hatası', error});
  }
});

app.post('/rooms', async (req, res) => {
  const {room} = req.body;

  const query = `INSERT INTO rooms (room) VALUES ($1) RETURNING *;`;

  try {
    const result = await pool.query(query, [room]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({message: 'Oda oluşturulurken hata oluştu.'});
  }
});

app.post('/register', async (req, res) => {
  const {username, password, room, user_type, user_type_id} = req.body;

  const query = `INSERT INTO users (username, password, room, user_type, user_type_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;

  try {
    const result = await pool.query(query, [
      username,
      password,
      room,
      user_type,
      user_type_id,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({message: 'Kullanıcı oluşturulurken hata oluştu.'});
  }
});

app.post('/tasks', async (req, res) => {
  const {title, description, problem, room, image} = req.body;
  const imageBuffer = Buffer.from(image, 'base64');

  const query = ` INSERT INTO tasks (title, description, problem, room, image) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;

  try {
    const result = await pool.query(query, [
      title,
      description,
      problem,
      room,
      imageBuffer,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({message: 'Task eklenemedi', error});
  }
});

app.post('/problems', async (req, res) => {
  const {problem} = req.body;

  const query = `INSERT INTO problems (problem) VALUES ($1) RETURNING *;`;

  try {
    const result = await pool.query(query, [problem]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({message: 'Problem eklenemedi', error});
  }
});

app.post('/status', async (req, res) => {
  const {statu} = req.body;

  const query = `INSERT INTO status (statu) VALUES ($1) RETURNING *;`;

  try {
    const result = await pool.query(query, [statu]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({message: 'Statu eklenemedi', error});
  }
});

app.get('/rooms', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooms ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({message: 'Odalar alınırken hata oluştu.'});
  }
});

app.get('/status', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM status ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({message: 'Durumlar alınırken hata oluştu.'});
  }
});

app.get('/users/:user', async (req, res) => {
  const user = req.params.user;

  const query = ` SELECT * FROM users WHERE username = $1;`;
  try {
    const result = await pool.query(query, [user]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({message: 'HATA'});
  }
});

app.get('/users/:username/:password', async (req, res) => {
  const username = req.params.username;
  const password = req.params.password;

  const query = ` SELECT * FROM users WHERE username = $1 AND password = $2;`;
  try {
    const result = await pool.query(query, [username, password]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({message: 'HATA'});
  }
});

app.get('/messages/:room_id', async (req, res) => {
  const room_id = req.params.room_id;

  const query = ` SELECT * FROM messages WHERE room_id = $1 ORDER BY id ASC`;

  try {
    const result = await pool.query(query, [room_id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({message: 'Mesajlar alınırken hata oluştu.'});
  }
});

app.get('/messages/:room_id/:task_id', async (req, res) => {
  const room_id = req.params.room_id;
  const id = req.params.task_id;

  const query =
    ' SELECT * FROM messages WHERE room_id = $1 AND task_id = $2 ORDER BY(id) ASC';

  try {
    const result = await pool.query(query, [room_id, id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({message: 'Mesajlar alınırken hata oluştu.'});
  }
});

app.get('/tasks', async (req, res) => {
  const query = `	SELECT * FROM tasks ORDER BY room, statu_id ASC;;
`;

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({message: 'Task yüklenemedi'});
  }
});

app.get('/tasks/:room_id', async (req, res) => {
  const room_id = req.params.room_id;
  const query = `SELECT * FROM tasks where room_id = $1 ORDER BY statu_id, problem_id ASC;
`;

  try {
    const result = await pool.query(query, [room_id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({message: 'Task yüklenemedi'});
  }
});

app.get('/tasks/admin/:problem', async (req, res) => {
  const problem = req.params.problem;
  const query = `SELECT * FROM tasks where problem = $1 ORDER BY room, statu_id ASC;
`;

  try {
    const result = await pool.query(query, [problem]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({message: 'Problem yüklenemedi'});
  }
});

app.get('/tasks/:problem_id/:room_id', async (req, res) => {
  const problem_id = req.params.problem_id;
  const room_id = req.params.room_id;

  const query = `SELECT * FROM tasks WHERE problem_id = $1 AND room_id = $2 ORDER BY statu_id ASC`;

  try {
    const result = await pool.query(query, [problem_id, room_id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({message: 'Task yüklenemedi'});
  }
});

app.get('/tasks/:problem_id/:room_id/:id', async (req, res) => {
  const problem_id = req.params.problem_id;
  const room_id = req.params.room_id;
  const id = req.params.id;

  const query = `SELECT * FROM tasks WHERE problem_id = $1 AND room_id = $2 AND id = $3`;

  try {
    const result = await pool.query(query, [problem_id, room_id, id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({message: 'Task yüklenemedi'});
  }
});

app.get('/problems', async (req, res) => {
  const problem = req.params.problem;

  const query = `SELECT * FROM PROBLEMS`;

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({message: 'Problem yüklenemedi'});
  }
});

app.put('/tasks/update/statu', async (req, res) => {
  const {id, statu_id} = req.body;

  const query = `
    UPDATE tasks
    SET statu_id = $1
    WHERE id = $2;
  `;

  try {
    const result = await pool.query(query, [statu_id, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({message: 'Task not found'});
    }

    res.json({
      message: 'Task updated successfully',
      updatedTask: {id, statu_id},
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res
      .status(500)
      .json({message: 'An error occurred while updating the task'});
  }
});

app.delete('/messages/:room', async (req, res) => {
  const room = req.params.room;

  const query = ` DELETE FROM messages WHERE room = $1;`;

  try {
    await pool.query(query, [room]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({message: 'Mesajlar silinirken hata oluştu.'});
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const id = req.params.id;

  const query = `DELETE FROM tasks WHERE id = $1`;

  try {
    await pool.query(query, [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({message: 'Görev silinirken bir hata oluştu'});
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
