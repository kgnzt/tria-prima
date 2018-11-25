/**
 * Setup for creating an asset bundle.
 *
 * @param directory The build directory.
 * @param path The assets path.
 * @return A promise.
 */
export function createWorkspace(
  directory: string,
  path: string
): Promise<> {
  return new Promise((resolve, reject) => {
    // Ensure the build directory exists.
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    // Create the asset path.
    return fs.mkdir(path, { recursive: true }, (error) => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });
}
