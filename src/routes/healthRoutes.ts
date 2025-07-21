import express from 'express';

const router = express.Router();

/**
 * @route GET /
 * @desc 健康检查接口
 * @access Public
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'tronScan-api',
    version: '1.0.0'
  });
});

export default router;