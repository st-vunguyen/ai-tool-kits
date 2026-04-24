#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const manifestPath = path.join(__dirname, '..', 'tooling', 'runtime-tools.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const workspaceRoot = path.join(__dirname, '..');
const currentWorkingDirectory = process.cwd();
const containerCli = 'docker';
const command = process.argv[2] || 'help';
const commandArgs = process.argv.slice(3);

function normalizeForwardedArgs(args) {
  if (args[0] === '--') return args.slice(1);
  return args;
}

function run(commandName, args, options = {}) {
  const result = childProcess.spawnSync(commandName, args, {
    encoding: 'utf8',
    shell: process.platform === 'win32',
    cwd: options.cwd || currentWorkingDirectory,
    stdio: options.stdio || 'pipe',
  });
  return {
    ok: result.status === 0,
    status: result.status,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
  };
}

function formatValue(value) {
  if (Array.isArray(value)) return value.join(', ');
  return value;
}

function printSection(title, rows) {
  console.log(title);
  for (const row of rows) console.log(`  ${row}`);
  console.log('');
}

function isDockerAvailable() {
  return run(containerCli, ['--version']).ok;
}

function localBinaryResult(binaryCandidates, versionArgs) {
  for (const binary of binaryCandidates) {
    const result = run(binary, versionArgs);
    if (result.ok) {
      return {
        ok: true,
        mode: 'local',
        binary,
        output: result.stdout || result.stderr,
      };
    }
  }

  return {
    ok: false,
    mode: 'local',
  };
}

function containerReadyResult(image) {
  if (!isDockerAvailable()) {
    return {
      ok: false,
      mode: 'container',
      output: 'Docker is not available on PATH.',
    };
  }

  const inspectResult = run(containerCli, ['image', 'inspect', image]);
  if (inspectResult.ok) {
    return {
      ok: true,
      mode: 'container',
      output: `container image ready: ${image}`,
    };
  }

  return {
    ok: true,
    mode: 'container',
    output: `container wrapper ready via ${containerCli}; image will auto-pull on first use: ${image}`,
  };
}

function runLocal(binary, args) {
  return childProcess.spawnSync(binary, args, {
    cwd: currentWorkingDirectory,
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });
}

function runContainer(image, args, mountTarget, entrypointArgs = []) {
  const volume = `${currentWorkingDirectory}:${mountTarget}`;
  return childProcess.spawnSync(containerCli, [
    'run',
    '--rm',
    '-i',
    '-v',
    volume,
    '-w',
    mountTarget,
    image,
    ...entrypointArgs,
    ...args,
  ], {
    cwd: currentWorkingDirectory,
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });
}

const tools = {
  newman: {
    versionArgs: ['--version'],
    wrapper: 'pnpm run tool:newman --',
    verifyCommand: 'pnpm run tool:newman -- --version',
    describe() {
      return [
        `mode: ${manifest.newman.type}`,
        `wrapper: ${this.wrapper}`,
        `verify: ${this.verifyCommand}`,
        `package: ${manifest.newman.packageName}@${manifest.newman.version}`,
        `notes: ${manifest.newman.notes}`,
      ];
    },
    doctor() {
      const result = run('pnpm', ['exec', 'newman', '--version'], { cwd: workspaceRoot });
      if (result.ok) {
        return {
          ok: true,
          output: `local pnpm package ${result.stdout || result.stderr}`.trim(),
        };
      }

      return {
        ok: false,
        output: manifest.newman.notes,
        hint: manifest.newman.installCommand,
      };
    },
    execute(args) {
      return childProcess.spawnSync('pnpm', ['exec', 'newman', ...args], {
        cwd: workspaceRoot,
        shell: process.platform === 'win32',
        stdio: 'inherit',
      });
    },
  },
  k6: {
    versionArgs: ['version'],
    wrapper: 'pnpm run tool:k6 --',
    verifyCommand: 'pnpm run tool:k6 -- version',
    describe() {
      return [
        `mode: ${manifest.k6.type}`,
        `wrapper: ${this.wrapper}`,
        `verify: ${this.verifyCommand}`,
        `local binary: ${manifest.k6.binary}`,
        `container image: ${manifest.k6.containerImage}`,
        `notes: ${manifest.k6.notes}`,
      ];
    },
    doctor() {
      const local = localBinaryResult([manifest.k6.binary], this.versionArgs);
      if (local.ok) {
        return {
          ok: true,
          output: `${local.binary} ${local.output}`.trim(),
        };
      }

      const container = containerReadyResult(manifest.k6.containerImage);
      if (container.ok) {
        return {
          ok: true,
          output: container.output,
        };
      }

      return {
        ok: false,
        output: manifest.k6.notes,
        hint: manifest.k6.prerequisites.join(' | '),
      };
    },
    execute(args) {
      const local = localBinaryResult([manifest.k6.binary], this.versionArgs);
      if (local.ok) return runLocal(manifest.k6.binary, args);
      return runContainer(manifest.k6.containerImage, args, '/work');
    },
  },
  zap: {
    versionArgs: ['-version'],
    wrapper: 'pnpm run tool:zap --',
    verifyCommand: 'pnpm run tool:zap -- -version',
    describe() {
      return [
        `mode: ${manifest.zap.type}`,
        `wrapper: ${this.wrapper}`,
        `verify: ${this.verifyCommand}`,
        `local binaries: ${manifest.zap.binaryCandidates.join(', ')}`,
        `container image: ${manifest.zap.containerImage}`,
        `notes: ${manifest.zap.notes}`,
      ];
    },
    doctor() {
      const local = localBinaryResult(manifest.zap.binaryCandidates, this.versionArgs);
      if (local.ok) {
        return {
          ok: true,
          output: `${local.binary} ${local.output}`.trim(),
        };
      }

      const container = containerReadyResult(manifest.zap.containerImage);
      if (container.ok) {
        return {
          ok: true,
          output: container.output,
        };
      }

      return {
        ok: false,
        output: manifest.zap.notes,
        hint: manifest.zap.prerequisites.join(' | '),
      };
    },
    execute(args) {
      const local = localBinaryResult(manifest.zap.binaryCandidates, this.versionArgs);
      if (local.ok) return runLocal(local.binary, args);
      return runContainer(manifest.zap.containerImage, args, '/zap/wrk', ['zap.sh']);
    },
  },
  jmeter: {
    versionArgs: ['--version'],
    wrapper: 'pnpm run tool:jmeter --',
    verifyCommand: 'pnpm run tool:jmeter -- --version',
    describe() {
      return [
        `mode: ${manifest.jmeter.type}`,
        `wrapper: ${this.wrapper}`,
        `verify: ${this.verifyCommand}`,
        `local binary: ${manifest.jmeter.binary}`,
        `container image: ${manifest.jmeter.containerImage}`,
        `notes: ${manifest.jmeter.notes}`,
      ];
    },
    doctor() {
      const local = localBinaryResult([manifest.jmeter.binary], this.versionArgs);
      if (local.ok) {
        return {
          ok: true,
          output: `${local.binary} ${local.output}`.trim(),
        };
      }

      const container = containerReadyResult(manifest.jmeter.containerImage);
      if (container.ok) {
        return {
          ok: true,
          output: container.output,
        };
      }

      return {
        ok: false,
        output: manifest.jmeter.notes,
        hint: manifest.jmeter.prerequisites.join(' | '),
      };
    },
    execute(args) {
      const local = localBinaryResult([manifest.jmeter.binary], this.versionArgs);
      if (local.ok) return runLocal(manifest.jmeter.binary, args);
      return runContainer(manifest.jmeter.containerImage, args, currentWorkingDirectory);
    },
  },
};

function listTools() {
  for (const [name, details] of Object.entries(manifest)) {
    console.log(`${name}:`);
    for (const [key, value] of Object.entries(details)) {
      console.log(`  ${key}: ${formatValue(value)}`);
    }
  }
}

function plan() {
  printSection('Runtime command surface', [
    'pnpm run apply -- --slug <slug>',
    'pnpm run apply:dry-run -- --slug <slug>',
    'pnpm run runtime:list',
    'pnpm run runtime:prepare',
    'pnpm run runtime:doctor',
  ]);

  for (const [name, tool] of Object.entries(tools)) {
    printSection(`${name}`, tool.describe());
  }
}

function prepare() {
  if (!isDockerAvailable()) {
    console.log('MISS  docker');
    console.log('      hint: install Docker Desktop or ensure `docker` is available before preparing container-backed wrappers.');
    process.exitCode = 1;
    return;
  }

  const images = Array.from(new Set(
    Object.values(manifest)
      .map((tool) => tool.containerImage)
      .filter(Boolean),
  ));

  for (const image of images) {
    console.log(`pull  ${image}`);
    const result = run(containerCli, ['pull', image], { stdio: 'inherit' });
    if (result.status !== 0) {
      process.exitCode = result.status || 1;
      return;
    }
  }
}

function doctor() {
  let hasMissing = false;
  for (const [name, tool] of Object.entries(tools)) {
    const result = tool.doctor();
    if (result.ok) {
      console.log(`OK    ${name} ${result.output}`.trim());
    } else {
      hasMissing = true;
      console.log(`MISS  ${name}`);
      console.log(`      detail: ${result.output}`);
      console.log(`      hint: ${result.hint}`);
    }
  }

  if (hasMissing) {
    process.exitCode = 1;
  }
}

function executeTool(toolName, args) {
  const tool = tools[toolName];
  if (!tool) {
    console.log(`Unknown tool: ${toolName}`);
    help();
    process.exitCode = 1;
    return;
  }

  const result = tool.execute(normalizeForwardedArgs(args));
  process.exitCode = result.status || 0;
}

function help() {
  console.log(`Runtime tool helper

Usage:
  pnpm run runtime:list
  pnpm run runtime:plan
  pnpm run runtime:prepare
  pnpm run runtime:doctor
  pnpm run tool:newman -- <args>
  pnpm run tool:k6 -- <args>
  pnpm run tool:zap -- <args>
  pnpm run tool:jmeter -- <args>
`);
}

if (command === 'list') listTools();
else if (command === 'plan') plan();
else if (command === 'prepare') prepare();
else if (command === 'doctor') doctor();
else if (command === 'exec') executeTool(commandArgs[0], commandArgs.slice(1));
else help();
