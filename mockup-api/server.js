const jsonServer = require("json-server");
const cors = require("cors"); // 👈 ADICIONADO
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// ✅ CORS (AJUSTE NECESSÁRIO)
server.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware para parsear JSON
server.use(jsonServer.bodyParser);

// Middleware para simular autenticação (adaptado para navegador)
server.use((req, res, next) => {
  // Sempre permitir login
  if (req.path === "/auth/login") return next();

  // Permitir GETs no navegador sem header
  if (req.method === "GET") return next();

  // Para outros métodos, exigir token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Token de autenticação não fornecido",
      message: "Use o header: Authorization: Bearer mock-token-12345",
    });
  }

  next();
});

// Middleware para delay realista
server.use((req, res, next) => {
  setTimeout(next, Math.random() * 500 + 100); // 100-600ms
});

// Middleware para logs
server.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Endpoint de login (POST)
server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@contabil.com" && password === "123456") {
    res.json({
      token: "mock-token-12345",
      user: {
        id: "1",
        nome: "Administrador",
        email: "admin@contabil.com",
        perfil: "CONTADOR",
      },
      expiresIn: 3600,
    });
  } else {
    res.status(401).json({
      error: "Credenciais inválidas",
      message: "Use: admin@contabil.com / 123456",
    });
  }
});

// Endpoint de login (GET) para navegador
server.get("/auth/login", (req, res) => {
  res.json({
    token: "mock-token-12345",
    user: {
      id: "1",
      nome: "Administrador",
      email: "admin@contabil.com",
      perfil: "CONTADOR",
    },
    expiresIn: 3600,
  });
});

// Middleware para balancete
server.get("/api/lancamentos/balancete", (req, res) => {
  const db = router.db;
  const lancamentos = db.get("lancamentos").value();
  const { dataInicio, dataFim, status } = req.query;

  let filtered = lancamentos;

  if (dataInicio) filtered = filtered.filter((l) => l.data >= dataInicio);
  if (dataFim) filtered = filtered.filter((l) => l.data <= dataFim);
  if (status && status !== "TODOS")
    filtered = filtered.filter((l) => l.status === status);

  const totalDebitos = filtered
    .filter((l) => l.tipo === "DEBITO")
    .reduce((sum, l) => sum + l.valor, 0);

  const totalCreditos = filtered
    .filter((l) => l.tipo === "CREDITO")
    .reduce((sum, l) => sum + l.valor, 0);

  res.json({
    totalDebitos,
    totalCreditos,
    saldo: totalCreditos - totalDebitos,
    quantidade: filtered.length,
    periodo: {
      inicio: dataInicio || lancamentos[lancamentos.length - 1]?.data,
      fim: dataFim || lancamentos[0]?.data,
    },
  });
});

// Middleware para paginação de lançamentos
server.use((req, res, next) => {
  if (
    req.url.startsWith("/api/lancamentos") &&
    req.method === "GET" &&
    !req.url.includes("balancete")
  ) {
    const db = router.db;
    let lancamentos = db.get("lancamentos").value();

    const { search, tipo, status, contaCodigo, dataInicio, dataFim } =
      req.query;

    if (search) {
      const searchLower = search.toLowerCase();
      lancamentos = lancamentos.filter(
        (l) =>
          l.historico.toLowerCase().includes(searchLower) ||
          (l.documento && l.documento.toLowerCase().includes(searchLower))
      );
    }

    if (tipo && tipo !== "TODOS")
      lancamentos = lancamentos.filter((l) => l.tipo === tipo);
    if (status && status !== "TODOS")
      lancamentos = lancamentos.filter((l) => l.status === status);
    if (contaCodigo)
      lancamentos = lancamentos.filter(
        (l) => l.contaContabil.codigo === contaCodigo
      );
    if (dataInicio)
      lancamentos = lancamentos.filter((l) => l.data >= dataInicio);
    if (dataFim)
      lancamentos = lancamentos.filter((l) => l.data <= dataFim);

    const sort = req.query.sort || "data";
    const order = req.query.order || "desc";

    lancamentos.sort((a, b) => {
      let aVal = a[sort];
      let bVal = b[sort];
      if (sort === "data") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      return order === "desc" ? (bVal > aVal ? 1 : -1) : aVal > bVal ? 1 : -1;
    });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    res.json({
      data: lancamentos.slice(startIndex, endIndex),
      pagination: {
        total: lancamentos.length,
        page,
        limit,
        totalPages: Math.ceil(lancamentos.length / limit),
        hasNext: endIndex < lancamentos.length,
        hasPrev: page > 1,
      },
    });
    return;
  }

  next();
});

// Middleware default
server.use(middlewares);
server.use("/api", router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log("=".repeat(60));
  console.log("API Mock do Sistema Contábil");
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
  console.log(
    "Acesse http://localhost:3000/auth/login no navegador para pegar o token"
  );
  console.log(
    "Endpoints disponíveis: /api/lancamentos, /api/contas, /api/lancamentos/balancete"
  );
  console.log("=".repeat(60));
});
