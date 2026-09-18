#!/usr/bin/env node
// Shell-independent npm entry point; never print or copy credentials into argv.
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function npmEnvironment(env = process.env, home = homedir()) {
  if (env.NODE_AUTH_TOKEN) return { ...env };
  const config = env.npm_config_userconfig || env.NPM_CONFIG_USERCONFIG || join(home, '.npmrc');
  let text;
  try {
    text = readFileSync(config, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw new Error('Cannot read npm user configuration.');
    return { ...env };
  }
  // Only the GitHub Packages credential can satisfy this registry's placeholder.
  const lines = text.split(/\r?\n/);
  let token;
  for (const line of lines) {
    const match = line.match(/^\s*\/\/npm\.pkg\.github\.com\/:_authToken\s*=\s*(.*?)\s*$/);
    if (match) token = match[1].replace(/^(["'])(.*)\1$/, '$2');
  }
  token = token?.replace(/\$\{([^}]+)\}/g, (_, name) => env[name] || '');
  return token ? { ...env, NODE_AUTH_TOKEN: token } : { ...env };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.error('Usage: node scripts/npm-agent.mjs <npm command> [arguments]');
    process.exit(1);
  }
  try {
    const env = npmEnvironment();
    if (!env.NODE_AUTH_TOKEN) {
      console.error('GitHub Packages authentication missing: set NODE_AUTH_TOKEN or configure //npm.pkg.github.com/:_authToken in your npm user configuration.');
      process.exit(1);
    }
    const result = spawnSync('npm', args, { env, stdio: 'inherit' });
    if (result.error) throw new Error('Unable to start npm. Check that npm is on PATH.');
    process.exit(result.status ?? 1);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
