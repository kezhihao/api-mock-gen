# API-Mock-Gen

> **Generate Mock REST APIs from OpenAPI in Seconds** | CLI tool - create fully functional mock servers and TypeScript SDKs from OpenAPI specs. Cloudflare Workers ready.

[![CI](https://github.com/kezhihao/api-mock-gen/actions/workflows/ci.yml/badge.svg)](https://github.com/kezhihao/api-mock-gen/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/api-mock-gen.svg)](https://www.npmjs.com/package/api-mock-gen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Generate fully functional mock REST API servers and TypeScript SDKs from OpenAPI specifications. Frontend developers can build UI without waiting for backend APIs to be implemented.

## Why API-Mock-Gen?

| Problem | Solution |
|---------|----------|
| Frontend blocked by backend API delays | Mock any API from OpenAPI spec instantly |
| Writing mock servers is tedious | One command generates a complete server |
| Type safety between frontend and backend | Auto-generate TypeScript SDKs |
| Testing with realistic data is hard | Built-in Faker.js for realistic mock data |
| Deploying mock APIs takes time | Cloudflare Workers ready, deploy in seconds |

- **OpenAPI to Mock Server**: Generate a fully functional mock API server from your OpenAPI (Swagger) specification
- **Cloudflare Workers Ready**: Outputs Hono-based servers optimized for Cloudflare Workers
- **TypeScript SDK Generation**: Generate TypeScript client SDKs for your API
- **Faker.js Integration**: Realistic mock data generation based on your schema
- **CLI Tool**: Simple command-line interface

## Installation

```bash
# Using npx (recommended)
npx api-mock-gen -i your-api-spec.yaml -o ./generated

# Or install globally
npm install -g api-mock-gen
api-mock-gen -i your-api-spec.yaml -o ./generated
```

## Usage

```bash
# Generate a mock server from OpenAPI spec
api-mock-gen -i openapi.yaml -o ./my-mock-api

# With options
api-mock-gen -i openapi.yaml -o ./my-mock-api --port 3000 --generate-sdk --generate-docs
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-i, --input` | Input OpenAPI specification file (JSON or YAML) | Required |
| `-o, --output` | Output directory | `./generated` |
| `--port` | Port for dev server | `3000` |
| `--generate-sdk` | Generate TypeScript SDK | `false` |
| `--generate-docs` | Generate API documentation | `false` |

## Output

The generator creates a complete mock server project:

```
generated/
├── package.json
├── tsconfig.json
├── wrangler.toml
└── src/
    ├── index.ts      # Entry point
    ├── types.ts      # TypeScript types
    └── routes/
        ├── get-pets.ts
        ├── post-pets.ts
        ├── get-pets-petid.ts
        └── delete-pets-petid.ts
```

## Running the Mock Server

```bash
cd generated
npm install
npm run dev    # Development: http://localhost:3000
npm run deploy # Deploy to Cloudflare Workers
```

## Example

Given an OpenAPI spec like:

```yaml
paths:
  /pets:
    get:
      operationId: listPets
      responses:
        200:
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: integer
                    name:
                      type: string
```

API-Mock-Gen generates a route that returns realistic mock data:

```typescript
app.get('/pets', (c) => {
  const response = [
    { id: 1, name: 'Fluffy' },
    { id: 2, name: 'Buddy' }
  ];
  return c.json(response);
});
```

## Use Cases

- **Frontend Development**: Develop UI without waiting for backend API
- **API Design**: Rapidly prototype and test API designs
- **Documentation**: Generate interactive API documentation
- **Integration Testing**: Test API consumers with stable mock data

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Server**: [Hono](https://hono.dev/) - ultrafast web framework for Cloudflare Workers
- **Mock Data**: [@faker-js/faker](https://fakerjs.dev/)
- **CLI**: [Commander.js](https://github.com/tj/commander.js)

## Quick Start

**Ready to mock your API?** Try it now:

```bash
npx api-mock-gen -i openapi.yaml -o ./mock-api
cd mock-api && npm install && npm run dev
```

## Real-World Scenarios

### Scenario 1: Frontend Without Backend

```bash
# Backend team provides OpenAPI spec
# Frontend team generates mock server instantly
npx api-mock-gen -i backend-api-spec.yaml -o ./mock-backend
cd mock-backend && npm run dev
# Now frontend can connect to http://localhost:3000
```

### Scenario 2: API Design First

```bash
# Design your API in OpenAPI first
# Generate mock server to validate the design
npx api-mock-gen -i api-design.yaml --generate-sdk
# Get instant feedback on API usability
```

### Scenario 3: Cloudflare Workers Deployment

```bash
# Generate and deploy to edge
npx api-mock-gen -i api.yaml -o ./workers-api
cd workers-api
npm run deploy
# Your mock API is now global on Cloudflare network
```

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## About

Built by [Auto Company](https://github.com/kezhihao) - a fully autonomous AI software company building useful developer tools.

## Keywords

api mock, mock server, openapi generator, swagger to mock, fake api, rest api mock, typescript sdk generator, cloudflare workers, hono, api testing, frontend development, api design, fake rest api, mock data generator, openapi 3.0, swagger generator, api prototyping, development tools

## License

MIT
