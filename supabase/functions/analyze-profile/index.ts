const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AnalysisRequest {
  profileText: string;
}

interface AnalysisResult {
  emotionalMaturity: {
    score: number;
    summary: string;
    details: string[];
  };
  ghostingRisk: {
    level: string;
    summary: string;
    indicators: string[];
  };
  emotionalSafety: {
    score: number;
    summary: string;
    positives: string[];
    concerns: string[];
  };
  connectionSignals: {
    summary: string;
    strengths: string[];
    considerations: string[];
  };
  overallTone: string;
}

function analyzeProfile(text: string): AnalysisResult {
  const lowerText = text.toLowerCase();
  const wordCount = text.split(/\s+/).length;
  
  const hasEmotionalWords = /feel|emotion|connect|understand|communication|vulnerab/i.test(text);
  const hasFutureWords = /future|long.?term|relationship|partner|commit/i.test(text);
  const hasRedFlags = /drama|crazy|ex|baggage|no time|busy|casual|hook.?up|dtf/i.test(text);
  const hasPositiveWords = /honest|kind|genuine|authentic|respect|communication|growth/i.test(text);
  const hasHobbies = /love|enjoy|passion|hobby|hobby|interest|travel|music|read|cook|hik/i.test(text);
  const hasHumor = /laugh|fun|humor|joke|silly|adventure/i.test(text);
  const isVague = wordCount < 30 || /just ask|idk|whatever|bored/i.test(text);
  const isDetailed = wordCount > 80;
  
  let maturityScore = 50;
  if (hasEmotionalWords) maturityScore += 15;
  if (hasFutureWords) maturityScore += 15;
  if (hasPositiveWords) maturityScore += 10;
  if (isDetailed) maturityScore += 10;
  if (hasRedFlags) maturityScore -= 20;
  if (isVague) maturityScore -= 15;
  maturityScore = Math.max(0, Math.min(100, maturityScore));
  
  let ghostingLevel = "Medium";
  let ghostingScore = 50;
  if (isVague) ghostingScore += 30;
  if (hasRedFlags) ghostingScore += 20;
  if (!hasEmotionalWords && !hasFutureWords) ghostingScore += 15;
  if (hasPositiveWords) ghostingScore -= 20;
  if (hasEmotionalWords) ghostingScore -= 15;
  if (isDetailed) ghostingScore -= 10;
  
  if (ghostingScore > 65) ghostingLevel = "Higher";
  else if (ghostingScore < 35) ghostingLevel = "Lower";
  
  let safetyScore = 60;
  if (hasPositiveWords) safetyScore += 15;
  if (hasEmotionalWords) safetyScore += 10;
  if (isDetailed) safetyScore += 10;
  if (hasRedFlags) safetyScore -= 25;
  if (isVague) safetyScore -= 15;
  safetyScore = Math.max(0, Math.min(100, safetyScore));
  
  const maturityDetails = [];
  if (hasEmotionalWords) maturityDetails.push("Shows emotional awareness and willingness to communicate feelings");
  if (hasFutureWords) maturityDetails.push("Mentions future-oriented thinking and relationship intentions");
  if (isDetailed) maturityDetails.push("Takes time to express themselves thoughtfully");
  if (hasHobbies) maturityDetails.push("Shares personal interests and passions");
  if (isVague) maturityDetails.push("Profile lacks detail, making it harder to gauge authenticity");
  if (hasRedFlags) maturityDetails.push("Contains language that may indicate unresolved past issues");
  if (maturityDetails.length === 0) maturityDetails.push("Profile is relatively neutral in emotional expression");
  
  const ghostingIndicators = [];
  if (isVague) ghostingIndicators.push("Minimal effort in profile suggests lower investment");
  if (hasRedFlags) ghostingIndicators.push("Casual language may indicate non-committal intentions");
  if (!hasEmotionalWords && !hasFutureWords) ghostingIndicators.push("Lacks emotional depth or future-oriented language");
  if (hasPositiveWords && isDetailed) ghostingIndicators.push("Thoughtful communication style suggests reliability");
  if (ghostingIndicators.length === 0) ghostingIndicators.push("No strong indicators either way");
  
  const safetyPositives = [];
  const safetyConcerns = [];
  if (hasPositiveWords) safetyPositives.push("Uses respectful and mature language");
  if (hasEmotionalWords) safetyPositives.push("Demonstrates emotional intelligence");
  if (isDetailed) safetyPositives.push("Invests time in self-presentation");
  if (hasRedFlags) safetyConcerns.push("Contains potentially problematic language");
  if (isVague) safetyConcerns.push("Lack of detail makes it harder to assess intentions");
  if (safetyPositives.length === 0) safetyPositives.push("No significant red flags detected");
  if (safetyConcerns.length === 0) safetyConcerns.push("None identified");
  
  const connectionStrengths = [];
  const connectionConsiderations = [];
  if (hasHobbies) connectionStrengths.push("Shares interests that could spark conversation");
  if (hasHumor) connectionStrengths.push("Shows personality and sense of fun");
  if (hasEmotionalWords) connectionStrengths.push("Open to deeper emotional connection");
  if (isVague) connectionConsiderations.push("May require more effort to find common ground");
  if (hasRedFlags) connectionConsiderations.push("Communication style may need addressing early on");
  if (connectionStrengths.length === 0) connectionStrengths.push("Standard profile with room for conversation");
  if (connectionConsiderations.length === 0) connectionConsiderations.push("Approach with open communication");
  
  let overallTone = "Neutral and balanced";
  if (hasPositiveWords && isDetailed) overallTone = "Warm and authentic";
  else if (hasHumor && hasHobbies) overallTone = "Lighthearted and engaging";
  else if (isVague) overallTone = "Brief and reserved";
  else if (hasRedFlags) overallTone = "Casual with some caution flags";
  
  return {
    emotionalMaturity: {
      score: maturityScore,
      summary: maturityScore >= 70 
        ? "This profile shows good emotional awareness and self-expression."
        : maturityScore >= 50
        ? "This profile shows moderate emotional maturity with room for more depth."
        : "This profile may benefit from more thoughtful self-expression.",
      details: maturityDetails
    },
    ghostingRisk: {
      level: ghostingLevel,
      summary: ghostingLevel === "Lower"
        ? "Communication patterns suggest reliable follow-through."
        : ghostingLevel === "Medium"
        ? "No strong indicators either way. Trust your gut and watch for consistency."
        : "Profile shows patterns that may indicate lower investment or follow-through.",
      indicators: ghostingIndicators
    },
    emotionalSafety: {
      score: safetyScore,
      summary: safetyScore >= 70
        ? "Profile suggests emotionally mature communication and respectful boundaries."
        : safetyScore >= 50
        ? "Profile appears relatively safe with standard emotional expression."
        : "Profile shows some patterns worth exploring carefully in early conversations.",
      positives: safetyPositives,
      concerns: safetyConcerns
    },
    connectionSignals: {
      summary: "Here's what might help you connect and what to watch for:",
      strengths: connectionStrengths,
      considerations: connectionConsiderations
    },
    overallTone
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { profileText }: AnalysisRequest = await req.json();

    if (!profileText || profileText.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Profile text is too short. Please provide at least 10 characters." }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const analysis = analyzeProfile(profileText);

    return new Response(
      JSON.stringify(analysis),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error analyzing profile:", error);
    return new Response(
      JSON.stringify({ error: "Failed to analyze profile. Please try again." }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});