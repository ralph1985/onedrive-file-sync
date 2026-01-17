import 'dotenv/config';
import { parseCliArgs } from './cli.js';

const overrides = parseCliArgs(process.argv);
if (!overrides.localFilePath || !overrides.remoteFilePath) {
  console.error('Missing --local and/or --remote arguments.');
  console.error('Example: ./run.sh --local /path/file --remote backups/home-manager/file');
  process.exit(1);
}

const { runApp } = await import('./app.js');

runApp({
  localFilePath: overrides.localFilePath,
  remoteFilePath: overrides.remoteFilePath,
}).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
