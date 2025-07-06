import { describe, it, expect } from 'vitest';
import { calculateTotal } from './calculateTotal';

describe('calculateTotal', () => {
    it('should sum numbers separated by commas', () => {
        const input = '1, 2, 3, 4';
        const result = calculateTotal(input);
        expect(result).toBe(10);
    });

    it('should sum numbers separated by new lines', () => {
        const input = '1\n2\n3\n4';
        const result = calculateTotal(input);
        expect(result).toBe(10);
    });

    it('should sum numbers separated by mixed commas and new lines', () => {
        const input = '1, 2\n3, 4';
        const result = calculateTotal(input);
        expect(result).toBe(10);
    });

    it('should handle Windows line endings (\\r\\n)', () => {
        const input = '1\r\n2\r\n3\r\n4';
        const result = calculateTotal(input);
        expect(result).toBe(10);
    });

    it('should ignore empty entries', () => {
        const input = '1, , 2,\n3,,4';
        const result = calculateTotal(input);
        expect(result).toBe(10);
    });

    it('should ignore non-numeric entries', () => {
        const input = '1, abc, 2, 3, def, 4';
        const result = calculateTotal(input);
        expect(result).toBe(10);
    });

    it('should handle decimal numbers', () => {
        const input = '1.5, 2.5, 3.5, 2.5';
        const result = calculateTotal(input);
        expect(result).toBe(10);
    });

    it('should return 0 for empty string', () => {
        const input = '';
        const result = calculateTotal(input);
        expect(result).toBe(0);
    });

    it('should return 0 for string with no valid numbers', () => {
        const input = 'abc, def, xyz';
        const result = calculateTotal(input);
        expect(result).toBe(0);
    });

    it('should handle trailing separators', () => {
        const input = '1, 2, 3, 4,';
        const result = calculateTotal(input);
        expect(result).toBe(10);
    });

    it('should handle leading separators', () => {
        const input = ', 1, 2, 3, 4';
        const result = calculateTotal(input);
        expect(result).toBe(10);
    });
});