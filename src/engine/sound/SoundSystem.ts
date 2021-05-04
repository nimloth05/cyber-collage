import * as Tone from "tone";
import {now} from "tone";
import {chain} from "lodash";
import {Interval} from "tone/build/esm/core/type/Units";
import {app} from "@/engine/app";

export type SoundOptions = {
  /**
   * file name of the sample.
   */
  fileName: string;
  /**
   * Pitch of the sound could change during runtime.
   */
  pitchModulation: boolean;
  /**
   * Id of the element requesting the sound. This id can be used to distinguish the same sound with different configurations.
   */
  id: string;
}

export class SoundSystem {
  // maintain a list of loaded players
  private id2Player: Record<string, Tone.Player> = {};
  private id2PitchShifts: Record<string, Tone.PitchShift> = {};
  private audioBuffers!: Tone.ToneAudioBuffers;

  async prepareSounds(options: Array<SoundOptions>): Promise<void> {
    this.audioBuffers = new Tone.ToneAudioBuffers();
    const promises = chain(options)
      .map(it => it.fileName)
      .uniq()
      .map(fileName => {
        const buffer = new Tone.ToneAudioBuffer();
        // FIXME: Add log levels
        console.log(`creating player for ${fileName}`);
        return buffer.load(fileName)
          .then(buffer => ({
            fileName,
            buffer,
          }));
      })
      .value();

    const loaded = await Promise.all(promises);
    loaded.forEach(it => {
      console.log("buffer", it.buffer);
      this.audioBuffers.add(it.fileName, it.buffer);
    });

    options.forEach(it => {
      const player = this.id2Player[it.id];
      if (player == null) {
        const player = new Tone.Player(this.audioBuffers.get(it.fileName));
        this.id2Player[it.id] = player;

        if (it.pitchModulation) {
          const pitchShift = new Tone.PitchShift(0);
          player.connect(pitchShift);
          pitchShift.toDestination();
          this.id2PitchShifts[it.id] = pitchShift;
        } else {
          player.toDestination();
        }
      }
    });
  }

  pitchShift(id: string, shift: Interval): void {
    const pitchShift = this.id2PitchShifts[id];
    if (pitchShift != null) {
      console.log("modify pitch", shift);
      pitchShift.pitch = shift;
    }
  }

  playSound(id: string): void {
    const player = this.id2Player[id];
    if (player == null) {
      console.warn(`sound not loaded: ${id}`);
      return;
    }
    // if (player.state === "started") {
    //   return;
    // }
    console.log("play sound with id", id);

    player.start(Tone.now());
  }

  async resetSoundContext() {
    await Tone.start();
  }

  stop() {
    Object.values(this.id2Player).forEach(it => {
      it.stop(now());
      it.dispose();
    });
    this.id2Player = {};
    this.audioBuffers.dispose();
  }

  hasSounds() {
    return Object.keys(this.id2Player).length > 0;
  }
}
