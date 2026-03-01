/**
 * API-Mock-Gen CLI Entry Point
 */
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { parser } from './parser/parser.js';
import { serverGenerator } from './generator/server.js';
import fs from 'fs-extra';
import path from 'path';
const program = new Command();
program
    .name('api-mock-gen')
    .description('Generate mock REST API servers from OpenAPI specifications')
    .version('1.0.0')
    .requiredOption('-i, --input <file>', 'Input OpenAPI specification file (JSON or YAML)')
    .option('-o, --output <dir>', 'Output directory', './generated')
    .option('--port <port>', 'Port for dev server', '3000')
    .option('--generate-sdk', 'Generate TypeScript SDK', false)
    .option('--generate-docs', 'Generate API documentation', false)
    .parse(process.argv);
const options = program.opts();
async function main() {
    const spinner = ora('Parsing OpenAPI specification...').start();
    try {
        // Parse the spec
        const parsedSpec = await parser.parse(options.input);
        spinner.succeed('OpenAPI specification parsed successfully');
        console.log(chalk.blue(`\n📦 Generating mock server for: ${parsedSpec.spec.info.title} v${parsedSpec.spec.info.version}`));
        console.log(chalk.gray(`   Base URL: ${parsedSpec.baseUrl}`));
        console.log(chalk.gray(`   Operations: ${parsedSpec.operations.length}\n`));
        // Generate server
        const genSpinner = ora('Generating mock server files...').start();
        const outputDir = path.resolve(options.output);
        // Cast to the expected type
        const specForGenerator = {
            spec: parsedSpec.spec,
            operations: parsedSpec.operations,
        };
        const { files, routes } = serverGenerator.generate(specForGenerator);
        // Write files
        for (const [filePath, content] of Object.entries(files)) {
            await fs.outputFile(path.join(outputDir, filePath), content);
        }
        genSpinner.succeed('Mock server generated successfully');
        console.log(chalk.green(`\n✅ Generated files in: ${outputDir}`));
        console.log(chalk.cyan('\nTo run the mock server:'));
        console.log(chalk.gray(`   cd ${outputDir}`));
        console.log(chalk.gray('   npm install'));
        console.log(chalk.gray('   npm run dev\n'));
    }
    catch (error) {
        spinner.fail('Failed to generate mock server');
        console.error(chalk.red(`\nError: ${error instanceof Error ? error.message : error}\n`));
        process.exit(1);
    }
}
main();
//# sourceMappingURL=cli.js.map