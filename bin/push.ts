#!/usr/bin/env ts-node

import { S3 } from 'aws-sdk';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import * as yargs from 'yargs';
import * as args from './args';

const { argv: options } = yargs
  .options({
    environment: {
      default : 'staging',
      alias : 'e',
      choices: ['staging', 'production'],
      description : 'Environment to deploy to.'
    },
    secret: {
      default: process.env.S3_SECRET ? process.env.S3_SECRET : '',
      alias: 's',
      description: 'An AWS secret key.'
    },
    access: {
      default: process.env.S3_ACCESS ? process.env.S3_ACCESS : 'AKIAJW7BWF6KE4UZZL3Q',
      alias: 'a',
      description: 'An AWS access key.'
    },
    tag: {
      requiresArg: true,
      default: 'latest',
      alias: 't',
      description: 'The build tag to deploy.'
    },
    directory: args.directory,
    bucket: args.bucket,
    region: args.region
  }).help();

export interface IOptions {
  /**
   * The environment to push to.
   */
  environment: string;

  /**
   * The S3 secret.
   */
  secret: string;

  /**
   * The S3 access key.
   */
  access: string;

  /**
   * The build tag to deploy.
   */
  tag: string;

  /**
   * The directory to push to.
   */
  directory: string;

  /**
   * The buket to push to.
   */
  bucket: string;

  /**
   * The S3 bucket region.
   */
  region: string;
}

/**
 * An application asset.
 */
interface IAsset {
  /**
   * The asset key.
   */
  key: string;

  /**
   * The S3 path.
   */
  path: string;

  /**
   * The asset data.
   */
  data: Buffer;

  /**
   * The asset file extension.
   */
  extname: string;

  /**
   * The asset content-type.
   */
  content: string;
};

/**
 * Given an extname, get the S3 content-type.
 *
 * @param extname The extname of the asset.
 * @return The content-type.
 */
export function extnameToContent(extname: string): string {
  switch(extname) {
    case '.js':
      return 'text/javascript';
    case '.html':
    default:
      return 'text/html';
  }
}

/**
 * Given a build tag, get the build assets.
 *
 * @param options Asset push options.
 * @return A promise.
 */
export function getAssets(options: IOptions): Promise<IAsset[]> {
  return util.promisify(fs.readdir)(path.resolve(
    options.directory,
    options.tag
  )).then((
    files: string[]
  ) => {
    return files.map((asset: string): IAsset => {
      const assetPath: string = path.resolve(
        options.directory,
        options.tag,
        asset
      );

      return {
        key: `${options.tag}/${asset}`,
        path: assetPath,
        data: fs.readFileSync(assetPath),
        extname: path.extname(asset),
        content: extnameToContent(path.extname(asset))
      };
    });
  });
}


/**
 * Push assets to S3.
 *
 * @param options Asset push options.
 * @return A promise.
 */
export function push(options: IOptions): Promise<{
  code: number;
}> {
  const s3 = new S3({
    accessKeyId: options.access,
    region: options.region,
    secretAccessKey: options.secret
  });

  return getAssets(options)
    .then((assets: IAsset[]) => {
      return Promise.all(assets.map((asset: IAsset) => {
        console.log(`Pushing asset: ${asset.key}.`);

        return s3.putObject({
          ACL: 'public-read',
          Body: asset.path,
          Bucket: options.bucket,
          ContentType: asset.content,
          Key: asset.key
        }).promise();
      }));
    }).then(() => {
      return {
        code: 0
      };
    });
}

/**
 * Run the asset push process.
 */
push(options).then(({
  code
}) => {
  console.log(`Pushed asset bundle: ${options.tag}, to S3.`);

  return process.exit(code);
}, console.error)
