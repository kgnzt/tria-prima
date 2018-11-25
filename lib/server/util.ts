import { IConfig } from './config';

/**
 * An static application resource.
 */
export interface IApplicationResource {
  bucket: string;
  region: string;
  tag: string;
};

/**
 * Given the application config return an application resource.
 *
 * @param config A config object.
 * @return An application resource.
 */
export function configToResource(config: IConfig): IApplicationResource {
  return {
    bucket: config.bucket,
    region: config.region,
    tag: config.tag
  };
}

/**
 * Given an application resource return it's S3 folder.
 *
 * @param resource An application resource.
 * @return S3 folder.
 */
export function resourceToFolder(resource: IApplicationResource): string {
  return `https://s3-${resource.region}.amazonaws.com/${resource.bucket}/${resource.tag}`;
}

/**
 * Given an application resource return its index.html path.
 *
 * @param resource An application resource.
 * @return Index.html asset path.
 */
export function resourceToIndexPath(resource: IApplicationResource): string {
  return `${resourceToFolder(resource)}/index.html`;
}

/**
 * Given the application config return its index.html path.
 *
 * @param config A config object.
 * @return Index.html asset path.
 */
export function configToIndexPath(config: IConfig): string {
  return resourceToIndexPath(configToResource(config));
}
