import { readJson, writeJson } from "../storage/storage";

export type NetworkScenario =
  | 'success'
  | 'empty'
  | 'slow'
  | 'server-error'
  | 'register-timeout';

export const NETWORK_SCENARIOS: readonly { id: NetworkScenario; label: string }[] = [
  { id: 'success', label: 'Success' },
  { id: 'empty', label: 'Empty lists' },
  { id: 'slow', label: 'Slow network (2 s)' },
  { id: 'server-error', label: 'Server error (500)' },
  { id: 'register-timeout', label: 'Timeout after saving a match' },
];

const STORAGE_KEY = 'pirate-battle:mock-scenario:v1';

export function getScenario(): NetworkScenario {
  const value = readJson(STORAGE_KEY);
  const match = NETWORK_SCENARIOS.find((scenario) => scenario.id === value);
  return match ? match.id : 'success';
}

export function setScenario(scenario: NetworkScenario): void {
  writeJson(STORAGE_KEY, scenario);
}