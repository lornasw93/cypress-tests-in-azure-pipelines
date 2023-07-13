# Azure-Cypress-React Dummy Project

The purpose of this dummy project was to run cypress tests within Azure pipelines and better yet, view the test results within the Test Plan section of Azure DevOps so we can view more info (such as error message, screenshot, video) and charts. I wanted to create a minimal project to:

1. Allow me to isolate and test pipeline changes without affecting a "real" project
2. Aid in a potential upcoming blog post as reference material

Packages worthy to note
* [cypress-junit-reporter](https://www.npmjs.com/package/cypress-junit-reporter) was used to generate the XML reports
* [wait-on](https://www.npmjs.com/package/wait-on) was used...

Note, there are only e2e tests and no component tests in this project.

Demos included [here](demos.md) ✨

## How to run 🏃‍♀️

After cloning the project, ensure you install NPM dependencies.

After cloning the project, ensure you install NPM dependencies.

```sh
npm i

```

Although the focus of this repo is running tests in pipelines, I'll cover how to run the tests locally.

### Run locally with Cypress app

Run below.

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

## The juicy bit... Project setup 101 💪
The following files (but not limited to) were key in getting all this magic to work.

### cypress.config.ts
A new reporter section added to the [file](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/cypress.config.ts).

```yaml
  reporter: "junit",
  reporterOptions: {
    mochaFile: "cypress/results/result-[hash].xml",
    toConsole: true,
    attachments: true,
    embeddedScreenshots: true,
  },
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  ```

### package.json
I added new scripts [here](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/package.json) that are utilised within the pipeline. Reminder: there are no working component tests in this project but have added the command for full-picture.

```json
  "cy:verify": "cypress verify",
  "cy:run-junit-reporter:component": "cypress run -q --component --reporter junit",
  "cy:run-junit-reporter:e2e": "cypress run --reporter junit"
```

### cypress-steps.yml
The content of this [file](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/templates/cypress-steps.yml) was originally within the [azure-pipeline.yml](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/azure-pipeline.yml) file but has been extracted out of there to ensure reusability using YAML templates (very cool 😎).

```yaml
parameters:
  - name: baseUrl
    default: ""
  - name: vmImage
    default: ""

jobs:
  - job: Cypress_tests
    pool:
      vmImage: ${{ parameters.vmImage }}
    steps:
      - task: NodeTool@0
        inputs:
          versionSpec: "18.x"
        displayName: "Install Node.js"

      - script: npm ci
        displayName: "Install NPM dependencies"

      - script: npm run cy:verify
        displayName: "Verify Cypress is installed"

      # Need to ensure it's running before running tests and generating a report
      - script: |
          npm install -g wait-on
          npm run start:e2e & wait-on ${{parameters.baseUrl}} & npm run cy:run-junit-reporter:e2e
        continueOnError: True
        displayName: "Run e2e tests"

      # Generate XML reports for each spec file
      - task: PublishTestResults@2
        displayName: "Publish test results"
        inputs:
          testResultsFormat: "JUnit"
          testResultsFiles: "/home/vsts/work/1/s/cypress/results/result-*.xml"
          testRunTitle: "$(Build.BuildNumber)"
          searchFolder: "$(System.DefaultWorkingDirectory)"

      - task: PublishBuildArtifacts@1
        displayName: "Publish screenshots"
        condition: failed()
        continueOnError: True
        inputs:
          PathtoPublish: "/home/vsts/work/1/s/cypress/screenshots"
          ArtifactName: screenshots

      # Publish video artifacts when tests have succeeded or failed
      - task: PublishBuildArtifacts@1
        displayName: "Publish videos"
        condition: succeededOrFailed()
        continueOnError: True
        inputs:
          PathtoPublish: "/home/vsts/work/1/s/cypress/videos"
          ArtifactName: videos
```

### azure-pipeline.yml
Finally, to bring everything together we utilise the YAML template ^ into this [azure-pipeline.yml](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/azure-pipeline.yml).

```yaml
trigger:
  paths:
    include:
      - master

jobs:
  - template: templates/cypress-steps.yml
    parameters:
      baseUrl: http://localhost:4173
      vmImage: "ubuntu-latest"
```

## Notes 📝

Originally, I was generating screenshots for only failed test runs but found that when having multiple test files
