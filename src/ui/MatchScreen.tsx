import { useRef, useState } from "react";
import type { GameSession } from "../game/GameSession";
import type { GameTextures } from "../render/textures";
import type { HudSnapshot } from "../game/hud";
import { GameCanvas } from "./GameCanvas";
import { Hud } from "./Hud";
import { PauseDialog } from "./PauseDialog";
import { ResultDialog } from "./ResultDialog";

interface MatchScreenProps {
  textures: GameTextures;
  onPlayAgain: () => void;
}

export function MatchScreen({ textures, onPlayAgain }: MatchScreenProps) {
  const sessionRef = useRef<GameSession | null>(null);
  const [hud, setHud] = useState<HudSnapshot | null>(null);

  return (
    <>
      <GameCanvas textures={textures} onHudChange={setHud} sessionRef={sessionRef} />
      {hud && <Hud hud={hud}/>}
      {hud?.status === "paused" && (
        <PauseDialog onResume={() => sessionRef.current?.resume()} />
      )}
      {hud?.status === 'ended' && <ResultDialog hud={hud} onPlayAgain={onPlayAgain} />}
    </>
  )
}