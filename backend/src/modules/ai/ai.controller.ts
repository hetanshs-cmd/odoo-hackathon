import { Request, Response } from 'express';
import { aiService } from './ai.service';
import { AppError } from '../../utils/AppError';

export const aiController = {
  chat: async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== 'string') {
        throw new AppError('VALIDATION_ERROR', 400, 'Message is required and must be a string');
      }

      const reply = await aiService.handleChat(message);

      res.status(200).json({
        success: true,
        data: { reply },
        message: 'AI response generated successfully',
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'SERVER_ERROR',
        message: 'Failed to generate AI response',
      });
    }
  },
};
