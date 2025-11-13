
import { GoogleGenAI } from "@google/genai";
import { InventoryItem } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. In a real environment, the key should be set.
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getDemandForecast = async (inventory: InventoryItem[]): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("AI features are disabled. Please configure your API key.");
  }
  
  const model = 'gemini-2.5-flash';

  const prompt = `
    You are an expert inventory management analyst for a restaurant.
    Analyze the following inventory data and provide a demand forecast and reordering recommendations.
    The data includes item name, category, current quantity, unit, and low stock threshold.
    Focus on items that are low in stock or have high potential for spoilage.
    Provide actionable insights in a concise, bulleted list format.
    
    Current Date: ${new Date().toLocaleDateString()}
    
    Inventory Data:
    ${inventory.map(item => 
      `- ${item.name} (${item.category}): ${item.quantity} ${item.unit} (Low stock alert at ${item.lowStockThreshold} ${item.unit})`
    ).join('\n')}
    
    Please provide your analysis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching demand forecast from Gemini API:", error);
    return "There was an error generating the AI forecast. Please check the console for details.";
  }
};
