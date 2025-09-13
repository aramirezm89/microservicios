const express = require("express");
const CircuitBreaker = require("opossum");

const app = express();
app.use(express.json());

let pagos = [];
let idCounter = 1;

// Función que simula procesamiento (a veces falla)
function procesarPago(pago) {
  return new Promise((resolve, reject) => {
    const falla = Math.random() < 0.3; // 30% de fallos simulados
    setTimeout(() => {
      if (falla) reject(new Error("Error al procesar pago"));
      else resolve({ ...pago, estado: "aprobado" });
    }, 500);
  });
}

// Circuit Breaker
const breaker = new CircuitBreaker(procesarPago, {
  timeout: 3000, // 3s
  errorThresholdPercentage: 50, // abre si 50% fallan
  resetTimeout: 5000 // vuelve a intentar después de 5s
});

// Crear pago
app.post("/pagos", async (req, res) => {
  const { usuarioId, monto } = req.body;
  const nuevoPago = { id: idCounter++, usuarioId, monto, estado: "pendiente" };
  try {
    const procesado = await breaker.fire(nuevoPago);
    pagos.push(procesado);
    res.status(201).json(procesado);
  } catch (err) {
    res.status(503).json({ error: "Servicio de pagos no disponible", detalle: err.message });
  }
});

// Listar pagos
app.get("/pagos", (req, res) => {
  res.json(pagos);
});

app.listen(3002, () => {
  console.log("Microservicio Pagos en puerto 3002");
});
