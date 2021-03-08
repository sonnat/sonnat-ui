const path = require("path");
const sizeLimit = require("size-limit");
const filePlugin = require("@size-limit/file");
const webpackPlugin = require("@size-limit/webpack");

const packagePath = process.cwd();
const distPath = path.join(packagePath, "./dist");

const getReadableValue = bytes =>
  parseFloat(parseFloat(bytes / 1024).toFixed(2));

async function runSizeChecks() {
  const plugins = [filePlugin, webpackPlugin];
  const config = {
    files: [path.join(distPath, "esm/index.js")],
    ignore: ["react", "react-dom", "prop-types"]
  };

  const [{ size: MGBytes }] = await sizeLimit(plugins, {
    checks: [{ ...config, gzip: true }]
  });
  const [{ size: MBytes }] = await sizeLimit(plugins, {
    checks: [{ ...config, gzip: false }]
  });

  return { mg: getReadableValue(MGBytes), m: getReadableValue(MBytes) };
}

(async function run() {
  try {
    console.log("--- BUNDLE SIZE CHECKING ---");
    const { m: nonGZipped, mg: gZipped } = await runSizeChecks();
    console.log("MINIFIED + GZIPPED =", gZipped, "kB");
    console.log("MINIFIED =", nonGZipped, "kB");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
