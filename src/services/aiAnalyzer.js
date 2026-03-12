// src/services/aiAnalyzer.js
// CivicAI Response System - Gemini AI Analysis Engine
// Enhanced for urban risk intelligence and decision support

const GEMINI_API_KEY = "AIzaSyDb7yJwYsWZdKTzswNacX7uyVZvt2ZSHDM";
const GEMINI_MODEL   = "gemini-1.5-flash";
const GEMINI_URL     = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

function buildEventList(events) {
  return events
    .map((e) => `  - [${e.id}] ${e.name}${e.detail ? ` (${e.detail})` : ""}`)
    .join("\n");
}

// ── ENHANCED PROMPTS FOR CIVICAI RESPONSE SYSTEM ───────────────────────

function buildPromptFrequent(events) {
  return `You are the CivicAI Decision Engine for urban risk intelligence. Your role is to provide authoritative analysis for city emergency management authorities.

A FREQUENT urban event chain has been detected — a recurring infrastructure problem requiring systematic resolution.

Event Chain:
${buildEventList(events)}

Analyze this scenario and return ONLY a valid JSON object with these exact fields:

{
  "category": "frequent",
  "systemInsight": "A single strong warning sentence (MAX 30 WORDS) summarizing the situation and potential escalation. Example: 'This incident is likely to cause city-wide disruption within 2 hours unless immediate containment begins.'",
  "riskLevel": "Low" | "Moderate" | "High" | "Critical",
  "confidenceScore": 75,
  "decisionRecommendation": {
    "primaryAction": "The single most critical action authorities must take NOW",
    "reason": "Why this action is essential based on current event progression"
  },
  "futureScenarioBranches": [
    {
      "title": "Scenario branch title",
      "branches": [
        { "outcome": "Best case outcome description", "probability": "high|medium|low" },
        { "outcome": "Worst case outcome description", "probability": "high|medium|low" }
      ]
    }
  ],
  "actionPlan": {
    "immediate": ["Action 1 — what to do NOW (0-30 min)", "Action 2", "Action 3"],
    "shortTerm": ["Action 1 — what to do in next 1-6 hours", "Action 2", "Action 3"],
    "longTerm": ["Action 1 — prevention for next 1-4 weeks", "Action 2", "Action 3"]
  },
  "impactEstimation": {
    "affectedPopulation": "Approximate number of people affected",
    "hospitalDemand": "Expected hospital admissions",
    "trafficDelay": "Expected traffic disruption duration",
    "emergencyResourceRequirement": "Types and quantity of resources needed"
  },
  "cityResources": {
    "nearbyHospitals": ["Hospital name and distance"],
    "fireStations": ["Station name and response time"],
    "evacuationRoutes": ["Primary and alternate routes"],
    "shelters": ["Available shelter locations and capacity"]
  },
  "additionalInfoNeeded": ["Question 1 if data is missing", "Question 2"],
  "rootCause": "2-3 sentences identifying the primary root cause",
  "keyContributingFactors": ["Factor 1", "Factor 2", "Factor 3"],
  "infrastructureSolutions": ["Solution 1", "Solution 2", "Solution 3", "Solution 4"],
  "preventionStrategies": ["Strategy 1", "Strategy 2", "Strategy 3"],
  "estimatedImpact": "1-2 sentences on economic/social impact if unresolved",
  "priority": "high" | "medium" | "low"
}

Return ONLY valid JSON. Be authoritative, specific, and actionable for Indian municipal authorities.`;
}

function buildPromptRare(events) {
  return `You are the CivicAI Decision Engine for urban risk intelligence. Your role is to provide authoritative analysis for city emergency management authorities.

A RARE / MAJOR catastrophic event has been detected — causing severe cascading impacts across multiple city systems.

Event Chain (branching cascade):
${buildEventList(events)}

Analyze this critical scenario and return ONLY a valid JSON object with these exact fields:

{
  "category": "rare",
  "systemInsight": "A single strong warning sentence (MAX 30 WORDS) summarizing the critical situation. Example: 'This incident is likely to escalate into a city-wide disruption within 2 hours unless chemical containment begins immediately.'",
  "riskLevel": "Low" | "Moderate" | "High" | "Critical",
  "confidenceScore": 85,
  "decisionRecommendation": {
    "primaryAction": "The single most critical emergency action authorities must take NOW",
    "reason": "Why this action is essential to prevent catastrophic escalation"
  },
  "futureScenarioBranches": [
    {
      "title": "Primary cascade branch",
      "branches": [
        { "outcome": "Best case — contained quickly → limited impact", "probability": "high|medium|low" },
        { "outcome": "Worst case — spreads via wind → residential exposure", "probability": "high|medium|low" },
        { "outcome": "Secondary risk — ignition risk → secondary explosion", "probability": "high|medium|low" }
      ]
    }
  ],
  "actionPlan": {
    "immediate": ["CRISIS ACTION 1 — what to do NOW (0-30 min)", "CRISIS ACTION 2", "CRISIS ACTION 3", "CRISIS ACTION 4"],
    "shortTerm": ["Response 1 — what to do in next 1-6 hours", "Response 2", "Response 3"],
    "longTerm": ["Prevention 1 — actions for next 1-4 weeks", "Prevention 2", "Prevention 3"]
  },
  "impactEstimation": {
    "affectedPopulation": "Approximate number of people directly affected",
    "hospitalDemand": "Expected emergency hospital admissions",
    "trafficDelay": "Expected major traffic disruptions",
    "emergencyResourceRequirement": "Types and quantity of emergency resources needed"
  },
  "cityResources": {
    "nearbyHospitals": ["Hospital name and distance", "ICU capacity status"],
    "fireStations": ["Station name and ETA", "HazMat capability"],
    "evacuationRoutes": ["Primary evacuation route", "Alternate safe route"],
    "shelters": ["Shelter name and capacity", "Alternate shelter"]
  },
  "additionalInfoNeeded": ["Question 1 if data is missing", "Question 2"],
  "impactChains": [
    "Chain 1: Initial event → cascading impact 1",
    "Chain 2: Initial event → cascading impact 2"
  ],
  "immediateResponseActions": ["Action 1", "Action 2", "Action 3", "Action 4"],
  "preventiveInterventions": ["Intervention 1", "Intervention 2", "Intervention 3"],
  "resourceRequirements": ["Resource 1", "Resource 2", "Resource 3"],
  "severityLevel": "critical" | "high" | "medium",
  "estimatedAffected": "Estimated number of people affected"
}

Return ONLY valid JSON. Be authoritative, specific, and actionable for Indian municipal emergency operations.`;
}

function buildPromptPredictive(events) {
  return `You are the CivicAI Decision Engine for urban risk intelligence. Your role is to provide authoritative predictive analysis for city emergency management authorities.

A PREDICTIVE urban risk scenario — these events have NOT yet occurred. This is a forecast requiring preventive action.

Predicted Event Sequence:
${buildEventList(events)}

Analyze this predictive scenario and return ONLY a valid JSON object with these exact fields:

{
  "category": "predictive",
  "systemInsight": "A single strong warning sentence (MAX 30 WORDS) predicting future risk. Example: 'If current rainfall continues, the Bhima River will breach flood stage within 90 minutes, inundating Riverside Colony unless immediate evacuation begins.'",
  "riskLevel": "Low" | "Moderate" | "High" | "Critical",
  "confidenceScore": 80,
  "decisionRecommendation": {
    "primaryAction": "The single most critical PREVENTIVE action authorities must take NOW",
    "reason": "Why this action is critical to prevent predicted catastrophe"
  },
  "futureScenarioBranches": [
    {
      "title": "Primary risk cascade",
      "branches": [
        { "outcome": "Best case — early intervention prevents cascade", "probability": "high|medium|low" },
        { "outcome": "Worst case — uncontrolled cascade → infrastructure collapse", "probability": "high|medium|low" },
        { "outcome": "Secondary impact — cascading system failures", "probability": "high|medium|low" }
      ]
    }
  ],
  "actionPlan": {
    "immediate": ["PREVENTIVE ACTION 1 — must be taken NOW (0-30 min)", "PREVENTIVE ACTION 2", "PREVENTIVE ACTION 3"],
    "shortTerm": ["Response 1 — what to do in next 1-6 hours", "Response 2", "Response 3"],
    "longTerm": ["Prevention 1 — actions for next 1-4 weeks", "Prevention 2", "Prevention 3"]
  },
  "impactEstimation": {
    "affectedPopulation": "Estimated population at risk",
    "hospitalDemand": "Expected surge in medical needs",
    "trafficDelay": "Expected infrastructure disruptions",
    "emergencyResourceRequirement": "Resources needed for response"
  },
  "cityResources": {
    "nearbyHospitals": ["Hospital name and capacity", "Distance from risk zone"],
    "fireStations": ["Station name and response time"],
    "evacuationRoutes": ["Primary evacuation route", "Alternate safe route"],
    "shelters": ["Shelter name and capacity", "Activation status"]
  },
  "additionalInfoNeeded": ["Question 1 if data is missing", "Question 2"],
  "futureRiskForecast": "2-3 sentences describing most likely outcome if no intervention",
  "possibleEventCascades": ["Cascade path 1", "Cascade path 2", "Cascade path 3"],
  "timeToImpact": {
    "immediate": "What will happen within 1-2 hours",
    "shortTerm": "What will happen within 6-12 hours",
    "longTerm": "What will happen within 24-48 hours if untreated"
  },
  "preventiveRecommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3", "Recommendation 4"],
  "riskLevel": "critical" | "high" | "medium",
  "populationAtRisk": "Estimated number of people at risk"
}

Return ONLY valid JSON. Be authoritative, specific, predictive, and actionable for Indian urban authorities.`;
}

// ── ENHANCED FALLBACKS FOR CIVICAI RESPONSE SYSTEM ─────────────────────

const FALLBACKS = {
  frequent: {
    category: "frequent",
    systemInsight: "This traffic disruption is likely to cause city-wide congestion within 2 hours unless alternative routing is implemented immediately.",
    riskLevel: "Moderate",
    confidenceScore: 78,
    decisionRecommendation: {
      primaryAction: "Activate traffic diversion protocol and deploy traffic management personnel to key junction points.",
      reason: "Road waterlogging has reduced capacity by 40% and is causing cascading delays across the municipal network."
    },
    futureScenarioBranches: [
      {
        title: "Traffic Disruption Progression",
        branches: [
          { outcome: "Best case: Quick drainage clears → normal traffic resumes within 2 hours", probability: "medium" },
          { outcome: "Worst case: Secondary potholes form → road closure required → 4+ hour disruption", probability: "low" }
        ]
      }
    ],
    actionPlan: {
      immediate: [
        "Deploy traffic management personnel to waterlogged junctions",
        "Activate alternate route signage on major arterials",
        "Issue public advisory via municipal social media channels"
      ],
      shortTerm: [
        "Clear storm drain blockages using vacuum trucks",
        "Assess road surface damage with inspection team",
        "Coordinate with bus depot for route modifications"
      ],
      longTerm: [
        "Schedule comprehensive drain cleaning before next monsoon",
        "Install IoT waterlogging sensors at critical points",
        "Conduct road surface audit and plan repairs"
      ]
    },
    impactEstimation: {
      affectedPopulation: "15,000-20,000 commuters daily",
      hospitalDemand: "Minimal impact (2-5 additional cases)",
      trafficDelay: "30-60 minutes average delay during peak hours",
      emergencyResourceRequirement: "2 traffic management teams, 1 drain clearing unit"
    },
    cityResources: {
      nearbyHospitals: ["Khed District Hospital (3.2 km)", "Prakash General (5.1 km)"],
      fireStations: ["Khed Fire Station (2.8 km) - 8 min response"],
      evacuationRoutes: ["NH-48 Bypass", "Station Road alternate"],
      shelters: ["Municipal Community Hall (capacity 200)"]
    },
    additionalInfoNeeded: ["Current rainfall intensity and forecast", "Real-time water depth at key junctions"],
    rootCause: "The primary root cause is inadequate stormwater drainage infrastructure unable to handle rainfall exceeding 60mm/hr. When drainage fails, water accumulates on road surfaces and infiltrates the subbase layer, initiating a progressive structural failure chain.",
    keyContributingFactors: [
      "Storm drains last cleared 18 months ago — operating at 35% capacity",
      "Road subbase constructed with permeable aggregate unsuitable for high-rainfall",
      "No real-time pothole detection system"
    ],
    infrastructureSolutions: [
      "Install permeable pavement on major arterials",
      "Upgrade storm drain network in Ward 4-9",
      "Deploy IoT road surface sensors at 200 key junctions",
      "Construct 3 retention ponds in upstream catchment areas"
    ],
    preventionStrategies: [
      "Mandatory pre-monsoon drain clearing by May 15",
      "Road surface audit every 6 months using drone photogrammetry",
      "Activate traffic diversion protocol automatically when rainfall exceeds 40mm/hr"
    ],
    estimatedImpact: "Current event causes ₹18 lakh/day in productivity loss and increases emergency response time by 22 minutes.",
    priority: "high",
    _fallback: true,
  },

  rare: {
    category: "rare",
    systemInsight: "This chemical leak incident is likely to escalate into a city-wide emergency within 2 hours unless immediate containment and evacuation begins.",
    riskLevel: "Critical",
    confidenceScore: 92,
    decisionRecommendation: {
      primaryAction: "Issue immediate emergency alert and initiate evacuation of 1km radius around the facility.",
      reason: "Chemical plume is drifting toward residential areas with potential for secondary explosions if ignition occurs."
    },
    futureScenarioBranches: [
      {
        title: "Chemical Leak Progression",
        branches: [
          { outcome: "Best case: Quick containment → limited impact → area cleared within 4 hours", probability: "medium" },
          { outcome: "Worst case: Spreads via wind → residential exposure → mass casualty event", probability: "high" },
          { outcome: "Secondary risk: Ignition → secondary explosion → facility-wide emergency", probability: "medium" }
        ]
      }
    ],
    actionPlan: {
      immediate: [
        "EXPAND exclusion zone to 750m — initiate shelter-in-place for all within 1km",
        "REQUEST Pune District Disaster Management mutual aid — 6 additional ICU beds",
        "DEPLOY decontamination corridor at NH-48 Entry Point",
        "PRE-POSITION 2 fire tenders at upwind perimeter — prevent spread to Tanks B4, B5"
      ],
      shortTerm: [
        "Coordinate HazMat team for chemical containment",
        "Establish air quality monitoring stations downwind",
        "Activate hospital overflow protocol",
        "Set up family reunification center at Municipal Hall"
      ],
      longTerm: [
        "Mandate annual pressure line integrity audit for all hazardous facilities",
        "Install sub-15-second toxic gas sensors on pressurized lines",
        "Establish Hospital Overload Protocol with pre-designated overflow facility"
      ]
    },
    impactEstimation: {
      affectedPopulation: "2,400 residents within 1km radius",
      hospitalDemand: "12-20 emergency admissions expected in first 2 hours",
      trafficDelay: "Major arterial road closures — 4-6 hour disruption",
      emergencyResourceRequirement: "4 fire tenders, 2 HazMat teams, 6 ambulances, emergency shelter capacity"
    },
    cityResources: {
      nearbyHospitals: ["Khed District Hospital (2.1 km) - ICU at 60%", "Pune Civil Hospital (8.5 km) - Mutual aid"],
      fireStations: ["Khed Fire Station (1.8 km) - 6 min ETA", "Hadapsar Fire (6.2 km) - HazMat capable"],
      evacuationRoutes: ["NH-48 Northbound", "Khed-Bhosari Road", "Bypass Route via MIDC"],
      shelters: ["Khed Sports Complex (capacity 80)", "Municipal High School (capacity 350)"]
    },
    additionalInfoNeeded: ["Wind direction and speed", "Chemical toxicity classification", "Number of hospitals within 5km"],
    impactChains: [
      "Fire Outbreak → Road Block: Emergency vehicle response corridors blocked",
      "Chemical Leak → Mass Casualty → Hospital Overload: 12+ workers exposed; ICU at 140%",
      "Chemical Leak → Air Pollution: Toxic plume drifting NE at 12km/h — affects 2,400 residents"
    ],
    immediateResponseActions: [
      "IMMEDIATE: Expand exclusion zone to 750m",
      "IMMEDIATE: Request Pune District Disaster Management mutual aid",
      "Deploy decontamination corridor at NH-48 Entry Point",
      "Pre-position 2 fire tenders at upwind perimeter"
    ],
    preventiveInterventions: [
      "Mandatory annual pressure line integrity audit for Class A hazardous facilities",
      "Install sub-15-second toxic gas sensors on all pressurized chemical lines",
      "Establish Hospital Overload Protocol at Khed Sports Complex"
    ],
    resourceRequirements: [
      "HazMat Team Alpha (Pune) — 45-minute ETA",
      "NDRF Unit 4 — 90-minute ETA for chemical containment",
      "Khed District Hospital + Pune Civil Hospital mutual aid activation"
    ],
    severityLevel: "critical",
    estimatedAffected: "340 factory workers, 2,400 nearby residents, 12+ hospital admissions",
    _fallback: true,
  },

  predictive: {
    category: "predictive",
    systemInsight: "If current rainfall continues, Bhima River will breach flood stage within 90 minutes, inundating Riverside Colony unless immediate evacuation begins.",
    riskLevel: "Critical",
    confidenceScore: 85,
    decisionRecommendation: {
      primaryAction: "Begin immediate evacuation of Riverside Colony — 340 residents to safe shelter within 90 minutes.",
      reason: "Dam release is unavoidable at 96% reservoir capacity, adding 2,400 cusecs to river flow and flooding low-lying areas."
    },
    futureScenarioBranches: [
      {
        title: "Flood Progression Scenario",
        branches: [
          { outcome: "Best case: Early evacuation → all residents safe → minimal casualty", probability: "high" },
          { outcome: "Worst case: Delayed evacuation → residents trapped → water rescue required", probability: "medium" },
          { outcome: "Secondary: Power outage → water treatment failure → 18,000 without water 24-72 hrs", probability: "medium" }
        ]
      }
    ],
    actionPlan: {
      immediate: [
        "BEGIN Riverside Colony evacuation — 340 residents to Khed High School NOW",
        "PRE-POSITION 2 rescue boats at Bhima River Ghat within 30 minutes",
        "NOTIFY Ward 7 substation operator — initiate planned shutdown sequence",
        "CLOSE Station Road bridge NOW — redirect all traffic via Bypass Road"
      ],
      shortTerm: [
        "Activate emergency shelter operations at Khed High School",
        "Deploy medical teams to shelter locations",
        "Coordinate with NDRF for water rescue if needed",
        "Establish communication center for family reunification"
      ],
      longTerm: [
        "Conduct post-flood damage assessment of Riverside Colony infrastructure",
        "Review dam management protocols with irrigation department",
        "Install early flood warning system at Bhima River gauge stations",
        "Plan relocation of residents from high-risk flood zones"
      ]
    },
    impactEstimation: {
      affectedPopulation: "2,400 residents in flood zone + 18,000 dependent on Ward 7 power grid",
      hospitalDemand: "20-30 emergency cases expected (injuries, displacement health issues)",
      trafficDelay: "All 4 arterial roads impassable — 6-12 hour disruption minimum",
      emergencyResourceRequirement: "4 rescue boats, 2 NDRF teams, 6 ambulances, 200 shelter beds"
    },
    cityResources: {
      nearbyHospitals: ["Khed District Hospital (4.5 km)", "Pune Civil Hospital (12 km)"],
      fireStations: ["Khed Fire Station (3.2 km) - can support rescue operations"],
      evacuationRoutes: ["Khed-Bhosari Road (elevated)", "NH-48 via Bypass", "MIDC Access Road"],
      shelters: ["Khed High School (capacity 400)", "Municipal Community Hall (capacity 200)"]
    },
    additionalInfoNeeded: ["Current dam reservoir level", "Rainfall forecast for next 6 hours", "Number of rescue boats available"],
    futureRiskForecast: "If current rainfall continues at 87mm/hr without intervention, the Bhima River will breach flood stage (5.5m) within 90 minutes. Controlled dam release is unavoidable once reservoir reaches 96% capacity — this will add 2,400 cusecs to existing river flow, inundating Riverside Colony within 2 hours.",
    possibleEventCascades: [
      "Primary: Dam release → Riverside Colony inundation → Ward 7 substation failure → district power outage",
      "Worst-case: All 4 arterial roads impassable → emergency vehicles cannot reach → water rescue for 340 trapped",
      "Secondary: Power outage disables water treatment → potable water interrupted for 18,000 residents"
    ],
    timeToImpact: {
      immediate: "River gauge will reach 4.8m (warning stage) within 30 minutes",
      shortTerm: "Dam water release likely 14:45-15:15 — Riverside Colony roads impassable by 16:00",
      longTerm: "Ward 7 substation requires 24-48 hours to restore — thermal power backup needed within 4 hours"
    },
    preventiveRecommendations: [
      "IMMEDIATE: Begin Riverside Colony evacuation",
      "Pre-position rescue boats at Bhima River Ghat",
      "Notify Ward 7 substation operator",
      "Close Station Road bridge"
    ],
    riskLevel: "critical",
    populationAtRisk: "2,400 residents in flood zone; 18,000 residents dependent on Ward 7 power grid",
    _fallback: true,
  },
};

// ── Main export ───────────────────────────────────────────────────────────

/**
 * Analyze events using Gemini AI.
 * Falls back to detailed local analysis if API call fails.
 *
 * @param {Array}  events      - from JSON graphData.events
 * @param {string} category    - "frequent" | "rare" | "predictive"
 * @param {string} scenarioId  - "traffic" | "factory" | "flood"
 */
export async function analyzeEvents(events, category, scenarioId) {
  // Map display category names to internal keys
  const catKey =
    category === "Frequent Event"       ? "frequent"   :
    category === "Rare Event"           ? "rare"        :
    category === "Predictive Risk Event"? "predictive"  :
    (category || "").toLowerCase().includes("frequent")  ? "frequent"  :
    (category || "").toLowerCase().includes("rare")      ? "rare"      :
    (category || "").toLowerCase().includes("predict")   ? "predictive":
    scenarioId === "traffic" ? "frequent" :
    scenarioId === "factory" ? "rare"     : "predictive";

  const buildPrompt =
    catKey === "frequent"   ? buildPromptFrequent :
    catKey === "rare"       ? buildPromptRare     :
    buildPromptPredictive;

  // Use graphData events if available (new format: {id, name, detail})
  // Otherwise adapt old format events
  const normalizedEvents = events[0]?.id
    ? events
    : events.map((e, i) => ({ id: i + 1, name: e.event || e.name, detail: e.value || e.location }));

  try {
    const res = await fetch(GEMINI_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(normalizedEvents) }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1500 },
      }),
    });

    if (!res.ok) {
      console.warn("Gemini API error:", res.status, await res.text());
      return FALLBACKS[catKey];
    }

    const data  = await res.json();
    const raw   = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const clean = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

    try {
      const parsed = JSON.parse(clean);
      return { ...parsed, _catKey: catKey };
    } catch {
      console.warn("JSON parse failed. Raw:", clean.slice(0, 300));
      return FALLBACKS[catKey];
    }
  } catch (err) {
    console.warn("Network error:", err.message);
    return FALLBACKS[catKey];
  }
}

// ── SCENARIO SIMULATION FUNCTION ──────────────────────────────────────────

// ── Scenario-specific simulation prompts ─────────────────────────────────

function buildSimulationPromptTraffic(condition) {
  return `You are the CivicAI Decision Engine for Khed Municipality urban risk intelligence.

SIMULATION REQUEST — TRAFFIC SCENARIO
Location context: Khed Town, Maharashtra, India. Key zones: Khed Bus Stand, Market Junction, NH-48, Central Road, Main Market Road.
User-reported condition: "${condition}"

Simulate the traffic impact cascade for Khed Municipality. Predict what will happen next based on this condition.
Return ONLY a valid JSON object with these exact fields:

{
  "predictedEventChain": [
    "Step 1 (0-15 min): Specific initial traffic trigger at a named Khed location",
    "Step 2 (15-45 min): Secondary congestion effect and which roads are affected",
    "Step 3 (45-90 min): Downstream impact (signal failure, blocked emergency route, etc.)",
    "Step 4 (90+ min): Worst-case outcome if no intervention"
  ],
  "cascadingImpacts": [
    "Ambulance / emergency vehicle route blockage — specific road or junction",
    "Public transport disruption — bus routes or school routes affected",
    "Commercial impact — market or business area affected",
    "Pothole or road damage risk if waterlogging is involved",
    "Pedestrian safety hazard at specific crossing"
  ],
  "riskLevel": "Low" | "Moderate" | "High" | "Critical",
  "confidenceScore": 78,
  "recommendedActions": [
    "Action 1 — most urgent traffic management step (name specific junction or road)",
    "Action 2 — alternate routing instruction for commuters",
    "Action 3 — coordination with traffic police or bus depot",
    "Action 4 — public advisory via municipal channels"
  ],
  "estimatedTimeToImpact": {
    "immediate": "Specific traffic situation in next 0-2 hours at named Khed locations",
    "shortTerm": "How congestion spreads across Khed road network in 2-6 hours",
    "longTerm": "Road condition or infrastructure impact in 6-24 hours if unresolved"
  }
}

Be specific to Khed town geography. Name real road types (NH-48, Market Junction, Bus Stand, Central Road). Return ONLY valid JSON.`;
}

function buildSimulationPromptIndustrial(condition) {
  return `You are the CivicAI Decision Engine for Khed Municipality urban risk intelligence.

SIMULATION REQUEST — INDUSTRIAL ACCIDENT SCENARIO
Location context: Khed Industrial Zone, Maharashtra, India. Nearby: NH-48 Entry Point, Khed District Hospital (2.1 km), Chemical Plant Unit-3, MIDC Khed.
User-reported condition: "${condition}"

Simulate the industrial accident cascade for Khed Industrial Zone. Predict the multi-system emergency impact.
Return ONLY a valid JSON object with these exact fields:

{
  "predictedEventChain": [
    "Step 1 (0-10 min): Specific industrial trigger event at named Khed facility zone",
    "Step 2 (10-30 min): Immediate physical hazard — fire, chemical spread, structural failure",
    "Step 3 (30-60 min): Human exposure cascade — worker casualties, nearby resident risk",
    "Step 4 (60-120 min): Infrastructure and hospital system overload if uncontained"
  ],
  "cascadingImpacts": [
    "Chemical or fire hazard radius — estimated spread zone in Khed",
    "Road blockage on NH-48 or plant access roads affecting emergency response",
    "Khed District Hospital surge — expected admissions and ICU impact",
    "Air quality deterioration — residential areas at risk downwind",
    "Secondary explosion or re-ignition risk if chemical storage is nearby"
  ],
  "riskLevel": "High" | "Critical",
  "confidenceScore": 88,
  "recommendedActions": [
    "IMMEDIATE: Most critical life-safety action for Khed Industrial Zone response",
    "IMMEDIATE: Evacuation perimeter and shelter-in-place instructions",
    "URGENT: HazMat or fire brigade coordination — nearest station and ETA",
    "URGENT: Khed District Hospital notification and mutual aid activation",
    "COORDINATE: Traffic diversion on NH-48 and surrounding roads"
  ],
  "estimatedTimeToImpact": {
    "immediate": "Specific hazard zone and population at risk in next 0-2 hours",
    "shortTerm": "Chemical plume spread, hospital overload, or road closure status in 2-6 hours",
    "longTerm": "Environmental contamination, displaced residents, or infrastructure damage in 6-24 hours"
  }
}

Be specific to Khed industrial geography. Reference MIDC Khed, NH-48, Khed District Hospital, Chemical Plant Unit-3. Return ONLY valid JSON.`;
}

function buildSimulationPromptFlood(condition) {
  return `You are the CivicAI Decision Engine for Khed Municipality urban risk intelligence.

SIMULATION REQUEST — FLOOD RISK SCENARIO
Location context: Khed Taluka, Maharashtra, India. Key zones: Bhima River (flood stage 5.5m), Riverside Colony, Wards 4/7/9, Ward 7 electrical substation, Station Road bridge, Khed High School shelter.
User-reported condition: "${condition}"

Simulate the urban flood cascade for Khed Taluka. Predict the multi-system impact of this rainfall/flood condition.
Return ONLY a valid JSON object with these exact fields:

{
  "predictedEventChain": [
    "Step 1 (0-30 min): Specific Bhima River gauge level and drainage status",
    "Step 2 (30-90 min): Which Khed wards begin flooding and drainage overflow",
    "Step 3 (90-180 min): Road impassability, power substation risk, evacuation trigger",
    "Step 4 (180+ min): Mass evacuation requirement and infrastructure failure if no action"
  ],
  "cascadingImpacts": [
    "Riverside Colony inundation — number of residents at risk and water depth estimate",
    "Ward 7 substation submersion — district-wide power outage risk",
    "All arterial roads impassable — emergency access cut off",
    "Bhima River dam pressure — controlled release impact on river levels",
    "Water treatment disruption — residents without potable water"
  ],
  "riskLevel": "Moderate" | "High" | "Critical",
  "confidenceScore": 83,
  "recommendedActions": [
    "IMMEDIATE: Begin evacuation of Riverside Colony — named shelter and resident count",
    "IMMEDIATE: Pre-position rescue boats at Bhima River Ghat",
    "URGENT: Notify Ward 7 substation operator for planned shutdown",
    "URGENT: Close Station Road bridge and redirect traffic via Bypass Road",
    "COORDINATE: Activate Khed High School emergency shelter — capacity 400"
  ],
  "estimatedTimeToImpact": {
    "immediate": "Bhima River level and ward flooding status in next 0-2 hours",
    "shortTerm": "Substation risk, road closures, evacuation status in 2-6 hours",
    "longTerm": "Power outage duration, water supply disruption, recovery timeline in 6-24 hours"
  }
}

Be specific to Khed Taluka flood geography. Reference Bhima River, Riverside Colony, Wards 4/7/9, Station Road, Khed High School. Return ONLY valid JSON.`;
}

function buildSimulationPromptCustom(condition) {
  return `You are the CivicAI Decision Engine for Khed Municipality urban risk intelligence.

SIMULATION REQUEST — CUSTOM EVENT SCENARIO
Location context: Khed Town, Maharashtra, India.
User-reported condition: "${condition}"

Simulate the urban risk cascade for Khed Municipality based on this custom event. Identify likely cascading city-system impacts.
Return ONLY a valid JSON object with these exact fields:

{
  "predictedEventChain": [
    "Step 1: Most immediate effect of this event in Khed urban context",
    "Step 2: Secondary impact on transport, health, or infrastructure systems",
    "Step 3: Cascading effect on public safety or city operations",
    "Step 4: Worst-case outcome if no intervention is taken"
  ],
  "cascadingImpacts": [
    "Impact on Khed road network or traffic flow",
    "Impact on emergency response capacity (hospital, fire, police)",
    "Impact on affected population — estimated residents or workers",
    "Environmental or infrastructure damage risk",
    "Secondary risk if initial event escalates"
  ],
  "riskLevel": "Low" | "Moderate" | "High" | "Critical",
  "confidenceScore": 70,
  "recommendedActions": [
    "Action 1 — most critical immediate step for Khed municipal authorities",
    "Action 2 — resource deployment or coordination required",
    "Action 3 — public communication or advisory",
    "Action 4 — preventive measure to limit escalation"
  ],
  "estimatedTimeToImpact": {
    "immediate": "What will unfold in Khed in the next 0-2 hours",
    "shortTerm": "How the situation evolves in 2-6 hours without intervention",
    "longTerm": "Likely outcome in 6-24 hours if the event is left unmanaged"
  }
}

Be specific and grounded in Khed town context. Return ONLY valid JSON.`;
}

// ── Scenario-specific simulation fallbacks ────────────────────────────────

const SIMULATION_FALLBACKS = {
  traffic: {
    predictedEventChain: [
      "Step 1 (0-15 min): Congestion builds at Khed Bus Stand — average speed drops below 10 km/h on Main Road",
      "Step 2 (15-45 min): Vehicles spill onto Market Junction — signal failure risk increases at Central Road",
      "Step 3 (45-90 min): Ambulance route blocked on Central Road — Khed District Hospital response time increases by 18 min",
      "Step 4 (90+ min): City-wide gridlock if no traffic management deployed at NH-48 entry",
    ],
    cascadingImpacts: [
      "Emergency vehicle access blocked on Central Road — delayed response to Hospital",
      "MSRTC bus routes 4, 7, 9 severely delayed — 6,000+ daily commuters affected",
      "Market area commercial losses — Main Market Road at standstill",
      "Road surface damage risk if waterlogging persists beyond 2 hours",
      "Pedestrian spillover onto carriageway — accident risk at Bus Stand crossing",
    ],
    riskLevel: "Moderate",
    confidenceScore: 74,
    recommendedActions: [
      "Deploy traffic personnel immediately to Market Junction and Bus Stand Entrance",
      "Activate alternate route: NH-48 Bypass → Station Road for through traffic",
      "Coordinate with MSRTC bus depot to hold buses until congestion clears",
      "Issue public advisory via Khed Municipal WhatsApp and local FM radio",
    ],
    estimatedTimeToImpact: {
      immediate: "Bus Stand and Market Junction congested — Central Road ambulance access at risk within 30 minutes",
      shortTerm: "If signal failure occurs at Market Junction, expect full gridlock spreading to NH-48 entry by hour 3",
      longTerm: "Road surface weakening under standing vehicles — pothole risk increases significantly after 6 hours",
    },
  },

  industrial: {
    predictedEventChain: [
      "Step 1 (0-10 min): Hazardous material release detected at Khed MIDC industrial zone — alarm triggered",
      "Step 2 (10-30 min): Fire or chemical plume spreads within 250m radius — workers on Plant Floor B evacuating",
      "Step 3 (30-60 min): NH-48 Entry Point blocked by emergency vehicles — chlorine/toxic gas drifting NE toward residential area",
      "Step 4 (60-120 min): Khed District Hospital surge — 15-20 admissions; ICU nearing capacity without mutual aid",
    ],
    cascadingImpacts: [
      "Toxic chemical plume — 500m residential area at risk based on NE wind drift from MIDC",
      "NH-48 and Plant Access Road blocked — emergency vehicles from Pune delayed by 40 minutes",
      "Khed District Hospital surge — estimated 15-20 acute cases; ICU capacity at risk",
      "Air quality deterioration — PM2.5 and chlorine levels dangerous in Ward 3 and 4",
      "Secondary explosion risk — Chemical Plant storage tanks B4/B5 in proximity to fire source",
    ],
    riskLevel: "Critical",
    confidenceScore: 87,
    recommendedActions: [
      "IMMEDIATE: Establish 750m exclusion zone around Chemical Plant Unit-3 — evacuate all within 500m",
      "IMMEDIATE: Issue shelter-in-place advisory for Ward 3, 4 residents — close windows, seal doors",
      "URGENT: Notify Khed Fire Station (1.8 km) and request Hadapsar HazMat team (6.2 km)",
      "URGENT: Activate Khed District Hospital mutual aid — notify Pune Civil Hospital (8.5 km)",
      "COORDINATE: Deploy decontamination corridor at NH-48 Entry Point before Pune units arrive",
    ],
    estimatedTimeToImpact: {
      immediate: "250m exclusion zone insufficient — plume reaching Ward 4 boundary within 45 minutes",
      shortTerm: "Hospital ICU at capacity if more than 12 admissions in first 2 hours — mutual aid required by hour 3",
      longTerm: "Air quality recovery takes 12-18 hours — environmental contamination assessment needed within 24 hours",
    },
  },

  flood: {
    predictedEventChain: [
      "Step 1 (0-30 min): Bhima River gauge rising — Wards 4, 7, 9 drainage systems at 90% capacity",
      "Step 2 (30-90 min): Riverside Colony roads begin flooding — 340 residents in direct inundation zone",
      "Step 3 (90-180 min): Station Road bridge impassable — Ward 7 substation at submersion risk, power outage imminent",
      "Step 4 (180+ min): All 4 arterial roads impassable — mass evacuation of 2,400 residents required, rescue boats needed",
    ],
    cascadingImpacts: [
      "Riverside Colony inundation — 340 residents stranded, water depth estimated 0.8-1.2m in low-lying areas",
      "Ward 7 electrical substation submersion — district-wide outage affecting 18,000 residents",
      "All 4 arterial roads cut off — emergency vehicle access to flood zone lost completely",
      "Dam controlled release adds 2,400 cusecs — river level rises faster than natural recession",
      "Khed water treatment plant disruption — potable water supply interrupted for up to 72 hours",
    ],
    riskLevel: "Critical",
    confidenceScore: 85,
    recommendedActions: [
      "IMMEDIATE: Begin Riverside Colony evacuation — move 340 residents to Khed High School (capacity 400) NOW",
      "IMMEDIATE: Pre-position 2 rescue boats at Bhima River Ghat within 30 minutes",
      "URGENT: Notify Ward 7 substation operator — initiate planned controlled shutdown sequence",
      "URGENT: Close Station Road bridge — redirect all traffic via NH-48 Bypass Road",
      "COORDINATE: Activate Khed High School and Municipal Community Hall emergency shelters",
    ],
    estimatedTimeToImpact: {
      immediate: "Bhima River will reach 4.8m warning stage within 30-45 minutes — Riverside Colony flooding starts within 90 minutes",
      shortTerm: "Ward 7 substation at risk of submersion by hour 3 — initiate controlled shutdown within 2 hours",
      longTerm: "Power restoration requires 24-48 hours — water treatment disruption means potable water shortage for 18,000 residents",
    },
  },

  custom: {
    predictedEventChain: [
      "Step 1: Event triggers immediate impact on nearest Khed municipal infrastructure or population",
      "Step 2: Secondary effect cascades to transport network or emergency response systems",
      "Step 3: Public safety risk emerges — affected population requires advisory or evacuation",
      "Step 4: Escalation to city-wide emergency if no intervention within 2 hours",
    ],
    cascadingImpacts: [
      "Khed road network disruption — key junction or arterial affected",
      "Emergency response capacity reduced — hospital or fire station response delayed",
      "Affected population at risk — estimate 500-2,000 residents depending on event scale",
      "Infrastructure damage risk — electrical, water, or road systems at risk",
      "Secondary hazard if primary event is not contained in first hour",
    ],
    riskLevel: "Moderate",
    confidenceScore: 65,
    recommendedActions: [
      "Activate Khed Municipal Emergency Operations Center for real-time coordination",
      "Deploy available emergency resources to most affected area — stage at nearest station",
      "Issue public advisory via municipal channels — specify safety instructions",
      "Pre-notify Khed District Hospital for potential surge readiness",
    ],
    estimatedTimeToImpact: {
      immediate: "Situation developing in Khed — monitor closely and deploy first responders",
      shortTerm: "Cascading impacts likely within 2-6 hours if primary event is not contained",
      longTerm: "Full recovery timeline 6-24 hours — dependent on scale and response speed",
    },
  },
};

/**
 * Simulate a custom event scenario based on user input
 *
 * @param {string} eventType - "traffic" | "industrial" | "flood" | "custom"
 * @param {string} condition - User's condition description
 */
export async function simulateScenario(eventType, condition) {
  // Pick the right prompt builder based on eventType
  const promptBuilders = {
    traffic:    buildSimulationPromptTraffic,
    industrial: buildSimulationPromptIndustrial,
    flood:      buildSimulationPromptFlood,
    custom:     buildSimulationPromptCustom,
  };

  const buildPrompt = promptBuilders[eventType] || buildSimulationPromptCustom;
  const simulationPrompt = buildPrompt(condition);
  const simulationFallback = SIMULATION_FALLBACKS[eventType] || SIMULATION_FALLBACKS.custom;

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: simulationPrompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1400 },
      }),
    });

    if (!res.ok) {
      console.warn("Gemini API error:", res.status, await res.text());
      return simulationFallback;
    }

    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const clean = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

    try {
      const parsed = JSON.parse(clean);
      return { ...parsed, _eventType: eventType };
    } catch {
      console.warn("JSON parse failed. Raw:", clean.slice(0, 300));
      return simulationFallback;
    }
  } catch (err) {
    console.warn("Network error:", err.message);
    return simulationFallback;
  }
}

