// Based on this previous solution:
// https://github.com/parcel-bundler/parcel/issues/1771
const appRoot = require("app-root-path");
const Parcel = require("@parcel/core").default;
const parcelConfig = appRoot.resolve(".parcelConfig");
const mode = process.argv[2];

const runParcel = async ({ source, distDir, target = "browser" }) => {
  const bundler = new Parcel({
    entries: appRoot.resolve(source),
    defaultConfig: parcelConfig,
    defaultTargetOptions: {
      distDir,
      publicUrl: "./",
    },
  });

  switch (mode) {
    case "build":
      await bundler.run();
      break;
    case "watch":
      // TODO: Output changes in watch mode
      await bundler.watch();
      // await watcher.unsubscribe();
      break;
    // TODO: Add serve?
    default:
      console.log("Invalid mode");
  }
};

const entries = [
  {
    source: "src/graphics/*.html",
    distDir: "graphics",
  },
  // {
  //   source: "src/dashboard/*.html",
  //   distDir: "dashboard",
  // },
  // {
  //   source: "src/extensions/*.html",
  //   distDir: "dashboard",
  //   target: "node"
  // }
];

for (const entry of entries) {
  runParcel(entry);
}
