const path = require("path");
const fse = require("fs-extra");
const glob = require("fast-glob");

const packagePath = process.cwd();

const buildPath = path.join(packagePath, "./dist/cjs");

void (async () => {
  const moduleDirectories = (
    await glob(path.join(buildPath, "**/*/index.js"))
  ).map(path.dirname);

  for (const moduleDirectory of moduleDirectories) {
    const typingsPath = path.join(moduleDirectory, "index.d.ts");
    const typingsExist = await fse.pathExists(typingsPath);

    const relativePath = path.relative(buildPath, moduleDirectory);

    const packageJson = {
      sideEffects: false,
      module: path.join(
        (depth => {
          let path = "../";
          for (let i = 0; i < depth; i++) path += i < depth - 1 ? "../" : "..";
          return path;
        })(relativePath.split("/").length),
        "esm",
        relativePath,
        "index.js"
      ),
      main: "./index.js"
    };

    if (typingsExist) packageJson.types = "./index.d.ts";

    const packageJsonPath = path.join(moduleDirectory, "package.json");

    await fse.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
})();
