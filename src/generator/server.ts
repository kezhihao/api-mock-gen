/**
 * Mock Server Generator
 * Generates Hono-based mock server code
 */

import { dataGenerator } from './data.js';
import type { OpenAPISpec, Operation, GeneratedRoute } from '../types.js';

export class ServerGenerator {
  /**
   * Generate a complete mock server project
   */
  generate(parsedSpec: { spec: OpenAPISpec; operations: (Operation & { path: string })[] }): {
    files: Record<string, string>;
    routes: GeneratedRoute[];
  } {
    const files: Record<string, string> = {};
    const routes: GeneratedRoute[] = [];

    // Generate package.json
    files['package.json'] = this.generatePackageJson(parsedSpec.spec);
    files['tsconfig.json'] = this.generateTsConfig();
    files['wrangler.toml'] = this.generateWranglerToml();

    // Generate entry point
    const { entryCode, imports } = this.generateEntryFile(parsedSpec.operations);
    files['src/index.ts'] = entryCode;

    // Generate individual route files
    for (const operation of parsedSpec.operations) {
      const routeCode = this.generateRoute(operation);
      const routeName = this.getRouteFileName(operation);
      files[`src/routes/${routeName}.ts`] = routeCode.code;

      routes.push({
        path: operation.path || 'unknown',
        method: operation.method || 'GET',
        file: `src/routes/${routeName}.ts`,
        code: routeCode.code,
      });
    }

    // Generate types file
    files['src/types.ts'] = this.generateTypes(parsedSpec.spec);

    return { files, routes };
  }

  /**
   * Generate package.json
   */
  private generatePackageJson(spec: OpenAPISpec): string {
    return JSON.stringify({
      name: `${this.slugify(spec.info.title)}-mock-api`,
      version: '1.0.0',
      description: `Mock API server for ${spec.info.title}`,
      type: 'module',
      scripts: {
        dev: 'wrangler dev src/index.ts',
        deploy: 'wrangler deploy',
        start: 'node --watch src/index.ts',
      },
      dependencies: {
        '@faker-js/faker': '^9.0.3',
        hono: '^4.6.14',
      },
      devDependencies: {
        '@cloudflare/workers-types': '^4.20241218.0',
        wrangler: '^4.4.0',
      },
    }, null, 2);
  }

  /**
   * Generate tsconfig.json
   */
  private generateTsConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'ES2022',
        moduleResolution: 'node',
        lib: ['ES2022'],
        types: ['@cloudflare/workers-types'],
        strict: true,
        skipLibCheck: true,
      },
      include: ['src/**/*'],
    }, null, 2);
  }

  /**
   * Generate wrangler.toml
   */
  private generateWranglerToml(): string {
    return `name = "mock-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
ENVIRONMENT = "mock"
`;
  }

  /**
   * Generate entry file
   */
  private generateEntryFile(operations: (Operation & { path: string })[]): {
    entryCode: string;
    imports: string[];
  } {
    const imports: string[] = [];
    const routeRegistrations: string[] = [];

    for (const operation of operations) {
      const routeName = this.getRouteFileName(operation);
      const varName = `${routeName}Routes`;
      imports.push(`import ${varName} from './routes/${routeName}.js';`);
      routeRegistrations.push(`app.route('${operation.path}', ${varName});`);
    }

    const entryCode = `import { Hono } from 'hono';
import { cors } from 'hono/cors';

${imports.join('\n')}

const app = new Hono();

// Enable CORS
app.use('*', cors());

// Health check
app.get('/', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
${routeRegistrations.join('\n')}

export default app;
`;

    return { entryCode, imports };
  }

  /**
   * Generate a single route file
   */
  private generateRoute(operation: Operation & { path: string; method?: string }): { code: string } {
    const method = operation.method || 'get';
    const path = operation.path || '/';
    const { summary = '', description = '' } = operation;

    let code = `// ${summary || description || `${method.toUpperCase()} ${path}`}\n`;
    code += `import { Hono } from 'hono';\n`;
    code += `import { faker } from '@faker-js/faker';\n\n`;

    code += `const app = new Hono();\n\n`;

    // Generate response schema
    const successResponse = operation.responses['200'] || operation.responses['201'] || operation.responses['204'];
    if (successResponse?.content) {
      code += `// Response schema based on OpenAPI spec\n`;
    }

    // Path parameters
    const pathParams = operation.parameters?.filter(p => p.in === 'path') || [];
    const pathParamCode = pathParams.map(p => {
      const name = p.name;
      return `const ${name} = c.req.param('${name}');`;
    }).join('\n    ');

    // Query parameters
    const queryParams = operation.parameters?.filter(p => p.in === 'query') || [];

    // Response generation
    code += `app.${method.toLowerCase()}('${path}', (c) => {\n`;

    if (pathParamCode) {
      code += `    ${pathParamCode}\n`;
    }

    code += `    // Generate mock response\n`;

    // Try to generate a realistic response
    const responseContent = successResponse?.content?.['application/json'];
    if (responseContent?.schema) {
      code += `    const response = ${this.generateMockDataCode(responseContent.schema, 4)};\n`;
      code += `    return c.json(response);\n`;
    } else {
      code += `    return c.json({\n`;
      code += `        message: '${method.toUpperCase()} ${path} successful',\n`;
      code += `        timestamp: new Date().toISOString(),\n`;
      code += `    });\n`;
    }

    code += `});\n\n`;
    code += `export default app;\n`;

    return { code };
  }

  /**
   * Generate mock data code
   */
  private generateMockDataCode(schema: any, indent: number = 0): string {
    // Simplified mock data generation for code output
    if (schema.type === 'object' && schema.properties) {
      const props = Object.entries(schema.properties).map(([name, prop]: [string, any]) => {
        const value = this.getMockValueForType(prop);
        return `${' '.repeat(indent)}${name}: ${value},`;
      });
      return `{\n${props.join('\n')}\n${' '.repeat(indent - 4)}}`;
    }

    if (schema.type === 'array' && schema.items) {
      return `[\n${' '.repeat(indent)}${this.generateMockDataCode(schema.items, indent)},\n${' '.repeat(indent - 4)}]`;
    }

    return JSON.stringify(this.getMockValueForType(schema));
  }

  /**
   * Get mock value for a schema type
   */
  private getMockValueForType(schema: any): string {
    if (schema.example) return JSON.stringify(schema.example);

    const type = schema.type || 'string';
    const format = schema.format || '';

    switch (type) {
      case 'string':
        switch (format) {
          case 'email': return '"user@example.com"';
          case 'uri':
          case 'url': return '"https://example.com"';
          case 'uuid': return '"123e4567-e89b-12d3-a456-426614174000"';
          case 'date': return '"2024-01-01"';
          case 'date-time': return '"2024-01-01T00:00:00Z"';
          default: return '"example string"';
        }
      case 'number':
      case 'integer':
        return '42';
      case 'boolean':
        return 'true';
      case 'array':
        return '[]';
      case 'object':
        return '{}';
      default:
        return 'null';
    }
  }

  /**
   * Generate TypeScript types file
   */
  private generateTypes(spec: OpenAPISpec): string {
    let code = `// Auto-generated TypeScript types for ${spec.info.title}\n\n`;

    if (spec.components?.schemas) {
      for (const [name, schema] of Object.entries(spec.components.schemas)) {
        code += `export interface ${name} {\n`;
        if (schema.properties) {
          for (const [propName, propSchema] of Object.entries(schema.properties)) {
            const isRequired = schema.required?.includes(propName);
            const tsType = this.schemaToType(propSchema);
            code += `  ${propName}${isRequired ? '' : '?'}: ${tsType};\n`;
          }
        }
        code += `}\n\n`;
      }
    }

    return code;
  }

  /**
   * Convert OpenAPI schema to TypeScript type
   */
  private schemaToType(schema: any): string {
    if (schema.$ref) {
      const refName = schema.$ref.replace('#/components/schemas/', '');
      return refName;
    }

    const type = schema.type || 'any';

    switch (type) {
      case 'string':
        return 'string';
      case 'number':
      case 'integer':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'array':
        const itemType = schema.items ? this.schemaToType(schema.items) : 'any';
        return `${itemType}[]`;
      case 'object':
        return 'Record<string, any>';
      default:
        return 'any';
    }
  }

  /**
   * Get route file name from operation
   */
  private getRouteFileName(operation: Operation & { path: string; method?: string }): string {
    const pathParts = operation.path
      .split('/')
      .filter(p => p && !p.startsWith('{'))
      .map(p => p.toLowerCase().replace(/[^a-z0-9]/g, '-'));

    const method = (operation.method || 'get').toLowerCase();

    if (pathParts.length === 0) {
      return 'index';
    }

    return `${method}-${pathParts.join('-')}`;
  }

  /**
   * Slugify a string
   */
  private slugify(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

export const serverGenerator = new ServerGenerator();
