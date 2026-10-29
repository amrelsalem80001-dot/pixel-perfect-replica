export type L = { ar: string; en: string };

export const COMMUNITIES = [
  { id: "agents", icon: "Bot", members: 12840, name: { ar: "وكلاء الذكاء الاصطناعي والبرمجة", en: "AI Agents & Coding" }, desc: { ar: "بناء الوكلاء الأذكياء، Claude Code، Cursor وأدوات المطورين.", en: "Build agents, Claude Code, Cursor and dev tooling." } },
  { id: "automation", icon: "Workflow", members: 9310, name: { ar: "أتمتة الأعمال وسير العمل", en: "n8n & Automations" }, desc: { ar: "سير عمل n8n و Make وأتمتة العمليات.", en: "n8n, Make and process automation workflows." } },
  { id: "llms", icon: "Cpu", members: 15220, name: { ar: "أدوات ونماذج الذكاء الاصطناعي", en: "AI Tools & LLMs" }, desc: { ar: "مقارنات النماذج اللغوية وأحدث الأدوات.", en: "LLM comparisons and the latest tools." } },
  { id: "media", icon: "Clapperboard", members: 7650, name: { ar: "صناع المحتوى وتوليد الميديا", en: "AI Video & Creative Media" }, desc: { ar: "توليد الفيديو والصور والصوت بالذكاء الاصطناعي.", en: "AI video, image and audio generation." } },
];

export const MEMBERS = [
  { id: "u1", name: "سارة المهندسة", handle: "sara_ai", xp: 1240 },
  { id: "u2", name: "Omar Dev", handle: "omar_dev", xp: 860 },
  { id: "u3", name: "خالد الأتمتة", handle: "khaled_n8n", xp: 410 },
  { id: "u4", name: "Lina Prompts", handle: "lina", xp: 265 },
  { id: "u5", name: "يوسف الباحث", handle: "yousef", xp: 190 },
  { id: "u6", name: "Mona Creative", handle: "mona", xp: 120 },
  { id: "u7", name: "أحمد المبتدئ", handle: "ahmed", xp: 35 },
];

export type PostType = "discussion" | "question" | "poll" | "showcase";
export type Post = {
  id: string; type: PostType; authorId: string; community: string; score: number; comments: number; time: L;
  title: L; body: L; code?: { lang: string; src: string }; attachment?: { name: string; size: string; kind: "n8n" | "python" };
  poll?: { options: L[]; votes: number[] }; answered?: boolean;
};

export const POSTS: Post[] = [
  { id: "p1", type: "showcase", authorId: "u3", community: "automation", score: 142, comments: 38, time: { ar: "منذ ساعتين", en: "2h ago" },
    title: { ar: "سير عمل n8n يرد على رسائل واتساب تلقائياً بـ GPT", en: "n8n workflow auto-replying to WhatsApp with GPT" },
    body: { ar: "شاركت معكم الملف الكامل، يعمل مع Webhook ويحفظ المحادثات في Google Sheets.", en: "Full file attached — webhook trigger, conversations saved to Google Sheets." },
    attachment: { name: "whatsapp-gpt-agent.json", size: "18 KB", kind: "n8n" } },
  { id: "p2", type: "question", authorId: "u7", community: "agents", score: 27, comments: 9, answered: true, time: { ar: "منذ 4 ساعات", en: "4h ago" },
    title: { ar: "كيف أستدعي Claude API ببايثون مع البث المباشر؟", en: "How do I stream Claude API responses in Python?" },
    body: { ar: "جربت الكود التالي لكن لا يظهر النص تدريجياً:", en: "I tried this but text doesn't stream:" },
    code: { lang: "python", src: `import anthropic\n\nclient = anthropic.Anthropic()\nwith client.messages.stream(\n    model="claude-3-5-sonnet",\n    max_tokens=1024,\n    messages=[{"role": "user", "content": "مرحبا"}],\n) as stream:\n    for text in stream.text_stream:\n        print(text, end="", flush=True)` } },
  { id: "p3", type: "poll", authorId: "u2", community: "llms", score: 88, comments: 54, time: { ar: "منذ يوم", en: "1d ago" },
    title: { ar: "أي نموذج تستخدمه يومياً للبرمجة؟", en: "Which model do you use daily for coding?" },
    body: { ar: "صوّت وشاركنا السبب في التعليقات.", en: "Vote and tell us why in the comments." },
    poll: { options: [{ ar: "Claude", en: "Claude" }, { ar: "GPT-4o", en: "GPT-4o" }, { ar: "Gemini", en: "Gemini" }, { ar: "DeepSeek", en: "DeepSeek" }], votes: [412, 230, 140, 98] } },
  { id: "p4", type: "discussion", authorId: "u6", community: "media", score: 61, comments: 22, time: { ar: "منذ يومين", en: "2d ago" },
    title: { ar: "هل ستستبدل أدوات الفيديو بالذكاء الاصطناعي المونتير؟", en: "Will AI video tools replace editors?" },
    body: { ar: "بعد تجربة Kling و Runway لشهر كامل، هذه ملاحظاتي...", en: "After a month with Kling and Runway, here are my notes..." } },
  { id: "p5", type: "showcase", authorId: "u1", community: "agents", score: 203, comments: 47, time: { ar: "منذ 3 أيام", en: "3d ago" },
    title: { ar: "سكربت بايثون لتلخيص ملفات PDF العربية", en: "Python script to summarize Arabic PDFs" },
    body: { ar: "يدعم الاتجاه من اليمين لليسار ويقسم المستند لأجزاء.", en: "Handles RTL text and chunks long documents." },
    attachment: { name: "arabic_pdf_summarizer.py", size: "6 KB", kind: "python" } },
];

export const TOOL_CATEGORIES = [
  { id: "all", ar: "الكل", en: "All" }, { id: "chat", ar: "محادثة", en: "Chat" }, { id: "code", ar: "برمجة", en: "Coding" },
  { id: "image", ar: "صور", en: "Image" }, { id: "video", ar: "فيديو", en: "Video" }, { id: "automation", ar: "أتمتة", en: "Automation" },
];

export const TOOLS = [
  { id: "claude", name: "Claude", cat: "chat", rating: 4.9, featured: true, url: "https://claude.ai", desc: { ar: "مساعد ذكي للكتابة والتحليل والبرمجة.", en: "Assistant for writing, analysis and code." } },
  { id: "chatgpt", name: "ChatGPT", cat: "chat", rating: 4.8, featured: false, url: "https://chat.openai.com", desc: { ar: "أشهر مساعد محادثة متعدد الوسائط.", en: "The popular multimodal chat assistant." } },
  { id: "cursor", name: "Cursor", cat: "code", rating: 4.8, featured: true, url: "https://cursor.com", desc: { ar: "محرر أكواد مدعوم بالذكاء الاصطناعي.", en: "AI-native code editor." } },
  { id: "midjourney", name: "Midjourney", cat: "image", rating: 4.7, featured: false, url: "https://midjourney.com", desc: { ar: "توليد صور فنية عالية الجودة.", en: "High quality artistic image generation." } },
  { id: "runway", name: "Runway", cat: "video", rating: 4.5, featured: false, url: "https://runwayml.com", desc: { ar: "توليد وتحرير الفيديو.", en: "Video generation and editing." } },
  { id: "n8n", name: "n8n", cat: "automation", rating: 4.8, featured: true, url: "https://n8n.io", desc: { ar: "منصة أتمتة مفتوحة المصدر.", en: "Open-source workflow automation." } },
  { id: "kling", name: "Kling", cat: "video", rating: 4.6, featured: false, url: "https://klingai.com", desc: { ar: "فيديو واقعي من النص.", en: "Realistic text-to-video." } },
  { id: "v0", name: "Lovable", cat: "code", rating: 4.7, featured: false, url: "https://lovable.dev", desc: { ar: "ابنِ تطبيقات ويب بالمحادثة.", en: "Build web apps by chatting." } },
];

export const MODEL_OF_WEEK = {
  name: "Claude 3.5 Sonnet", vendor: "Anthropic", score: 9.8,
  radar: [
    { k: { ar: "البرمجة", en: "Coding" }, v: 97 }, { k: { ar: "الاستدلال", en: "Reasoning" }, v: 93 },
    { k: { ar: "العربية", en: "Arabic" }, v: 90 }, { k: { ar: "السرعة", en: "Speed" }, v: 84 },
    { k: { ar: "السعر", en: "Price" }, v: 78 }, { k: { ar: "السياق", en: "Context" }, v: 88 },
  ],
  pros: [{ ar: "أفضل أداء في البرمجة", en: "Top-tier coding" }, { ar: "فهم ممتاز للعربية", en: "Excellent Arabic" }],
  cons: [{ ar: "لا يولد صوراً", en: "No image generation" }, { ar: "حدود استخدام يومية", en: "Daily usage caps" }],
  uses: [{ ar: "وكلاء البرمجة", en: "Coding agents" }, { ar: "تحليل المستندات", en: "Doc analysis" }, { ar: "كتابة المحتوى", en: "Copywriting" }],
};

export const BATTLES = [
  { id: "b1", cat: { ar: "النماذج اللغوية", en: "LLMs" }, a: { name: "Claude 3.5 Sonnet", votes: 1820, latency: "1.1s", price: "$3 / 1M" }, b: { name: "GPT-4o", votes: 1540, latency: "0.9s", price: "$5 / 1M" }, comments: 312 },
  { id: "b2", cat: { ar: "توليد الصور", en: "Image Gen" }, a: { name: "MiniMax Image", votes: 640, latency: "6s", price: "$0.01" }, b: { name: "Midjourney v6", votes: 1120, latency: "40s", price: "$10/mo" }, comments: 145 },
  { id: "b3", cat: { ar: "الفيديو", en: "Video" }, a: { name: "Kling 1.6", votes: 930, latency: "90s", price: "$0.35" }, b: { name: "Runway Gen-3", votes: 870, latency: "60s", price: "$0.50" }, comments: 98 },
];

export const CHALLENGES = [
  { id: "c1", xp: 30, days: 3, joined: 214, title: { ar: "ابنِ وكيل دعم فني بـ n8n", en: "Build a support agent with n8n" } },
  { id: "c2", xp: 20, days: 5, joined: 389, title: { ar: "أفضل برومبت لشعار عربي", en: "Best prompt for an Arabic logo" } },
  { id: "c3", xp: 50, days: 7, joined: 102, title: { ar: "فيديو إعلاني 15 ثانية بالذكاء الاصطناعي", en: "15s AI ad video" } },
];
