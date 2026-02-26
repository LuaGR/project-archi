/**
 * Port defining what the domain needs to validate Mermaid.js syntax.
 * The infrastructure layer provides `MermaidValidatorAdapter` using the `mermaid` package's parser.
 */
export interface MermaidValidator {
    validate(mermaidCode: string): Promise<boolean>;
}
