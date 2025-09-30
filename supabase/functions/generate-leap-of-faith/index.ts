import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Log available providers at boot
console.log("Leap of Faith providers active:", {
  lovable: !!Deno.env.get('LOVABLE_API_KEY'),
  gemini: !!Deno.env.get('GEMINI_API_KEY'),
  openai: !!Deno.env.get('OPENAI_API_KEY'),
  together: !!Deno.env.get('TOGETHER_API_KEY'),
  groq: !!Deno.env.get('GROQ_API_KEY'),
});

type Inputs = {
  customer: string;
  problem: string;
  solution: string;
  circleType: 'assumption' | 'hypothesis';
  leapOfFaithResults?: string[];
};

type Output = {
  assumptions: string[];
  _warning?: string;
  _errors?: string[];
};

function buildPrompt(inputs: Inputs): { system: string; user: string } {
  if (inputs.circleType === 'assumption') {
    const system = `🧠 Agent & Task Design Prompt: Generate Leap of Faith Assumptions
🔹 Agent Definition
Role: Lean Startup Strategist

Goal: Identify the most critical Leap of Faith Assumptions (LOFAs) that underpin a founder's CPS logic, focusing on those that could cause the business to fail if proven false.

Backstory: You are an expert in hypothesis-driven entrepreneurship with a deep understanding of Eric Ries' Lean Startup methodology. You specialize in helping early-stage founders break down their business ideas into testable assumptions. Your superpower is translating abstract ideas into clear, falsifiable leaps of faith that can be validated through customer discovery.

🔸 Task Definition
Task Name: Extract Leap of Faith Assumptions from CPS

Task Description: The user will provide their CPS (Customer–Problem–Solution) statement. Your job is to analyze this input and extract 2–3 Leap of Faith Assumptions that, if proven wrong, would significantly jeopardize the viability of the idea. These assumptions should focus on beliefs the entrepreneur is making about customer behavior, willingness to pay, problem relevance, or the effectiveness of the solution.

Steps to Perform:
1. Carefully parse the CPS input to identify: Who the customer is, What problem they are believed to have, What solution is proposed to solve it
2. Determine the implicit assumptions the founder is making for the solution to work
3. Identify which of these are "leap of faith" assumptions — the riskiest beliefs that must be true
4. Output 2–3 assumptions phrased as falsifiable beliefs (i.e., they can be validated or invalidated through interviews or experiments)

Expected Output: A list of 2–3 Leap of Faith Assumptions written in this format:
[LOFA #1]: [assumption]
[LOFA #2]: [assumption]  
[LOFA #3]: [assumption]`;

    const user = `Based on this CPS statement:
Customer: ${inputs.customer}
Problem: ${inputs.problem}
Solution: ${inputs.solution}

Generate 2-3 Leap of Faith Assumptions using the exact format specified in the task definition above. Focus on assumptions that, if proven wrong, would significantly jeopardize the viability of the idea.`;

    return { system, user };
  } else {
    const system = `🤖 Agent Prompt: Generate Hypotheses from Leap of Faith Assumptions
🔹 Agent Role: Hypothesis Framer for Startup Validation

You are an expert in hypothesis-driven product validation. Your job is to take high-level assumptions (Leap of Faith Assumptions) and refine them into specific, falsifiable hypotheses that can guide customer discovery interviews and experiments. You do not interview users — you only create structured hypotheses.

🔸 Task Name: Create Testable Hypotheses from Leap of Faith Assumptions

📝 Task Description: You will receive 2–3 Leap of Faith Assumptions. These are risky, unproven beliefs that underpin a startup idea. Your job is to convert each into a clear, falsifiable hypothesis — something that can be validated or invalidated through real-world interaction.

🪜 Steps to Perform:
1. Read each Leap of Faith Assumption carefully
2. For each assumption, ask: "What would the world look like if this were true?" "How could we test this through real user behavior?"
3. Rewrite the assumption into a hypothesis using the format: We believe that [customer segment] will [specific behavior] because [reason or pain point]

✅ Expected Output Format:
Hypothesis 1 (from LOFA 1): We believe that [customer segment] will [behavior] because [reason].
Hypothesis 2 (from LOFA 2): We believe that [customer segment] will [behavior] because [reason].
Hypothesis 3 (optional): We believe that [customer segment] will [behavior] because [reason].`;

    const user = `Based on these Leap of Faith Assumptions:
${(inputs.leapOfFaithResults || []).join('\n')}

And this CPS context:
Customer: ${inputs.customer}
Problem: ${inputs.problem}
Solution: ${inputs.solution}

Convert each Leap of Faith Assumption into testable hypotheses using the exact format specified above. Make each hypothesis falsifiable and testable through real-world interaction.`;

    return { system, user };
  }
}

async function callLovableAI(system: string, user: string): Promise<string> {
  const key = Deno.env.get('LOVABLE_API_KEY');
  if (!key) throw new Error("Lovable AI key missing");
  
  const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    })
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Lovable AI HTTP ${res.status}: ${errorText}`);
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Lovable AI empty response");
  return text;
}

async function callGemini(system: string, user: string): Promise<string> {
  const key = Deno.env.get('GEMINI_API_KEY');
  if (!key) throw new Error("Gemini key missing");
  
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: `${system}\n\n${user}` }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      })
    }
  );
  
  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini empty response");
  return text;
}

async function callOpenAI(system: string, user: string): Promise<string> {
  const key = Deno.env.get('OPENAI_API_KEY');
  if (!key) throw new Error("OpenAI key missing");
  
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    })
  });
  
  if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("OpenAI empty response");
  return text;
}

async function callTogether(system: string, user: string): Promise<string> {
  const key = Deno.env.get('TOGETHER_API_KEY');
  if (!key) throw new Error("Together key missing");
  
  const res = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
      temperature: 0.7,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    })
  });
  
  if (!res.ok) throw new Error(`Together HTTP ${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Together empty response");
  return text;
}

async function callGroq(system: string, user: string): Promise<string> {
  const key = Deno.env.get('GROQ_API_KEY');
  if (!key) throw new Error("Groq key missing");
  
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile',
      temperature: 0.7,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    })
  });
  
  if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Groq empty response");
  return text;
}

function offlineBackup(inputs: Inputs): Output {
  // Extract key segments from long descriptions
  const extractSegment = (text: string, maxWords: number = 8): string => {
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const customerSegment = extractSegment(inputs.customer);
  const problemCore = extractSegment(inputs.problem);
  const solutionCore = extractSegment(inputs.solution);

  if (inputs.circleType === 'assumption') {
    return {
      assumptions: [
        `[LOFA #1]: The target customer segment experiences this problem frequently enough to actively seek a solution`,
        `[LOFA #2]: Customers are willing to change their current behavior or pay to adopt the proposed solution`,
        `[LOFA #3]: The proposed solution effectively addresses the core problem better than existing alternatives`
      ]
    };
  } else {
    const lofas = inputs.leapOfFaithResults || [];
    if (lofas.length === 0) {
      return {
        assumptions: ['Please generate Leap of Faith Assumptions first before creating hypotheses.']
      };
    }
    return {
      assumptions: lofas.map((lofa, i) => 
        `Hypothesis ${i + 1}: We believe that the target customers will actively seek and adopt the solution because they face this problem regularly and current alternatives are insufficient.`
      )
    };
  }
}

function parseResponse(text: string): string[] {
  const lines = text.split('\n').filter(line => line.trim());
  return lines.length > 0 ? lines : [text];
}

async function generateLeapOfFaith(inputs: Inputs): Promise<Output> {
  const { system, user } = buildPrompt(inputs);
  const providers: Array<() => Promise<string>> = [
    () => callGemini(system, user),
    () => callLovableAI(system, user),
    () => callOpenAI(system, user),
    () => callTogether(system, user),
    () => callGroq(system, user)
  ];

  const errors: string[] = [];
  for (const call of providers) {
    try {
      const text = await call();
      const assumptions = parseResponse(text);
      return { assumptions };
    } catch (e: any) {
      errors.push(e?.message || String(e));
      continue;
    }
  }

  // All failed → offline backup
  const backup = offlineBackup(inputs);
  backup._warning = "LLM providers unavailable; using offline backup.";
  backup._errors = errors;
  return backup;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const inputs: Inputs = await req.json();
    console.log('Generating leap of faith for:', inputs.circleType);
    
    const output = await generateLeapOfFaith(inputs);
    
    return new Response(JSON.stringify(output), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in generate-leap-of-faith:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        assumptions: ['Error generating response. Please try again.']
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
