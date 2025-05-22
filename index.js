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
      return res.status(500).send({ error: err });
    }
    res.send({ message: "Usuário cadastrado!", id: result.insertId });
  });
});

app.get("/usuarios", (req, res) => {
  res.send(req.body);
});

app.listen(3000, "0.0.0.0", () => {
  console.log("API rodando na porta 3000");
});
