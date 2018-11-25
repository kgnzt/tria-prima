import * as Koa from 'koa';

import { IConfig, IProxy } from './config';

/**
 * An static application resource.
 */
export interface IApplicationResource {
  bucket: string;
  region: string;
  tag: string;
};

/**
 * Apply proxies to koa.
 *
 * @param config A proxy configuration.
 * @param application A koa application instance.
 * @return The koa application instance passed in.
 */
export function proxyKoa(
  proxy: IProxy,
  application: Koa
): Koa {
  return application;
}
