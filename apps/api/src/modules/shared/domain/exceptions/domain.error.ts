/**
 * Base class for all domain-specific errors in this application.
 * Subclasses provide semantic meaning (e.g. `DocumentNotFoundError`) and
 * a `statusCode` that `error-mapper.ts` uses to produce the correct HTTP response.
 *
 * `Object.setPrototypeOf` is required because TypeScript compiles `class Foo extends Error`
 * in a way that breaks the `instanceof` chain in some Node.js environments.
 */
export abstract class DomainError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
    ) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}