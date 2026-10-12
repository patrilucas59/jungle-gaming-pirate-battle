import { useEffect, useRef, useState } from "react";
import type { GameSession } from "../game/GameSession";
import type { GameTextures } from "../render/textures";
import type { HudSnapshot } from "../game/hud";
import { GameCanvas } from "./GameCanvas";
import { Hud } from "./Hud";
import { PauseDialog } from "./PauseDialog";
import { ResultDialog } from "./ResultDialog";
import type { GameplayConfig } from "../config/gameplay";

interface MatchScreenProps {
  textures: GameTextures;
  config: GameplayConfig;
  onPlayAgain: () => void;
  onMainMenu: () => void;
  onMatchEnd: (hud: HudSnapshot) => void; 
}

export function MatchScreen({ textures, config, onPlayAgain, onMainMenu, onMatchEnd }: MatchScreenProps) {
  const sessionRef = useRef<GameSession | null>(null);
  const reportedRef = useRef(false);
  const [hud, setHud] = useState<HudSnapshot | null>(null);

  useEffect(() => {
    if (hud?.status !== 'ended' || reportedRef.current) return;
    reportedRef.current = true;
    onMatchEnd(hud);
  }, [hud, onMatchEnd]);

  return (
    <>
      <GameCanvas textures={textures} config={config} onHudChange={setHud} sessionRef={sessionRef} />
      {hud && <Hud hud={hud}/>}
      {hud?.status === "paused" && (
        <PauseDialog onResume={() => sessionRef.current?.resume()} onQuit={onMainMenu} />
      )}
      {hud?.status === 'ended' && (
        <ResultDialog hud={hud} onPlayAgain={onPlayAgain} onMainMenu={onMainMenu} />
      )}    
    </>
  )
}