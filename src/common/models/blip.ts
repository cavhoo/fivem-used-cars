export type BlipDisplay = 1 | 2 | 3 | 4 | 5 | 6;

/** Datatype describing a Blip (Graphical map marker). */
export interface Blip {
  type: number;
  display: BlipDisplay;
  label: string;
  location: number[];
  color: number;
  scale: number;
}
