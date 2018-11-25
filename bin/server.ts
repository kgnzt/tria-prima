#!/usr/bin/env node

import * as Handlebars from 'handlebars';
import * as _ from 'lodash';
import * as path from 'path';
import { spawn } from 'child_process';

import { IAssetBundle } from './compile';

const { argv: options } = yargs.options({
  environment: {
    default : 'development',
    alias : 'e',
    description : 'Environment to build for.',
    choices: ['staging', 'production']
  },
  index: {
    default : './index.html',
    alias : 'i',
    description : 'The index.html location.'
  },
  config: {
    default : './config.hjs',
    alias : 'i',
    description : 'The templated config file.'
  },
  tag: {
     
  }
  directory: args.directory
}).help();

return () {
  return createWorkspace(options.directory, '')
    .then(() => {
      return config(options);
    });
};

// add dist/tag/server
// compile into it.
// overwrite with compiled config
// create a Docker image from it
// then another script to deploy the docker image

/**
 * Compile config.
 *
 * @param options Server options.
 * @return A promise.
 */
export function config(options: IOptions): Promise<any> {
  return util.promisify(fs.readFile)(options.config).then((buffer) => {
    const template = Handlebars.compile(buffer.toString());
    const html = template({
      index: options.index
    });

    return util.promisify(fs.writeFile)(options.directory, html);
  });
}

/**
 * Given the output of compilation, get the asset bundle.
 *
 * @return A promise.
 */
export function outputToAsset(output: Buffer): IAssetBundle {
  const lines: string[] = output.toString().trim().split(/\r?\n/);
  const lastLine: string = lines[lines.length - 1];

  return JSON.parse(lastLine);
}

/**
 * Compile an asset bundle.
 *
 * @return A promise.
 */
export function compile(): Promise<IAssetBundle> {
  return new Promise((resolve, reject) => {
    const compileProc = spawn(NODE, [
      COMPILE
    ], {
      stdio: 'pipe'
    });

    let stdout = null;
    compileProc.stdout.on('data', (data) => {
      stdout += data;
    });

    let stderr = null;
    compileProc.stderr.on('data', (data) => {
      stderr += data;
    });

    compileProc.on('close', (code: number) => {
      if (code !== 0) {
        return reject(stderr);
      }

      return resolve(outputToAsset(stdout));
    });
  });
}

/**
 * Push an asset bundle to S3.
 *
 * @param The asset to deploy.
 * @return A promise.
 */
export function push(bundle: IAssetBundle): Promise<{
  bundle: IAssetBundle,
  code: number
}> {
  return new Promise((resolve, reject) => {
    const pushProc = spawn(NODE, [
      PUSH,
      `--tag=${bundle.tag}`
    ], {
      stdio: 'inherit'
    });

    pushProc.on('close', (code: number) => {
      if (code !== 0) {
        return reject(code);
      }
  
      return resolve({
        bundle,
        code
      });
    });
  });
}

/**
 * Deploy a new build.
 *
 * @return A promise.
 */
export function deploy(): Promise<{
  bundle: IAssetBundle;
  code: number;
}> {
  return compile()
    .then((bundle: IAssetBundle) => {
      return push(bundle);
    });
}

// Get server directory
// update config.hjs
// build docker image
// deploy to location

/**
 * Run deployment process.
 */
deploy().then(({
  code,
  bundle
}) => {
  console.log(`Deployed: ${bundle.tag}.`);

  process.exit(code);
}, console.error)
