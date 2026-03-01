import type { Furniture, FurnitureType } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const findImage = (id: string) => {
  const img = PlaceHolderImages.find(p => p.id === id);
  return img || { imageUrl: 'https://picsum.photos/seed/error/200/200', imageHint: 'placeholder' };
}

const availableFurniture: Omit<Furniture, 'id' | 'x' | 'y' | 'rotation'>[] = [
    { name: 'Comfy Sofa', type: 'Sofa', width: 84, depth: 38, height: 32, color: '#3b82f6', material: 'Fabric', style: 'Modern', hasShadow: false, ...findImage('furniture-sofa'), price: 799.99, description: 'A plush and comfortable sofa for modern living spaces.' },
    { name: 'Stylish Armchair', type: 'Armchair', width: 30, depth: 32, height: 35, color: '#f59e0b', material: 'Leather', style: 'Mid-century', hasShadow: false, ...findImage('furniture-armchair'), price: 349.50, description: 'A statement armchair with a mid-century modern aesthetic.' },
    { name: 'Family Dining Table', type: 'Dining Table', width: 72, depth: 36, height: 30, color: '#d2b48c', material: 'Oak Wood', style: 'Rustic', hasShadow: false, ...findImage('furniture-dining-table'), price: 620.00, description: 'A large, sturdy dining table for family gatherings.' },
    { name: 'Small Side Table', type: 'Side Table', width: 20, depth: 18, height: 24, color: '#ffffff', material: 'Wood', style: 'Contemporary', hasShadow: false, ...findImage('furniture-side-table'), price: 125.00, description: 'A versatile and compact side table.' },
    { name: 'Queen Size Bed', type: 'Bed', width: 62, depth: 82, height: 48, color: '#a5b4fc', material: 'Upholstered', style: 'Modern', hasShadow: false, ...findImage('furniture-bed'), price: 950.00, description: 'A comfortable and stylish queen size bed frame.' },
    { name: 'Large Area Rug', type: 'Rug', width: 96, depth: 120, height: 1, color: '#9ca3af', material: 'Wool', style: 'Modern', hasShadow: false, ...findImage('furniture-rug'), price: 250.00, description: 'A soft wool rug to tie your room together.' },
    { name: 'Arc Floor Lamp', type: 'Lamp', width: 12, depth: 12, height: 72, color: '#111827', material: 'Metal', style: 'Industrial', hasShadow: false, ...findImage('furniture-lamp'), price: 180.75, description: 'An industrial-style arc lamp to illuminate your space.' },
]

export function getAvailableFurniture(): Omit<Furniture, 'id' | 'x' | 'y' | 'rotation'>[] {
    return availableFurniture;
}

export function getFurnitureIcon(type: FurnitureType) {
    const icons = {
        'Sofa': 'Sofa',
        'Dining Table': 'Table2',
        'Armchair': 'Armchair',
        'Side Table': 'RectangleHorizontal',
        'Bed': 'BedDouble',
        'Rug': 'RectangleHorizontal',
        'Lamp': 'LampFloor'
    };
    return icons[type] || 'Box';
}
