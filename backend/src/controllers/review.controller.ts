// backend/src/controllers/review.controller.ts
import { Request, Response, NextFunction } from 'express';
import { Review, Template, User } from '../models';
import mongoose from 'mongoose';

// GET /api/reviews/item/:itemId – only approved reviews, populate user name/avatar, sort newest
export const getReviewsByItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const reviews = await Review.find({ itemId, approved: true })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .exec();
    res.json({ success: true, data: reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/reviews – auth required
export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rating, comment, itemId } = req.body;
    const userId = (req as any).userId; // set by protect middleware
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be 1-5' });
    }
    if (!comment) {
      return res.status(400).json({ success: false, message: 'Comment is required' });
    }
    // prevent duplicate review from same user on same template
    const existing = await Review.findOne({ userId, itemId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this template' });
    }
    const newReview = await Review.create({ rating, comment, userId, itemId, approved: false });
    // Recalculate average rating for the template (only approved reviews)
    const approvedReviews = await Review.find({ itemId, approved: true });
    const avg = approvedReviews.reduce((sum, r) => sum + r.rating, 0) / (approvedReviews.length || 1);
    await Template.findByIdAndUpdate(itemId, { rating: avg });
    res.status(201).json({ success: true, data: newReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /api/reviews/:id – admin only
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    // Recalculate rating after deletion
    const approved = await Review.find({ itemId: deleted.itemId, approved: true });
    const avg = approved.reduce((sum, r) => sum + r.rating, 0) / (approved.length || 1);
    await Template.findByIdAndUpdate(deleted.itemId, { rating: avg });
    res.json({ success: true, data: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/reviews – admin only, return all reviews with status
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find().populate('userId', 'name avatar').populate('itemId', 'title').exec();
    res.json({ success: true, data: reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
