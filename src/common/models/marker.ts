export type Marker = {
  type: number;
  position: number[];
  direction?: number[];
  rotation?: number[];
  scale: number[];
  color: number[];
  bobbing: boolean;
  facesPlayer: boolean;
  rotates: boolean;
  textureDictionary?: string;
  textureName?: string;
};
