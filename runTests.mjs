import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  console.log('Building verification test bundle with Vite...');
  await build({
    configFile: false,
    build: {
      lib: {
        entry: path.resolve(__dirname, '../tests/verify_campusflow.ts'),
        formats: ['es'],
        fileName: 'test_bundle',
      },
      outDir: path.resolve(__dirname, '../tests/dist'),
      emptyOutDir: true,
      rollupOptions: {
        external: ['node:test', 'node:assert/strict'],
      },
    },
    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, '../../shared'),
      },
    },
  });

  console.log('Running test bundle with Node.js test runner...');
  const testBundlePath = path.resolve(__dirname, '../tests/dist/test_bundle.js');
  execSync(`node --test "${testBundlePath}"`, { stdio: 'inherit' });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

