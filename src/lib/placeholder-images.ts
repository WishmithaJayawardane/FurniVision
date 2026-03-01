import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;

export const findImageById = (id: string): ImagePlaceholder => {
    const img = PlaceHolderImages.find(p => p.id === id);
    return img || { id: 'error', description: 'Not found', imageUrl: 'https://picsum.photos/seed/error/200/200', imageHint: 'placeholder' };
}
