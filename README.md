# API-Mock-Gen

Generate mock REST API servers and TypeScript SDKs from OpenAPI specifications.

## Features

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

## License

MIT
