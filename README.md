# Azure Cypress React Dummy Project

The purpose of this dummy project was to run cypress tests within Azure pipelines and better yet, view the test results within the Test Plan section of Azure DevOps so we can view more info (such as error message, screenshot, video) and charts. I wanted to create a minimal project to:

1. Allow me to isolate and test pipeline changes
2. Aid in a potential upcoming blog post as reference material

I used [cypress-junit-reporter](https://www.npmjs.com/package/cypress-junit-reporter) to generate the XML reports based off cypress test results

Only e2e tests, no component tests in this project.

Repo lives [here](https://github.com/lornasw93/react-vite-cypress-azure-ts).

## How to run

After pulling down this project, ensure you install NPM dependencies.

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
npx cypress run --reporter junit --spec "cypress/e2e/signing-up.cy.ts"

```

* [azure-pipeline.yml](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/azure-pipeline.yml)
* [templates/cypress-steps.yml](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/templates/cypress-steps.yml)
* [cypress.config.ts](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/cypress.config.ts)
* [package.json](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/package.json)

## Azure pipeline YAML

## Features

### Ability to create bugs from a failed test run result

In this short demo, I have selected a failed test run and attempted to create a new bug. You can view more info on the error too as well as the stack trace. You are also able to add to an existing bug. The MP4 version of the gif below is available in [here](/assets/demo/fail/create%20bug.mp4).

![](/assets/demo/fail/create%20bug.gif)

### View artifact video

Blah

![](/assets/demo/success/view%20artifact%20video.gif)

### View test results in console

Blah

![](/assets/demo/success/view%20results%20in%20console.gif)

## Notes

Originally, I was generating screenshots for only failed test runs but found that when having multiple test files

## Summary

Blah
