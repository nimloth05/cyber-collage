import * as Tone from "tone";
import {now} from "tone";

export class SoundSystem {
  // maintain a list of loaded players
  private readonly name2Player: Record<string, Tone.Player> = {};

  prepareSounds(fileNames: Array<string>): void {
    fileNames.forEach(it => {
      const player = this.name2Player[it];
      if (player == null) {
        // FIXME: Add log levels
        console.log(`creating player for ${it}`);
        this.name2Player[it] = new Tone.Player(it).toDestination();
      }
    });
  }

  playSound(fileName: string): void {
    const player = this.name2Player[fileName];
    if (player == null) {
      console.warn(`sound not loaded: ${fileName}`);
      return;
    }

    player.start();
  }

  stop() {
    Object.values(this.name2Player).forEach(it => {
      it.stop(now());
      it.dispose();
    });
  }
}
