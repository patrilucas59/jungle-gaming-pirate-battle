import { useState, type FormEvent  } from "react";
import { OPTION_LIMITS, validateOptions, type GameOptions, type OptionErrors } from "../storage/options";

interface OptionsScreenProps {
  options: GameOptions;
  onSave: (options: GameOptions) => void;
  onBack: () => void;
}

export function OptionsScreen({ options, onSave, onBack }: OptionsScreenProps) {
  const [duration, setDuration] = useState(String(options.durationSeconds));
  const [spawn, setSpawn] = useState(String(options.spawnIntervalSeconds));
  const [errors, setErrors] = useState<OptionErrors>({});
  const [saved, setSaved] = useState(false);
  const durationLimits = OPTION_LIMITS.durationSeconds;
  const spawnLimits = OPTION_LIMITS.spawnIntervalSeconds;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: GameOptions = {
      durationSeconds: Number(duration),
      spawnIntervalSeconds: Number(spawn),
    };
    const found = validateOptions(next);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setSaved(false);
      return;
    }
    onSave(next);
    setSaved(true);
  };

  return (
    <main className="menu">
      <h1 className="menu__title">Options</h1>
      <form className="options" onSubmit={handleSubmit} noValidate>
        <label htmlFor="duration">Game session time (seconds)</label>
        <input
          id="duration"
          type="number"
          inputMode="numeric"
          min={durationLimits.min}
          max={durationLimits.max}
          step={durationLimits.step}
          value={duration}
          onChange={(event) => {
            setDuration(event.target.value);
            setSaved(false);
          }}
          aria-invalid={Boolean(errors.durationSeconds)}
          aria-describedby="duration-hint duration-error"
          autoFocus
        />
        <p id="duration-hint" className="field__hint">
          Between {durationLimits.min} and {durationLimits.max} seconds.
        </p>
        {errors.durationSeconds && (
          <p id="duration-error" className="field__error" role="alert">
            {errors.durationSeconds}
          </p>
        )}

        <label htmlFor="spawn">Enemy spawn time (seconds)</label>
        <input
          id="spawn"
          type="number"
          inputMode="decimal"
          min={spawnLimits.min}
          max={spawnLimits.max}
          step={spawnLimits.step}
          value={spawn}
          onChange={(event) => {
            setSpawn(event.target.value);
            setSaved(false);
          }}
          aria-invalid={Boolean(errors.spawnIntervalSeconds)}
          aria-describedby="spawn-hint spawn-error"
        />
        <p id="spawn-hint" className="field__hint">
          Between {spawnLimits.min} and {spawnLimits.max} seconds. Lower means more enemies.
        </p>
        {errors.spawnIntervalSeconds && (
          <p id="spawn-error" className="field__error" role="alert">
            {errors.spawnIntervalSeconds}
          </p>
        )}

        <p className="field__status" role="status">
          {saved ? 'Options saved. They apply to your next match.' : ''}
        </p>

        <div className="options__actions">
          <button type="submit">Save</button>
          <button type="button" className="button--secondary" onClick={onBack}>
            Back
          </button>
        </div>
      </form>
    </main>
  );
}