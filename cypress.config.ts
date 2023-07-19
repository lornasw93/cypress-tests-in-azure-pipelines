import { defineConfig } from "cypress";
import codeCoverageTask from "@cypress/code-coverage/task";

export default defineConfig({
  env: {
    codeCoverage: {
      exclude: "cypress/**/*.*",
    },
  },
 
  e2e: {
    defaultCommandTimeout: 6000, // set command timeout to 6secs
    baseUrl: "http://localhost:4173",
    video: true
  },

  component: {
    viewportHeight: 800,
    viewportWidth: 1280,
    video: false,
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    supportFile: "cypress/support/component.tsx",
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);

      return config;
    },
  },

  reporter: "junit",
  reporterOptions: {
    mochaFile: "cypress/results/result-[hash].xml",
    toConsole: true,
    attachments: true,
    embeddedScreenshots: true,
    trashAssetsBeforeRuns: false,
  },
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
});
