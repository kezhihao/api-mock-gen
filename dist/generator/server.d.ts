/**
 * Mock Server Generator
 * Generates Hono-based mock server code
 */
import type { OpenAPISpec, Operation, GeneratedRoute } from '../types.js';
export declare class ServerGenerator {
    /**
     * Generate a complete mock server project
     */
    generate(parsedSpec: {
        spec: OpenAPISpec;
        operations: (Operation & {
            path: string;
        })[];
    }): {
        files: Record<string, string>;
        routes: GeneratedRoute[];
    };
    /**
     * Generate package.json
     */
    private generatePackageJson;
    /**
     * Generate tsconfig.json
     */
    private generateTsConfig;
    /**
     * Generate wrangler.toml
     */
    private generateWranglerToml;
    /**
     * Generate entry file
     */
    private generateEntryFile;
    /**
     * Generate a single route file
     */
    private generateRoute;
    /**
     * Generate mock data code
     */
    private generateMockDataCode;
    /**
     * Get mock value for a schema type
     */
    private getMockValueForType;
    /**
     * Generate TypeScript types file
     */
    private generateTypes;
    /**
     * Convert OpenAPI schema to TypeScript type
     */
    private schemaToType;
    /**
     * Get route file name from operation
     */
    private getRouteFileName;
    /**
     * Slugify a string
     */
    private slugify;
}
export declare const serverGenerator: ServerGenerator;
//# sourceMappingURL=server.d.ts.map