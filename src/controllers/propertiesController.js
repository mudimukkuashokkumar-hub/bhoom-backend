// src/controllers/propertiesController.js
import { Property } from '../models/Property.js';

export const getProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const filters = {
      status: req.query.status,
      city: req.query.city,
      type: req.query.type,
    };

    const properties = await Property.findAll(filters, limit, offset);
    const total = await Property.count(filters);

    res.json({
      success: true,
      data: properties,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties',
      code: 'FETCH_PROPERTIES_ERROR',
    });
  }
};

export const getProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
        code: 'PROPERTY_NOT_FOUND',
      });
    }

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch property',
      code: 'FETCH_PROPERTY_ERROR',
    });
  }
};

export const createProperty = async (req, res) => {
  try {
    const { title, type, price, city, country } = req.body;

    if (!title || !type || !price || !city || !country) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        code: 'MISSING_FIELDS',
      });
    }

    const propertyId = await Property.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: {
        id: propertyId,
        title,
        status: 'draft',
      },
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create property',
      code: 'CREATE_PROPERTY_ERROR',
    });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
        code: 'PROPERTY_NOT_FOUND',
      });
    }

    await Property.update(id, req.body);

    res.json({
      success: true,
      message: 'Property updated successfully',
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update property',
      code: 'UPDATE_PROPERTY_ERROR',
    });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
        code: 'PROPERTY_NOT_FOUND',
      });
    }

    await Property.delete(id);

    res.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete property',
      code: 'DELETE_PROPERTY_ERROR',
    });
  }
};
