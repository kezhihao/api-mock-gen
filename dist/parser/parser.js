/**
 * OpenAPI Specification Parser
 */
import SwaggerParser from '@apidevtools/swagger-parser';
const { parse, validate } = SwaggerParser;
export class Parser {
    /**
     * Parse and validate an OpenAPI specification
     */
    async parse(specPath) {
        try {
            // Parse with any type to handle swagger-parser's complex types
            const spec = await parse(specPath);
            // Validate the spec
            await validate(spec);
            // Extract all operations
            const operations = [];
            for (const [path, pathItem] of Object.entries(spec.paths)) {
                const pathItemAny = pathItem;
                for (const [method, operation] of Object.entries(pathItemAny)) {
                    if (this.isOperation(method) && operation) {
                        operations.push({
                            ...operation,
                            path,
                            method: method.toUpperCase(),
                        });
                    }
                }
            }
            // Get base URL from first server or default
            const baseUrl = spec.servers?.[0]?.url || 'http://localhost:3000';
            return {
                spec,
                baseUrl,
                operations,
            };
        }
        catch (error) {
            throw new Error(`Failed to parse OpenAPI spec: ${error instanceof Error ? error.message : error}`);
        }
    }
    /**
     * Check if a method is a valid HTTP operation
     */
    isOperation(method) {
        return ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace'].includes(method);
    }
    /**
     * Get operation ID or generate one from path and method
     */
    getOperationId(operation) {
        if (operation.operationId) {
            return operation.operationId;
        }
        // Generate from path and method
        const pathParts = operation.path
            .split('/')
            .filter(p => p && !p.startsWith('{'))
            .map(p => p.charAt(0).toUpperCase() + p.slice(1));
        return operation.method.toLowerCase() + pathParts.join('');
    }
}
export const parser = new Parser();
//# sourceMappingURL=parser.js.map