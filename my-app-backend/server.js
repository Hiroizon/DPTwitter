const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001;

// CORSミドルウェアの設定
app.use(cors());

// JSONリクエストの解析を有効化
app.use(express.json());

// SQLiteデータベースへの接続
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database');
    db.run("CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)", (err) => {
      if (err) {
        console.error('Error creating table', err);
      } else {
        console.log('Table created or already exists');
      }
    });
  }
});

// サーバーの起動
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });

// メモを取得するためのAPI
app.get('/api/memos', (req, res) => {
  db.all("SELECT * FROM memos", [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).json(rows);
    }
  });
});

// メモを保存するためのAPI
app.post('/api/memos', (req, res) => {
  const { content } = req.body;
  db.run("INSERT INTO memos (content) VALUES (?)", [content], function(err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).json({ id: this.lastID, content });
    }
  });
});

// メモを削除するためのAPI
app.delete('/api/memos/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM memos WHERE id = ?", [id], function(err) {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(200).json({ id: this.changes });
      }
    });
  });