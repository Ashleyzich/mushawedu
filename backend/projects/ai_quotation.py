"""
AI Quotation service for Vaka.
Uses the Anthropic Claude API to generate construction cost estimates
from plain-text project descriptions.

Add to .env:
  ANTHROPIC_API_KEY=your_key_here
"""

import json
import re
import urllib.request
import urllib.error
from django.conf import settings

ANTHROPIC_API_KEY = getattr(settings, "ANTHROPIC_API_KEY", "")
API_URL = "https://api.anthropic.com/v1/messages"

SYSTEM_PROMPT = """You are a construction cost estimator for Zimbabwe. 
You help homeowners understand the likely costs of their construction projects.

When given a project description, respond ONLY with a valid JSON object in this exact format:
{
  "summary": "2-3 sentence plain-language summary of the project",
  "total_min_usd": 5000,
  "total_max_usd": 8000,
  "currency_note": "Estimates in USD. EcoCash/RTGS rates vary — confirm with suppliers.",
  "line_items": [
    { "category": "Materials", "item": "Cement (50 bags)", "min_usd": 650, "max_usd": 750 },
    { "category": "Labour",    "item": "Bricklayer (4 weeks)", "min_usd": 800, "max_usd": 1200 }
  ],
  "key_terms": [
    { "term": "DPC", "explanation": "Damp Proof Course — a waterproof layer in the foundation to stop rising moisture" },
    { "term": "BRC", "explanation": "Bar Reinforcement Concrete mesh used to strengthen slabs and walls" }
  ],
  "tips": [
    "Get at least 3 quotes from verified artisans before committing",
    "Budget 10-15% contingency on top of estimates for unexpected costs"
  ],
  "disclaimer": "These are rough estimates only. Actual costs depend on site conditions, material prices, and artisan rates at time of construction."
}

Base your estimates on current Zimbabwean construction market rates (USD pricing).
Identify and explain any technical construction terms the homeowner may not understand.
Be realistic and helpful — these homeowners need accurate guidance."""


def _detect_bedrooms(description: str) -> int:
    match = re.search(r"(\d+)\s*[- ]?bedroom", description, re.IGNORECASE)
    if match:
        return max(1, int(match.group(1)))
    if "house" in description.lower() or "home" in description.lower() or "residential" in description.lower():
        return 3
    return 0


def _rule_based_demo_estimate(project_description: str, location: str) -> dict:
    description = project_description.lower()
    bedroom_count = _detect_bedrooms(description)

    # Base ranges tuned for a simple presentation demo.
    total_min = 2600
    total_max = 4200
    line_items = [
        {"category": "Site Work", "item": "Site clearing & setting out", "min_usd": 180, "max_usd": 300},
        {"category": "Foundation", "item": "Excavation & foundation concrete", "min_usd": 520, "max_usd": 820},
        {"category": "Materials", "item": "Cement, sand & aggregate", "min_usd": 620, "max_usd": 950},
        {"category": "Labour", "item": "Skilled labour & general workers", "min_usd": 620, "max_usd": 980},
    ]
    key_terms = [
        {"term": "DPC", "explanation": "Damp Proof Course — a waterproof layer that stops moisture rising through walls."},
        {"term": "BRC", "explanation": "Bar Reinforcement Concrete mesh — steel mesh used to strengthen slabs and reduce cracking."},
    ]
    tips = [
        "Get at least 3 quotes from verified artisans before committing",
        "Keep a 10-15% contingency for price changes and unexpected site work",
    ]

    summary_bits = [
        f"This looks like a project in {location}",
        "with a typical Zimbabwe market cost structure",
    ]

    if bedroom_count:
        bedroom_min = bedroom_count * 700
        bedroom_max = bedroom_count * 1050
        line_items.append({
            "category": "Structure",
            "item": f"{bedroom_count}-bedroom walling and framing",
            "min_usd": bedroom_min,
            "max_usd": bedroom_max,
        })
        total_min += bedroom_min
        total_max += bedroom_max
        summary_bits.insert(0, f"A {bedroom_count}-bedroom build was detected")
        tips.append("Split the build into foundation, shell, roofing, and finishes for better budget control")

    if any(word in description for word in ["foundation", "footing", "footings", "slab"]):
        line_items.append({
            "category": "Foundation",
            "item": "Foundation excavation, rebar and slab works",
            "min_usd": 700,
            "max_usd": 1100,
        })
        total_min += 350
        total_max += 550
        key_terms.append({
            "term": "Ring beam",
            "explanation": "A reinforced concrete band that ties walls together and helps carry roof loads evenly.",
        })

    if any(word in description for word in ["roof", "roofing", "truss", "timber"]):
        line_items.append({
            "category": "Roofing",
            "item": "Roof structure, sheets and fastening materials",
            "min_usd": 850,
            "max_usd": 1450,
        })
        total_min += 700
        total_max += 1100
        tips.append("Roofing costs rise quickly with span, pitch, and timber quality")

    if any(word in description for word in ["renovation", "renovate", "refurbish", "remodel"]):
        total_min = max(1800, int(total_min * 0.7))
        total_max = max(2800, int(total_max * 0.72))
        line_items.insert(0, {
            "category": "Renovation",
            "item": "Demolition, repairs and finishing improvements",
            "min_usd": 500,
            "max_usd": 900,
        })
        summary_bits.append("it has been treated as a renovation rather than a full new build")
        tips.append("Renovations often hide extra work behind old finishes, so inspect the site first")

    if any(word in description for word in ["plaster", "plastering"]):
        line_items.append({
            "category": "Finishes",
            "item": "Plastering and surface preparation",
            "min_usd": 260,
            "max_usd": 480,
        })

    if any(word in description for word in ["paint", "painting"]):
        line_items.append({
            "category": "Finishes",
            "item": "Primer, paint and application labour",
            "min_usd": 220,
            "max_usd": 420,
        })

    if any(word in description for word in ["bathroom", "toilet", "plumbing"]):
        line_items.append({
            "category": "Services",
            "item": "Plumbing fixtures and pipework",
            "min_usd": 350,
            "max_usd": 780,
        })

    if any(word in description for word in ["kitchen", "cabinet", "wardrobe"]):
        line_items.append({
            "category": "Joinery",
            "item": "Kitchen or joinery works",
            "min_usd": 400,
            "max_usd": 900,
        })

    contingency_min = int(total_min * 0.1)
    contingency_max = int(total_max * 0.15)
    line_items.append({
        "category": "Contingency",
        "item": "10-15% buffer for unexpected costs",
        "min_usd": contingency_min,
        "max_usd": contingency_max,
    })

    total_min += contingency_min
    total_max += contingency_max

    return {
        "summary": (
            f"{' '.join(summary_bits)}. The estimate below is a local demo calculation that reacts to the words in your description."
        ),
        "total_min_usd": total_min,
        "total_max_usd": total_max,
        "currency_note": "Estimates in USD. EcoCash/RTGS rates vary — confirm current rates with your bank or supplier.",
        "line_items": line_items,
        "key_terms": key_terms,
        "tips": tips,
        "disclaimer": "SIMULATED ESTIMATE — Add your ANTHROPIC_API_KEY to .env for real AI-powered quotes. These figures are illustrative only based on typical Zimbabwe construction costs.",
    }


def generate_quotation(project_description: str, location: str = "Zimbabwe") -> dict:
    """
    Generate an AI construction cost estimate.

    Returns:
        { "success": bool, "data": dict | None, "error": str | None, "simulated": bool }
    """
    if not ANTHROPIC_API_KEY:
        return {
            "success":   True,
            "simulated": True,
            "data": _rule_based_demo_estimate(project_description, location),
        }

    user_message = f"""Project description: {project_description}

Location: {location}

Please generate a detailed cost estimate for this construction project."""

    payload = {
        "model":      "claude-sonnet-4-20250514",
        "max_tokens": 1500,
        "system":     SYSTEM_PROMPT,
        "messages":   [{"role": "user", "content": user_message}],
    }

    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode(),
        headers={
            "Content-Type":      "application/json",
            "x-api-key":         ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return {"success": False, "data": None, "error": f"API error: {e.code}", "simulated": False}
    except Exception as e:
        return {"success": False, "data": None, "error": str(e), "simulated": False}

    try:
        text = result["content"][0]["text"]
        # Strip any markdown code fences if present
        text = text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        data = json.loads(text.strip())
        return {"success": True, "data": data, "error": None, "simulated": False}
    except (KeyError, json.JSONDecodeError) as e:
        return {"success": False, "data": None, "error": f"Could not parse AI response: {e}", "simulated": False}
