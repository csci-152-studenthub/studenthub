import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ForgotPasswordComponent from '../src/components/pages/auth/ForgotPassword.component';

Enzyme.configure({adapter: new Adapter() });

describe("ForgotPassword", () => {
  test("renders correctly", () => {
    const wrapper = shallow(<ForgotPasswordComponent />);

    expect(wrapper.exists()).toBe(true);
  });

  test("Should have no values ", () => {
    const wrapper = shallow(<ForgotPasswordComponent />);
    expect(wrapper.find('.email').length).toBe(0);
    expect(wrapper.find('.password').length).toBe(0);
    expect(wrapper.find('.buttonLoading').length).toBe(0);
    expect(wrapper.find('.formType').length).toBe(0);
  });


});

