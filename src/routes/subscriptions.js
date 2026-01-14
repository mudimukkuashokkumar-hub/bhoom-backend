// src/routes/subscriptions.js
import express from 'express';
import { getSubscriptions, getUserSubscription, createSubscription, cancelSubscription, getDashboardStats } from '../controllers/subscriptionsController.js';
import { authMiddleware, requireRole } from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', requireRole('admin', 'super_admin'), getSubscriptions);
router.get('/user/:userId', getUserSubscription);
router.post('/', createSubscription);
router.put('/:id/cancel', cancelSubscription);
router.get('/dashboard/stats', requireRole('admin', 'super_admin'), getDashboardStats);

export default router;
