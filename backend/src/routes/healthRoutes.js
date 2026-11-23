const express = require('express');
const { isLockdownEnabled } = require('../middleware/lockdown.js');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: isLockdownEnabled() ? 'lockdown' : 'ok',
  });
});

module.exports = router;
