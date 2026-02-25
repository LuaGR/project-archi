import { describe, expect, it } from 'vitest';
import { DomainError } from './domain.error.js';

class TestDomainError extends DomainError {
    constructor(message: string, statusCode: number) {
        super(message, statusCode);
    }
}

describe('DomainError', () => {
    it('should be an instance of Error', () => {
        const error = new TestDomainError('Something went wrong', 400);
        expect(error).toBeInstanceOf(Error);
    });

    it('should be an instance of DomainError', () => {
        const error = new TestDomainError('Something went wrong', 400);
        expect(error).toBeInstanceOf(DomainError);
    });

    it('should store the correct message', () => {
        const error = new TestDomainError('Domain logic failed', 422);
        expect(error.message).toBe('Domain logic failed');
    });

    it('should store the correct statusCode', () => {
        const error = new TestDomainError('Not found', 404);
        expect(error.statusCode).toBe(404);
    });

    it('should set name to the subclass name', () => {
        const error = new TestDomainError('Test', 500);
        expect(error.name).toBe('TestDomainError');
    });

    it('should support instanceof checks through the prototype chain', () => {
        const error = new TestDomainError('Test', 400);

        expect(error instanceof TestDomainError).toBe(true);
        expect(error instanceof DomainError).toBe(true);
        expect(error instanceof Error).toBe(true);
    });

    it('should have a stack trace', () => {
        const error = new TestDomainError('Test', 500);
        expect(error.stack).toBeDefined();
    });
});