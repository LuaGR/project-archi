import { describe, expect, it } from 'vitest';
import { DomainError } from '@shared/domain/index.js';
import { DocumentNotFoundError, InvalidMermaidSyntaxError, LLMProviderUnavailableError } from './index.js';

describe('InvalidMermaidSyntaxError', () => {
    it('should have statusCode 400', () => {
        const error = new InvalidMermaidSyntaxError('unexpected token at line 3');
        expect(error.statusCode).toBe(400);
    });

    it('should include the validation error in the message', () => {
        const error = new InvalidMermaidSyntaxError('unexpected token at line 3');
        expect(error.message).toContain('unexpected token at line 3');
    });

    it('should extend DomainError and Error', () => {
        const error = new InvalidMermaidSyntaxError('bad syntax');
        expect(error).toBeInstanceOf(DomainError);
        expect(error).toBeInstanceOf(Error);
    });
});

describe('DocumentNotFoundError', () => {
    it('should have statusCode 404', () => {
        const error = new DocumentNotFoundError('VPC architecture');
        expect(error.statusCode).toBe(404);
    });

    it('should include the query in the message', () => {
        const error = new DocumentNotFoundError('VPC architecture');
        expect(error.message).toContain('VPC architecture');
    });

    it('should extend DomainError and Error', () => {
        const error = new DocumentNotFoundError('query');
        expect(error).toBeInstanceOf(DomainError);
        expect(error).toBeInstanceOf(Error);
    });
});

describe('LLMProviderUnavailableError', () => {
    it('should have statusCode 502', () => {
        const error = new LLMProviderUnavailableError();
        expect(error.statusCode).toBe(502);
    });

    it('should work without a cause', () => {
        const error = new LLMProviderUnavailableError();
        expect(error.message).toBeDefined();
    });

    it('should include the cause in the message when provided', () => {
        const error = new LLMProviderUnavailableError('rate limit exceeded');
        expect(error.message).toContain('rate limit exceeded');
    });

    it('should extend DomainError and Error', () => {
        const error = new LLMProviderUnavailableError();
        expect(error).toBeInstanceOf(DomainError);
        expect(error).toBeInstanceOf(Error);
    });
});
