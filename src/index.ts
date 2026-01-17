import 'dotenv/config';
import { parseCliArgs } from './cli.js';

const overrides = parseCliArgs(process.argv);
if (overrides.localFilePath) {
  process.env.LOCAL_FILE_PATH = overrides.localFilePath;
}
if (overrides.remoteFilePath) {
  process.env.ONEDRIVE_FILE_PATH = overrides.remoteFilePath;
}

const { runApp } = await import('./app.js');

runApp().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
