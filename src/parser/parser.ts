/**
 * OpenAPI Specification Parser
 */

import SwaggerParser from '@apidevtools/swagger-parser';
import type { OpenAPISpec, Operation, ParsedSpec, SecurityRequirementObject } from '../types.js';

const { parse, validate } = SwaggerParser;

export class Parser {
  /**
   * Parse and validate an OpenAPI specification
   */
  async parse(specPath: string): Promise<ParsedSpec> {
    try {
      // Parse with any type to handle swagger-parser's complex types
      const spec: any = await parse(specPath);

      // Validate the spec
      await validate(spec);

      // Extract all operations
      const operations: Operation[] = [];
      for (const [path, pathItem] of Object.entries(spec.paths)) {
        const pathItemAny = pathItem as any;
        for (const [method, operation] of Object.entries(pathItemAny)) {
          if (this.isOperation(method) && operation) {
            operations.push({
              ...operation,
              path,
              method: method.toUpperCase(),
            } as Operation & { path: string; method: string });
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
    } catch (error) {
      throw new Error(`Failed to parse OpenAPI spec: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Check if a method is a valid HTTP operation
   */
  private isOperation(method: string): boolean {
    return ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace'].includes(method);
  }

  /**
   * Get operation ID or generate one from path and method
   */
  getOperationId(operation: Operation & { path: string; method: string }): string {
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
