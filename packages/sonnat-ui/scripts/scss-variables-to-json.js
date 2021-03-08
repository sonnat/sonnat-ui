const path = require("path");
const fse = require("fs-extra");
const lineReader = require("line-reader");
const Promise = require("bluebird");

const packagePath = process.cwd();
const srcPath = path.join(packagePath, "./src");
const scssFileName = "_sonnat-font-icon-variables.scss";

const camelCase = s => s.replace(/-./g, x => x.toUpperCase()[1]);

async function createJsonVariablesFile() {
  const pattern = /^\$(.*)$/;
  const variablesJson = {};

  await Promise.promisify(lineReader.eachLine)(
    path.resolve(srcPath, "static", scssFileName),
    line => {
      if (pattern.test(line)) {
        let [key, val] = line.split(":");

        val = val.replace(";", "").trim();

        key = key.replace("$", "").trim();
        key = key.replace("sonnat-icon-", "").trim();
        key = camelCase(key);

        variablesJson[key] = val;
      }
    }
  );

  fse.writeFileSync(
    path.resolve(srcPath, "styles", "fontIconVariables.json"),
    JSON.stringify(variablesJson, null, 2)
  );
}

(async function run() {
  try {
    await createJsonVariablesFile();
    console.log("'fontIconVariables.json' successfully created from 'scss'.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
