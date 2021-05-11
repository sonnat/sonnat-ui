const childProcess = require("child_process");
const path = require("path");
const { promisify } = require("util");
const yargs = require("yargs");

const exec = promisify(childProcess.exec);

const srcDir = path.resolve("./src");
const babelConfigPath = path.resolve(__dirname, "../babel.config.js");

const validBuildTypes = ["umd", "es", "cjs", "esm"];
const extensions = [".js", ".ts", ".tsx"];
const ignore = [
  "**/*.test.js",
  "**/*.test.ts",
  "**/*.test.tsx",
  "**/*.spec.ts",
  "**/*.spec.tsx",
  "**/*.d.ts"
];

const subDirs = {
  cjs: "./",
  es: "./es",
  esm: "./esm"
};

async function run(argv) {
  const { buildType, largeFiles, dev } = argv;

  if (validBuildTypes.indexOf(buildType) === -1) {
    throw new TypeError(
      `Unrecognized build type '${buildType}'. Did you mean one of "${validBuildTypes.join(
        '", "'
      )}"?`
    );
  }

  const env = {
    NODE_ENV: dev ? "development" : "production",
    BABEL_ENV: buildType
  };

  const outDir = path.resolve("./dist", subDirs[buildType]);
  let command = "";

  const babelArgs = [
    "--config-file",
    babelConfigPath,
    "--extensions",
    `"${extensions.join(",")}"`,
    srcDir,
    "--out-dir",
    outDir,
    "--ignore",
    // Need to put these patterns in quotes otherwise they might be evaluated by the used terminal.
    `"${ignore.join('","')}"`
  ];

  if (largeFiles) babelArgs.push("--compact false");
  const optWatch = dev ? "--watch" : "";

  command = [`yarn babel ${optWatch}`, ...babelArgs].join(" ");

  const { stderr, stdout } = await exec(command, {
    env: { ...process.env, ...env }
  });

  if (stderr) throw new Error(`'${command}' failed with \n${stderr}`);

  // eslint-disable-next-line no-console
  console.log(stdout);
}

yargs
  .command({
    command: "$0 <buildType>",
    description: "Build package.",
    handler: run,
    builder: command => {
      return command
        .positional("buildType", {
          description: `Valid build types: "${validBuildTypes.join('" | "')}"`,
          type: "string"
        })
        .option("largeFiles", {
          type: "boolean",
          default: false,
          describe: "Set to `true` if you know you are transpiling large files."
        })
        .option("dev", {
          type: "boolean",
          default: false,
          describe:
            "Set to `true` if you want it to work in a development environment."
        });
    }
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
