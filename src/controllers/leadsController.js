// src/controllers/leadsController.js
import { Lead } from '../models/Lead.js';

export const getLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      propertyId: req.query.propertyId,
    };

    const leads = await Lead.findAll(filters, limit, offset);
    const total = await Lead.count(filters);

    res.json({
      success: true,
      data: leads,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leads',
      code: 'FETCH_LEADS_ERROR',
    });
  }
};

export const getLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
        code: 'LEAD_NOT_FOUND',
      });
    }

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lead',
      code: 'FETCH_LEAD_ERROR',
    });
  }
};

export const createLead = async (req, res) => {
  try {
    const { name, email, phone, propertyId } = req.body;

    if (!name || !email || !phone || !propertyId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        code: 'MISSING_FIELDS',
      });
    }

    const leadId = await Lead.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: {
        id: leadId,
        name,
        email,
        status: 'new',
      },
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create lead',
      code: 'CREATE_LEAD_ERROR',
    });
  }
};

export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
        code: 'LEAD_NOT_FOUND',
      });
    }

    await Lead.update(id, req.body);

    res.json({
      success: true,
      message: 'Lead updated successfully',
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lead',
      code: 'UPDATE_LEAD_ERROR',
    });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
        code: 'LEAD_NOT_FOUND',
      });
    }

    await Lead.delete(id);

    res.json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lead',
      code: 'DELETE_LEAD_ERROR',
    });
  }
};
