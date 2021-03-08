const path = require("path");
const fse = require("fs-extra");

const packagePath = process.cwd();
const srcPath = path.join(packagePath, "./src");
const packageIndex = path.join(srcPath, "index.js");
const umdEntryIndex = path.join(srcPath, "umd.entry.js");

const umdRequiredModules = [
  `./${path.relative(srcPath, path.join(srcPath, "styles"))}`,
  `./${path.relative(srcPath, path.join(srcPath, "utils"))}`
];

async function createUMDEntryFile() {
  fse.copyFileSync(packageIndex, umdEntryIndex);

  fse.appendFileSync(
    umdEntryIndex,
    umdRequiredModules.reduce((acc, current) => {
      return acc.concat(`\nexport * from "${current}";`);
    }, "")
  );
}

(async function run() {
  try {
    await createUMDEntryFile();
    console.log("'umd.entry.js' successfully created.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
