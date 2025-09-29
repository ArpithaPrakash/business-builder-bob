import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { cpsData, circleType, leapOfFaithResults } = await req.json()
    
    // Hardcoded Gemini API key
    const apiKey = 'AIzaSyD-6tp8Dh2Vu9fgs5ZqUiT28gMbxb45st4'

    let prompt = ''
    let systemPrompt = ''

    if (circleType === 'assumption') {
      systemPrompt = `🧠 Agent & Task Design Prompt: Generate Leap of Faith Assumptions
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
[LOFA #3]: [assumption]`
      
      prompt = `Based on this CPS statement:
Customer: ${cpsData.customer}
Problem: ${cpsData.problem}
Solution: ${cpsData.solution}

Generate 2-3 Leap of Faith Assumptions using the exact format specified in the task definition above. Focus on assumptions that, if proven wrong, would significantly jeopardize the viability of the idea.`
    } else if (circleType === 'hypothesis') {
      if (!leapOfFaithResults || leapOfFaithResults.length === 0) {
        return new Response(
          JSON.stringify({ 
            error: 'Please click on "Leap of Faith Assumptions" first to generate assumptions before creating hypotheses.' 
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
      }
      
      systemPrompt = `🤖 Agent Prompt: Generate Hypotheses from Leap of Faith Assumptions
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
Hypothesis 3 (optional): We believe that [customer segment] will [behavior] because [reason].`
      
      prompt = `Based on these Leap of Faith Assumptions:
${leapOfFaithResults.join('\n')}

And this CPS context:
Customer: ${cpsData.customer}
Problem: ${cpsData.problem}
Solution: ${cpsData.solution}

Convert each Leap of Faith Assumption into testable hypotheses using the exact format specified above. Make each hypothesis falsifiable and testable through real-world interaction.`
    } else {
      systemPrompt = `You are a business validation expert helping founders identify key assumptions that need validation.`
      
      prompt = `Based on this CPS statement:
Customer: ${cpsData.customer}
Problem: ${cpsData.problem}
Solution: ${cpsData.solution}

Generate 3 key validation questions that need to be answered:`
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${prompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      }),
    })

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'QUOTA_EXCEEDED' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 429,
          }
        )
      }
      throw new Error('Failed to generate AI response')
    }

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    // Parse the response into array format
    const lines = content.split('\n').filter((line: string) => line.trim())
    const assumptions = lines.length > 0 ? lines : [content]

    return new Response(
      JSON.stringify({ assumptions }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in generate-leap-of-faith function:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})