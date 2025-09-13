const express = require("express");
const router = express.Router();

let usuarios = [];
let idCounter = 1;

// Crear usuario
router.post("/", (req, res) => {
  const { nombre, email } = req.body;
  if (!nombre || !email) {
    return res.status(400).json({ error: "Faltan datos" });
  }
  const nuevoUsuario = { id: idCounter++, nombre, email };
  usuarios.push(nuevoUsuario);
  res.status(201).json(nuevoUsuario);
});

// Listar usuarios
router.get("/", (req, res) => {
  res.json(usuarios);
});

// Obtener usuario por ID
router.get("/:id", (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  res.json(usuario);
});

// Actualizar usuario
router.put("/:id", (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  const { nombre, email } = req.body;
  if (nombre) usuario.nombre = nombre;
  if (email) usuario.email = email;
  res.json(usuario);
});

// Eliminar usuario
router.delete("/:id", (req, res) => {
  const index = usuarios.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  const eliminado = usuarios.splice(index, 1);
  res.json(eliminado[0]);
});

module.exports = router;
