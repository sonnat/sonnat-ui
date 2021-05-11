const fse = require("fs-extra");
const globAsync = require("fast-glob");
const rimraf = require("rimraf");
const Mustache = require("mustache");
const path = require("path");
const yargs = require("yargs");

const extensions = [".svg"];
const ignore = [];

const packagePath = process.cwd();

const outDirs = {
  svgIcons: path.resolve(packagePath, "src"),
  svgPaths: path.resolve(packagePath, "src/paths")
};

/**
 * @param {string} string
 * @param {string | RegExp} splitRegex
 * @returns {string}
 */
function toPascalCase(string, splitRegex) {
  const baseCase = string.split(splitRegex);

  return baseCase
    .map(part => part.charAt(0).toUpperCase() + part.substring(1))
    .join("");
}

async function generateIndex() {
  // const files = await globAsync(path.join(outDir, "*.js"));
  // const index = files
  //   .map(file => {
  //     const typename = path.basename(file).replace(".js", "");
  //     return `export { default as ${typename} } from './${typename}';\n`;
  //   })
  //   .join("");
  // await fse.writeFile(path.join(outDir, "index.js"), index);
}

/**
 * @param {string} data
 * @returns {string}
 */
function cleanPaths(data) {
  // Extract the paths from the svg string
  // Clean xml paths
  const paths = data
    .replace(/<svg[^>]*>/g, "")
    .replace(/<\/svg>/g, "")
    .replace(/"\/>/g, '" />')
    .replace(/ xlink:href=".+?"/g, "")
    .replace(/ fill=".+?"/g, "")
    .replace(/ fill-opacity=".+?"/g, "")
    .replace(/ clip-rule=".+?"/g, "")
    .replace(/ fill-rule=".+?"/g, "")
    .replace(/ clip-path=".+?"/g, "") // Fix visibility issue and save some bytes.
    .replace(/<clipPath.+?<\/clipPath>/g, ""); // Remove unused definitions

  const trimedPaths = paths.trim();

  return (trimedPaths.match(/\/>/g) || []).length > 1
    ? `<React.Fragment>${trimedPaths}</React.Fragment>`
    : trimedPaths;
}

/**
 * @param {string} svgPath
 * @param {{
 * svgIcon: string;
 * svgIconType: string;
 * svgPaths: string;
 * svgPathsType: string;
 * }} template
 */
async function generateModules(svgPath, template) {
  const normalizedSvgPath = path.normalize(svgPath);
  const svgPathObj = path.parse(normalizedSvgPath);

  await fse.ensureDir(outDirs.svgPaths);
  await fse.ensureDir(outDirs.svgIcons);

  const data = await fse.readFile(svgPath, { encoding: "utf8" });
  const paths = cleanPaths(data);

  const name = toPascalCase(svgPathObj.name, "-");

  const pathsModuleString = Mustache.render(template.svgPaths, {
    paths
  });

  const pathsTypeString = Mustache.render(template.svgPathsType, {
    name
  });

  const iconModuleString = Mustache.render(template.svgIcon, {
    name
  });

  const iconTypeString = `export { default } from "@sonnat/ui/Icon";`;
  const indexString = `export { default as ${name} } from "./${name}";\n`;

  const pathsModuleDestPath = path.join(outDirs.svgPaths, `${name}.js`);
  const pathsTypeDestPath = path.join(outDirs.svgPaths, `${name}.d.ts`);
  const pathsIndexDestPath = path.join(outDirs.svgPaths, "index.js");
  const pathsIndexTypeDestPath = path.join(outDirs.svgPaths, "index.d.ts");
  const iconModuleDestPath = path.join(outDirs.svgIcons, `${name}.js`);
  const iconTypeDestPath = path.join(outDirs.svgIcons, `${name}.d.ts`);
  const iconIndexDestPath = path.join(outDirs.svgIcons, "index.js");
  const iconIndexTypeDestPath = path.join(outDirs.svgIcons, "index.d.ts");

  await fse.writeFile(pathsModuleDestPath, pathsModuleString);
  await fse.writeFile(pathsTypeDestPath, pathsTypeString);
  await fse.appendFile(pathsIndexDestPath, indexString);
  await fse.appendFile(pathsIndexTypeDestPath, indexString);
  await fse.writeFile(iconModuleDestPath, iconModuleString);
  await fse.writeFile(iconTypeDestPath, iconTypeString);
  await fse.appendFile(iconIndexDestPath, indexString);
  await fse.appendFile(iconIndexTypeDestPath, indexString);
}

async function run(argv) {
  const { srcDir } = argv;

  if (!srcDir || !srcDir.length) return;

  // Clean old files
  rimraf.sync(`${outDirs.svgPaths}/*.js`);
  rimraf.sync(`${outDirs.svgPaths}/*.d.ts`);
  rimraf.sync(`${outDirs.svgIcons}/*.js`);
  rimraf.sync(`${outDirs.svgIcons}/*.d.ts`);

  await fse.ensureDir(outDirs.svgPaths);
  await fse.ensureDir(outDirs.svgIcons);

  const svgPaths = await globAsync(path.join(srcDir, "**/*.svg"));

  if (!svgPaths || !svgPaths.length) return;

  const template = {
    svgIcon: await fse.readFile(path.join(packagePath, "templates/svgIcon"), {
      encoding: "utf8"
    }),
    svgIconType: await fse.readFile(
      path.join(packagePath, "templates/svgIconType"),
      {
        encoding: "utf8"
      }
    ),
    svgPaths: await fse.readFile(path.join(packagePath, "templates/svgPaths"), {
      encoding: "utf8"
    }),
    svgPathsType: await fse.readFile(
      path.join(packagePath, "templates/svgPathsType"),
      {
        encoding: "utf8"
      }
    )
  };

  await fse.ensureFile(path.join(outDirs.svgPaths, "index.js"));
  await fse.ensureFile(path.join(outDirs.svgPaths, "index.d.ts"));
  await fse.ensureFile(path.join(outDirs.svgIcons, "index.js"));
  await fse.ensureFile(path.join(outDirs.svgIcons, "index.d.ts"));

  await Promise.all([
    svgPaths.map(svgPath => generateModules(svgPath, template))
  ]);
}

yargs
  .command({
    command: "$0 <srcDir>",
    description: "Build jsx components from svgs.",
    handler: run,
    builder: command => {
      return command.positional("srcDir", {
        description: "The source directory to look for `.svg` files.",
        type: "string"
      });
    }
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
