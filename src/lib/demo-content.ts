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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// IMPROVED AI IMAGE GENERATION PROMPTS
// Each prompt is a complete art-direction brief with:
//   1. Subject & Scene  — what the image depicts
//   2. Composition     — framing, rule-of-thirds, depth, focal point
//   3. Lighting         — light source, mood, quality
//   4. Color Palette    — exact hues, gradients, grading
//   5. Style            — illustration/photography hybrid, rendering hints
//   6. Tone Adaptation  — how the selected tone shifts the visual mood
//   7. Audience Hook    — visual metaphors that resonate with the audience
//   8. Technical Specs  — aspect ratio, resolution, negative prompts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface ImagePromptParts {
  subject: string
  composition: string
  lighting: string
  colorPalette: string
  style: string
  negativePrompt: string
}

const THEME_PROMPT_PARTS: Record<Theme, ImagePromptParts> = {
  'Career Growth': {
    subject: `A professional figure ascending a glowing staircase made of stacked achievement badges and milestone icons. Each step represents a career level — from junior to senior to executive. The figure is mid-climb, reaching for the next step, with a confident forward-leaning posture. Behind them, a faint trail of past achievements fades into the background.`,
    composition: `Rule-of-thirds composition with the figure positioned at the left-third intersection point. The staircase rises diagonally from bottom-left to upper-right, creating a natural leading line that pulls the viewer's eye upward. Generous negative space in the upper-right for headline text overlay. Shallow depth of field — the figure is tack-sharp while the lower steps softly blur.`,
    lighting: `Cinematic rim lighting from the upper-right, wrapping the figure in a warm golden glow that separates them from the background. Soft fill light from camera-left to preserve detail in the face and hands. The staircase steps emit a subtle internal luminescence, as if each achievement is lit from within. Overall mood: aspirational, warm, forward-looking.`,
    colorPalette: `Deep navy (#0a1628) background transitioning to a rich teal (#0d4f5c) in the mid-tones. The figure is lit with warm amber (#f5a623) and soft gold (#d4af37) highlights. Badge accents in electric blue (#3b82f6). Color grading: warm shadows, neutral midtones, slightly cool highlights for a premium corporate feel.`,
    style: `Semi-realistic 3D illustration with subtle flat-design influences. Smooth, polished surfaces with soft ambient occlusion. The figure is stylized but anatomically proportional — not cartoonish, but not photorealistic. Think Apple keynote aesthetic meets LinkedIn editorial illustration. Clean, premium, trustworthy. Render at 4K with anti-aliased edges.`,
    negativePrompt: `No text, no watermarks, no logos, no clutter, no photorealistic faces, no cartoonish proportions, no busy backgrounds, no low-resolution artifacts, no extra limbs, no distorted perspective`,
  },
  'Productivity': {
    subject: `An ultra-clean, modern desk workspace seen from a top-down isometric perspective. On the desk: a sleek laptop displaying a focused task dashboard, a glowing productivity timer showing 25:00, a neatly stacked set of color-coded task blocks arranged in a grid, a minimalist desk lamp, and a single coffee cup with steam rising. The task blocks form a satisfying visual rhythm — some completed (filled), some pending (outlined).`,
    composition: `Isometric top-down angle at approximately 30-degree tilt. The desk is centered with all elements arranged in a deliberate, grid-like pattern that satisfies the eye. Leading lines created by the laptop edge and task block grid draw the viewer to the timer as the focal point. Generous margin around the desk for text overlay. Perfect symmetry with intentional asymmetry in the task blocks for visual interest.`,
    lighting: `Soft, diffused overhead lighting creating gentle, even illumination across the entire scene. The laptop screen and timer emit their own subtle glow, creating pools of cool blue light on the desk surface. The desk lamp adds a warm amber accent light from the upper-left corner. No harsh shadows — everything feels calm, controlled, and focused. Mood: serene efficiency.`,
    colorPalette: `Warm white desk surface (#f8f6f2) with soft amber undertones. Task blocks in a harmonious set: sage green (#84cc16) for completed, soft blue (#3b82f6) for in-progress, warm gray (#94a3b8) for pending. Laptop screen glow in cool cyan (#06b6d4). Coffee cup in matte black. Overall palette: warm, inviting, organized. Color grading: bright, clean, high-key.`,
    style: `Isometric flat-design illustration with subtle 3D depth via soft shadows and gradients. Clean vector-style shapes with rounded corners. Minimal texture — smooth surfaces only. Think Notion aesthetic meets premium productivity app marketing. Crisp, geometric, satisfying. Render at 4K with perfect pixel alignment.`,
    negativePrompt: `No text, no watermarks, no messy elements, no photorealistic textures, no harsh shadows, no clutter, no random objects, no distorted geometry, no busy patterns, no low-res artifacts`,
  },
  'Leadership': {
    subject: `A commanding silhouette of a leader standing at the prow of a stylized ship, facing forward into a vast, open horizon. Behind them, a crew of smaller figures works in coordinated motion. The leader's posture is upright, shoulders back, one hand pointing toward the horizon. The ship is a modern, abstracted vessel — not literal, but suggestive of direction and purpose.`,
    composition: `Centered, symmetrical composition with the leader as the vertical focal point at the exact center. The horizon line sits at the lower-third, giving the sky and the forward vision dominant space. The crew forms a subtle V-formation behind the leader, echoing the shape of birds in flight. Massive negative space in the upper two-thirds for headline text. The horizon line creates a powerful sense of depth and scale.`,
    lighting: `Golden-hour backlighting from the horizon, creating a dramatic silhouette of the leader and crew. The light wraps around the leader's outline, creating a luminous edge that separates them from the dark foreground. The sky is luminous and gradient-filled. The foreground ship and crew are in deep shadow, creating high contrast. Mood: heroic, decisive, visionary.`,
    colorPalette: `Deep charcoal foreground (#1a1a2e) transitioning to a rich golden sky (#f59e0b to #f97316) at the horizon. The leader's rim light is pure gold (#fbbf24). The sky has subtle purple-magenta undertones (#7c3aed) in the upper atmosphere. Color grading: dramatic warm highlights, cool deep shadows, cinematic contrast.`,
    style: `Minimalist editorial illustration with strong silhouette contrast. Think New Yorker cover meets TED Talk stage design. Bold, graphic shapes with minimal detail — the power is in the silhouette and the light. The ship is abstracted to its essential geometric form. Clean, iconic, memorable. Render at 4K with smooth gradients.`,
    negativePrompt: `No text, no watermarks, no photorealistic faces, no busy details, no cluttered backgrounds, no literal ship rigging, no cartoonish style, no low-contrast, no flat lighting`,
  },
  'AI': {
    subject: `A glowing, semi-transparent neural network rendered as a 3D sculptural form, floating in dark space. Inside the network, a stylized human silhouette is visible — the neural pathways pass through and around the figure, suggesting a synthesis of human intelligence and artificial intelligence. Data particles flow along the network edges like luminous pulses of light.`,
    composition: `Centered composition with the neural network-human hybrid as the focal point, occupying the center 60% of the frame. The network extends beyond the frame edges, suggesting infinite scale. Data particles create dynamic motion blur trails along the network edges. Negative space in the upper portion for text overlay. The figure inside is slightly off-center to the left, creating visual tension and interest.`,
    lighting: `Self-illuminating neural network — each node and edge emits its own glow, creating a complex interplay of light sources. The dominant light is cool electric blue from the network, with secondary warm amber pulses traveling along the data streams. The human silhouette is backlit by the network's internal glow, creating an ethereal, translucent effect. No external light source — the network IS the light. Mood: futuristic, intelligent, awe-inspiring.`,
    colorPalette: `Deep space black (#050510) background. Neural network in electric blue (#3b82f6) and cyan (#06b6d4). Data pulses in warm amber (#f59e0b) and white-hot (#fef3c7). The human silhouette glows with a soft purple-violet (#8b5cf6) inner light. Color grading: deep blacks, vibrant neon highlights, high dynamic range, HDR feel.`,
    style: `High-end 3D render with volumetric lighting and particle effects. Glassmorphism influences — the neural network has translucent, refractive qualities. Particle simulation for data streams with motion blur. Think NVIDIA keynote visual meets sci-fi film concept art. Premium, cutting-edge, technologically sophisticated. Render at 4K with ray-traced reflections and bloom effects.`,
    negativePrompt: `No text, no watermarks, no cartoonish robots, no cliché circuit boards, no flat colors, no low-poly models, no photorealistic faces, no cluttered composition, no low-contrast, no pixelation`,
  },
  'Entrepreneurship': {
    subject: `A sleek rocket ship emerging from an open laptop, mid-launch with exhaust plumes streaming downward. Around the rocket, orbiting icons represent entrepreneurial milestones: a lightbulb (idea), a growth chart (traction), a handshake (partnership), and a coin (revenue). The laptop sits on a simple surface, its screen glowing with a launch sequence interface.`,
    composition: `Vertical composition with the rocket ascending through the center, creating a powerful upward thrust. The laptop anchors the bottom-third of the frame, grounding the scene. Orbiting icons are arranged in a loose spiral around the rocket, creating rotational energy that contrasts with the vertical thrust. Generous sky/space area in the upper portion for text overlay. Dynamic, energetic, non-symmetrical.`,
    lighting: `Dramatic launch lighting — the rocket exhaust creates a warm, intense orange glow from below, illuminating the laptop and surrounding icons. The upper portion of the scene is lit by a cool, ambient blue, suggesting high altitude and aspiration. Strong contrast between the warm launch zone and the cool sky. Mood: energetic, ambitious, unstoppable.`,
    colorPalette: `Launch zone: intense orange (#f97316) and warm yellow (#fbbf24) from the exhaust. Background sky: deep blue (#1e3a8a) transitioning to dark indigo (#312e81) at the top. Rocket body: clean white (#f8fafc) with blue accents (#3b82f6). Orbiting icons: each in a different harmonious color — green (#22c55e), blue (#3b82f6), amber (#f59e0b), purple (#8b5cf6). Color grading: warm bottom, cool top, high saturation, vibrant.`,
    style: `Modern flat-design illustration with 3D depth via shading and layering. Motion blur on the exhaust and orbiting icons to convey speed and momentum. Clean, geometric shapes. Think startup pitch deck hero image meets premium app launch marketing. Bold, energetic, optimistic. Render at 4K with smooth gradients and crisp edges.`,
    negativePrompt: `No text, no watermarks, no photorealistic rocket, no cluttered elements, no flat lighting, no dull colors, no extra objects, no distorted shapes, no low-res, no busy background`,
  },
  'Marketing': {
    subject: `A stylized megaphone at the center of the composition, transforming into a burst of interconnected social media icons (heart, comment bubble, share arrow, star). The icons radiate outward from the megaphone in dynamic, expanding waves, creating a visual ripple effect. Engagement metrics (small numbers and chart fragments) float in the outer rings, suggesting measurable impact.`,
    composition: `Radial composition centered on the megaphone, with icon waves expanding outward in concentric rings. The megaphone is positioned slightly left-of-center, with the blast of icons expanding toward the right, creating directional flow. The outer rings fade into the background, creating depth. Upper-right quadrant has negative space for text overlay. Dynamic, expansive, engaging.`,
    lighting: `The megaphone is the light source — it emits a warm, energetic glow that illuminates the expanding icon waves. The innermost icons are brightest, with light fading radially outward. The background is darker, creating contrast that makes the icon burst pop. Warm-to-cool gradient from the center outward. Mood: energetic, viral, exciting.`,
    colorPalette: `Megaphone: warm coral (#f87171) and soft pink (#fb7185). Inner icon ring: vibrant coral (#fb7185) and electric blue (#3b82f6). Middle ring: teal (#14b8a6) and amber (#f59e0b). Outer ring: soft purple (#a78bfa) and cool blue (#60a5fa). Background: deep charcoal (#1e293b) with a subtle radial gradient. Color grading: vibrant, high-saturation center, fading to muted edges.`,
    style: `Modern flat-design illustration with subtle 3D layering and glow effects. The icon waves have a slight motion blur suggesting expansion and movement. Clean, geometric icons with rounded corners. Think premium social media marketing campaign visual. Playful but professional. Energetic but not chaotic. Render at 4K with smooth gradients and bloom on the glow elements.`,
    negativePrompt: `No text, no watermarks, no photorealistic megaphone, no cluttered icons, no dull colors, no flat composition, no random elements, no distorted shapes, no low-res, no busy background patterns`,
  },
  'Personal Finance': {
    subject: `A stylized, golden coin stack growing upward from a solid foundation, with a protective shield icon wrapping around its base. A growth chart line rises alongside the coins, curving upward with an arrow at its peak. Subtle financial symbols — a percentage sign, a small house, a piggy bank — float in the background at low opacity, adding context without clutter.`,
    composition: `Vertical, centered composition with the coin stack as the primary focal point, rising through the center of the frame. The growth chart line runs parallel on the right side, creating a dual-ascending visual rhythm. The shield at the base provides a grounded, stable foundation. Upper portion has clean negative space for text overlay. Symmetrical, stable, reassuring.`,
    lighting: `Warm, trustworthy lighting from the upper-left, casting a golden glow across the coin stack and creating soft, realistic shadows to the lower-right. The coins have a metallic sheen with specular highlights, suggesting real gold. The shield has a subtle inner glow, suggesting protection and security. Background is softly lit, not dark but not bright. Mood: trustworthy, stable, prosperous.`,
    colorPalette: `Coins: rich gold (#d4af37) with lighter highlights (#fbbf24) and darker shadows (#92400e). Shield: deep forest green (#166534) with gold trim. Growth chart: emerald green (#10b981). Background: soft cream (#fef3c7) with a subtle warm gradient. Color grading: warm, golden, premium, trustworthy. High-key but with rich gold tones.`,
    style: `Semi-realistic 3D illustration with metallic rendering on the coins — proper specular highlights, reflections, and ambient occlusion. The shield and chart are cleaner, more graphic. Think premium banking app marketing meets fintech startup hero image. Solid, trustworthy, premium. Render at 4K with ray-traced reflections on the coin surfaces.`,
    negativePrompt: `No text, no watermarks, no photorealistic money, no cluttered elements, no dark/moody lighting, no dull colors, no busy background, no distorted coins, no low-res, no flat shading on metal`,
  },
  'Health & Wellness': {
    subject: `A serene figure in a meditation pose, sitting cross-legged, surrounded by a glowing aura of soft green light. Around the figure, organic leaf shapes and soft energy waves radiate outward in gentle, concentric ripples. The figure's eyes are closed, posture relaxed, hands resting on knees in a mudra position. A subtle lotus flower pattern is faintly visible in the aura behind the figure's head.`,
    composition: `Perfectly centered, symmetrical composition with the meditating figure as the focal point. The aura and energy ripples create concentric circles that fill the frame, with the outermost ripples fading into the background. The lotus pattern behind the head creates a subtle mandala effect. Upper portion has clean space for text overlay. Balanced, harmonious, calm.`,
    lighting: `Soft, diffused, ethereal lighting with no harsh shadows. The figure is lit by a gentle, omnidirectional glow — as if the aura itself is the light source. The energy ripples catch light along their edges, creating a luminous, layered effect. Background is softly lit with a gentle gradient. Mood: calm, restorative, peaceful, healing.`,
    colorPalette: `Figure: soft, warm skin tones with a gentle green tint from the aura. Aura: sage green (#84cc16) and soft mint (#6ee7b7). Energy ripples: lighter green (#a7f3d0) fading to white. Background: very soft lavender (#e9d5ff) at the edges, transitioning to warm white (#fefce8) near the center. Color grading: soft, pastel, airy, gentle contrast, high-key.`,
    style: `Minimalist botanical illustration style with subtle 3D depth. The figure is rendered in a clean, stylized manner — smooth, organic, flowing lines. The leaves and energy waves are semi-transparent, creating a layered, ethereal quality. Think premium wellness app marketing meets meditation app hero image. Clean, calming, restorative. Render at 4K with soft, diffused shadows.`,
    negativePrompt: `No text, no watermarks, no photorealistic face, no harsh shadows, no dark colors, no cluttered elements, no busy patterns, no distorted anatomy, no low-res, no high-contrast lighting`,
  },
  'Technology & Innovation': {
    subject: `Abstract geometric shapes — cubes, spheres, and interconnected planes — assembling themselves in mid-air, forming a futuristic, crystalline structure. Glowing connection nodes link the shapes, with holographic data layers visible as semi-transparent overlays. The structure is mid-assembly, with some shapes still floating toward their final position, suggesting a process of creation and innovation.`,
    composition: `Dynamic, asymmetric composition with the assembling structure positioned at the left-third intersection. Floating shapes trail from the upper-right toward the structure, creating a natural visual flow. The holographic data layers add depth without overwhelming. Upper-right quadrant has negative space for text overlay. Dynamic, forward-looking, innovative.`,
    lighting: `Holographic, volumetric lighting — each geometric shape emits its own subtle glow, while holographic data layers create light planes in the air. The dominant light is cool blue from the holographic elements, with warm amber accents on the connection nodes. Strong rim lighting on the geometric shapes, separating them from the dark background. Mood: futuristic, precise, innovative.`,
    colorPalette: `Background: deep indigo (#1e1b4b) transitioning to near-black (#050510). Geometric shapes: deep blue (#3b82f6) with cyan (#06b6d4) edges. Connection nodes: warm amber (#f59e0b). Holographic layers: semi-transparent white-blue (#dbeafe at 30% opacity). Color grading: deep, rich shadows, vibrant cool highlights, subtle warm accents, HDR feel.`,
    style: `High-end 3D render with glassmorphism and holographic effects. The geometric shapes have translucent, refractive surfaces with subsurface scattering. The holographic layers use additive blending for a true holographic feel. Think sci-fi film UI design meets premium tech product launch. Cutting-edge, precise, sophisticated. Render at 4K with ray-traced refractions and bloom.`,
    negativePrompt: `No text, no watermarks, no photorealistic elements, no flat colors, no low-poly models, no cluttered composition, no dull lighting, no distorted geometry, no low-res, no pixelation`,
  },
  'Sales': {
    subject: `A dynamic handshake at the center of the composition, with the two hands transforming into an upward-pointing arrow at the point of contact. Behind the handshake, subtle revenue chart lines rise diagonally, and small target/bullseye icons float in the background. The handshake is the moment of agreement — the catalyst for growth.`,
    composition: `Centered composition with the handshake at the exact center, creating a powerful focal point. The arrow rises vertically from the handshake, creating upward momentum. Revenue chart lines run diagonally from lower-left to upper-right, reinforcing the growth theme. Target icons are scattered in the background at low opacity. Upper portion has clean space for text overlay. Dynamic, confident, results-oriented.`,
    lighting: `Dramatic, directional lighting from the upper-left, creating strong highlights on the handshake and arrow. Deep shadows to the lower-right add drama and dimension. The revenue chart lines have a subtle glow, suggesting positive momentum. The target icons in the background are softly lit, not competing with the main subject. Mood: confident, energetic, high-stakes.`,
    colorPalette: `Handshake and arrow: bold red (#dc2626) with lighter highlights (#f87171). Revenue chart lines: navy blue (#1e3a8a). Target icons: soft gray (#94a3b8) at low opacity. Background: clean white (#f8fafc) with a subtle warm gradient. Color grading: high-contrast, bold, energetic, clean. Professional but not sterile.`,
    style: `Modern flat-design illustration with 3D depth via shading and layering. The handshake has slightly more dimensionality than the background elements, creating depth. The arrow has a subtle motion blur suggesting upward momentum. Think premium sales CRM marketing meets TED Talk slide design. Bold, confident, results-driven. Render at 4K with smooth gradients and crisp edges.`,
    negativePrompt: `No text, no watermarks, no photorealistic hands, no cluttered elements, no dull colors, no flat composition, no random objects, no distorted anatomy, no low-res, no busy background`,
  },
  'Personal Branding': {
    subject: `A striking silhouette of a person with a glowing, circular personal-logo halo behind their head, like a modern digital icon. Around the figure, floating content icons — a document, a video play button, a speech bubble, an article — orbit in a gentle, gravitational pattern. The figure stands confidently, facing forward, as if presenting to an audience.`,
    composition: `Centered composition with the figure as the vertical focal point. The halo behind the head creates a powerful, iconic focal point — the visual anchor of the entire image. Orbiting content icons create a dynamic ring around the figure, suggesting reach and influence. Upper portion has clean space for text overlay. Iconic, memorable, identity-focused.`,
    lighting: `The halo is the primary light source, emitting a warm, golden glow that illuminates the figure from behind, creating a striking rim-light effect. Soft fill light from the front preserves detail in the figure's silhouette. The orbiting icons have their own subtle glow. Background is dark, creating maximum contrast with the halo and figure. Mood: iconic, authoritative, memorable.`,
    colorPalette: `Figure: dark silhouette (#1a1a2e) with golden rim lighting (#fbbf24). Halo: warm gold (#d4af37) with a brighter inner ring (#fef3c7). Orbiting icons: each in a different harmonious color — blue (#3b82f6), green (#22c55e), amber (#f59e0b), purple (#8b5cf6). Background: deep charcoal (#0f172a) with a subtle radial gradient toward the halo. Color grading: dramatic, high-contrast, premium, iconic.`,
    style: `Modern editorial illustration with strong silhouette aesthetics. The figure is rendered as a clean, bold silhouette — no facial detail, just form and posture. The halo and icons are more detailed, creating a hierarchy. Think premium personal branding service marketing meets magazine cover design. Bold, iconic, memorable. Render at 4K with smooth gradients and bloom on the halo.`,
    negativePrompt: `No text, no watermarks, no photorealistic face, no cluttered elements, no dull colors, no flat lighting, no busy background, no distorted proportions, no low-res, no low-contrast`,
  },
  'Remote Work': {
    subject: `A cozy, well-lit home office scene seen from a slight isometric angle. On the desk: a laptop showing a video call interface, a steaming coffee mug, a small potted plant, and noise-canceling headphones. From the laptop, glowing dotted lines extend outward to connect with small global location pins floating in the surrounding space, suggesting a distributed team connected across distances.`,
    composition: `Isometric perspective at approximately 25-degree tilt. The desk is positioned at the lower-center, with the laptop as the focal point. The connection lines extend upward and outward to location pins arranged in a loose arc, creating a sense of global reach. The plant and coffee mug add warmth and humanity. Upper portion has clean space for text overlay. Cozy, connected, productive.`,
    lighting: `Warm, natural window light from the upper-left, creating soft, inviting illumination across the desk. The laptop screen emits a cool blue glow that contrasts with the warm ambient light. The connection lines and location pins have their own subtle luminescence. Soft, realistic shadows. Mood: warm, productive, connected, comfortable.`,
    colorPalette: `Desk surface: warm wood tone (#d4a574). Laptop: matte gray (#64748b) with a cool blue screen (#3b82f6). Coffee mug: warm terracotta (#c2410c). Plant: sage green (#84cc16). Connection lines: soft teal (#14b8a6). Location pins: amber (#f59e0b). Background: soft cream (#fef3c7) with a subtle warm gradient. Color grading: warm, inviting, soft contrast, high-key.`,
    style: `Isometric flat-design illustration with subtle 3D depth via soft shadows and layering. Clean, geometric shapes with rounded corners. The connection lines have a slight glow, suggesting digital connectivity. Think premium remote work tool marketing meets cozy productivity app hero image. Clean, warm, relatable. Render at 4K with smooth gradients and soft ambient occlusion.`,
    negativePrompt: `No text, no watermarks, no photorealistic elements, no cluttered desk, no dull colors, no harsh shadows, no distorted perspective, no busy background, no low-res, no extra objects`,
  },
  'Startups & Innovation': {
    subject: `A lightbulb at the center of the composition, transforming into a rocket as it rises upward — the filament of the bulb becomes the rocket's body, and the glass dome becomes the rocket's nose cone. Behind this transformation, a subtle background of brainstorming sticky notes and mechanical innovation gears, all softly out of focus. The transformation is mid-process, capturing the moment of ignition.`,
    composition: `Vertical composition with the lightbulb-to-rocket transformation as the central focal point, rising through the frame. The transformation creates a powerful visual metaphor — idea becoming action. The background elements (sticky notes, gears) are blurred, creating depth and context without competing with the main subject. Upper portion has clean space for text overlay. Dynamic, energetic, innovative.`,
    lighting: `The lightbulb-rocket is the primary light source, emitting a warm, intense glow from the filament-rocket core. This light illuminates the surrounding space, creating a dramatic, high-contrast scene. The background elements are softly lit by this glow, with no additional light sources. The ignition moment creates a burst of light at the transition point. Mood: energetic, innovative, explosive potential.`,
    colorPalette: `Lightbulb-rocket: warm white (#fef3c7) at the glass dome, transitioning to intense amber (#f59e0b) and electric purple (#8b5cf6) at the ignition point. Background: deep indigo (#312e81) with subtle purple (#4c1d95) undertones. Sticky notes (background): faint yellow (#fde68a) and pink (#fbcfe8) at low opacity. Gears (background): faint gray (#94a3b8) at low opacity. Color grading: vibrant, high-contrast, energetic, HDR feel.`,
    style: `Modern 3D illustration with dynamic transformation effects. The lightbulb-to-rocket transition is smooth and believable, with the filament morphing into the rocket body. Motion blur on the rising rocket suggests upward momentum. The background elements use depth-of-field blur. Think premium startup pitch deck hero image meets innovation summit keynote visual. Bold, energetic, innovative. Render at 4K with bloom on the ignition point and volumetric lighting.`,
    negativePrompt: `No text, no watermarks, no photorealistic rocket, no cluttered elements, no dull colors, no flat lighting, no busy background, no distorted shapes, no low-res, no low-contrast`,
  },
}

// ─── Tone-specific mood adaptations ─────────────────────────────────────────
function getToneMood(tone: Tone): string {
  const moodMap: Record<Tone, string> = {
    'Educational': `Adjust the visual mood to feel informative and structured — clean lines, organized composition, balanced symmetry, and a sense of clarity and precision. The image should feel like a well-designed textbook cover or educational infographic.`,
    'Inspirational': `Adjust the visual mood to feel uplifting and aspirational — warm golden lighting, a sense of height and elevation, and a composition that draws the eye upward. The image should evoke hope, possibility, and forward momentum.`,
    'Opinionated': `Adjust the visual mood to feel bold and assertive — high contrast, strong angular shapes, dramatic lighting, and a composition that makes a visual statement. The image should feel confident, unapologetic, and commanding.`,
    'Storytelling': `Adjust the visual mood to feel narrative and cinematic — layered depth, warm tones, atmospheric haze, and a composition that suggests a story unfolding. The image should feel like a film still or a moment captured mid-narrative.`,
    'Motivational': `Adjust the visual mood to feel energetic and driving — vibrant saturated colors, dynamic diagonal composition, motion blur, and a sense of speed and momentum. The image should feel like a call to action, visually.`,
    'Humorous / Witty': `Adjust the visual mood to feel playful and clever — bright, cheerful colors, whimsical proportions, a touch of visual humor in the iconography, while maintaining professional polish. The image should feel smart-funny, not silly.`,
    'Professional / Formal': `Adjust the visual mood to feel polished and authoritative — restrained color palette, clean geometric composition, precise lighting, and a corporate-grade aesthetic. The image should feel like premium B2B marketing material.`,
    'Conversational / Casual': `Adjust the visual mood to feel approachable and friendly — soft colors, rounded shapes, warm lighting, and a composition that feels inviting rather than imposing. The image should feel like a warm welcome.`,
    'Bold / Provocative': `Adjust the visual mood to feel daring and attention-grabbing — extreme high contrast, dramatic chiaroscuro lighting, unconventional composition, and a color palette that pops. The image should stop the scroll.`,
    'Analytical / Data-Driven': `Adjust the visual mood to feel precise and data-rich — clean grid elements, chart-like visual cues, structured layout, cool color palette, and a composition that feels organized and measurable. The image should feel like a premium data visualization.`,
  }
  return moodMap[tone] || moodMap['Educational']
}

// ─── Audience-specific visual context ────────────────────────────────────────
function getAudienceContext(audience: Audience): string {
  const contextMap: Record<Audience, string> = {
    'Founders': `The visual should resonate with startup founders — use imagery of growth, building from scratch, and entrepreneurial ambition. Think pitch-deck aesthetic.`,
    'Developers': `The visual should resonate with software developers — use clean, technical aesthetics with subtle code-like patterns and a polished, engineering-grade feel.`,
    'Students': `The visual should resonate with students — use imagery of learning, growth, and potential, with a fresh, energetic aesthetic.`,
    'Marketers': `The visual should resonate with marketing professionals — use vibrant, engagement-focused imagery with social media visual cues.`,
    'Beginners': `The visual should resonate with beginners — use simple, approachable imagery that feels welcoming and not intimidating.`,
    'Executives / C-Suite': `The visual should resonate with C-suite executives — use premium, authoritative imagery with a polished, high-end corporate aesthetic.`,
    'Small Business Owners': `The visual should resonate with small business owners — use grounded, practical imagery with a warm, hardworking aesthetic.`,
    'Freelancers': `The visual should resonate with freelancers — use imagery of independence, flexibility, and self-directed work.`,
    'Content Creators': `The visual should resonate with content creators — use creative, expressive imagery with a social-media-native aesthetic.`,
    'HR Professionals': `The visual should resonate with HR professionals — use people-focused, warm imagery with a professional, human-centered aesthetic.`,
    'Sales Professionals': `The visual should resonate with sales professionals — use energetic, results-driven imagery with targets, growth, and momentum cues.`,
    'General Public': `The visual should resonate with a broad general audience — use universally relatable imagery with a clean, accessible aesthetic.`,
  }
  return contextMap[audience] || contextMap['General Public']
}

function buildImagePrompt(theme: Theme, tone: Tone, audience: Audience): string {
  const parts = THEME_PROMPT_PARTS[theme] || THEME_PROMPT_PARTS['Productivity']
  const toneMood = getToneMood(tone)
  const audienceContext = getAudienceContext(audience)

  return `【 SUBJECT & SCENE 】
${parts.subject}

【 COMPOSITION 】
${parts.composition}

【 LIGHTING 】
${parts.lighting}

【 COLOR PALETTE 】
${parts.colorPalette}

【 STYLE & RENDERING 】
${parts.style}

【 TONE ADAPTATION — ${tone} 】
${toneMood}

【 AUDIENCE RESONANCE — ${audience} 】
${audienceContext}

【 TECHNICAL SPECIFICATIONS 】
• Aspect ratio: 1:1 square (1080×1080px for social media)
• Resolution: 4K minimum, anti-aliased edges
• Format: High-quality digital illustration / 3D render
• Text overlay area: Reserve upper 25% of frame with clean negative space
• Visual hierarchy: Single clear focal point, supporting elements at lower visual weight
• Color depth: Full RGB, HDR-capable, no banding in gradients
• Export: PNG with transparency support for background elements

【 NEGATIVE PROMPT — Exclude 】
${parts.negativePrompt}`
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

  const xPost = `${hook}\n\nFor ${audience}: ${theme}, ${tone.toLowerCase()} angle.\n${contrarian[0]}\n\n${sourceUrl} #${theme.replace(/\s+/g, '')}`.slice(0, 280)

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
