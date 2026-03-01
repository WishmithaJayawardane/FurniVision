import { cn } from './utils';

describe('cn utility function', () => {
    it('should merge tailwind classes correctly', () => {
        expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
    });

    it('should handle conditional classes', () => {
        const isEditing = true;
        expect(cn('p-4', isEditing && 'border-primary', !isEditing && 'border-transparent'))
            .toBe('p-4 border-primary');
    });

    it('should resolve tailwind conflicts using tailwind-merge', () => {
        expect(cn('px-2 py-1 p-4')).toBe('p-4');
        expect(cn('text-white text-black')).toBe('text-black');
    });

    it('should ignore undefined, null, or false values', () => {
        expect(cn('flex', undefined, null, false, '', 'items-center')).toBe('flex items-center');
    });
});
