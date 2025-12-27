const CATEGORY_KEYWORDS = {
    scheduling: ["meeting", "schedule", "call", "appointment", "deadline"],
    finance: ["payment", "invoice", "bill", "budget", "cost", "expense"],
    technical: ["bug", "fix", "error", "install", "repair", "maintain"],
    safety: ["safety", "hazard", "inspection", "compliance", "ppe"]
};

const PRIORITY_KEYWORDS = {
    high: ["urgent", "asap", "immediately", "today", "critical", "emergency"],
    medium: ["soon", "this week", "important"]
};

const SUGGESTED_ACTIONS = {
    scheduling: ["Block calendar", "Send invite", "Prepare agenda", "Set reminder"],
    finance: ["Check budget", "Get approval", "Generate invoice", "Update records"],
    technical: ["Diagnose issue", "Check resources", "Assign technician", "Document fix"],
    safety: ["Conduct inspection", "File report", "Notify supervisor", "Update checklist"],
    general: []
};

function detectCategory(text) {
    const lower = text.toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(k => lower.includes(k))) {
            return category;
        }
    }
    return "general";
}

function detectPriority(text) {
    const lower = text.toLowerCase();
    if (PRIORITY_KEYWORDS.high.some(k => lower.includes(k))) return "high";
    if (PRIORITY_KEYWORDS.medium.some(k => lower.includes(k))) return "medium";
    return "low";
}

function extractEntities(text) {
    const entities = {};

    // Dates / time keywords
    const dateMatch = text.match(/\b(today|tomorrow|next week|\d{1,2}\/\d{1,2}\/\d{2,4})\b/i);
    if (dateMatch) entities.date = dateMatch[0];

    // Assigned person
    const personMatch = text.match(/\b(with|by|assign to)\s+([A-Za-z ]+)/i);
    if (personMatch) entities.person = personMatch[2].trim();

    // Action verbs (simple heuristic)
    const verbs = text.match(/\b(schedule|call|fix|pay|inspect|review)\b/gi);
    if (verbs) entities.actions = [...new Set(verbs.map(v => v.toLowerCase()))];

    return entities;
}

function classifyTask({ title, description }) {
    const content = `${title} ${description || ""}`;

    const category = detectCategory(content);
    const priority = detectPriority(content);
    const extracted_entities = extractEntities(content);
    const suggested_actions = SUGGESTED_ACTIONS[category] || [];

    return {
        category,
        priority,
        extracted_entities,
        suggested_actions
    };
}

export default { classifyTask };
