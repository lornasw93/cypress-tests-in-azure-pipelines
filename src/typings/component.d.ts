import { MountReturn, MountOptions } from "cypress/react18";

type CustomMountOptions = MountOptions & {
  routerProps?: MemoryRouterProps;
  reduxStore?: typeof store;
};

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: (
        jsx: React.ReactNode,
        options?: CustomMountOptions,
        renderKey?: string,
      ) => Cypress.Chainable<MountReturn>;

      /**
       * This command returns the element with the give data-cy selector
       */
      getDataCy: typeof cy.get,
    }
  }
}
