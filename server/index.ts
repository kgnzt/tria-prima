import * as Koa from 'koa';
import * as request from 'request';
import * as fp from 'lodash/fp';
import { proxyKoa } from './util';
import * as route from 'koa-route';
import {
  IConfig,
  config
} from './config';

/**
 * Start the frontend server.
 *
 * @param opts Server options.
 */
export function server(opts: IConfig = {}) {
  const options = fp.defaults(opts, config);

  if (!options.index) {
    throw new Error('No index location was set.');
  }

  const application: Koa = new Koa();
  
  /**
   * Serve index file for the current asset.
   */
  application.use(route.get('/', (context: Koa.Context) => {
    context.body = request(options.index);
  }));

  proxyKoa(options.proxy, application);
  
  application.listen(options.port);
  
  console.log(`Serving: ${options.index}, on port: ${options.port}.`);

  return application;
}
