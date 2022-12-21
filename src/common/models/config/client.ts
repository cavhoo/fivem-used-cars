import { Blip } from '../blip';
import { Marker } from '../marker';

export type Language = 'en' | 'de';

export type Client = {
  blips: Blip[];
  markers: Marker[];
  language: Language;
};
