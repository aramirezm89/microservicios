const jwt = require("jsonwebtoken");

const SECRET = "clave-secreta"; // en producción usar variable de entorno

function generarToken(usuario) {
  return jwt.sign({ id: usuario.id, email: usuario.email }, SECRET, { expiresIn: "1h" });
}

function verificarToken(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ error: "Token requerido" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Token inválido" });
  }
}

module.exports = { generarToken, verificarToken, SECRET };
