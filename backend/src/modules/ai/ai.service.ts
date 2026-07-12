import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env';
import { prisma } from '../../config/db';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || 'dummy-key');

export const aiService = {
  async handleChat(message: string): Promise<string> {
    if (!env.GEMINI_API_KEY || env.GEMINI_API_KEY === 'dummy-key') {
      return "⚠️ **Configuration Error**: I am the AI Assistant, but I don't have a valid Gemini API key yet. Please add your `GEMINI_API_KEY` to the `.env` file and restart the server.";
    }

    try {
      // Gather context about the fleet
      const [vehicleCount, driverCount, activeTrips] = await Promise.all([
        prisma.vehicle.count(),
        prisma.driver.count(),
        prisma.trip.count({ where: { status: 'IN_PROGRESS' } }),
      ]);

      const systemPrompt = `You are the TransitOps AI Fleet Assistant. You help managers operate their logistics fleet. 
Current Fleet Status:
- Total Vehicles: ${vehicleCount}
- Total Drivers: ${driverCount}
- Active Trips: ${activeTrips}

Answer the user's questions concisely. Use markdown formatting.`;

      const model = genAI.getGenerativeModel({
        model: "gemini-3.5-flash",
        systemInstruction: systemPrompt
      });

      const result = await model.generateContent(message);
      return result.response.text();
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      throw new Error(error.message || 'Failed to communicate with AI model.');
    }
  },
};
