import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = 'AIzaSyD-6tp8Dh2Vu9fgs5ZqUiT28gMbxb45st4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      idea, 
      passion, 
      qualified, 
      audience, 
      assumption_category, 
      hypothesis, 
      context 
    } = await req.json();

    console.log('Generating Mom Test questions for:', { idea, assumption_category, hypothesis });

    const systemPrompt = `You are a startup discovery assistant specializing in The Mom Test methodology. Your role is to generate interview questions that follow these strict principles:

RULES (Mom Test checklist):
1. Do NOT ask "Would you use/buy this?", "How much would you pay?", or "Do you like my idea?"
2. Avoid future hypotheticals ("Would you…", "Will you…"). Prefer past/present specifics ("Tell me about the last time…", "How do you currently…")
3. Avoid leading or pitching. No solution words, no features, no selling
4. Ask about frequency, recency, workarounds, budget/spend, decision process, stakeholders, alternatives, switching costs, and priority
5. Questions must be short (≤18 words), clear, neutral, and answerable from memory
6. Aim for who, what, when, where, how often, how much, who else

You must return ONLY valid JSON with exactly this structure (no markdown, no extra text):
{
  "assumption_category": "<echoed category>",
  "hypothesis": "<echoed hypothesis>",
  "audience": "<echoed or inferred audience>",
  "questions": [
    {
      "q": "<interview question>",
      "assumption_tag": "<Demand|Value|Monetization|Acquisition|Retention|Growth|Feasibility>",
      "why_it_works": "<1 short line referencing Mom Test principle>",
      "signal_to_listen_for": "<what strong evidence sounds like>",
      "priority": 1 | 2 | 3
    }
  ]
}`;

    const userPrompt = `Generate exactly 10 Mom Test interview questions for this startup:

INPUTS:
- Business Idea: ${idea}
- Founder Motivation: ${passion || 'Not provided'}
- Founder Credibility: ${qualified || 'Not provided'}
- Target Audience: ${audience}
- Assumption Category: ${assumption_category}
- Hypothesis: ${hypothesis}
- Context: ${context || 'Not provided'}

REQUIREMENTS:
- Generate exactly 10 questions
- Each question must be ≤18 words
- No pitching, no hypotheticals, no leading questions
- Tie each question to the ${assumption_category} assumption and hypothesis
- Spread across: problem discovery, current workflow, frequency/recency, spend/budget, alternatives, decision maker, switching cost, impact/priority, purchase trigger, channel discovery (if relevant)
- Return ONLY valid JSON matching the schema above`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\n${userPrompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    console.log('Raw Gemini response:', content);

    // Extract JSON from markdown code blocks if present
    let jsonContent = content.trim();
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/```\n?/g, '').trim();
    }

    const result = JSON.parse(jsonContent);

    // Validate structure
    if (!result.questions || !Array.isArray(result.questions) || result.questions.length !== 10) {
      throw new Error('Invalid response structure: must have exactly 10 questions');
    }

    console.log('Successfully generated Mom Test questions:', result.questions.length);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-mom-test function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate Mom Test questions';
    const errorDetails = error instanceof Error ? error.toString() : String(error);
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
