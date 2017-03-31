/*
 * Changes to this file will not be automatically reloaded,
 * instead you will have to restart the process to do so.
 */

const express = require("express")
const morgan = require("morgan")
const path = require("path")

// Long symbolicated stack traces
require("longjohn")

// Load environment from disk
require("dotenv").load()

const app = express()
app.use(morgan("dev"))

// const webpack = require("webpack");
// const config = require("./webpack.config");
// const compiler = webpack(config);
// // Dynamically host assets to browser.
// app.use(require("webpack-dev-middleware")(compiler, {
//   noInfo: true,
//   publicPath: config.output.publicPath,
//   serverSideRender: true,
// }));
// // Allow client to be notified of changes to sources.
// app.use(require("webpack-hot-middleware")(compiler));

// Watch for FS changes in `../src` and clear cached modules when a change occurs,
// thus effectively reloading the file on a subsequent request.
const srcPath = path.resolve(__dirname, "../src")
const watcher = require("chokidar").watch(srcPath)
watcher.on("ready", function () {
  // TODO See if this can be optimsed to reload less files.
  //      Basically need to know dependency graph of modules, maybe flow can help?
  watcher.on("all", function () {
    // console.log(`Clearing module cache in: ${srcPath}`)
    Object.keys(require.cache).forEach(function (id) {
      if (id.startsWith(srcPath)) {
        delete require.cache[id]
      }
    });
  });
});

// In case of an uncaught exception show it to the user and proceed, rather than exiting the process.
// NOTE: This is a bad thing when it comes to concurrency, basically you can’t have 2 requests at the same time.
let currentResponse = null
app.use(function (req, res, next) {
  // if (currentResponse) {
  //   console.error("No concurrent requests may be made, only 1 at a time.");
  //   process.abort();
  // }
  currentResponse = res
  res.on("finish", () => {
    currentResponse = null
  })
  next()
})
process.on("uncaughtException", (error) => {
  if (currentResponse) {
    currentResponse.status(500).send(`
      <html>
        <body>
          <pre>${error.stack}</pre>
        </body>
      </html>
    `)
    currentResponse = null
  } else {
    console.error(error)
    process.abort()
  }
})

// Dynamically load app routes so that they can be reloaded in development.
app.use((req, res, next) => {
  const subapps = require(path.join(srcPath, "apps")).default
  const subappNames = Object.keys(subapps)
  const router = express.Router()
  subappNames.forEach(subappName => {
    router.use(`/${subappName}`, subapps[subappName])
  })
  router.get("/", () => {
    res.send(`
      <html>
        <body>
          <h1>Available applications:</h1>
          <ul>
            ${subappNames.map(name => `<li><a href="/${name}">${name}</a></li>`)}
          </ul>
        </body>
      </html>
    `)
  })
  router(req, res, next)
})

app.listen(3000, () => {
  console.log("✨  Listening on http://localhost:3000") // tslint:disable-line
})