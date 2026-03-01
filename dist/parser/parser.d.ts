/**
 * OpenAPI Specification Parser
 */
import type { Operation, ParsedSpec } from '../types.js';
export declare class Parser {
    /**
     * Parse and validate an OpenAPI specification
     */
    parse(specPath: string): Promise<ParsedSpec>;
    /**
     * Check if a method is a valid HTTP operation
     */
    private isOperation;
    /**
     * Get operation ID or generate one from path and method
     */
    getOperationId(operation: Operation & {
        path: string;
        method: string;
    }): string;
}
export declare const parser: Parser;
//# sourceMappingURL=parser.d.ts.map