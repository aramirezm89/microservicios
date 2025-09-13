const request = require("supertest");
const app = require("../src/app");

describe("Usuarios API", () => {
  let usuarioCreado;

  it("debería crear un usuario", async () => {
    const nuevoUsuario = { nombre: "Ana", email: "ana@mail.com" };
    const res = await request(app).post("/usuarios").send(nuevoUsuario);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.nombre).toBe("Ana");
    usuarioCreado = res.body;
  });

  it("debería listar usuarios", async () => {
    const res = await request(app).get("/usuarios");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("debería obtener un usuario por ID", async () => {
    const res = await request(app).get(`/usuarios/${usuarioCreado.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe("Ana");
  });

  it("debería actualizar un usuario", async () => {
    const res = await request(app)
      .put(`/usuarios/${usuarioCreado.id}`)
      .send({ nombre: "Ana Actualizada" });
    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe("Ana Actualizada");
  });

  it("debería eliminar un usuario", async () => {
    const res = await request(app).delete(`/usuarios/${usuarioCreado.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(usuarioCreado.id);
  });

  it("debería devolver 404 si el usuario no existe", async () => {
    const res = await request(app).get("/usuarios/9999");
    expect(res.statusCode).toBe(404);
  });

  it("debería devolver 400 si faltan datos al crear", async () => {
    const res = await request(app).post("/usuarios").send({ nombre: "SinEmail" });
    expect(res.statusCode).toBe(400);
  });
});
