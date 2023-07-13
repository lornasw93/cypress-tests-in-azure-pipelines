#  Azure Cypress React Dummy Project
The purpose of this dummy project was to run cypress tests within Azure pipelines and better yet, view the test results within the Test Plan section of Azure DevOps so we can view more info (such as error message, screenshot, video) and charts. I wanted to create a minimal project to:

1. Allow me to isolate and test pipeline changes
2. Aid in a potential upcoming blog post as reference material

I used [cypress-junit-reporter](https://www.npmjs.com/package/cypress-junit-reporter) to generate the XML reports based off cypress test results

Only e2e tests, no component tests in this project.

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

## Azure pipeline YAML

I've utilised a YAML template so in future when injecting creation of cypress test results in pipelines, it's reusable. 

### azure-pipeline.yml

The following script has been reduced, see full script [here](here)

[file](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/azure-pipeline.yml) lives here.

```yaml
jobs:
- template: templates/cypress-steps.yml
  parameters:
    baseUrl: http://localhost:4173
    vmImage: 'ubuntu-latest'
```

### templates/cypress-steps.yml

[file](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/templates/cypress-steps.yml) lives here.

The [wait-on](https://www.npmjs.com/package/wait-on) NPM package has been SUPER useful.

```yaml
parameters:
- name: baseUrl
  default: ''
- name: vmImage
  default: ''

jobs:
- job: Cypress_tests
  pool: 
    vmImage: ${{ parameters.vmImage }}
  steps:
    - task: NodeTool@0
      inputs:
        versionSpec: '18.x'
      displayName: 'Install Node.js'

    - script: npm ci
      displayName: 'Install NPM dependencies'

    - script: npm run cy:verify
      displayName: 'Verify Cypress is installed'

    # Using wait-on NPM package, we need to ensure it's running before running tests and generating a report
    - script: |
        npm install -g wait-on
        npm run start:e2e & wait-on ${{parameters.baseUrl}} & npm run cy:run-junit-reporter:e2e
      continueOnError: True
      displayName: 'Run e2e tests'

    # Something here
    - task: PublishTestResults@2
      displayName: 'Publish test results'
      inputs:
        testResultsFormat: 'JUnit'
        testResultsFiles: '/home/vsts/work/1/s/cypress/results/result-*.xml'
        testRunTitle: '$(Build.BuildNumber)'
        searchFolder: '$(System.DefaultWorkingDirectory)'

    # Publish screenshot artifacts only when tests have failed
    - task: PublishBuildArtifacts@1
      displayName: 'Publish screenshots'
      condition: failed()
      continueOnError: True
      inputs:
        PathtoPublish: '/home/vsts/work/1/s/cypress/screenshots'
        ArtifactName: screenshots

    # Publish video artifacts when tests have succeeded or failed
    - task: PublishBuildArtifacts@1
      displayName: 'Publish videos'
      condition: succeededOrFailed()
      continueOnError: True
      inputs:
        PathtoPublish: '/home/vsts/work/1/s/cypress/videos'
        ArtifactName: videos
```

## Project config

### package.json
Take note of these additional scripts that are utilised within the pipeline. Reminder: there are no working component tests in this project but have added the command for full-picture.

[file](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/package.json)

```json
  "cy:verify": "cypress verify",
  "cy:run-junit-reporter:component": "cypress run -q --component --reporter junit",
  "cy:run-junit-reporter:e2e": "cypress run --reporter junit"
```

### cypress.config.ts
Take note of the reporter section at the bottom of the file.

[file](https://github.com/lornasw93/react-vite-cypress-azure-ts/blob/master/cypress.config.ts)

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

## Summary

Blah
