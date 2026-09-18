import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { npmEnvironment } from './npm-agent.mjs';

test('credential precedence, registry isolation, and placeholder handling', () => {
  const home = mkdtempSync(join(tmpdir(), 'npm-agent-'));
  try {
    assert.deepEqual(npmEnvironment({}, home), {});
    writeFileSync(join(home, '.npmrc'), '//registry.npmjs.org/:_authToken=unrelated\n');
    assert.deepEqual(npmEnvironment({}, home), {});
    writeFileSync(join(home, '.npmrc'), '//npm.pkg.github.com/:_authToken="local-test-token"\n');
    assert.equal(npmEnvironment({}, home).NODE_AUTH_TOKEN, 'local-test-token');
    assert.equal(npmEnvironment({ NODE_AUTH_TOKEN: 'ci-test-token' }, home).NODE_AUTH_TOKEN, 'ci-test-token');
    writeFileSync(join(home, '.npmrc'), '//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}\n');
    assert.deepEqual(npmEnvironment({}, home), {});
    const custom = join(home, 'custom.npmrc');
    writeFileSync(custom, '//npm.pkg.github.com/:_authToken=${PACKAGES_TOKEN}\n');
    const input = { npm_config_userconfig: custom, PACKAGES_TOKEN: 'custom-test-token' };
    assert.equal(npmEnvironment(input, home).NODE_AUTH_TOKEN, 'custom-test-token');
    assert.equal(input.NODE_AUTH_TOKEN, undefined);
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});
