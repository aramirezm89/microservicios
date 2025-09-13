const express = require("express");
const usuariosRouter = require("./src/routes/usuarios");

const app = express();
app.use(express.json());

app.use("/usuarios", usuariosRouter);

app.listen(3001, () => {
  console.log("Microservicio Usuarios en puerto 3001");
}); 

module.exports = app;