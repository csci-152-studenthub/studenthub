import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SignUpComponent from '../src/components/pages/auth/SignUp.component';

Enzyme.configure({adapter: new Adapter() });

describe("ChangePassword", () => {
  test("renders correctly", () => {
    const wrapper = shallow(<SignUpComponent />);

    expect(wrapper.exists()).toBe(true);
  });

  test("Should have no values ", () => {
    const wrapper = shallow(<SignUpComponent />);
    expect(wrapper.find('confirmDirty').length).toBe(0);
    expect(wrapper.find('autoCompleteResult').length).toBe(0);
    expect(wrapper.find('.buttonLoading').length).toBe(0);
    expect(wrapper.find('.myValidateHelp').length).toBe(0);
    expect(wrapper.find('.myValidateStatus').length).toBe(0);
  });


});

