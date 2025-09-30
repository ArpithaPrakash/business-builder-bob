import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Log available providers at boot
console.log("🔑 Available API providers:", {
  lovable: !!Deno.env.get('LOVABLE_API_KEY'),
  gemini: !!Deno.env.get('GEMINI_API_KEY'),
  openai: !!Deno.env.get('OPENAI_API_KEY'),
  together: !!Deno.env.get('TOGETHER_API_KEY'),
  groq: !!Deno.env.get('GROQ_API_KEY')
});

// Types
type Inputs = {
  idea: string;
  passion?: string;
  qualified?: string;
  audience: string;
  assumption_category: string;
  hypothesis: string;
  context?: string;
};

type Question = {
  q: string;
  assumption_tag: string;
  why_it_works: string;
  signal_to_listen_for: string;
  priority: number;
};

type Output = {
  assumption_category: string;
  hypothesis: string;
  audience: string;
  questions: Question[];
  _warning?: string;
  _errors?: string[];
};

// Prompt builder
const buildPrompt = (i: Inputs) => `You are a startup discovery assistant. Generate EXACTLY 10 interview questions that follow The Mom Test.

Inputs:
- Idea: ${i.idea}
- Passion: ${i.passion || ""}
- Qualified: ${i.qualified || ""}
- Audience: ${i.audience}
- Assumption Category: ${i.assumption_category}
- Hypothesis: ${i.hypothesis}
- Context: ${i.context || ""}

Rules:
- No pitching. No hypotheticals ("would you", "will you"). No "do you like it".
- Ask about past/present behavior: last time, current workflow, frequency, spend, alternatives, decision process.
- Short (<= 18 words), specific to the audience/context. Neutral tone.
- Spread coverage across discovery, workflow, frequency, spend, alternatives, decision maker, switching cost, impact/priority, trigger, and channel (if Acquisition).
- Return ONLY valid JSON in this schema:

{
  "assumption_category": "<echoed>",
  "hypothesis": "<echoed>",
  "audience": "<echoed or inferred>",
  "questions": [
    {
      "q": "<interview question>",
      "assumption_tag": "<Demand|Value|Monetization|Acquisition|Retention|Growth|Feasibility>",
      "why_it_works": "<1 line>",
      "signal_to_listen_for": "<1 line>",
      "priority": 1
    }
  ]
}`;

// LLM Provider Functions
async function callLovableAI(prompt: string): Promise<string> {
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
        { role: 'system', content: 'You respond ONLY with JSON matching the requested schema.' },
        { role: 'user', content: prompt }
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

async function callGemini(prompt: string): Promise<string> {
  const key = Deno.env.get('GEMINI_API_KEY');
  if (!key) throw new Error("Gemini key missing");
  
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 2000 }
      })
    }
  );
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini HTTP ${res.status}: ${errorText}`);
  }
  
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini empty response");
  return text;
}

async function callOpenAI(prompt: string): Promise<string> {
  const key = Deno.env.get('OPENAI_API_KEY');
  if (!key) throw new Error("OpenAI key missing");
  
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: "You respond ONLY with JSON matching the requested schema." },
        { role: "user", content: prompt }
      ]
    })
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenAI HTTP ${res.status}: ${errorText}`);
  }
  
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("OpenAI empty response");
  return text;
}

async function callTogether(prompt: string): Promise<string> {
  const key = Deno.env.get('TOGETHER_API_KEY');
  if (!key) throw new Error("Together key missing");
  
  const res = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
      temperature: 0.2,
      messages: [
        { role: "system", content: "Output JSON only." },
        { role: "user", content: prompt }
      ]
    })
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Together HTTP ${res.status}: ${errorText}`);
  }
  
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Together empty response");
  return text;
}

async function callGroq(prompt: string): Promise<string> {
  const key = Deno.env.get('GROQ_API_KEY');
  if (!key) throw new Error("Groq key missing");
  
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: "llama-3.1-70b-versatile",
      temperature: 0.2,
      messages: [
        { role: "system", content: "Output JSON only." },
        { role: "user", content: prompt }
      ]
    })
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Groq HTTP ${res.status}: ${errorText}`);
  }
  
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Groq empty response");
  return text;
}

// Offline deterministic backup
function offlineBackup(i: Inputs): Output {
  const tags = [
    "Demand","Value","Monetization","Acquisition","Retention","Growth","Feasibility",
    "Demand","Value","Monetization"
  ];
  
  const who = i.audience || "your typical user";
  
  const questions: Question[] = [
    {
      q: `Tell me about the last time you faced this problem.`,
      assumption_tag: tags[0],
      why_it_works: "Past behavior, specific, neutral.",
      signal_to_listen_for: "Concrete recency/frequency, real spend, named tools/alternatives.",
      priority: 1
    },
    {
      q: `How do you currently handle it? What tools do you use?`,
      assumption_tag: tags[1],
      why_it_works: "Uncovers existing solutions and workarounds.",
      signal_to_listen_for: "Named tools, manual processes, frustrations with current approach.",
      priority: 1
    },
    {
      q: `How often does this happen in a typical week?`,
      assumption_tag: tags[2],
      why_it_works: "Establishes frequency and urgency.",
      signal_to_listen_for: "Specific numbers, patterns, pain level.",
      priority: 1
    },
    {
      q: `When it happens, how long does it take end-to-end?`,
      assumption_tag: tags[3],
      why_it_works: "Quantifies time investment.",
      signal_to_listen_for: "Hours, days, bottlenecks.",
      priority: 2
    },
    {
      q: `What have you paid for solutions in the past year?`,
      assumption_tag: tags[4],
      why_it_works: "Reveals actual budget and willingness to pay.",
      signal_to_listen_for: "Dollar amounts, existing subscriptions.",
      priority: 2
    },
    {
      q: `Where did you first discover your current solution?`,
      assumption_tag: tags[5],
      why_it_works: "Identifies effective channels.",
      signal_to_listen_for: "Specific sources: colleague, search, community.",
      priority: 2
    },
    {
      q: `Who else is involved in choosing a new tool?`,
      assumption_tag: tags[6],
      why_it_works: "Maps decision-making process.",
      signal_to_listen_for: "Roles, approval chains, budget holders.",
      priority: 2
    },
    {
      q: `What would make you switch from your current workaround?`,
      assumption_tag: tags[7],
      why_it_works: "Reveals switching costs and threshold.",
      signal_to_listen_for: "Deal-breakers, must-have features.",
      priority: 3
    },
    {
      q: `What happens if you do nothing? What's the impact?`,
      assumption_tag: tags[8],
      why_it_works: "Tests urgency and consequence.",
      signal_to_listen_for: "Tangible costs, missed opportunities.",
      priority: 3
    },
    {
      q: `What typically triggers you to look for a solution?`,
      assumption_tag: tags[9],
      why_it_works: "Identifies acquisition timing.",
      signal_to_listen_for: "Specific events, thresholds, breaking points.",
      priority: 3
    }
  ];
  
  return {
    assumption_category: i.assumption_category,
    hypothesis: i.hypothesis,
    audience: who,
    questions
  };
}

// JSON parser with cleanup
function parseJSON(text: string): Output {
  // Strip markdown code fences
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json\s*/g, '').replace(/\s*```$/g, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```\s*/g, '').replace(/\s*```$/g, '');
  }
  
  const obj = JSON.parse(clean);
  
  // Validate
  if (!Array.isArray(obj.questions) || obj.questions.length !== 10) {
    throw new Error("Invalid JSON: questions must be 10 items");
  }
  
  return obj;
}

// Main generator with fallback
async function generateMomTest(inputs: Inputs): Promise<Output> {
  const prompt = buildPrompt(inputs);
  const providers = [
    { name: 'Gemini', call: () => callGemini(prompt) },
    { name: 'Lovable AI', call: () => callLovableAI(prompt) },
    { name: 'OpenAI', call: () => callOpenAI(prompt) },
    { name: 'Together', call: () => callTogether(prompt) },
    { name: 'Groq', call: () => callGroq(prompt) }
  ];
  
  const errors: string[] = [];
  
  for (const provider of providers) {
    try {
      console.log(`🔄 Trying ${provider.name}...`);
      const text = await provider.call();
      const result = parseJSON(text);
      console.log(`✅ ${provider.name} succeeded`);
      return result;
    } catch (e: any) {
      const msg = `${provider.name}: ${e?.message || String(e)}`;
      errors.push(msg);
      console.error(`❌ ${msg}`);
      continue;
    }
  }
  
  // All failed → offline backup
  console.warn('⚠️ All LLM providers failed, using offline backup');
  const backup = offlineBackup(inputs);
  backup._warning = "LLM providers unavailable; using offline backup.";
  backup._errors = errors;
  return backup;
}

// HTTP handler
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const result = await generateMomTest(body);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Error in generate-mom-test function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate Mom Test questions';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? error.toString() : String(error)
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
