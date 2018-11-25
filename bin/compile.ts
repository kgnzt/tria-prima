#!/usr/bin/env node

import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as uuid from 'uuid/v1';
import * as yargs from 'yargs';
import { spawn } from 'child_process';

import { createWorkspace } from './util';
import * as args from './args';

/**
 * Webpack binary.
 */
const WEBPACK = './node_modules/.bin/webpack';

/**
 * An asset bundle.
 */
export interface IAssetBundle {
  /**
   * The javascript file name.
   */
  js: string;

  /**
   * The javascript file path.
   */
  jsPath: string;

  /**
   * The relative javascript file path.
   */
  jsPathRelative: string;

  /**
   * The root of the build.
   */
  root: string;

  /**
   * The index.html file path.
   */
  indexPath: string;

  /**
   * The asset bunlde path.
   */
  path: string;

  /**
   * The S3 url of the javascript asset.
   */
  s3Javscript: string;

  /**
   * A unique asset bundle tag.
   */
  tag: string;
};

/**
 * Compilation options.
 */
export interface IOptions {
  /**
   * The S3 bucket the assets will be deployed to.
   */
  bucket: string;

  /**
   * The build diretory.
   */
  directory: string;

  /**
   * The build environment.
   */
  environment: string;

  /**
   * The index.hjs handlebars template.
   */
  index: string;

  /**
   * The S3 bucket region.
   */
  region: string;
};

/**
 * Create an asset bundle.
 *
 * @param options Compilation options.
 * @return An asset bundle.
 */
export function AssetBundle(options: IOptions): IAssetBundle {
  const tag: string = uuid();
  const js: string = `${tag}-dtd.js`;
  const assetPath: string = path.resolve(options.directory, tag);
  const root: string = path.resolve(options.directory, '../');
  const jsPath: string = path.resolve(assetPath, js);

  return {
    indexPath: path.resolve(assetPath, 'index.html'),
    js,
    jsPath,
    root,
    jsPathRelative: `./${tag}/${js}`,
    path: assetPath,
    s3Javscript: `https://s3-${options.region}.amazonaws.com/${options.bucket}/${tag}/${js}`,
    tag
  };
}

/**
 * Compile html.
 *
 * @param asset An asset bundle definition.
 * @param options Compile options.
 * @return A promise.
 */
export function html(bundle: IAssetBundle, options: IOptions): Promise<any> {
  return util.promisify(fs.readFile)(options.index).then((buffer) => {
    const template = Handlebars.compile(buffer.toString());
    const html = template({
      javascript: bundle.s3Javscript
    });

    return util.promisify(fs.writeFile)(bundle.indexPath, html);
  });
}

/**
 * Compile javascript.
 *
 * @param asset An asset bundle definition.
 * @param options Compilation options.
 * @return A promise.
 */
export function javascript(
  bundle: IAssetBundle,
  options: IOptions
): Promise<number> {
  return new Promise((resolve, reject) => {
    const webpack = spawn(path.resolve(bundle.root, WEBPACK), [
      `--mode=${options.environment}`,
      `--output-filename=${bundle.jsPathRelative}`
    ], {
      cwd: bundle.root,
      stdio: 'inherit'
    });
    
    webpack.on('close', (code: number) => {
      if (code !== 0) {
        return reject(code);
      }

      return resolve(code);
    });
  });
}

/**
 * Compile an asset bundle.
 *
 * @param asset An asset bundle definition.
 * @param options Compilation options.
 * @return A promise.
 */
export function compile(
  bundle: IAssetBundle,
  options: IOptions
): Promise<{
  code: number,
  bundle: IAssetBundle
}> {
  return createWorkforce(options.directory, bundle.path)
    .then(() => {
      return html(bundle, options);
    })
    .then(() => {
      return javascript(bundle, options);
    })
    .then((code: number) => {
      return {
        code,
        bundle
      };
    });
}

const { argv: options } = yargs.options({
  environment: {
    default : 'development',
    alias : 'e',
    description : 'Environment to build for.',
    choices: ['development', 'production']
  },
  index: {
    default : 'index.hjs',
    alias : 'i',
    description : 'The templated index.hjs file.'
  },
  name: {
    default : 'javascript',
    alias : 'n',
    description : 'The name of the compiled javascript file.'
  },
  directory: args.directory,
  bucket: args.bucket,
  region: args.region
}).help();

/**
 * Run compilation process.
 */
compile(AssetBundle(options), options).then(({
  code,
  bundle
}) => {
  // Output bundle information.
  console.log(JSON.stringify(bundle));

  return process.exit(code);
}, (error) => {
  console.error(error);

  return process.exit(-1);
});
