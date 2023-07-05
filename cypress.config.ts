import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    codeCoverage: {
      exclude: "cypress/**/*.*",
    },
  },
 
  e2e: {
    defaultCommandTimeout: 6000, // set command timeout to 6secs
    baseUrl: "http://localhost:4173",
    video: true,
    videoCompression: 50,
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
  },

  reporter: "junit",
  reporterOptions: {
    mochaFile: "cypress/results/results-[hash].xml",
    toConsole: true
  }
});
