export type Design = {
  id: string;
  name: string;
  designerId: string;
  room: Room;
  furniture: Furniture[];
  lastModified: string;
  imageUrl: string;
  imageHint: string;
};

export type Room = {
  width: number; // in feet
  depth: number; // in feet
  height: number; // in feet
  color: string; // hex code
  shape: 'rectangular' | 'l-shaped';
};

export type FurnitureType = 'Sofa' | 'Dining Table' | 'Armchair' | 'Side Table' | 'Bed' | 'Rug' | 'Lamp';

export type Furniture = {
  id: string;
  name: string;
  type: FurnitureType;
  width: number; // in inches
  depth: number; // in inches
  height: number; // in inches
  x: number; // position in room, in inches from top-left
  y: number; // position in room, in inches from top-left
  rotation: number; // in degrees
  color: string; // hex code
  material: string;
  style: string;
  imageUrl: string;
  imageHint: string;
  hasShadow?: boolean;
  price?: number;
  description?: string;
};
