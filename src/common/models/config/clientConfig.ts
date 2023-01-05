import { Blip } from '../blip';
import { Marker } from '../marker';
import { Car } from '../car';

export type Language = 'en' | 'de';

export type Client = {
  blips: Blip[];
  markers: Marker[];
  language: Language;
  cars: Car[];
};
