import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getScenario, NETWORK_SCENARIOS, setScenario, type NetworkScenario } from "../mocks/scenarios";
import { resetMockState } from "../mocks/db";

interface NetworkScenarioPanelProps {
  onReset: () => void;
}

export function NetworkScenarioPanel({ onReset }: NetworkScenarioPanelProps) {
  const queryClient = useQueryClient();
  const [scenario, setScenarioState] = useState<NetworkScenario>(getScenario);

  const change = (next: NetworkScenario) => {
    setScenario(next);
    setScenarioState(next);
    void queryClient.invalidateQueries();
  };

  const reset = () => {
    resetMockState();
    setScenarioState('success');
    onReset();
    void queryClient.invalidateQueries();
  };

  return (
    <section className="menu__panel" aria-labelledby="network-title">
      <h2 id="network-title">Network scenario (mock API)</h2>
      <label htmlFor="network-scenario">Scenario</label>
      <select
        id="network-scenario"
        value={scenario}
        onChange={(event) => change(event.target.value as NetworkScenario)}
      >
        {NETWORK_SCENARIOS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      <button type="button" className="button--secondary" onClick={reset}>
        Reset mock data
      </button>
    </section>
  );
}