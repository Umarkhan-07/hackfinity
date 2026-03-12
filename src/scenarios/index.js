import { trafficScenario } from "./trafficScenario";
import { factoryScenario } from "./factoryScenario";
import { floodScenario }   from "./floodScenario";

// New graph data from src/data/
import trafficGraph from "../data/traffic.json";
import factoryGraph from "../data/factory.json";
import floodGraph   from "../data/flood.json";

export const SCENARIOS = [
  {
    id:        "traffic",
    label:     "Traffic Scenario",
    category:  "Frequent Event",
    color:     "#F59E0B",
    data:      trafficScenario,   // rich table data {time, event, location, value}
    graphData: trafficGraph,      // graph data {category, events, edges}
  },
  {
    id:        "factory",
    label:     "Factory Accident Scenario",
    category:  "Rare Event",
    color:     "#EF4444",
    data:      factoryScenario,
    graphData: factoryGraph,
  },
  {
    id:        "flood",
    label:     "Flood Risk Scenario",
    category:  "Predictive Risk Event",
    color:     "#3B82F6",
    data:      floodScenario,
    graphData: floodGraph,
  },
];
