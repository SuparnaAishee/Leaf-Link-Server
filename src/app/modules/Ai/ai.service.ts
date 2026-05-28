/* eslint-disable no-console */
import axios from 'axios';

type IdentifyInput = {
  imageUrl?: string;
  imageBase64?: string;
  hint?: string;
};

type DiagnoseInput = {
  imageUrl?: string;
  imageBase64?: string;
  symptoms?: string;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

async function callAnthropic(messages: ChatMessage[], system: string, maxTokens = 1024) {
  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    },
    {
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      timeout: 30_000,
    },
  );
  const text = response.data?.content?.[0]?.text ?? '';
  return text as string;
}

const HERBS = ['Basil', 'Mint', 'Rosemary', 'Thyme', 'Cilantro'];
const VEGGIES = ['Tomato', 'Pepper', 'Cucumber', 'Lettuce', 'Carrot'];
const FLOWERS = ['Rose', 'Marigold', 'Sunflower', 'Tulip', 'Lavender'];

const PLANT_DB: Record<string, { scientific: string; care: string[]; sun: string; water: string; soil: string }> = {
  Basil: {
    scientific: 'Ocimum basilicum',
    sun: 'Full sun (6+ hrs)',
    water: 'Keep soil moist, water when top inch is dry',
    soil: 'Well-draining, rich in organic matter',
    care: ['Pinch flowers to keep leaves tender', 'Harvest from the top to encourage bushy growth', 'Avoid wetting leaves in cool weather'],
  },
  Tomato: {
    scientific: 'Solanum lycopersicum',
    sun: 'Full sun (8+ hrs)',
    water: 'Deep, consistent watering — 1–2 in./week',
    soil: 'Loamy, slightly acidic (pH 6.2–6.8)',
    care: ['Stake or cage early', 'Mulch to retain moisture', 'Remove suckers on indeterminate varieties'],
  },
  Rose: {
    scientific: 'Rosa spp.',
    sun: 'Full sun (6+ hrs)',
    water: 'Deep watering 1–2x/week at the base',
    soil: 'Rich, well-draining loam',
    care: ['Prune in early spring', 'Watch for black spot and aphids', 'Mulch crown in winter'],
  },
  Mint: {
    scientific: 'Mentha spp.',
    sun: 'Partial shade to full sun',
    water: 'Consistently moist soil',
    soil: 'Any reasonable garden soil — contain it!',
    care: ['Grow in a pot to control spread', 'Cut back hard after flowering', 'Divide every 2–3 years'],
  },
};

const DISEASES = [
  {
    name: 'Powdery Mildew',
    cause: 'Fungal (Erysiphales) — common in warm days / cool nights with poor air flow',
    treatment: ['Improve air circulation by spacing or pruning', 'Spray with diluted milk (1:9 water) or potassium bicarbonate', 'Remove and dispose of heavily infected leaves'],
    severity: 'Moderate',
  },
  {
    name: 'Early Blight',
    cause: 'Alternaria solani fungus — splash-up from soil',
    treatment: ['Mulch around the base to stop soil splash', 'Remove lower infected leaves', 'Apply copper-based fungicide preventively'],
    severity: 'Serious',
  },
  {
    name: 'Aphid Infestation',
    cause: 'Sap-sucking insects clustered on new growth',
    treatment: ['Spray with strong jet of water', 'Apply insecticidal soap weekly', 'Introduce ladybugs as natural predators'],
    severity: 'Mild',
  },
  {
    name: 'Root Rot',
    cause: 'Overwatering / poor drainage — Phytophthora',
    treatment: ['Stop watering and let soil dry', 'Repot in fresh, well-draining mix', 'Trim brown/mushy roots before repotting'],
    severity: 'Serious',
  },
];

function pickFromHint(hint: string | undefined): string {
  if (!hint) return [...HERBS, ...VEGGIES, ...FLOWERS][Math.floor(Math.random() * 14)];
  const h = hint.toLowerCase();
  const all = [...HERBS, ...VEGGIES, ...FLOWERS];
  const match = all.find((p) => h.includes(p.toLowerCase()));
  if (match) return match;
  if (/(herb|leaf|leaves|aromatic)/.test(h)) return HERBS[Math.floor(Math.random() * HERBS.length)];
  if (/(veg|fruit|food|edible)/.test(h)) return VEGGIES[Math.floor(Math.random() * VEGGIES.length)];
  if (/(flower|bloom|petal|rose|tulip)/.test(h)) return FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
  return all[Math.floor(Math.random() * all.length)];
}

function mockIdentify(input: IdentifyInput) {
  const name = pickFromHint(input.hint);
  const data = PLANT_DB[name] || PLANT_DB.Basil;
  const confidence = 78 + Math.floor(Math.random() * 18);
  return {
    name,
    scientificName: data.scientific,
    confidence,
    care: {
      sun: data.sun,
      water: data.water,
      soil: data.soil,
    },
    tips: data.care,
    source: 'mock' as const,
  };
}

function mockDiagnose(input: DiagnoseInput) {
  const s = (input.symptoms || '').toLowerCase();
  let disease = DISEASES[0];
  if (/(white|powder|dust)/.test(s)) disease = DISEASES[0];
  else if (/(brown|spot|ring|target)/.test(s)) disease = DISEASES[1];
  else if (/(curl|sticky|cluster|tiny)/.test(s)) disease = DISEASES[2];
  else if (/(wilt|droop|yellow|mushy|smell)/.test(s)) disease = DISEASES[3];
  else disease = DISEASES[Math.floor(Math.random() * DISEASES.length)];

  return {
    diagnosis: disease.name,
    cause: disease.cause,
    severity: disease.severity,
    treatment: disease.treatment,
    confidence: 72 + Math.floor(Math.random() * 22),
    source: 'mock' as const,
  };
}

function mockChat(messages: ChatMessage[]): string {
  const last = messages[messages.length - 1]?.content?.toLowerCase() || '';
  if (/water|drink|moisture/.test(last))
    return 'Most garden plants prefer deep, infrequent watering over shallow daily sprinkles — water when the top inch of soil is dry, and mulch to keep moisture even.';
  if (/sun|light|shade/.test(last))
    return 'Full-sun plants (tomato, basil, rose) want 6+ hours of direct light. Greens and shade lovers (lettuce, ferns) prefer dappled or morning sun only.';
  if (/soil|compost|fertili[sz]e/.test(last))
    return 'Healthy soil is the cheat code: mix in 2–3 inches of compost each season, keep pH between 6.0 and 7.0 for most vegetables, and top-dress with mulch to feed soil life.';
  if (/pest|bug|aphid|spider|mite/.test(last))
    return 'Start gentle: a strong water spray knocks off most aphids. If they come back, insecticidal soap once a week. Encourage ladybugs and lacewings — they do the work for free.';
  if (/(plant|seed|grow|start|begin)/.test(last))
    return 'Start small and indoors 6–8 weeks before your last frost. Use a sterile seed-starting mix, bottom-water, and once true leaves appear, harden seedlings off over a week before transplanting.';
  return 'I am your garden assistant. Ask me about watering, light, soil, pests, or any plant you are growing — I will keep answers practical and actionable.';
}

const SYSTEM_IDENTIFY =
  'You are a botanist assistant. Given an image of a plant, return ONLY compact JSON with keys: name (common), scientificName, confidence (0-100 number), care.sun, care.water, care.soil, tips (array of 3 short strings). No prose outside JSON.';

const SYSTEM_DIAGNOSE =
  'You are a plant pathologist. Given an image and/or symptoms of a sick plant, return ONLY compact JSON with keys: diagnosis (string), cause (string), severity (Mild|Moderate|Serious), treatment (array of 3 short steps), confidence (0-100). No prose outside JSON.';

const SYSTEM_CHAT =
  'You are a friendly, practical gardening assistant. Keep answers under 4 sentences. Prefer specific, actionable guidance. If unsure, say so.';

function tryParseJson(text: string): any | null {
  if (!text) return null;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

function buildImageContent(input: { imageUrl?: string; imageBase64?: string }, prompt: string) {
  const content: any[] = [];
  if (input.imageBase64) {
    const base64 = input.imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const mediaType = /jpeg|jpg/i.test(input.imageBase64) ? 'image/jpeg' : 'image/png';
    content.push({ type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } });
  } else if (input.imageUrl) {
    content.push({ type: 'image', source: { type: 'url', url: input.imageUrl } });
  }
  content.push({ type: 'text', text: prompt });
  return content;
}

const identifyPlant = async (input: IdentifyInput) => {
  if (!ANTHROPIC_KEY) return mockIdentify(input);
  try {
    const prompt = `Identify this plant. Optional hint from user: "${input.hint || 'none'}". Respond as JSON only.`;
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: ANTHROPIC_MODEL,
        max_tokens: 800,
        system: SYSTEM_IDENTIFY,
        messages: [{ role: 'user', content: buildImageContent(input, prompt) }],
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        timeout: 30_000,
      },
    );
    const text = response.data?.content?.[0]?.text ?? '';
    const parsed = tryParseJson(text);
    if (!parsed) return mockIdentify(input);
    return { ...parsed, source: 'anthropic' as const };
  } catch (err) {
    console.error('Anthropic identify failed, falling back to mock:', (err as Error).message);
    return mockIdentify(input);
  }
};

const diagnoseDisease = async (input: DiagnoseInput) => {
  if (!ANTHROPIC_KEY) return mockDiagnose(input);
  try {
    const prompt = `Diagnose this plant. Reported symptoms: "${input.symptoms || 'none'}". Respond as JSON only.`;
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: ANTHROPIC_MODEL,
        max_tokens: 800,
        system: SYSTEM_DIAGNOSE,
        messages: [{ role: 'user', content: buildImageContent(input, prompt) }],
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        timeout: 30_000,
      },
    );
    const text = response.data?.content?.[0]?.text ?? '';
    const parsed = tryParseJson(text);
    if (!parsed) return mockDiagnose(input);
    return { ...parsed, source: 'anthropic' as const };
  } catch (err) {
    console.error('Anthropic diagnose failed, falling back to mock:', (err as Error).message);
    return mockDiagnose(input);
  }
};

const chat = async (messages: ChatMessage[]) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { reply: 'Ask me anything about your garden!', source: 'mock' as const };
  }
  if (!ANTHROPIC_KEY) {
    return { reply: mockChat(messages), source: 'mock' as const };
  }
  try {
    const text = await callAnthropic(messages, SYSTEM_CHAT, 600);
    return { reply: text || mockChat(messages), source: text ? ('anthropic' as const) : ('mock' as const) };
  } catch (err) {
    console.error('Anthropic chat failed, falling back to mock:', (err as Error).message);
    return { reply: mockChat(messages), source: 'mock' as const };
  }
};

export const aiService = { identifyPlant, diagnoseDisease, chat };
