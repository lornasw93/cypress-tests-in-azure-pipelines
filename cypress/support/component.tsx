/* eslint-disable @typescript-eslint/no-namespace */
// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import React from "react";

import { mount, MountOptions } from "cypress/react18";
import { MemoryRouter, MemoryRouterProps } from "react-router-dom";
import { Provider } from "react-redux";

import "@cypress/code-coverage/support";
import "./commands";

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

type CustomMountOptions = MountOptions & {
  routerProps: MemoryRouterProps;
};

Cypress.Commands.add("mount", (component, options = {}) => {
  const {
    routerProps = { initialEntries: ["/"] },
    ...mountOptions
  } = options as CustomMountOptions;

  const wrapped = (
    <Provider store={undefined}>
      <MemoryRouter {...routerProps}>{component}</MemoryRouter>
    </Provider>
  );

  return mount(wrapped, mountOptions);
});
