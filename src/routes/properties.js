// src/routes/properties.js
import express from 'express';
import { getProperties, getProperty, createProperty, updateProperty, deleteProperty } from '../controllers/propertiesController.js';
import { authMiddleware, requireRole } from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getProperties);
router.get('/:id', getProperty);
router.post('/', requireRole('agent', 'builder', 'admin', 'super_admin'), createProperty);
router.put('/:id', requireRole('agent', 'builder', 'admin', 'super_admin'), updateProperty);
router.delete('/:id', requireRole('agent', 'builder', 'admin', 'super_admin'), deleteProperty);

export default router;
