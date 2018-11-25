#!/usr/bin/env node

import * as Handlebars from 'handlebars';
import * as _ from 'lodash';
import * as path from 'path';
import * as yargs from 'yargs';
import * as args from './args';
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
    default : 'latest',
    alias : 't',
    description : 'The tag to build the server for.'
  },
  directory: args.directory
}).help();

/*
() => {
  return createWorkspace(options.directory, '')
    .then(() => {
      return config(options);
    });
};
*/

// add dist/tag/server
// compile into it.
// overwrite with compiled config
// create a Docker image from it
// then another script to deploy the docker image
