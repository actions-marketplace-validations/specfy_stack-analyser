#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import timer from 'node:timers/promises';

import { Command } from 'commander';
import figures from 'figures';
import kleur from 'kleur';
import ora from 'ora';

import { analyser } from './analyser/index.js';
import { FSProvider } from './provider/fs.js';

const program = new Command();

program
  .name('stack-analyser')
  .description('CLI to extract metadata from repository')
  .argument('<path>', 'repository to analyse')
  .option('-o, --output <FILENAME>', 'output json to a file', 'output.json')
  .version('1.0.1')
  .action(async (arg, options) => {
    const here = process.cwd();
    const root = path.join(here, arg);

    try {
      const stat = await fs.stat(root);
      if (!stat.isDirectory()) {
        console.log(
          kleur.bold().red(figures.cross),
          `Path "${root}" is not a folder`
        );
        process.exit(1);
      }
    } catch (e) {
      console.log(
        kleur.bold().red(figures.cross),
        `Path "${root}" does not exist`
      );
      process.exit(1);
    }

    console.log(kleur.bold().magenta(figures.triangleRight), kleur.cyan(root));

    const spinner = ora(`Analysing`).start();

    await timer.setTimeout(500);
    const res = await analyser({
      provider: new FSProvider({
        path: root,
        ignorePaths: [],
      }),
    });
    spinner.succeed('Analysed');

    if (options.output) {
      const file = path.join(here, options.output);
      await fs.writeFile(file, JSON.stringify(res.toJson(root), undefined, 2));
      console.log('');
      console.log('Output', kleur.green(file));
    }
  });

// program
//   .command('github')
//   .description('Extract a Github repository using the API')
//   .argument('<repository>', 'repository to analyse')
//   .option('--output', 'output json to a file', 'output.json')
//   .action(() => {
//     console.log('action, github');
//   });

program.parse(process.argv);
