import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ChangePasswordComponent from '../src/components/pages/auth/ChangePassword.component';

Enzyme.configure({adapter: new Adapter() });

describe("ChangePassword", () => {
  test("renders correctly", () => {
    const wrapper = shallow(<ChangePasswordComponent />);

    expect(wrapper.exists()).toBe(true);
  });

  test("Should have no values ", () => {
    const fakeEvent = { preventDefault: () => console.log('preventDefault') };
    const wrapper = shallow(<ChangePasswordComponent />);
    expect(wrapper.find('.email').length).toBe(0);
    expect(wrapper.find('.password').length).toBe(0);
    expect(wrapper.find('.code').length).toBe(0);
    expect(wrapper.find('.buttonLoading').length).toBe(0);
    expect(wrapper.find('.formType').length).toBe(0);
  });
  
});

