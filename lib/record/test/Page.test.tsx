import * as React from 'react';
import { shallow } from 'enzyme';

import * as Record from '../Page';
import { PageMeta } from '../PageMeta';
import { Query } from '../Query';
import { SetupAPI } from '../SetupAPI';

describe('Record: Page', () => {
  describe('Page', () => {
    const { Page } = Record;

    const instance = Page();

    describe('defaults', () => {
      it('has correct default meta', () => {
        expect(instance.meta).toEqual(PageMeta());
      });
  
      it('has correct default select', () => {
        expect(instance.select('a')).toEqual('a');
      });

      it('has correct default component', () => {
        const wrapper = shallow(<instance.component />);

        expect(wrapper.text()).toEqual('Undefined component.');
      });

      it('has correct default setup', () => {
        const query = Query({});
        const api = SetupAPI({});

        return expect(instance.setup(query, api)).resolves.toBe(undefined);
      });
    });
  });
});
