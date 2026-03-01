/**
 * Core type definitions for API-Mock-Gen
 */

export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: Record<string, PathItem>;
  components?: {
    schemas?: Record<string, Schema>;
    securitySchemes?: Record<string, SecurityScheme>;
  };
  security?: SecurityRequirement[];
}

export interface PathItem {
  summary?: string;
  description?: string;
  parameters?: Parameter[];
  get?: Operation;
  post?: Operation;
  put?: Operation;
  delete?: Operation;
  patch?: Operation;
}

export interface Operation {
  operationId?: string;
  summary?: string;
  description?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
  tags?: string[];
  security?: SecurityRequirement[];
  // Extended properties added at runtime
  path?: string;
  method?: string;
}

export interface Parameter {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  description?: string;
  required?: boolean;
  schema: Schema;
  example?: any;
}

export interface RequestBody {
  description?: string;
  required?: boolean;
  content: Record<string, MediaType>;
}

export interface Response {
  description: string;
  content?: Record<string, MediaType>;
}

export interface MediaType {
  schema?: Schema;
  example?: any;
  examples?: Record<string, { value: any }>;
}

export interface Schema {
  type?: string;
  format?: string;
  description?: string;
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  enum?: any[];
  example?: any;
  allOf?: Schema[];
  oneOf?: Schema[];
  anyOf?: Schema[];
  $ref?: string;
  additionalProperties?: boolean | Schema;
  minItems?: number;
  maxItems?: number;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface SecurityScheme {
  type: string;
  description?: string;
  name?: string;
  in?: string;
  scheme?: string;
  bearerFormat?: string;
}

export interface SecurityRequirement {
  [key: string]: string[] | undefined;
}

export interface SecurityRequirementObject {
  [key: string]: string[];
}

export interface GeneratedServer {
  entry: string;
  routes: GeneratedRoute[];
  packageJson: any;
}

export interface GeneratedRoute {
  path: string;
  method: string;
  file: string;
  code: string;
}

export interface GeneratorOptions {
  outDir: string;
  port?: number;
  generateSdk?: boolean;
  generateDocs?: boolean;
  deploy?: boolean;
}

export interface ParsedSpec {
  spec: OpenAPISpec;
  baseUrl: string;
  operations: Operation[];
}
