#!/usr/bin/env node

import * as _ from 'lodash';
import * as path from 'path';
import { spawn } from 'child_process';

import { IAssetBundle } from './compile';

/**
 * Typescript node binary.
 */
const TS_NODE = './node_modules/.bin/ts-node';

/**
 * Compilation script.
 */
const COMPILE = './node_modules/.bin/tria-prima-compile';

/**
 * Asset push script.
 */
const PUSH = './node_modules/.bin/tria-prima-push';

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
    const compileProc = spawn(TS_NODE, [
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
    const pushProc = spawn(TS_NODE, [
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
