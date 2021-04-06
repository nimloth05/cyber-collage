export class SoundDatabase {
  static readonly SOUND_FILES = [
    {
      value: "/sounds/snare-drum.mp3",
      label: "Snare drum",
    },
    {
      value: "/sounds/piano-C4.wav",
      label: "Piano, C4",
    },
    {
      value: "/sounds/flute-C4.wav",
      label: "Flöte, C4",
    },
    {
      value: "/sounds/trumpet-C4.wav",
      label: "Trompete, C4",
    },
    {
      value: "/sounds/violin-C4.wav",
      label: "Violine, C4",
    },
  ];

  static getName(value: string): string {
    return this.SOUND_FILES.find(it => it.value === value)?.label ?? value;
  }
}
