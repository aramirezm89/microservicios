const express = require("express");
const { generarToken, verificarToken } = require("./auth");
const axios = require("axios");

const app = express();
app.use(express.json());

// Endpoints de login (genera JWT)
app.post("/login", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email requerido" });

  const usuarioFake = { id: 1, email };
  const token = generarToken(usuarioFake);
  res.json({ token });
});

// Simulación de service discovery (URLs de microservicios)
const services = {
  usuarios: "http://localhost:3001/usuarios",
  pagos: "http://localhost:3002/pagos"
};

// Gateway hacia Usuarios (protegido por JWT)
app.use("/usuarios", verificarToken, async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${services.usuarios}${req.url}`,
      data: req.body
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Error en Usuarios" });
  }
});

// Gateway hacia Pagos (protegido por JWT)
app.use("/pagos", verificarToken, async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${services.pagos}${req.url}`,
      data: req.body
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Error en Pagos" });
  }
});

app.listen(3000, () => {
  console.log("API Gateway en puerto 3000");
});
