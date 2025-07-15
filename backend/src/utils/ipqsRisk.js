/**
 * Calcula um score de risco e recomendação baseado nos dados do IPQS.
 */
function calcularRiscoIPQS(data) {
  let riskLevel = 'baixo';
  let recommendation = 'Permitir';
  let riskScore = Math.min(data.fraud_score, 100); // base inicial

  // Penalização adicional se fatores suspeitos forem detectados
  if (data.recent_abuse) riskScore += 10;
  if (data.bot_status || data.is_bot) riskScore += 15;
  if (data.proxy && data.vpn) riskScore += 10;
  if (data.active_tor) riskScore += 20;
  if (data.is_relay) riskScore += 10;
  if (data.is_hosting_provider) riskScore += 5;
  if (data.abuse_velocity === 'medium') riskScore += 5;
  if (data.abuse_velocity === 'high') riskScore += 10;

  // Clamp entre 0 e 100
  riskScore = Math.min(Math.max(riskScore, 0), 100);

  // Definir nível de risco baseado no score final
  if (riskScore >= 90) {
    riskLevel = 'crítico';
    recommendation = 'Bloquear imediatamente';
  } else if (riskScore >= 75) {
    riskLevel = 'alto';
    recommendation = 'Bloquear ou exigir autenticação forte (2FA)';
  } else if (riskScore >= 50) {
    riskLevel = 'moderado';
    recommendation = 'Monitorar comportamento e limitar ações sensíveis';
  } else if (riskScore >= 25) {
    riskLevel = 'baixo';
    recommendation = 'Permitir, mas monitorar com cuidado';
  } else {
    riskLevel = 'muito baixo';
    recommendation = 'Permitir normalmente';
  }

  return {
    risk_level: riskLevel,
    risk_recommendation: recommendation,
    risk_score: riskScore,
    risk_factors: {
      fraud_score: data.fraud_score,
      proxy: data.proxy,
      vpn: data.vpn,
      tor: data.tor,
      active_tor: data.active_tor,
      is_bot: data.is_bot,
      recent_abuse: data.recent_abuse,
      abuse_velocity: data.abuse_velocity,
      is_hosting_provider: data.is_hosting_provider,
      is_relay: data.is_relay,
      connection_type: data.connection_type,
    }
  };
}

module.exports = {
  calcularRiscoIPQS
};
