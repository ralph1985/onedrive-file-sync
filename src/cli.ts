type CliOverrides = {
  localFilePath?: string;
  remoteFilePath?: string;
};

const HELP_TEXT = `
Usage:
  node dist/index.js [--local /path/to/file] [--remote remote/path]

Options:
  --local   Override LOCAL_FILE_PATH
  --remote  Override ONEDRIVE_FILE_PATH (relative to app folder)
  --help    Show this help message
`;

export function parseCliArgs(argv: string[]): CliOverrides {
  const overrides: CliOverrides = {};
  const args = argv.slice(2);

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      console.log(HELP_TEXT.trim());
      process.exit(0);
    }

    if (arg === '--local') {
      overrides.localFilePath = args[i + 1];
      i += 1;
      continue;
    }

    if (arg === '--remote') {
      overrides.remoteFilePath = args[i + 1];
      i += 1;
      continue;
    }
  }

  return overrides;
}
