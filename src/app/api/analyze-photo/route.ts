import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

export async function POST(request: Request) {
  try {
    const { image, mimeType } = await request.json();

    if (!image || !mimeType) {
      return NextResponse.json(
        { error: 'Image and mimeType are required' },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined');
    }
    console.log('API Key length:', GEMINI_API_KEY.length); // Debug log
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const prompt = `You are an expert fitness coach and physique judge.\nGiven a user's physique photo, analyze and rate the following muscle groups on a scale from 1 to 10 (no zeros):\n- Chest\n- Legs\n- Arms\n- Back\n\nIf a muscle group is not clearly visible in the photo, do NOT assign a zero. Instead, use your best judgment to estimate its score based on the visible muscle groups, overall proportions, and typical physique balance. Complete the picture as a human judge would, inferring likely development from the available evidence.\n\nReturn your answer strictly in this JSON format:\n{\n  \"chest\": <score 1-10>,\n  \"legs\": <score 1-10>,\n  \"arms\": <score 1-10>,\n  \"back\": <score 1-10>\n}\nReply with only the JSON object, and nothing else.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            inlineData: {
              mimeType,
              data: image,
            },
          },
          { text: prompt },
        ],
      });

      return NextResponse.json({ result: response.text });
    } catch (geminiError: unknown) {
      console.error('Gemini API Error:', {
        message: geminiError instanceof Error ? geminiError.message : geminiError
      });
      return NextResponse.json(
        { error: 'Gemini API error: ' + (geminiError instanceof Error ? geminiError.message : geminiError) },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Error analyzing photo:', {
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Failed to analyze photo: ' + (error instanceof Error ? error.message : error) },
      { status: 500 }
    );
  }
} 