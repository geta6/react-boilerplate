/* global jest, expect */

import 'babel-core/polyfill';
import React from 'react';
import ReactTestUtils, {createRenderer} from 'react-addons-test-utils';
import {navigateAction} from 'fluxible-router';
import {createMockComponentContext} from 'fluxible/utils';

jest.dontMock('../ApplicationComponent');
jest.dontMock('../../handlers/ErrorHandler');
jest.dontMock('../../stores/RouteStore');
jest.dontMock('../../stores/ErrorStore');

const ApplicationComponent = require('../ApplicationComponent');
const RouteStore = require('../../stores/RouteStore');
const ErrorStore = require('../../stores/ErrorStore');

class MockRouteStore extends RouteStore {}
class MockErrorStore extends ErrorStore {}

describe('Application', () => {
  const context = createMockComponentContext({stores: [MockRouteStore, MockErrorStore]});

  it('should set state', async () => {
    context.executeAction(navigateAction, {url: '/'});
    const renderer = createRenderer();
    renderer.render(<ApplicationComponent context={context} />);
    const result = renderer.getRenderOutput();
    expect(result.type).to.be('div');
    ReactTestUtils.renderIntoDocument(<ApplicationComponent context={context} />);
  });
});
