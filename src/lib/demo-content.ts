import type { GenerationFormValues, GenerationResult, Theme, Tone, Audience } from '../types'

// ─── Theme-specific stock images ───────────────────────────────────────────
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
    'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg',
    'https://images.pexels.com/photos/7376/startup-photos.jpg',
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
  ],
  'Marketing': [
    'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg',
    'https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg',
    'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
  ],
  'Personal Finance': [
    'https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg',
    'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg',
    'https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg',
  ],
  'Health & Wellness': [
    'https://images.pexels.com/photos/3753025/pexels-photo-3753025.jpeg',
    'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg',
    'https://images.pexels.com/photos/4046718/pexels-photo-4046718.jpeg',
  ],
  'Technology & Innovation': [
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    'https://images.pexels.com/photos/1036641/pexels-photo-1036641.jpeg',
  ],
  'Sales': [
    'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
  ],
  'Personal Branding': [
    'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg',
    'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
    'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
  ],
  'Remote Work': [
    'https://images.pexels.com/photos/4012194/pexels-photo-4012194.jpeg',
    'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg',
    'https://images.pexels.com/photos/4226219/pexels-photo-4226219.jpeg',
  ],
  'Startups & Innovation': [
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
    'https://images.pexels.com/photos/7376/startup-photos.jpg',
    'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg',
  ],
}

function pickImage(theme: Theme, seed: string): string {
  const pool = THEME_IMAGES[theme] || THEME_IMAGES['Productivity']
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return pool[hash % pool.length]
}

// ─── Improved AI image generation prompts ────────────────────────────────────
// Matches the v4 workflow node 15 "Image_Prompt_Generator" which generates
// a professional social media image prompt based on the platform content.
// Each theme gets a detailed, visually rich prompt with composition,
// color palette, style, and mood guidance.

function buildImagePrompt(theme: Theme, tone: Tone, audience: Audience): string {
  const basePrompts: Record<Theme, string> = {
    'Career Growth': `A modern, aspirational social media graphic showing a professional ascending a glowing staircase made of stacked achievement badges. Clean geometric composition with a deep navy-to-teal gradient background. Bold sans-serif headline text area at the top. Minimalist flat-design illustration style with subtle 3D depth. Professional corporate aesthetic suitable for LinkedIn. High contrast, crisp edges, 1:1 square format.`,
    'Productivity': `A sleek social media infographic-style image showing a focused workspace with a clean desk, a glowing productivity timer, and organized task blocks floating in a grid layout. Warm amber and soft blue color palette. Modern flat illustration with isometric perspective. Subtle motion lines suggesting flow and efficiency. Professional, clean, high-engagement visual. 1:1 square format.`,
    'Leadership': `A commanding social media graphic showing a stylized leader figure standing at the front of a group, with a glowing path radiating outward. Deep blue and gold color scheme conveying authority and trust. Minimalist editorial illustration style with strong silhouette contrast. Bold headline space at top. Professional, inspiring, suitable for LinkedIn and Facebook. 1:1 square format.`,
    'AI': `A futuristic social media graphic showing a glowing neural network pattern overlaid on a stylized human silhouette, with data streams flowing into a central glowing core. Electric blue, purple-cyan gradient, and white highlight color palette. Modern tech aesthetic with circuit-board motifs and particle effects. Clean, high-tech, professional. Bold text area at top. 1:1 square format.`,
    'Entrepreneurship': `A dynamic social media graphic showing a rocket launching from an open laptop, with growth-chart arrows and lightbulb icons orbiting around it. Vibrant orange, deep blue, and white color palette. Modern flat-design illustration with motion blur effects suggesting speed and ambition. Professional startup aesthetic. Bold headline space. 1:1 square format.`,
    'Marketing': `A creative social media graphic showing a megaphone transforming into interconnected social media icons, with colorful engagement metrics (hearts, comments, shares) radiating outward. Vibrant gradient from coral pink to electric blue. Modern flat illustration style with playful energy. Clean composition with text area at top. Professional yet engaging. 1:1 square format.`,
    'Personal Finance': `A clean, trustworthy social media graphic showing a stylized growth chart with a golden coin stack and a shield icon, symbolizing wealth building and protection. Forest green and gold color palette on a soft cream background. Modern flat-design with subtle isometric depth. Professional financial aesthetic. Bold headline space at top. 1:1 square format.`,
    'Health & Wellness': `A calming social media graphic showing a serene figure in a meditation pose surrounded by glowing green leaves and soft energy waves. Sage green, soft lavender, and warm white color palette. Minimalist botanical illustration style with organic shapes. Clean, airy composition with text area at top. Professional wellness aesthetic. 1:1 square format.`,
    'Technology & Innovation': `A cutting-edge social media graphic showing abstract geometric shapes assembling into a futuristic structure, with glowing connection nodes and holographic data layers. Deep indigo, cyan, and white color palette. Modern 3D-render style with glassmorphism effects. Tech-forward, innovative, professional. Bold text area at top. 1:1 square format.`,
    'Sales': `A high-energy social media graphic showing a handshake transforming into an upward-pointing arrow, with subtle revenue-chart lines and target icons in the background. Bold red, navy blue, and white color palette. Modern flat illustration with dynamic diagonal composition suggesting momentum. Professional sales aesthetic. Headline space at top. 1:1 square format.`,
    'Personal Branding': `A striking social media graphic showing a stylized silhouette of a person with a glowing personal logo/halo behind them, surrounded by floating content icons (posts, videos, articles). Warm gold, deep charcoal, and white color palette. Modern editorial illustration style. Professional, memorable, identity-focused. Bold headline space. 1:1 square format.`,
    'Remote Work': `A modern social media graphic showing a cozy home office setup with a laptop, coffee cup, and plant, connected by glowing dotted lines to global location pins. Soft teal, warm orange, and cream color palette. Flat illustration style with isometric perspective. Clean, relatable, professional. Text area at top. 1:1 square format.`,
    'Startups & Innovation': `An energetic social media graphic showing a lightbulb transforming into a rocket, with brainstorming sticky notes and innovation gears in the background. Electric purple, lime green, and white color palette. Modern flat-design with dynamic composition. Startup-energy aesthetic, bold and forward-looking. Headline space at top. 1:1 square format.`,
  }

  const toneMood: Record<Tone, string> = {
    'Educational': 'The mood should feel informative, clear, and structured — like a well-designed textbook cover.',
    'Inspirational': 'The mood should feel uplifting and aspirational — warm lighting, hopeful energy.',
    'Opinionated': 'The mood should feel bold and confident — high contrast, strong angles, assertive composition.',
    'Storytelling': 'The mood should feel narrative and evocative — warm tones, layered depth, cinematic quality.',
    'Motivational': 'The mood should feel energetic and driving — vibrant colors, dynamic motion lines, forward momentum.',
    'Humorous / Witty': 'The mood should feel playful and clever — bright colors, whimsical elements, a touch of fun without being unprofessional.',
    'Professional / Formal': 'The mood should feel polished and authoritative — restrained color palette, clean lines, corporate-grade design.',
    'Conversational / Casual': 'The mood should feel approachable and friendly — soft colors, rounded shapes, warm and inviting.',
    'Bold / Provocative': 'The mood should feel daring and attention-grabbing — high contrast, dramatic lighting, unconventional composition.',
    'Analytical / Data-Driven': 'The mood should feel precise and data-rich — clean grids, chart elements, structured layout, cool color palette.',
  }

  const audienceContext = `The visual should resonate with ${audience.toLowerCase()} — use imagery and metaphors from their world.`

  return `${basePrompts[theme]}

Style: Modern professional social media graphic, high engagement, suitable for LinkedIn, X, and Facebook.
Tone: ${toneMood[tone]}
Audience: ${audienceContext}
Include key message visually through iconography and composition, not through cluttered text.
Color palette should be cohesive and brand-safe. Avoid cluttered layouts — use generous whitespace.
Render quality: high-resolution, sharp, print-ready crispness. Aspect ratio: 1:1 square.`
}

// ─── Content insights per theme ─────────────────────────────────────────────

interface Insight { title: string; body: string }

function buildInsights(theme: Theme, audience: Audience): Insight[] {
  const map: Record<Theme, Insight[]> = {
    'Career Growth': [
      { title: 'Compounding beats pivoting', body: `Most ${audience.toLowerCase()} overestimate what one year of focused work can do and underestimate what five years of compounding in a single direction produces. Career trajectories are unambiguous: depth, not breadth, is the multiplier.` },
      { title: 'Your network is a lagging indicator', body: `The relationships that accelerate your career form slowly through repeated value exchange, not cold outreach. For ${audience.toLowerCase()}, the highest-leverage connections come from shared projects, not shared interests.` },
      { title: 'Skill stacking beats skill mastery', body: `Being in the top 1% at one skill is brutally hard. Being in the top 10% at three complementary skills is achievable and far more rare in the market — and it is where ${audience.toLowerCase()} create outsized leverage.` },
      { title: 'Visibility is a skill, not vanity', body: `The work matters, but being known for the work matters more. Decision-makers promote people whose judgment they have already seen in action.` },
      { title: 'Burnout is a strategy problem', body: `Sustainable career growth is not about working less — it is about working on the right things. Energy management, not time management, is the real constraint.` },
    ],
    'Productivity': [
      { title: 'Depth beats hours', body: `Two hours of uninterrupted, high-intensity work produces more value than eight hours of context-switching. For ${audience.toLowerCase()}, the highest-impact move is engineering your environment so shallow work cannot reach you during peak hours.` },
      { title: 'Systems outrun motivation', body: `Motivation is finite and volatile. Systems — checklists, time blocks, decision defaults — run regardless of how you feel. This is why productive ${audience.toLowerCase()} stop relying on willpower and start designing friction out of their daily flow.` },
      { title: 'The 80/20 is a discipline', body: `Everyone knows 20% of effort drives 80% of results. Almost no one actually cuts the bottom 80%. Most ${audience.toLowerCase()} keep low-value work alive because it feels safe, not because it produces anything.` },
      { title: 'Rest is a productivity input', body: `Treating sleep, breaks, and recovery as optional is a strategy that only works until it collapses. Cognitive performance degrades faster than people perceive.` },
      { title: 'Single-tasking is a competitive advantage', body: `In a world of constant notifications, the ability to hold one problem in mind for 90 uninterrupted minutes is genuinely rare. For ${audience.toLowerCase()}, this is not a productivity hack — it is a moat.` },
    ],
    'Leadership': [
      { title: 'Clarity is kindness', body: `Ambiguity feels polite but it is cruel. Teams cannot execute on vibes; they need decisions. The strongest leaders replace "we should probably consider" with a direct, dated decision.` },
      { title: 'The bottleneck is usually you', body: `Leaders create the very bottlenecks they complain about by hoarding decisions. For ${audience.toLowerCase()}, the unlock is almost always delegation with real authority — not tasks handed down, but outcomes owned end-to-end by someone else.` },
      { title: 'Slow to hire, fast to fire', body: `The cost of one bad hire is not the salary — it is the multiplied drag on every person who works around them. Experienced leaders learn to act on people decisions far earlier than feels comfortable.` },
      { title: 'Feedback is a gift only when specific', body: `"Good job" is not feedback. "The way you framed that tradeoff in the meeting won the room" is. ${audience.toLowerCase()} who receive specific feedback compound; those who receive generic praise plateau.` },
      { title: "Your mood sets the org's weather", body: `Leaders underestimate how much their emotional state radiates outward. A tense leader creates a tense team within hours. Deliberate calm is a practiced skill, not a personality trait.` },
    ],
    'AI': [
      { title: 'The moat is not the model', body: `With foundation models commoditizing fast, durable advantage comes from proprietary data, workflow integration, and distribution — not from the model itself. For ${audience.toLowerCase()}, AI value accrues at the application layer, not the infrastructure layer.` },
      { title: 'Augmentation beats replacement, today', body: `The workflows winning right now are not "AI does the whole job" but "AI does the part humans hate." AI accelerates; humans decide.` },
      { title: 'Evals are the new test suite', body: `Software teams learned to ship reliably with automated tests. AI product teams need the same discipline around evaluation harnesses — because vibes-based QA does not scale. ${audience.toLowerCase()} who build evals early move fast without breaking trust.` },
      { title: 'Context windows change the UX', body: `Long-context models collapse the "search-then-read" UX into "drop-the-whole-thing-in." For ${audience.toLowerCase()}, this is a redesign moment: interfaces built around chunking are about to look very dated.` },
      { title: 'Reliability is the hard part', body: `Models are smart enough for most production use cases. The actual blocker is getting the same answer 99 times out of 100. Teams that invest in guardrails out-ship teams chasing the newest model.` },
    ],
    'Entrepreneurship': [
      { title: 'Distribution before product', body: `Most founders build first and look for customers second. The ones who win build an audience or a sales channel first, then shape the product to fit. This inverts the instinct and it is almost always right.` },
      { title: 'Cash runway is strategy', body: `Every decision is different when you have 18 months of runway versus 3. ${audience.toLowerCase()} who manage runway as a strategic asset make calmer, longer-horizon bets.` },
      { title: 'Talk to users before writing code', body: `The cheapest validation is a conversation, not a prototype. ${audience.toLowerCase()} who do 20 customer interviews before building ship products that actually sell; those who skip this step ship products that sit.` },
      { title: 'Pricing is the most leveraged decision', body: `A 2x price increase with the same customers doubles revenue instantly and often improves perceived value. Most entrepreneurs leave the biggest lever untouched out of fear.` },
      { title: "Focus is the founder's job", body: `The market will offer a hundred adjacent opportunities. The founders who win say no to 99 of them. The opportunity cost of a new idea is every idea you already committed to.` },
    ],
    'Marketing': [
      { title: 'Attention is the currency', body: `For ${audience.toLowerCase()}, the battle is not for budget — it is for attention. Every marketing decision should be filtered through one question: does this earn or lose attention?` },
      { title: 'Storytelling outperforms features', body: `Feature lists are forgettable. Stories are sticky. ${audience.toLowerCase()} who lead with narrative and weave features into the story out-convert those who lead with specs.` },
      { title: 'Distribution channels compound', body: `A great campaign on an owned channel (email, SMS, social) costs less over time as the audience grows. Rented channels (ads) only get more expensive. Build owned media early.` },
      { title: 'Data without intuition is dangerous', body: `Dashboards tell you what happened, not why. ${audience.toLowerCase()} who pair quantitative data with qualitative customer conversations make better calls than those who rely on either alone.` },
      { title: 'Brand is a long-term moat', body: `Performance marketing is rented attention. Brand is owned attention. The best marketing portfolios balance both — brand for the long game, performance for the short game.` },
    ],
    'Personal Finance': [
      { title: 'Automation beats discipline', body: `The ${audience.toLowerCase()} who build wealth are not the most disciplined — they are the most automated. Auto-invest, auto-save, auto-pay. Remove yourself from the temptation loop.` },
      { title: 'Spending less is tax-free income', body: `Every dollar you do not spend is a dollar earned without taxes, without effort, without risk. Frugality is the highest-ROI financial move available to ${audience.toLowerCase()}.` },
      { title: 'Time in the market beats timing the market', body: `Missing the 10 best days in the market over 20 years cuts your returns in half. ${audience.toLowerCase()} who stay invested through volatility outperform those who try to time entries and exits.` },
      { title: 'Emergency fund is the foundation', body: `Before investing, before debt payoff acceleration, before anything else — build a 3-6 month emergency fund. It is the financial shock absorber that keeps ${audience.toLowerCase()} from making desperate decisions.` },
      { title: 'Index funds beat stock picking', body: `Over 20 years, 90% of professional fund managers underperform the S&P 500. For ${audience.toLowerCase()}, the boring strategy — buy and hold low-cost index funds — is the winning strategy.` },
    ],
    'Health & Wellness': [
      { title: 'Sleep is the foundation', body: `For ${audience.toLowerCase()}, no supplement, workout, or diet can compensate for chronic sleep deprivation. Sleep is not a luxury — it is the input that makes every other health decision work.` },
      { title: 'Consistency beats intensity', body: `A 20-minute walk every day beats a 2-hour gym session once a month. ${audience.toLowerCase()} who build sustainable, repeatable habits outperform those who chase peak intensity.` },
      { title: 'Stress management is a health intervention', body: `Chronic stress is not just unpleasant — it is physiologically damaging. ${audience.toLowerCase()} who treat stress management (meditation, breathwork, therapy) as a health investment, not a luxury, see compounding returns.` },
      { title: 'Protein is the lever', body: `Most ${audience.toLowerCase()} underconsume protein. Increasing protein intake — especially at breakfast — improves satiety, preserves muscle, and stabilizes energy more than any other single dietary change.` },
      { title: 'Movement is medicine', body: `Exercise is not just for fitness — it is the single most effective intervention for mood, cognition, and longevity. For ${audience.toLowerCase()}, daily movement is non-negotiable.` },
    ],
    'Technology & Innovation': [
      { title: 'Adoption curves predict disruption', body: `For ${audience.toLowerCase()}, the signal of disruption is not the technology itself — it is the adoption curve. When the new technology crosses the chasm into early majority, the incumbents are already too late.` },
      { title: 'Open source accelerates everything', body: `The pace of innovation in any domain is now gated by open-source adoption. ${audience.toLowerCase()} who contribute to and build on open source move faster than those who build everything in-house.` },
      { title: 'APIs are the new supply chain', body: `Composing capabilities via APIs is how modern products are built. ${audience.toLowerCase()} who treat APIs as strategic supply chain decisions — not just technical choices — build more resilient products.` },
      { title: 'Developer experience is a moat', body: `The product with the best developer experience wins the developer audience. ${audience.toLowerCase()} who invest in documentation, SDKs, and frictionless onboarding out-compete those who do not.` },
      { title: 'Innovation happens at the edges', body: `The most interesting innovations happen at the intersection of domains, not in the center of one. ${audience.toLowerCase()} who explore adjacent fields find opportunities that specialists miss.` },
    ],
    'Sales': [
      { title: 'Discovery beats pitching', body: `The best ${audience.toLowerCase()} spend 70% of the conversation asking questions, not presenting features. Discovery creates urgency; pitching creates resistance.` },
      { title: 'Follow-up is where deals are won', body: `80% of sales require 5+ follow-ups, but 44% of ${audience.toLowerCase()} give up after one. The fortune is in the follow-up — persistence is the differentiator.` },
      { title: 'Objections are buying signals', body: `An objection means the prospect is engaged enough to push back. ${audience.toLowerCase()} who treat objections as opportunities to clarify value close more deals than those who dread them.` },
      { title: 'Referrals are the highest-ROI channel', body: `For ${audience.toLowerCase()}, a warm referral converts at 3-5x the rate of a cold lead. Building a referral engine is more valuable than any outbound campaign.` },
      { title: 'Trust compounds faster than tactics', body: `Tactics win individual deals; trust wins repeat business and referrals. ${audience.toLowerCase()} who invest in long-term relationships out-earn those who optimize for single transactions.` },
    ],
    'Personal Branding': [
      { title: 'Niche down to stand out', body: `For ${audience.toLowerCase()}, the path to being recognized is not breadth — it is depth. The most memorable personal brands are built around a specific, defensible niche.` },
      { title: 'Consistency builds recognition', body: `Posting once a week for a year beats posting daily for a month and vanishing. ${audience.toLowerCase()} who show up consistently compound recognition while those who sprint burn out.` },
      { title: 'Your story is your differentiator', body: `Skills are commoditized; stories are not. ${audience.toLowerCase()} who share their journey — including failures — build audiences that skills alone cannot attract.` },
      { title: 'Content is the top of the funnel', body: `Every piece of content is a 24/7 ambassador for your brand. ${audience.toLowerCase()} who treat content as an investment, not an expense, build inbound pipelines that compound.` },
      { title: 'Authenticity is the algorithm', body: `In a world of AI-generated content, authentic human voice is the scarcest resource. ${audience.toLowerCase()} who lean into their real perspective outperform those who imitate.` },
    ],
    'Remote Work': [
      { title: 'Async communication is the skill', body: `For ${audience.toLowerCase()}, the ability to write clearly and concisely is now a core productivity skill. Teams that master async communication reduce meetings and increase output.` },
      { title: 'Outcomes, not hours', body: `Remote work forces the question: what did you produce, not how long were you online? ${audience.toLowerCase()} who focus on measurable outcomes outperform those who perform visibility.` },
      { title: 'Documentation is the office', body: `In a remote setting, the documentation IS the office. ${audience.toLowerCase()} who invest in written processes, decision logs, and shared knowledge bases build teams that scale without them.` },
      { title: 'Boundaries prevent burnout', body: `The flexibility of remote work can become a 24/7 trap. ${audience.toLowerCase()} who set clear work hours, create shutdown rituals, and protect personal time sustain performance longer.` },
      { title: 'Connection requires intention', body: `Remote does not mean isolated — but connection will not happen by accident. ${audience.toLowerCase()} who schedule regular check-ins, virtual coffees, and team rituals build trust that sustains.` },
    ],
    'Startups & Innovation': [
      { title: 'Speed is the startup moat', body: `For ${audience.toLowerCase()}, the only durable advantage over incumbents is speed. The startup that ships 10x faster than the enterprise wins the market before the enterprise notices.` },
      { title: 'Product-market fit is binary', body: `You either have it or you do not. ${audience.toLowerCase()} who are honest about whether customers would be devastated if the product disappeared can make the call to pivot or persevere.` },
      { title: 'Fundraising is not a milestone', body: `Raising money is not success — it is a tool. ${audience.toLowerCase()} who treat fundraising as fuel for a validated engine outperform those who treat it as the goal.` },
      { title: 'Customer obsession beats competitor obsession', body: `Startups that study customers find opportunities; startups that study competitors find copies. ${audience.toLowerCase()} who spend more time with users than with competitor analysis build better products.` },
      { title: 'Culture is set in the first 10 hires', body: `The first 10 hires define the culture for the next 100. ${audience.toLowerCase()} who are ruthlessly selective about cultural fit in the early team build organizations that retain talent.` },
    ],
  }
  return map[theme] || map['Productivity']
}

function buildTakeaways(theme: Theme): string[] {
  return [
    `Audit your last 30 days: which 20% of work actually moved the needle on ${theme}? Cut the rest next sprint.`,
    `Find one decision you have been sitting on for over a week. Make the call — the cost of delay is larger than the cost of being wrong.`,
    `Book one conversation this week with someone two steps ahead of you on ${theme}. Insights compound when shared.`,
  ]
}

function buildContrarian(theme: Theme): string[] {
  const map: Record<Theme, string[]> = {
    'Career Growth': ['Planning your career five years out is mostly theater; real progress comes from compounding in the present quarter.', 'Mentorship is overrated. Peership — working alongside equals — is where the real growth happens.'],
    'Productivity': ['Most productivity advice is procrastination wearing a tie. Doing fewer things, badly, often beats doing many things, optimally.', 'Reading about productivity is the opposite of being productive.'],
    'Leadership': ['The best leaders are not the most charismatic — they are the most consistent. Charisma attracts; consistency retains.', 'Consensus is expensive. A slightly-wrong fast decision beats a perfectly-correct slow one.'],
    'AI': ['The companies most likely to win with AI are not the ones with the best models — they are the ones with the most boring, well-organized data.', 'Prompt engineering is a temporary skill. Context engineering is the durable one.'],
    'Entrepreneurship': ['"Fail fast" is half-right. The full version: fail fast on cheap bets, but give the real bet years to breathe.', 'A profitable small business beats a money-losing startup every time. Scale is optional.'],
    'Marketing': ['The best marketing strategy is often to pick one channel and go deep rather than spreading thin across five.', 'Brand awareness is a vanity metric. Brand preference is a business metric.'],
    'Personal Finance': ['Budgeting apps do not fix spending problems. Automating savings and investing does.', 'The best financial advice is boring, repeated, and free. You do not need a guru.'],
    'Health & Wellness': ['The fitness industry profits from complexity. The best health protocol is the simplest one you will actually do consistently.', 'Tracking every metric often creates more anxiety than insight.'],
    'Technology & Innovation': ['The most innovative companies are not the ones with the most patents — they are the ones with the fastest feedback loops.', 'Blockchain will change less than promised. AI will change more than anyone predicted.'],
    'Sales': ['The best salespeople are not the smoothest talkers — they are the best listeners.', 'Discounting your way to growth is a race to the bottom. Value-based pricing wins.'],
    'Personal Branding': ['You do not need a personal brand. You need a body of work. The brand is the byproduct.', 'Trying to go viral is a distraction. Building trust with 1,000 true fans beats chasing 1 million views.'],
    'Remote Work': ['Remote work does not require more communication — it requires better communication.', 'The office was never about productivity. It was about control. Remote work exposes that.'],
    'Startups & Innovation': ['Most startups do not fail from running out of money. They fail from running out of relevance.', 'Innovation theater — hackathons, idea boards, innovation labs — rarely produces real innovation. Shipping does.'],
  }
  return map[theme] || map['Productivity']
}

function buildHooks(theme: Theme, tone: Tone, audience: Audience): string[] {
  return [
    `Everyone in ${theme.toLowerCase()} is optimizing for the wrong thing — here is what ${audience.toLowerCase()} should actually focus on.`,
    `I watched a YouTube video on ${theme} and it broke how I think about my next 12 months.`,
    `The ${tone.toLowerCase()} take on ${theme} that most ${audience.toLowerCase()} will not say out loud.`,
    `3 things in this ${theme} video changed how I would advise any ${audience.toLowerCase()} this quarter.`,
    `Stop reading ${theme} think-pieces. This one insight from a 30-minute video is worth more.`,
  ]
}

function joinInsights(insights: Insight[], count: number): string {
  return insights.slice(0, count).map((i, idx) => `${idx + 1}. **${i.title}** — ${i.body}`).join('\n\n')
}

function toneFlourish(tone: Tone): string {
  const map: Record<Tone, string> = {
    'Educational': 'Let me break this down clearly.',
    'Inspirational': 'This is your moment to act.',
    'Opinionated': 'Here is the truth nobody wants to hear.',
    'Storytelling': 'Let me tell you what happened next.',
    'Motivational': 'You are closer than you think — keep pushing.',
    'Humorous / Witty': 'Do not take my word for it — but definitely take the advice.',
    'Professional / Formal': 'The following analysis is based on observed patterns.',
    'Conversational / Casual': 'So here is the thing —',
    'Bold / Provocative': 'I will say what others will not.',
    'Analytical / Data-Driven': 'The data tells a clear story.',
  }
  return map[tone] || ''
}

export function buildDemoResult(values: GenerationFormValues, videoId: string | null): GenerationResult {
  const { theme, tone, audience, humanOpinion, platforms } = values
  const vid = videoId || 'demo'
  const sourceUrl = `https://youtu.be/${vid}`

  const insights = buildInsights(theme, audience)
  const takeaways = buildTakeaways(theme)
  const contrarian = buildContrarian(theme)
  const hooks = buildHooks(theme, tone, audience)
  const flourish = toneFlourish(tone)
  const imagePrompt = buildImagePrompt(theme, tone, audience)

  const hook = hooks[0]
  const opinionLine = humanOpinion?.trim()
    ? `My own take, which I asked the system to weave in: ${humanOpinion.trim()}`
    : `And the contrarian angle worth sitting with: ${contrarian[0]}`

  // LinkedIn: 200-300 words
  const linkedinPost = [
    `${hook}`,
    ``,
    `${flourish} I just ran a YouTube video on ${theme} through a content-generation workflow and pulled out the parts that actually matter for ${audience.toLowerCase()}.`,
    ``,
    `Here is what surfaced:`,
    ``,
    joinInsights(insights, 3),
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
    `#${theme.replace(/\s+/g, '')} #${audience.replace(/[\s/]/g, '')} #ContentStrategy #${tone.split(/[\s/]/)[0]} #CareerGrowth`,
  ].join('\n')

  // X: <=280 characters
  const xPost = `${hook}\n\nFor ${audience}: ${theme}, ${tone.toLowerCase()} angle.\n${contrarian[0]}\n\n${sourceUrl} #${theme.replace(/\s+/g, '')}`.slice(0, 280)

  // Facebook: 150-250 words, conversational, emojis
  const facebookPost = [
    `${hook} 👇`,
    ``,
    `I turned a YouTube video on ${theme} into a full content suite and the output honestly surprised me.`,
    ``,
    `If you are a ${audience.toLowerCase()} — here is what jumped out:`,
    ...insights.slice(0, 3).map((i, idx) => `${idx + 1}. ${i.title} — ${i.body}`),
    ``,
    `${opinionLine}`,
    ``,
    `Curious — does this match how you think about ${theme.toLowerCase()}, or am I off here? 🤔`,
    ``,
    `Watch the source here: ${sourceUrl}`,
  ].join('\n')

  // Blog: 500-800 words, Markdown
  const blogPost = [
    `# ${theme}: A ${tone} Breakdown for ${audience}`,
    ``,
    `*Source video: ${sourceUrl}*`,
    ``,
    `## Introduction`,
    ``,
    `${hook} ${flourish} In this breakdown, adapted from a YouTube deep dive on ${theme.toLowerCase()}, we pull out the five insights that matter most for ${audience.toLowerCase()} — and turn them into moves you can make this quarter.`,
    ``,
    `If you work in or around ${theme.toLowerCase()} and you are tired of surface-level takes, this is for you.`,
    ``,
    `## The Five Insights That Actually Move the Needle`,
    ``,
    joinInsights(insights, 5),
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
  ].join('\n')

  const imageUrl = pickImage(theme, vid)
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)
  const folderId = `demo-${vid}-${stamp}`.slice(0, 28)
  const docId = `demo-doc-${vid}-${stamp.slice(-8)}`.slice(0, 28)

  return {
    linkedinPost,
    xPost,
    facebookPost,
    blogPost,
    imageUrl,
    imagePrompt,
    reportUrl: `https://docs.google.com/document/d/${docId}/edit`,
    folderUrl: `https://drive.google.com/drive/folders/${folderId}`,
    metadataFileUrl: `https://drive.google.com/file/d/demo-meta-${vid}/view`,
  }
}
