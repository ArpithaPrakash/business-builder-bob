import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

// ---- Types ------------------------------------------------------------------

export type UserInputs = {
  idea: string;           // "what's your business idea?"
  passion?: string;       // "passion for the project?"
  qualified?: string;     // "what makes you uniquely qualified?"
  audience?: string;      // "who are you building this for?"
  stylePreset?: keyof typeof STYLE_PRESETS;
  aspect?: keyof typeof ASPECT_SIZES;
  allowText?: boolean;
  n?: number;
  seed?: number;          // optional: reproducible base seed
  userId?: string;        // for deterministic seed derivation
};

export type ProviderOpts = {
  prompt: string;
  negative: string;
  width: number;
  height: number;
  cfg: number;
  steps: number;
  sampler?: string;
  seeds: number[];      // generate one image per seed
  allowText: boolean;
};

export type ProviderImage = { dataUrl: string; seed: number; score?: number };
export type ProviderResult = { images: ProviderImage[] };

export type GenResponse = {
  images: ProviderImage[]; // best-first if reranked
  used: {
    prompt: string;
    negative: string;
    width: number;
    height: number;
    cfg: number;
    steps: number;
    sampler?: string;
    allowText: boolean;
    seeds: number[];
  };
};

// ---- Prompt Assembly --------------------------------------------------------

const STYLE_PRESETS = {
  "E-commerce Studio": { cfg: 7, steps: 28, sampler: "Euler a" },
  "Photoreal":         { cfg: 6.5, steps: 30, sampler: "Euler a" },
  "3D Render":         { cfg: 8, steps: 26, sampler: "DPM++ 2M" },
  "Flat Illustration": { cfg: 5.5, steps: 22, sampler: "Euler" },
  "Architectural":     { cfg: 7.5, steps: 32, sampler: "DPM++ 2M Karras" },
  "Cyberpunk":         { cfg: 7, steps: 30, sampler: "Euler a" },
  "Line Art":          { cfg: 5, steps: 20, sampler: "Euler" },
} as const;

const ASPECT_SIZES = {
  "1:1":  { width: 1024, height: 1024 },
  "4:5":  { width: 1024, height: 1280 },
  "3:2":  { width: 1344, height: 896 },
  "16:9": { width: 1536, height: 864 },
} as const;

const NEGATIVE_BASE =
  "blurry, low-res, extra fingers, mangled hands, deformed limbs, distorted face, " +
  "watermark, logo, wrong proportions, oversaturated, noisy, text artifacts, jpeg artifacts, unrealistic anatomy";

function buildPrompt(a: ReturnType<typeof sanitizeInputs>, preset: (typeof STYLE_PRESETS)[keyof typeof STYLE_PRESETS]) {
  const brand = a.brand ?? "YourBrand";
  const subject = a.idea || "the business concept";
  const aud = a.audience || "the intended customer";
  const credibility = a.qualified ? `Founder credibility: ${a.qualified}.` : "";
  const motivation = a.passion ? `Motivation: ${a.passion}.` : "";
  const composition = "center framing, clean background";
  const lighting = "soft studio lighting";
  const palette = "soft neutrals with one accent color";
  const allowText = a.allowText === true;

  const noTextLine = allowText ? "" : "\nDo not render any text, letters, logos, or watermarks.";

  const prompt =
`You are generating brand-safe, high-quality images for ${brand}.
Render a concept visual for: ${subject}
Audience: ${aud}
${credibility}
${motivation}
Style: ${getPresetName(a.stylePreset)}; ${composition}; ${lighting}; Palette: ${palette}.
Photorealistic where applicable, sharp focus, consistent perspective, clean background.${noTextLine}`;

  const negative = allowText
    ? NEGATIVE_BASE.replace(/(?:, )?logo/, "") // if text allowed, relax logo ban
    : `${NEGATIVE_BASE}, text, letters, wordmark`;

  return { prompt, negative, allowText };
}

function getPresetName(name?: string) {
  return name && STYLE_PRESETS[name as keyof typeof STYLE_PRESETS] ? name : "E-commerce Studio";
}

// ---- Helpers ----------------------------------------------------------------

function sanitizeInputs(a: UserInputs) {
  const strip = (s?: string) =>
    (s ?? "")
      .replace(/https?:\/\/\S+/g, "")   // drop URLs
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, "") // drop emojis
      .trim();

  return {
    idea: nonEmptyOrDefault(strip(a.idea), "a new product or service"),
    passion: strip(a.passion),
    qualified: strip(a.qualified),
    audience: strip(a.audience),
    stylePreset: a.stylePreset,
    aspect: a.aspect,
    allowText: a.allowText ?? false,
    brand: "YourBrand", // optional tenant/brand injection
    seed: a.seed, // Include seed in sanitized inputs
  };
}

function nonEmptyOrDefault(s: string, def: string) {
  return s.length ? s : def;
}

function mapAspectToSize(k: keyof typeof ASPECT_SIZES) {
  return ASPECT_SIZES[k] ?? ASPECT_SIZES["1:1"];
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// Deterministic seeds: if base seed provided, fan out; else hash(userId + time)
function buildSeeds(baseSeed: number | undefined, userId: string, n: number): number[] {
  const base = typeof baseSeed === "number" ? baseSeed : hashToSeed(`${userId}:${Date.now()}`);
  const rng = mulberry32(base);
  const seeds: number[] = [];
  for (let i = 0; i < n; i++) seeds.push(Math.floor(rng() * 2_147_483_647));
  return seeds;
}

function hashToSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- Provider Adapter -------------------------------------------------------

async function callProvider(opts: ProviderOpts): Promise<ProviderResult> {
  // Using Pollinations.AI as the provider (similar to existing imageGenerationService)
  const images: ProviderImage[] = [];
  
  for (const seed of opts.seeds) {
    try {
      const pollinationsUrl = new URL('https://image.pollinations.ai/prompt/' + encodeURIComponent(opts.prompt));
      pollinationsUrl.searchParams.set('width', opts.width.toString());
      pollinationsUrl.searchParams.set('height', opts.height.toString());
      pollinationsUrl.searchParams.set('seed', seed.toString());
      pollinationsUrl.searchParams.set('nologo', 'true');
      
      const response = await fetch(pollinationsUrl.toString());
      
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        const dataUrl = `data:image/jpeg;base64,${base64}`;
        
        images.push({ dataUrl, seed });
      } else {
        console.error(`Failed to generate image with seed ${seed}:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error generating image with seed ${seed}:`, error);
    }
  }
  
  return { images };
}

// ---- Public entrypoint ------------------------------------------------------

/**
 * Build final prompt from 4 answers, apply locked defaults, generate N variants,
 * call your existing image API, and return images (best first) + used settings.
 */
export async function generateImageBackend(
  input: UserInputs,
  callProvider: (opts: ProviderOpts) => Promise<ProviderResult>,
  rerank?: (prompt: string, images: ProviderImage[]) => Promise<ProviderImage[]>
): Promise<GenResponse> {
  // 1) Normalize & guard
  const a = sanitizeInputs(input);

  // 2) Map UI -> server-locked params
  const preset = STYLE_PRESETS[a.stylePreset ?? "E-commerce Studio"];
  const { width, height } = mapAspectToSize(a.aspect ?? "1:1");

  // 3) Build final prompt (prefix) + negatives (suffix)
  const { prompt, negative, allowText } = buildPrompt(a, preset);

  // 4) Prepare variant seeds
  const n = clamp(input.n ?? 3, 1, 6);
  const seeds = buildSeeds(a.seed, input.userId ?? "anon", n);

  // 5) Call your existing provider
  const results = await callProvider({
    prompt,
    negative,
    width,
    height,
    cfg: preset.cfg,
    steps: preset.steps,
    sampler: preset.sampler,
    seeds,          // one seed per image
    allowText
  });

  // 6) (Optional) rerank best-first; else keep provider order
  let images = results.images;
  if (rerank) {
    images = await rerank(prompt, images);
  }

  // 7) Return images + the exact settings used (for reproducibility UI)
  return {
    images, // {dataUrl, seed}
    used: {
      prompt,
      negative,
      width,
      height,
      cfg: preset.cfg,
      steps: preset.steps,
      sampler: preset.sampler,
      allowText,
      seeds
    }
  };
}

// Optional reranker stub (returns provider order if none available)
const noRerank = async (_p: string, imgs: ProviderImage[]) => imgs;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json() as UserInputs;
    const resp = await generateImageBackend(body, callProvider, noRerank);
    
    return new Response(
      JSON.stringify(resp),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in generate-business-image function:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
