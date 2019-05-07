import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SignIn from '../src/components/pages/auth/SignIn';

Enzyme.configure({adapter: new Adapter() });

describe("SignIn Component", () => {
  test("renders", () => {
    const wrapper = shallow(<SignIn />);

    expect(wrapper.exists()).toBe(true);
  })
});

describe("SignIn Component", () => {
  test("renders", () => {
    const wrapper = shallow(<SignIn />);

    expect(wrapper.exists()).toBe(true);
  })
});