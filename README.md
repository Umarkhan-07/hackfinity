# Urban Event Intelligence Dashboard

AI-powered urban event analysis dashboard for city authorities.
Built with React + Gemini AI.

---

## Project Structure

```
urban-event-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── grokApi.js          # Grok API integration
│   ├── components/
│   │   ├── AnalysisPanel.jsx   # AI results display
│   │   ├── CausalGraph.jsx     # SVG causal chain graph
│   │   ├── EventTable.jsx      # Scenario events table
│   │   └── ScenarioSelector.jsx
│   ├── scenarios/
│   │   ├── trafficScenario.js
│   │   ├── factoryScenario.js
│   │   ├── floodScenario.js
│   │   └── index.js            # Exports all SCENARIOS array
│   ├── App.jsx                 # Root component
│   └── index.js                # React entry point
├── package.json
└── README.md
```

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Gemini API key
Open `src/api/geminiApi.js` and replace:
```js
const GEMINI_API_KEY = "your_api_key_here";
```
with your actual Gemini API key.

### 3. Run the app
```bash
npm start
```
The app opens at `http://localhost:3000`

---

## How It Works

1. Select a scenario (Traffic / Factory / Flood)
2. Scenario events load into the table
3. Events are sent to the Gemini AI engine
4. The causal graph renders the event chain
5. AI analysis appears with category-specific insights

## Event Categories

| Scenario | Category | AI Output |
|---|---|---|
| Traffic | Frequent Event | Root Cause + Permanent Solutions |
| Factory Accident | Rare / Major Event | Root Cause + Cascade Chain + Emergency Actions |
| Flood Risk | Predictive Event | Root Cause + Predictions + Risk Areas + Preventive Actions |
