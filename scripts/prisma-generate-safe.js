#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const { existsSync } = require('node:fs');
const { join } = require('node:path');

const fallbackDatabaseUrl = 'postgresql://prisma:prisma@localhost:5432/agritech_build?schema=public';
const env = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL || fallbackDatabaseUrl,
};

delete env.PRISMA_SKIP_POSTINSTALL_GENERATE;

if (!process.env.DATABASE_URL) {
  console.warn('[prisma] DATABASE_URL is not set. Using a local placeholder only for Prisma Client generation.');
}

const command = process.platform === 'win32' ? 'prisma.cmd' : 'prisma';
const localPrisma = join(process.cwd(), 'node_modules', '.bin', command);
const executable = existsSync(localPrisma) ? localPrisma : command;

const prismaArgs = process.argv.slice(2);
const result = spawnSync(executable, prismaArgs.length > 0 ? prismaArgs : ['generate'], {
  env,
  stdio: 'inherit',
  shell: false,
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
