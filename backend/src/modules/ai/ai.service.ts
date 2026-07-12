import Groq from 'groq-sdk';
import { env } from '../../config/env';
import { prisma } from '../../config/db';

const groq = new Groq({
  apiKey: env.GROQ_API_KEY || 'dummy-key',
});

export const aiService = {
  async handleChat(message: string): Promise<string> {
    if (!env.GROQ_API_KEY || env.GROQ_API_KEY === 'dummy-key') {
      return "⚠️ **Configuration Error**: I am the AI Assistant, but I don't have a valid Groq API key yet. Please add your `GROQ_API_KEY` to the `.env` file and restart the server.";
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

      const response = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        model: 'llama3-8b-8192',
        temperature: 0.7,
        max_tokens: 1024,
      });

      return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error: any) {
      console.error('Groq API Error:', error);
      throw new Error(error.message || 'Failed to communicate with AI model.');
    }
  },
};
