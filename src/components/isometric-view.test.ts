import { hexToRgba } from './isometric-view';

describe('Isometric View Helpers - hexToRgba', () => {
    it('should parse 6-digit hex codes correctly', () => {
        expect(hexToRgba('#ffffff', 0.5)).toBe('rgba(255, 255, 255, 0.5)');
        expect(hexToRgba('#ff0000', 1)).toBe('rgba(255, 0, 0, 1)');
        expect(hexToRgba('#00ff00', 0)).toBe('rgba(0, 255, 0, 0)');
        expect(hexToRgba('#0000ff', 0.8)).toBe('rgba(0, 0, 255, 0.8)');
    });

    it('should parse 3-digit hex codes correctly', () => {
        expect(hexToRgba('#fff', 0.5)).toBe('rgba(255, 255, 255, 0.5)');
        expect(hexToRgba('#f00', 1)).toBe('rgba(255, 0, 0, 1)');
    });

    it('should handle missing # prefix', () => {
        expect(hexToRgba('ffffff', 0.5)).toBe('rgba(255, 255, 255, 0.5)');
        expect(hexToRgba('fff', 0.5)).toBe('rgba(255, 255, 255, 0.5)');
    });

    it('should fallback to 50% grey for invalid inputs', () => {
        expect(hexToRgba('invalid', 0.5)).toBe('rgba(128, 128, 128, 0.5)');
        expect(hexToRgba('', 0.5)).toBe('rgba(128, 128, 128, 0.5)');
        expect(hexToRgba('#ffffffff', 0.5)).toBe('rgba(128, 128, 128, 0.5)'); // Too long
        // @ts-expect-error Testing invalid runtime inputs
        expect(hexToRgba(null, 0.5)).toBe('rgba(128, 128, 128, 0.5)');
    });
});
