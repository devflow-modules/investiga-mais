const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth.js');
const somenteRoles = require('../middleware/somenteRoles.js');
const Roles = require('../utils/roles.js');
const limiterPerfil = require('../middleware/limiterPerfil.js');
const perfilController = require('../controllers/perfilController.js');

// 🧾 Logger opcional
router.use((req, res, next) => {
  console.log(`[PerfilRoutes] ${req.method} ${req.originalUrl} - Body:`, req.body);
  next();
});

// 🔒 Protege todas as rotas → CLIENTE
router.use(verifyToken);
router.use(somenteRoles([Roles.CLIENTE]));

// 📥 Rotas de perfil
router.get('/', perfilController.obterPerfil);
router.post('/', limiterPerfil, perfilController.atualizarPerfil);

module.exports = router;
