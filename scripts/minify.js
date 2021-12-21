const path = require("path");
const fse = require("fs-extra");
const { minify } = require("terser");
const glob = require("fast-glob");

const packagePath = process.cwd();

const buildPath = path.join(packagePath, "./dist");

/** @param {string[]} files */
const runMinify = async files => {
  for (const file of files) {
    const source = await fse.readFile(file, { encoding: "utf8" });
    const result = await minify(source);

    await fse.writeFile(file, result.code);
  }
};

void (async () => {
  await runMinify(await glob(path.join(buildPath, "**/*/*.js")));
})();
