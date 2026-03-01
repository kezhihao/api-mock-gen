/**
 * Mock Data Generator
 * Generates realistic mock data from OpenAPI schemas
 */
import type { Schema } from '../types.js';
export declare class DataGenerator {
    private locale;
    /**
     * Generate mock data from a schema
     */
    generate(schema: Schema, path?: string): any;
    /**
     * Generate a string value
     */
    private generateString;
    /**
     * Generate a number value
     */
    private generateNumber;
    /**
     * Generate an array
     */
    private generateArray;
    /**
     * Generate an object
     */
    private generateObject;
    /**
     * Generate using faker.js method
     */
    private generateWithFaker;
    /**
     * Generate from regex pattern (simplified)
     */
    private generateFromPattern;
    /**
     * Merge schemas from allOf
     */
    private mergeSchemas;
    /**
     * Get random item from array
     */
    private randomItem;
    /**
     * Generate placeholder for unresolved refs
     */
    private generatePlaceholder;
    /**
     * Set faker locale
     */
    setLocale(locale: string): void;
}
export declare const dataGenerator: DataGenerator;
//# sourceMappingURL=data.d.ts.map