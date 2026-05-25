import { Request, Response } from 'express';
import { Template } from '../models';

// GET /api/items
export const getAllTemplates = async (req: Request, res: Response) => {
  try {
    const {
      search = '',
      category,
      rating,
      sort = 'popular',
      page = '1',
      limit = '12',
    } = req.query as any;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }
    if (category) filter.category = category;
    if (rating) filter.rating = { $gte: Number(rating) };

    // Build sort
    let sortOption: any = {};
    switch (sort) {
      case 'newest':
        sortOption.createdAt = -1;
        break;
      case 'rated':
        sortOption.rating = -1;
        break;
      case 'popular':
      default:
        sortOption.usageCount = -1;
        break;
    }

    const total = await Template.countDocuments(filter);
    const templates = await Template.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .exec();

    res.json({
      success: true,
      data: templates,
      meta: { page: pageNum, limit: limitNum, total },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/items/:id
export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = await Template.findById(id).populate('createdBy', 'name').exec();
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, data: template });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getRelatedTemplates = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const current = await Template.findById(id).exec();
    if (!current) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    const related = await Template.find({ category: current.category, _id: { $ne: id } })
      .limit(4)
      .exec();
    res.json({ success: true, data: related });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

