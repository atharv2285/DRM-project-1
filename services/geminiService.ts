
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const modelPrompts: Record<string, string> = {
    'BSM': `
        Explain the Black-Scholes-Merton (BSM) model for pricing European options in simple terms for a finance student. 
        Structure your explanation with the following markdown sections:
        
        ### Core Idea
        Briefly explain the main concept behind the model.
        
        ### Key Inputs
        List and explain each input parameter:
        - **Stock Price (S)**
        - **Strike Price (K)**
        - **Time to Expiry (T)**
        - **Risk-Free Rate (r)**
        - **Volatility (σ)**
        
        ### Outputs
        Describe what the Call and Put premium outputs represent.
    `,
    'Binomial': `
        Explain the Binomial Option Pricing Model in simple terms for a finance student.
        Structure your explanation with the following markdown sections:
        
        ### Core Idea
        Briefly explain the main concept of using a "tree" to model price movements.
        
        ### Key Inputs
        List and explain each input parameter:
        - **Stock Price (S)**
        - **Strike Price (K)**
        - **Time to Expiry (T)**
        - **Risk-Free Rate (r)**
        - **Volatility (σ)**
        - **Number of Steps**
        
        ### How It Works
        Describe the process of building the tree and working backward to find the option price. Explain why more steps lead to a more accurate price.
    `,
    'Synthetic': `
        Explain the concept of a Synthetic Long Call option using Put-Call Parity for a finance student.
        Structure your explanation with the following markdown sections:

        ### What is Put-Call Parity?
        Briefly explain the no-arbitrage relationship for European options: C + K*e^(-rt) = P + S.

        ### Constructing a Synthetic Call
        Explain how the formula is rearranged to create a synthetic call (C = P + S - K*e^(-rt)). Describe the components of the synthetic strategy:
        - **Long Stock (S)**
        - **Long Put (P)**
        - (Implicitly, this is financed by borrowing the present value of the strike price)

        ### Why It Works
        Describe why the payoff of (Long Stock + Long Put) perfectly mimics the payoff of a Long Call at expiration.

        ### Discrepancies in Real Life
        Briefly mention reasons why the synthetic and actual call prices might differ in the real world (e.g., transaction costs, dividends, liquidity, market inefficiencies).
    `
};

export const fetchModelExplanation = async (modelName: 'BSM' | 'Binomial' | 'Synthetic'): Promise<string> => {
    if (!API_KEY) {
        return Promise.resolve("API Key not configured. Please set the `API_KEY` environment variable to use this feature.");
    }

    try {
        const prompt = modelPrompts[modelName];
        if (!prompt) {
            throw new Error('Invalid model name for explanation.');
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error fetching explanation from Gemini:", error);
        return "Sorry, there was an error fetching the explanation. Please check the console for more details.";
    }
};
