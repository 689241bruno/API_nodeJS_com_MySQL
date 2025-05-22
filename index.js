const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bancoUsers",
});

// Testar conexão
db.connect((err) => {
  if (err) {
    console.error("Erro na conexão:", err);
  } else {
    console.log("Conectado ao MySQL");
  }
});

app.post("/usuarios", (req, res) => {
  const { nome, email, senha } = req.body;
  const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
  db.query(sql, [nome, email, senha], (err, result) => {
    if (err) {
      console.error("Erro no MySQL:", err);
      return res.status(500).send({ error: err });
    }
    res.send({ message: "Usuário cadastrado!", id: result.insertId });
  });
});

app.get("/usuarios", (req, res) => {
  const sql = "SELECT * FROM usuarios";
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send({ error: err });
    }

    res.send(result);
  });
});

app.get("/usuarios/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM usuarios WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send({ error: err });
    }
    if (result.length === 0) {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }
    res.send(result[0]);
  });

  app.delete("/usuarios/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM usuarios WHERE id = ? ";
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.status(500).send({ error: err });
      }
      if (result.length === 0) {
        return res.status(404).send({ message: "Usuário deletado" });
      }
      res.send(result[0]);
    });
  });
});

//rota de login

app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
  db.query(sql, [email, senha], (err, result) => {
    if (err) {
      console.error("Erro no MySQL:", err);
      return res.status(500).send({ error: "Erro interno do servidor" });
    }

    if (result.length > 0) {
      res.send({ message: "Login bem-sucedido", user: result[0] });
    } else {
      res.status(401).send({ error: "Email ou senha inválidos" });
    }
  });
});

app.listen(3000, "0.0.0.0", () => {
  console.log("API rodando na porta 3000");
});
