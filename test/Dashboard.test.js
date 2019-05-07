import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Dashboard from '../src/components/pages/dashboard/Dashboard';

Enzyme.configure({adapter: new Adapter() });

describe("ChangePassword", () => {
  test("renders correctly", () => {
    const wrapper = shallow(<Dashboard />);

    expect(wrapper.exists()).toBe(true);
  });

  // test("Should have no values ", () => {
  //   const wrapper = shallow(<Dashboard />);
  //   expect(wrapper.find('.current_subfeed').toBe(0));
  //   expect(wrapper.find('.statistics').toBeUndefined());
  //   expect(wrapper.find('.loading').toBeTruthy());
  // });
  
});
