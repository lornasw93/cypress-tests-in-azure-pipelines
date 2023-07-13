# Azure Cypress React Dummy Project

The purpose of this dummy project was to run cypress tests within Azure pipelines and better yet, view the test results within the Test Plan section of Azure DevOps so we can view more info (such as error message, screenshot, video) and charts. I wanted to create a minimal project to:

1. Allow me to isolate and test pipeline changes
2. Aid in a potential upcoming blog post as reference material

Useful links
* Demos included [here](demos.md)
* [cypress-junit-reporter](https://www.npmjs.com/package/cypress-junit-reporter) package was used to to generate the XML reports based from cypress test results

## How to run 🏃‍♀️

After cloning the project, ensure you install NPM dependencies.

```sh
npm i

```

### Run locally via Cypress application

Run this.

```sh
npm run start:e2e

```

The next command will open Cypress application.

```sh
cypress open

```

### Generate XML report for specific test

Again, ensure you're running locally.

```sh
npm run start:e2e

```

Then the following command.

```sh
npx cypress run --reporter junit --spec "cypress/e2e/todo.cy.ts"

```

* [azure-pipeline.yml](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/azure-pipeline.yml)
* [templates/cypress-steps.yml](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/templates/cypress-steps.yml)
* [cypress.config.ts](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/cypress.config.ts)
* [package.json](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/package.json)

## Notes 📝

Originally, I was generating screenshots for only failed test runs but found that when having multiple test files


Only e2e tests, no component tests in this project.

## Summary

Blah
