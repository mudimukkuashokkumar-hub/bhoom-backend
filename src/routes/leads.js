// src/routes/leads.js
import express from 'express';
import { getLeads, getLead, createLead, updateLead, deleteLead } from '../controllers/leadsController.js';
import { authMiddleware, requireRole } from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', createLead);
router.put('/:id', requireRole('agent', 'builder', 'admin', 'super_admin'), updateLead);
router.delete('/:id', requireRole('admin', 'super_admin'), deleteLead);

export default router;
