import * as path from 'path';

/**
 * The build directory.
 */
export const directory = {
  default: path.resolve(process.cwd(), 'dist'),
  alias : 'd',
  description : 'The build directory.'
};

/**
 * An S3 bucket.
 */
export const bucket = {
  default : 'dtd-assetes',
  alias : 'b',
  description : 'S3 bucket to place assets into.'
};

/**
 * An S3 region.
 */
export const region = {
  default: 'us-west-1',
  alias: 'r',
  description: 'AWS bucket region.'
};
