import { mount } from "cypress/react18";

import "@cypress/code-coverage/support";
import "./commands";

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}


Cypress.Commands.add('mount', (component, options) => {
  return mount(component, options)
})