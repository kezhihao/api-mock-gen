/**
 * Mock Data Generator
 * Generates realistic mock data from OpenAPI schemas
 */
import { faker } from '@faker-js/faker';
export class DataGenerator {
    locale = 'en';
    /**
     * Generate mock data from a schema
     */
    generate(schema, path = 'root') {
        // Use example if provided
        if (schema.example !== undefined) {
            return schema.example;
        }
        // Handle $ref
        if (schema.$ref) {
            // For simplicity, return a placeholder
            // Full implementation would resolve references
            return this.generatePlaceholder(schema.$ref);
        }
        // Handle allOf, oneOf, anyOf
        if (schema.allOf && schema.allOf.length > 0) {
            return this.mergeSchemas(schema.allOf);
        }
        if (schema.oneOf && schema.oneOf.length > 0) {
            return this.generate(schema.oneOf[0], path);
        }
        if (schema.anyOf && schema.anyOf.length > 0) {
            return this.generate(schema.anyOf[0], path);
        }
        // Handle enum
        if (schema.enum && schema.enum.length > 0) {
            return this.randomItem(schema.enum);
        }
        // Generate based on type
        switch (schema.type) {
            case 'string':
                return this.generateString(schema);
            case 'number':
            case 'integer':
                return this.generateNumber(schema);
            case 'boolean':
                return faker.datatype.boolean();
            case 'array':
                return this.generateArray(schema, path);
            case 'object':
                return this.generateObject(schema, path);
            default:
                return null;
        }
    }
    /**
     * Generate a string value
     */
    generateString(schema) {
        const { format } = schema;
        switch (format) {
            case 'email':
                return faker.internet.email();
            case 'uri':
            case 'url':
                return faker.internet.url();
            case 'uuid':
                return faker.string.uuid();
            case 'date':
                return faker.date.past().toISOString().split('T')[0];
            case 'date-time':
                return faker.date.recent().toISOString();
            case 'time':
                return faker.date.recent().toISOString().split('T')[1]?.split('.')[0] || '12:00:00';
            case 'byte':
                return faker.string.binary({ length: 10 });
            case 'password':
                return faker.internet.password();
            case 'ipv4':
                return faker.internet.ipv4();
            case 'ipv6':
                return faker.internet.ipv6();
            case 'hostname':
                return faker.internet.domainName();
            default:
                // Check for x-faker extension
                if (schema['x-faker']) {
                    return this.generateWithFaker(schema['x-faker']);
                }
                // Check for pattern
                if (schema.pattern) {
                    return this.generateFromPattern(schema.pattern);
                }
                // Default string based on field name context
                return faker.lorem.word();
        }
    }
    /**
     * Generate a number value
     */
    generateNumber(schema) {
        const min = schema.minimum ?? 0;
        const max = schema.maximum ?? 100;
        if (schema.type === 'integer') {
            return faker.number.int({ min, max });
        }
        return faker.number.float({ min, max });
    }
    /**
     * Generate an array
     */
    generateArray(schema, path) {
        const minItems = schema.minItems ?? 1;
        const maxItems = schema.maxItems ?? 5;
        const count = faker.number.int({ min: minItems, max: maxItems });
        return Array.from({ length: count }, (_, i) => {
            if (schema.items) {
                return this.generate(schema.items, `${path}[${i}]`);
            }
            return null;
        });
    }
    /**
     * Generate an object
     */
    generateObject(schema, path) {
        if (!schema.properties || Object.keys(schema.properties).length === 0) {
            return {};
        }
        const obj = {};
        for (const [propName, propSchema] of Object.entries(schema.properties)) {
            // Generate if not required or randomly include optional properties
            const isRequired = schema.required?.includes(propName);
            const includeOptional = isRequired || faker.datatype.boolean(0.7);
            if (includeOptional && propSchema) {
                obj[propName] = this.generate(propSchema, `${path}.${propName}`);
            }
        }
        return obj;
    }
    /**
     * Generate using faker.js method
     */
    generateWithFaker(fakerPath) {
        const parts = fakerPath.split('.');
        let value = faker;
        for (const part of parts) {
            if (value && typeof value === 'object' && part in value) {
                value = value[part];
            }
            else {
                return faker.lorem.word();
            }
        }
        return typeof value === 'function' ? value() : value;
    }
    /**
     * Generate from regex pattern (simplified)
     */
    generateFromPattern(pattern) {
        // Simplified pattern matching
        if (pattern.includes('^\\d+$'))
            return faker.string.numeric();
        if (pattern.includes('^\\w+$'))
            return faker.string.alphanumeric();
        if (pattern.includes('@'))
            return faker.internet.email();
        return faker.string.alphanumeric({ length: 10 });
    }
    /**
     * Merge schemas from allOf
     */
    mergeSchemas(schemas) {
        const merged = {};
        for (const schema of schemas) {
            if (schema.type === 'object' && schema.properties) {
                Object.assign(merged, this.generate(schema));
            }
        }
        return merged;
    }
    /**
     * Get random item from array
     */
    randomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    /**
     * Generate placeholder for unresolved refs
     */
    generatePlaceholder(ref) {
        return `REF_${ref.replace('#/components/schemas/', '')}`;
    }
    /**
     * Set faker locale
     */
    setLocale(locale) {
        this.locale = locale;
        // Note: faker 9.x uses faker.setDefaultLocale() instead
        // For now, just store the locale preference
    }
}
export const dataGenerator = new DataGenerator();
//# sourceMappingURL=data.js.map