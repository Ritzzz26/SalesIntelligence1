import type { Deal } from "@shared/schema";
import * as ss from "simple-statistics";

// Since this is a demo, we're using simple-statistics instead of OpenAI API
// In a real implementation, we would use the OpenAI API for more advanced forecasting

type ForecastResult = {
  probability: number;
  predictedCloseDate: string;
  recommendation: string;
  factors: Array<{
    name: string;
    impact: "positive" | "negative" | "neutral";
    weight: number;
  }>;
};

export async function generateForecast(
  deal: Deal | undefined,
  customInput?: string
): Promise<ForecastResult> {
  // If no deal is provided, return generic forecast
  if (!deal) {
    return {
      probability: 0.75,
      predictedCloseDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      recommendation: "Focus on building relationship with the decision makers and addressing any concerns about pricing.",
      factors: [
        { name: "Market conditions", impact: "positive", weight: 0.7 },
        { name: "Competition", impact: "negative", weight: 0.3 },
        { name: "Budget alignment", impact: "positive", weight: 0.8 },
      ],
    };
  }

  // Use simple statistical methods to calculate probability
  let baseProbability = deal.probability / 100;
  
  // Apply some simple modifications based on deal properties
  const daysUntilClose = deal.expectedCloseDate 
    ? Math.max(0, Math.floor((new Date(deal.expectedCloseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) 
    : 30;
  
  // Deals closing soon have more certainty
  const timeEffect = daysUntilClose < 7 ? 0.1 : daysUntilClose > 30 ? -0.05 : 0;
  
  // Deals in later stages have higher probabilities
  const stageEffect = 
    deal.stage === "Closed Won" ? 0.3 :
    deal.stage === "Negotiation" ? 0.15 :
    deal.stage === "Proposal" ? 0.05 :
    deal.stage === "Product Demo" ? 0 :
    -0.1;
  
  // Value effect - larger deals are slightly harder to close
  const valueEffect = deal.value > 50000 ? -0.05 : deal.value < 10000 ? 0.05 : 0;
  
  // Calculate adjusted probability (ensuring it stays between 0 and 1)
  const adjustedProbability = Math.min(1, Math.max(0, baseProbability + timeEffect + stageEffect + valueEffect));
  
  // Add some randomness to make it look like AI (in a real implementation, the AI would provide this)
  // Using a simple randomization instead of the normal distribution function
  const randomFactor = (Math.random() * 0.1) - 0.05; // Random value between -0.05 and 0.05
  const finalProbability = Math.min(1, Math.max(0, adjustedProbability + randomFactor));
  
  // Calculate predicted close date
  let predictedCloseDate: Date;
  if (deal.expectedCloseDate) {
    // Adjust expected close date based on probability
    const deviation = (1 - finalProbability) * 14; // Up to 14 days delay for low probability deals
    predictedCloseDate = new Date(new Date(deal.expectedCloseDate).getTime() + deviation * 24 * 60 * 60 * 1000);
  } else {
    // Default to 30 days from now if no expected close date
    predictedCloseDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  
  // Generate recommendations based on deal properties
  let recommendation = "";
  if (finalProbability < 0.4) {
    recommendation = "Consider offering additional incentives or discounts to improve close chances.";
  } else if (finalProbability < 0.7) {
    recommendation = "Focus on addressing the client's specific pain points and emphasize ROI.";
  } else {
    recommendation = "Maintain regular contact and start preparing implementation plans to ensure a smooth transition.";
  }
  
  // Add custom input awareness if provided
  if (customInput) {
    recommendation += ` Regarding "${customInput}": This is an important consideration that should be addressed in your next client meeting.`;
  }
  
  // Create impact types with proper typing
  const getImpact = (effect: number): "positive" | "negative" | "neutral" => {
    if (effect > 0) return "positive";
    if (effect < 0) return "negative";
    return "neutral";
  };

  // Relevant factors affecting the deal
  const factors = [
    { 
      name: "Deal stage", 
      impact: getImpact(stageEffect), 
      weight: Math.abs(stageEffect) * 5
    },
    { 
      name: "Timeline", 
      impact: getImpact(timeEffect), 
      weight: Math.abs(timeEffect) * 5
    },
    { 
      name: "Deal size", 
      impact: getImpact(valueEffect), 
      weight: Math.abs(valueEffect) * 5
    },
  ];
  
  return {
    probability: parseFloat(finalProbability.toFixed(2)),
    predictedCloseDate: predictedCloseDate.toISOString(),
    recommendation,
    factors,
  };
}
