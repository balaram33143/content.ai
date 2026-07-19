import type { GenerationFormValues, GenerationResult, Theme, Tone, Audience } from '@/types';

// Pexels stock photos keyed by theme — varied, professional, relevant to each topic
const THEME_IMAGES: Record<Theme, string[]> = {
  'Career Growth': [
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
    'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg',
  ],
  'Productivity': [
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
    'https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg',
    'https://images.pexels.com/photos/7376/startup-photos.jpg',
  ],
  'Leadership': [
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
    'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
    'https://images.pexels.com/photos/3760915/pexels-photo-3760915.jpeg',
  ],
  'AI': [
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg',
    'https://images.pexels.com/photos/1036641/pexels-photo-1036641.jpeg',
  ],
  'Entrepreneurship': [
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
    'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg',
    'https://images.pexels.com/photos/7376/startup-photos.jpg',
  ],
};

function pickImage(theme: Theme, videoId: string): string {
  const pool = THEME_IMAGES[theme] || THEME_IMAGES['Productivity'];
  // Deterministic pick based on videoId so re-runs of the same video are stable,
  // but different videos get different images.
  let hash = 0;
  const seed = videoId || String(Date.now());
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return pool[hash % pool.length];
}

interface Insight {
  title: string;
  body: string;
}

// Build a set of insights tailored to the theme + audience combination.
// These mirror the "5 Key Insights" + "3 Actionable Takeaways" that node 07
// (Insight Extraction) produces in the real n8n workflow.
function buildInsights(theme: Theme, audience: Audience, tone: Tone): Insight[] {
  const insightMap: Record<Theme, Insight[]> = {
    'Career Growth': [
      { title: 'Compounding beats pivoting', body: `Most ${audience.toLowerCase()} overestimate what one year of focused work can do and underestimate what five years of compounding in a single direction produces. The data from career trajectories is unambiguous: depth, not breadth, is the multiplier.` },
      { title: 'Your network is a lagging indicator', body: `The relationships that accelerate your career form slowly, through repeated value exchange — not through cold outreach. For ${audience.toLowerCase()} specifically, the highest-leverage connections come from shared projects, not shared interests.` },
      { title: 'Skill stacking > skill mastery', body: `Being in the top 1% at one skill is brutally hard. Being in the top 10% at three complementary skills is achievable and far more rare in the market — and it is where ${audience.toLowerCase()} create outsized leverage.` },
      { title: 'Visibility is a skill, not vanity', body: `The work matters, but being known for the work matters more. ${audience === 'Founders' ? 'Investors back founders they have watched for months, not founders who appear out of nowhere.' : audience === 'Developers' ? 'Senior engineers are not the best coders — they are the ones whose decisions are visible and trusted.' : 'Decision-makers promote people whose judgment they have already seen in action.'}` },
      { title: 'Burnout is a strategy problem', body: `Sustainable career growth is not about working less — it is about working on the right things. The ${tone.toLowerCase()} framing matters here: energy management, not time management, is the real constraint.` },
    ],
    'Productivity': [
      { title: 'Depth of focus beats hours worked', body: `Two hours of uninterrupted, high-intensity work produces more value than eight hours of context-switching. For ${audience.toLowerCase()}, the highest-impact move is engineering your environment so shallow work cannot reach you during peak hours.` },
      { title: 'Systems outrun motivation', body: `Motivation is a finite, volatile resource. Systems — checklists, time blocks, decision defaults — run regardless of how you feel. This is why productive ${audience.toLowerCase()} stop relying on willpower and start designing friction out of their daily flow.` },
      { title: 'The 80/20 is a discipline, not a discovery', body: `Everyone knows 20% of effort drives 80% of results. Almost no one actually cuts the bottom 80%. The ${tone.toLowerCase()} insight: most ${audience.toLowerCase()} keep low-value work alive because it feels safe, not because it produces anything.` },
      { title: 'Rest is a productivity input', body: `Treating sleep, breaks, and recovery as optional is a strategy that only works until it collapses. The data is clear: cognitive performance degrades faster than people perceive, which is why ${audience.toLowerCase()} who guard recovery time outperform those who do not.` },
      { title: 'Single-tasking is a competitive advantage', body: `In a world of constant notifications, the ability to hold one problem in mind for 90 uninterrupted minutes is genuinely rare. For ${audience.toLowerCase()}, this is not a productivity hack — it is a moat.` },
    ],
    'Leadership': [
      { title: 'Clarity is kindness', body: `Ambiguity feels polite but it is cruel. ${audience === 'Founders' ? 'Teams cannot execute on vibes; they need decisions.' : audience === 'Marketers' ? 'Campaigns fail when briefs are soft.' : 'People thrive on clear expectations, not on guessing what the leader wants.'} The strongest leaders replace "we should probably consider" with a direct, dated decision.` },
      { title: 'The bottleneck is usually you', body: `Leaders create the very bottlenecks they complain about by hoarding decisions. For ${audience.toLowerCase()}, the unlock is almost always delegation with real authority — not tasks handed down, but outcomes owned end-to-end by someone else.` },
      { title: 'Slow to hire, fast to fire', body: `The cost of one bad hire is not the salary — it is the multiplied drag on every person who works around them. ${audience === 'Founders' ? 'Founders learn this expensively.' : 'Experienced leaders learn to act on people decisions far earlier than feels comfortable.'}` },
      { title: 'Feedback is a gift only when it is specific', body: `"Good job" is not feedback. "The way you framed that tradeoff in the meeting won the room" is. ${audience.toLowerCase()} who receive specific feedback compound; those who receive generic praise plateau.` },
      { title: "Your mood sets the org's weather", body: `Leaders underestimate how much their emotional state radiates outward. A tense leader creates a tense team within hours. The ${tone.toLowerCase()} counter-move is deliberate calm — a practiced skill, not a personality trait.` },
    ],
    'AI': [
      { title: 'The moat is not the model', body: `With foundation models commoditizing fast, durable advantage comes from proprietary data, workflow integration, and distribution — not from the model itself. For ${audience.toLowerCase()}, this means AI value accrues at the application layer, not the infrastructure layer.` },
      { title: 'Augmentation beats replacement, today', body: `The workflows winning right now are not "AI does the whole job" but "AI does the part humans hate." ${audience === 'Developers' ? 'Copilots write boilerplate; engineers make architecture calls.' : audience === 'Marketers' ? 'AI drafts; humans edit for voice.' : 'AI accelerates; humans decide.'}` },
      { title: 'Evals are the new test suite', body: `Software teams learned to ship reliably with automated tests. AI product teams need the same discipline around evaluation harnesses — because vibes-based QA does not scale. ${audience.toLowerCase()} who build evals early move fast without breaking trust.` },
      { title: 'Context windows change the UX', body: `Long-context models collapse the "search-then-read" UX into "drop-the-whole-thing-in." For ${audience.toLowerCase()}, this is a redesign moment: interfaces built around chunking are about to look very dated.` },
      { title: 'The hard part is reliability, not intelligence', body: `Models are smart enough for most production use cases. The actual blocker is getting the same answer 99 times out of 100. ${audience === 'Founders' ? 'Founders who treat AI as a reliability problem, not a capability problem, ship faster.' : 'Teams that invest in guardrails out-ship teams chasing the newest model.'}` },
    ],
    'Entrepreneurship': [
      { title: 'Distribution before product', body: `Most founders build first and look for customers second. The ones who win build an audience or a sales channel first, then shape the product to fit. For ${audience === 'Founders' ? 'first-time founders' : audience.toLowerCase()}, this inverts the instinct and it is almost always right.` },
      { title: 'Cash runway is strategy', body: `Every decision is different when you have 18 months of runway versus 3. ${audience === 'Founders' ? 'Founders who manage runway as a strategic asset make calmer, longer-horizon bets.' : 'Operators who understand the cash position make better day-to-day calls.'}` },
      { title: 'Talk to users before writing code', body: `The cheapest validation is a conversation, not a prototype. ${audience.toLowerCase()} who do 20 customer interviews before building ship products that actually sell; those who skip this step ship products that sit.` },
      { title: 'Pricing is the most leveraged decision', body: `A 2x price increase with the same customers doubles revenue instantly and often improves perceived value. ${audience === 'Founders' ? 'Founders chronically undercharge.' : 'Most entrepreneurs leave the biggest lever untouched out of fear.'}` },
      { title: "Focus is the founder's job", body: `The market will offer a hundred adjacent opportunities. The founders who win say no to 99 of them. For ${audience.toLowerCase()}, the ${tone.toLowerCase()} version of this: the opportunity cost of a new idea is every idea you already committed to.` },
    ],
  };

  return insightMap[theme] || insightMap['Productivity'];
}

function buildTakeaways(theme: Theme, audience: Audience): string[] {
  return [
    `Audit your last 30 days: which 20% of work actually moved the needle on ${theme}? Cut the rest next sprint.`,
    `Find one decision you have been sitting on for over a week. ${audience === 'Founders' ? 'Ship it today with a reversible version' : 'Make the call'} — the cost of delay is larger than the cost of being wrong.`,
    `Book one conversation this week with someone two steps ahead of you on ${theme}. Insights compound when shared.`,
  ];
}

function buildContrarian(theme: Theme, tone: Tone): string[] {
  const map: Record<Theme, string[]> = {
    'Career Growth': ['Planning your career five years out is mostly theater; real progress comes from compounding in the present quarter.', 'Mentorship is overrated. Peership — working alongside equals — is where the real growth happens.'],
    'Productivity': ['Most productivity advice is procrastination wearing a tie. Doing fewer things, badly, often beats doing many things, optimally.', 'Reading about productivity is the opposite of being productive.'],
    'Leadership': ['The best leaders are not the most charismatic — they are the most consistent. Charisma attracts; consistency retains.', 'Consensus is expensive. A slightly-wrong fast decision beats a perfectly-correct slow one.'],
    'AI': ['The companies most likely to win with AI are not the ones with the best models — they are the ones with the most boring, well-organized data.', 'Prompt engineering is a temporary skill. Context engineering is the durable one.'],
    'Entrepreneurship': ['"Fail fast" is half-right. The full version: fail fast on cheap bets, but give the real bet years to breathe.', 'A profitable small business beats a money-losing startup every time. Scale is optional.'],
  };
  const arr = map[theme] || map['Productivity'];
  return arr;
}

function buildHooks(theme: Theme, tone: Tone, audience: Audience): string[] {
  return [
    `Everyone in ${theme.toLowerCase()} is optimizing for the wrong thing — here is what ${audience.toLowerCase()} should actually focus on.`,
    `I watched a YouTube video on ${theme} and it broke how I think about my next 12 months.`,
    `The ${tone.toLowerCase()} take on ${theme} that most ${audience.toLowerCase()} will not say out loud.`,
    `3 things in this ${theme} video changed how I would advise any ${audience.toLowerCase()} this quarter.`,
    `Stop reading ${theme} think-pieces. This one insight from a 30-minute video is worth more.`,
  ];
}

function pick<T>(arr: T[], n: number): T[] {
  return arr.slice(0, n);
}

function joinInsights(insights: Insight[]): string {
  return insights.map((i, idx) => `${idx + 1}. **${i.title}** — ${i.body}`).join('\n\n');
}

/**
 * Build a rich demo result that matches the real n8n workflow's output specs:
 *  - LinkedIn: 200-300 words, thought-leadership, story+insight, CTA, 5 hashtags
 *  - X (Twitter): <=280 characters, strong hook, hashtags
 *  - Facebook: 150-250 words, conversational, emojis, encourages comments
 *  - Blog: 500-800 words, Markdown H2/H3, SEO intro, actionable body, CTA
 *
 * Mirrors what nodes 11/12/13/13a (the Gemini formatters) produce.
 */
export function buildDemoResult(values: GenerationFormValues, videoId: string | null): GenerationResult {
  const { theme, tone, audience, humanOpinion, platforms } = values;
  const vid = videoId || 'demo';
  const sourceUrl = `https://youtu.be/${vid}`;

  const insights = buildInsights(theme, audience, tone);
  const takeaways = buildTakeaways(theme, audience);
  const contrarian = buildContrarian(theme, tone);
  const hooks = buildHooks(theme, tone, audience);

  const hook = hooks[0];
  const opinionLine = humanOpinion?.trim()
    ? `My own take, which I asked the system to weave in: ${humanOpinion.trim()}`
    : `And the contrarian angle worth sitting with: ${contrarian[0]}`;

  // --- LinkedIn: 200-300 words, story + insight, CTA, 5 hashtags ---
  const linkedinParts = [
    `${hook}`,
    ``,
    `I just ran a YouTube video on ${theme} through a content-generation workflow and pulled out the parts that actually matter for ${audience.toLowerCase()}.`,
    ``,
    `Here is what surfaced:`,
    ``,
    joinInsights(pick(insights, 3)),
    ``,
    opinionLine,
    ``,
    `Three things I would do with this in the next 30 days:`,
    ...takeaways.map((t, i) => `${i + 1}. ${t}`),
    ``,
    `If you are a ${audience.toLowerCase()} working on ${theme.toLowerCase()}, which of these hits hardest for you right now? Drop a comment — I genuinely want to compare notes.`,
    ``,
    `Source: ${sourceUrl}`,
    ``,
    `#${theme.replace(/\s+/g, '')} #${audience} #ContentStrategy #${tone} #CareerGrowth`,
  ];
  const linkedinPost = linkedinParts.join('\n');

  // --- X: <=280 characters ---
  const xPostBody = `${hook}\n\nFor ${audience}: ${theme}, ${tone.toLowerCase()} angle.\n${contrarian[0]}`;
  const xPost = `${xPostBody}\n\n${sourceUrl} #${theme.replace(/\s+/g, '')} #${audience}`.slice(0, 280);

  // --- Facebook: 150-250 words, conversational, emojis, encourages comments ---
  const facebookParts = [
    `${hook} 👇`,
    ``,
    `I turned a YouTube video on ${theme} into a full content suite and the output honestly surprised me.`,
    ``,
    `If you are a ${audience.toLowerCase()} — here is what jumped out:`,
    ...pick(insights, 3).map((i, idx) => `${idx + 1}. ${i.title} — ${i.body}`),
    ``,
    `${opinionLine}`,
    ``,
    `Curious — does this match how you think about ${theme.toLowerCase()}, or am I off here? 🤔`,
    ``,
    `Watch the source here: ${sourceUrl}`,
  ];
  const facebookPost = facebookParts.join('\n');

  // --- Blog: 500-800 words, Markdown H2/H3, SEO intro, actionable body, CTA ---
  const blogPost = [
    `# ${theme}: A ${tone} Breakdown for ${audience}`,
    ``,
    `*Source video: ${sourceUrl}*`,
    ``,
    `## Introduction`,
    ``,
    `${hook} In this breakdown, adapted from a YouTube deep dive on ${theme.toLowerCase()}, we pull out the five insights that matter most for ${audience.toLowerCase()} — and turn them into moves you can make this quarter.`,
    ``,
    `If you work in or around ${theme.toLowerCase()} and you are tired of surface-level takes, this is for you.`,
    ``,
    `## The Five Insights That Actually Move the Needle`,
    ``,
    joinInsights(insights),
    ``,
    `## The Contrarian View`,
    ``,
    `${contrarian[0]} ${contrarian[1]} This is not contrarian for its own sake — it is a reflection of where ${theme.toLowerCase()} is actually heading, and ${audience.toLowerCase()} who internalize it early will be positioned differently in 12 months.`,
    ``,
    `## Actionable Takeaways`,
    ``,
    ...takeaways.map((t, i) => `${i + 1}. ${t}`),
    ``,
    `## Why This Matters for ${audience}`,
    ``,
    `The ${tone.toLowerCase()} framing here is deliberate. Most ${theme.toLowerCase()} content is written in a neutral, encyclopedic register that is easy to skim and easy to forget. By filtering the same material through a ${tone.toLowerCase()} lens for ${audience.toLowerCase()}, the insights become immediately applicable rather than abstract.`,
    ``,
    opinionLine,
    ``,
    `## Conclusion`,
    ``,
    `Pick one insight from this list — just one — and apply it to your work on ${theme.toLowerCase()} in the next two weeks. Measure the result. Then come back and pick the next one. Compounding is the whole game.`,
    ``,
    `If this was useful, the full report (with the AI-generated image and all platform posts) is linked below. Share it with one other ${audience.toLowerCase()} who needs it.`,
    ``,
    `---`,
    `*Generated by ContentForge AI from ${sourceUrl}. Platforms: ${platforms.join(', ')}. Tone: ${tone}. Audience: ${audience}.*`,
  ].join('\n');

  const imageUrl = pickImage(theme, vid);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
  const folderId = `demo-${vid}-${stamp}`.slice(0, 28);
  const docId = `demo-doc-${vid}-${stamp.slice(-8)}`.slice(0, 28);

  return {
    linkedinPost,
    xPost,
    facebookPost,
    blogPost,
    imageUrl,
    reportUrl: `https://docs.google.com/document/d/${docId}/edit`,
    folderUrl: `https://drive.google.com/drive/folders/${folderId}`,
    metadataFileUrl: `https://drive.google.com/file/d/demo-meta-${vid}/view`,
  };
}
