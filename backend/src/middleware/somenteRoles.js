const { sendError } = require('../../../shared/utils/sendResponse')

function somenteRoles(rolesPermitidas = []) {
  return (req, res, next) => {
    const roleUsuario = req.user?.role
    const usuarioId = req.user?.usuarioId || req.user?.id

    if (!rolesPermitidas.includes(roleUsuario)) {
      console.warn(`[somenteRoles] Acesso negado para role='${roleUsuario}' (usuarioId=${usuarioId}). Permitidas: [${rolesPermitidas.join(', ')}]`)
      return sendError(res, 403, 'Acesso restrito: permissão insuficiente.')
    }

    console.log(`[somenteRoles] Acesso liberado para role='${roleUsuario}' (usuarioId=${usuarioId})`)
    next()
  }
}

module.exports = somenteRoles
