/**
 * Configuration options.
 */
export interface IConfig {
  /**
   * Location of the index file.
   */
  index?: string;

  /**
   * Port to run server on.
   */
  port?: number;
};

/**
 * Assset server config.
 */
export const config: IConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  index: process.env.INDEX
};
