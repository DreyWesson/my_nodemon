#!/usr/bin/env node

const chokidar = require("chokidar");
const { spawn } = require("child_process");
const path = require("path");

const COLORS = {
  RESET: "\x1b[0m",
  CYAN: "\x1b[36m",
  YELLOW: "\x1b[33m",
  MAGENTA: "\x1b[35m",
};

const debounce = (fn, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

class Nodemon {
  static async fileWatcher(filePath, options = {}, cb) {
    const debouncedCallback = debounce(cb, 100);

    console.log(
      `${COLORS.CYAN}Watching ${COLORS.YELLOW}${filePath}${COLORS.CYAN} for changes...${COLORS.RESET}`
    );

    const watcher = chokidar.watch(filePath, {
      ignored: /(^|[\/\\])\../,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100,
      },
      ...options.watchOptions,
    });

    watcher
      .on("all", (event, path) => {
        if (!options.type || event.toLowerCase() === options.type.toLowerCase()) {
          const eventType = event.charAt(0).toUpperCase() + event.slice(1);
          debouncedCallback(
            `${COLORS.MAGENTA}${eventType} detected${COLORS.RESET}: ${path}`
          );
        }
      })
      .on("error", (error) => console.error(`Watcher error: ${error}`));

    return watcher;
  }

  static async startNodemon(entryFile, watchDir = process.cwd()) {
    let childProcess = null;
    let isInitialStart = true;

    const startChildProcess = () => {
      if (childProcess) {
        childProcess.kill();
        console.log(`${COLORS.CYAN}Restarting your application...${COLORS.RESET}`);
      } else if (isInitialStart) {
        console.log("Starting application...");
        isInitialStart = false;
      }

      const fullEntryPath = path.join(watchDir, entryFile);

      childProcess = spawn("node", [fullEntryPath], { stdio: "inherit" });
      childProcess.on("close", (code) => {
        if (code !== null) {
          console.log(`Child process exited with code ${code}`);
        }
      });
    };

    startChildProcess();

    const watcher = await this.fileWatcher(
      watchDir,
      { watchOptions: { recursive: true } },
      startChildProcess
    );

    process.on("SIGINT", () => {
      console.log("\nStopping watcher and exiting...");
      watcher.close();
      if (childProcess) {
        childProcess.kill();
      }
      process.exit(0);
    });

    return watcher;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const entryFile = args[0] || "index.js";
const watchDir = path.dirname(entryFile);

Nodemon.startNodemon(entryFile, watchDir);