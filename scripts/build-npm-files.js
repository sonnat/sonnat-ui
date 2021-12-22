const path = require("path");
const fse = require("fs-extra");

const packagePath = process.cwd();

const buildPath = path.join(packagePath, "./dist");

void (async () => {
  const rootPackageJson = path.join(packagePath, "package.json");
  const readme = path.join(packagePath, "README.md");
  const license = path.join(packagePath, "LICENSE");

  const rootPackageJsonData = JSON.parse(
    await fse.readFile(rootPackageJson, {
      encoding: "utf8"
    })
  );

  const npmPackageJson = {
    sideEffects: false,
    main: "index.js",
    types: "index.d.ts",
    module: "esm/index.js",
    name: rootPackageJsonData.name,
    version: rootPackageJsonData.version,
    description: rootPackageJsonData.description,
    license: rootPackageJsonData.license,
    homepage: rootPackageJsonData.homepage,
    repository: rootPackageJsonData.repository,
    keywords: rootPackageJsonData.keywords,
    peerDependencies: rootPackageJsonData.peerDependencies,
    dependencies: rootPackageJsonData.dependencies
  };

  await fse.copyFile(readme, path.join(buildPath, "README.md"));
  await fse.copyFile(license, path.join(buildPath, "LICENSE"));
  await fse.writeFile(
    path.join(buildPath, "package.json"),
    JSON.stringify(npmPackageJson, null, 2)
  );
})();
