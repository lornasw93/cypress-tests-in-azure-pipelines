# Run Cypress tests in Azure Pipelines with a React project

The purpose of this dummy project was to run cypress tests within Azure pipelines and better yet, view the test results within the Test Plan section of Azure DevOps so we can view more info (such as error message, screenshot, video) and charts. I wanted to create a minimal project to:

1. Allow me to isolate and test pipeline changes without affecting a "real" project
2. Aid in a potential upcoming blog post as reference material

I used 2 basic cypress tests from this [repo](https://github.com/cypress-io/cypress-example-kitchensink) to get up and running fast.

To note (able to see most in [demos](demos.md) and in screenshots below):

* Covers both e2e and component testing
* Test results are viewable in pipeline console
* If tests have failed, the build will have a warning on it
* Screenshot artifacts are generated only if you have a failed test result
* Video artifacts are generated if you have either a successful or failed test result
* Test run name is build number (want to change this to something more meaningful! 🤔)
* Test run results are merged otherwise for each spec file (cy.ts) you'd have a separate test run for each i.e. <buildnumber>_1, <buildnumber>_2

Packages worthy to note

* [cypress-junit-reporter](https://www.npmjs.com/package/cypress-junit-reporter) for generating XML reports
* [wait-on](https://www.npmjs.com/package/wait-on) for ensuring server is running before attempting to run cypress tests

This [blog post](https://www.edgewordstraining.co.uk/2021/02/04/cypress-yaml-pipeline-in-azure-devops/) helped me along really nicely.

**Demos included [here](demos.md)** ✨

## How to run 🏃‍♀️

After cloning the project, ensure you install NPM dependencies.

```sh
npm i

```

Although the focus of this repo is running tests in pipelines, I'll cover how to run the tests locally.

### Run locally with Cypress app 📍

Run below.

```sh
npm run start:e2e

```

The next command will open Cypress application.

```sh
cypress open

```

### Generate XML report for specific test 🔃

Again, ensure you're running locally.

```sh
npm run start:e2e

```

Then the following command.

```sh
npx cypress run --reporter junit --spec "cypress/e2e/todo.cy.ts"

```

## Project setup

The following files (but not limited to) were key in getting all this magic to work.

### cypress.config.ts 📄

A new reporter section added to the [file](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/cypress.config.ts).

```ts
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

### package.json 📄

I added new scripts [here](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/package.json) that are utilised within the pipeline.

```json
"cy:verify": "cypress verify",
"cy:run-junit-reporter:component": "cypress run -q --component --reporter junit",
"cy:run-junit-reporter:e2e": "cypress run --reporter junit"
```

### cypress-steps.yml 📄

The content of this [file](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/templates/cypress-steps.yml) was originally within the [azure-pipeline.yml](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/azure-pipeline.yml) file but has been extracted out of there to ensure reusability using YAML templates (very cool 😎).

```yaml
parameters:
  - name: baseUrl
    default: ""
  - name: vmImage
    default: ""

jobs:
  - job: CypressTests
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

      # Need to ensure server is running before running tests and generating a report
      - script: |
          npm install -g wait-on
          npm run start:e2e & wait-on http://localhost/4173 & npm run cy:run-junit-reporter:e2e && npm run cy:run-junit-reporter:component
        continueOnError: True
        displayName: "Run (component, e2e) tests"

      # Generate XML reports for each spec file
      - task: PublishTestResults@2
        displayName: "Publish test results"
        inputs:
          testResultsFormat: "JUnit"
          testResultsFiles: "/home/vsts/work/1/s/cypress/results/result-*.xml"
          testRunTitle: "$(Build.BuildNumber)"
          searchFolder: "$(System.DefaultWorkingDirectory)"
          mergeTestResults: true

      # Publish video artifacts when tests have failed
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

### azure-pipeline.yml 📄

Finally, to bring everything together we utilise the YAML template ^ into this [file](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/azure-pipeline.yml).

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

## End results ✅

The following image shows 2 completed builds within Azure Pipelines at the top - 1 successful and 1 warning, each with artifacts (successful build only has videos and warning as both videos and screenshots). Selecting the **Tests** tab, you can see a summary of the results where you can do the following for a failed test:

* View basic info such as how long the test ran for
* Create a new bug
* View stack trace
* Add to an existing bug
* Associate test to a work item

Usefully, you can also filter in the table shown - for example, you can filter by **Outcome** to see only failed tests.

![alt text](/assets/demo/pipeline%20results.png)

In the **Test Plans > Runs** section in DevOps, you can view the following info (based on the same builds above):

* Able to do the same as above (create new bug, view stack trace etc.)
* View charts
* Download XML test results - it's a zip as there are 2 test runs

![alt text](/assets/demo/test%20runs.png)

## Notes 📝

If you have really bad video artifact quality, check the video compression within your cypress config file.
