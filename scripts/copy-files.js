/* eslint-disable no-console */
const path = require("path");
const fse = require("fs-extra");
const glob = require("glob");

const packagePath = process.cwd();
const buildPath = path.join(packagePath, "./dist");
const srcPath = path.join(packagePath, "./src");
const readme = path.join(packagePath, "./README.md");

async function createModulePackages({ from, to }) {
  const directoryPackages = glob
    .sync("**/*/index.js", { cwd: from })
    .map(path.dirname);

  await Promise.all(
    directoryPackages.map(async directoryPackage => {
      const typingsPath = path.join(to, directoryPackage, "index.d.ts");
      const typingsExist = await fse.pathExists(typingsPath);

      const packageJson = {
        sideEffects: false,
        module: path.join(
          (depth => {
            let path = "";
            for (let i = 0; i < depth; i++)
              path += i < depth - 1 ? "../" : "..";
            return path;
          })(directoryPackage.split("/").length),
          "esm",
          directoryPackage,
          "index.js"
        ),
        main: "./index.js"
      };

      if (typingsExist) packageJson.types = "./index.d.ts";

      const packageJsonPath = path.join(to, directoryPackage, "package.json");

      await fse.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2)
      );

      return packageJsonPath;
    })
  );
}

async function typescriptCopy({ from, to }) {
  if (!(await fse.pathExists(to))) {
    console.warn(`path ${to} does not exists`);
    return [];
  }

  const files = glob.sync("**/*.d.ts", { cwd: from });

  const cmds = files.map(file =>
    fse.copy(path.resolve(from, file), path.resolve(to, file))
  );
  return Promise.all(cmds);
}

async function createPackageFile() {
  const packageData = await fse.readFile(
    path.resolve(packagePath, "./package.json"),
    "utf8"
  );

  /* eslint-disable no-unused-vars */
  const { nyc, scripts, devDependencies, workspaces, ...packageDataOther } =
    JSON.parse(packageData);
  /* eslint-enable no-unused-vars */

  const newPackageData = {
    ...packageDataOther,
    main: "./index.js",
    module: "./esm/index.js",
    types: "./index.d.ts"
  };
  const targetPath = path.resolve(buildPath, "./package.json");

  await fse.writeFile(
    targetPath,
    JSON.stringify(newPackageData, null, 2),
    "utf8"
  );

  return newPackageData;
}

async function run() {
  try {
    await createPackageFile();
    console.log(`Created package.json in ${buildPath}.`);

    await fse.copyFile(readme, path.resolve(buildPath, "./README.md"));
    console.log(`Created README.md in ${buildPath}.`);

    await typescriptCopy({ from: srcPath, to: buildPath });
    console.log(
      `Copied typescript declarations from ${srcPath} to ${buildPath}.`
    );

    await createModulePackages({ from: srcPath, to: buildPath });
    console.log(`Created module packages.`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
