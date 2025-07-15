const express = require('express');
const verifyToken = require('../middleware/auth.js');
const verificarCron = require('../middleware/verificarCron.js');
const somenteRoles = require('../middleware/somenteRoles.js');
const Roles = require('../utils/roles.js');

const {
  registrarManual,
  listarConversas,
  listarMensagensDaConversa,
  responderConversa,
  atribuirConversaHandler,
  liberarConversaHandler,
  liberarConversasInativasHandler,
  atribuirDisponivel,
  criarConversaManualHandler,
  assumirConversaDisponivel
} = require('../controllers/adminController.js');

const router = express.Router();

// Logger opcional
router.use((req, res, next) => {
  console.log(`[AdminRoutes] ${req.method} ${req.originalUrl} - Body:`, req.body);
  next();
});

// Protege com verifyToken + somente ADMIN
router.use(verifyToken);
router.use(somenteRoles([Roles.ADMIN]));

// ROTAS ADMIN
router.post('/registrar-manual', registrarManual);

router.get('/conversas', listarConversas);
router.get('/conversas/:id/mensagens', listarMensagensDaConversa);
router.post('/conversas/:id/responder', responderConversa);
router.post('/conversas/:id/atribuir', atribuirConversaHandler); 
router.post('/conversas/:id/liberar', liberarConversaHandler); 
router.post('/conversas/liberar-inativas', verificarCron, liberarConversasInativasHandler); 
router.post('/conversas/atribuir-disponivel', atribuirDisponivel);
router.post('/conversas/assumir', assumirConversaDisponivel);
router.post('/conversas/nova', criarConversaManualHandler);

module.exports = router;
