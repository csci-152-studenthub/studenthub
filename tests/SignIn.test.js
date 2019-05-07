import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SignIn from '../src/components/pages/auth/SignIn';

Enzyme.configure({adapter: new Adapter() });

describe("SignIn Component", () => {
  test("renders correctly", () => {
    const wrapper = shallow(<SignIn />);

    expect(wrapper.exists()).toBe(true);
  });

  test("Should have no values for password and email", () => {
    const fakeEvent = { preventDefault: () => console.log('preventDefault') };
    const wrapper = shallow(<SignIn />);
    expect(wrapper.find('.email').length).toBe(0);
    expect(wrapper.find('.password').length).toBe(0);
    //wrapper.find('message').simulate('handlesubmit', fakeEvent);
    //expect(wrapper.find(message).length).toBe(1);
    //loginComponent.find('.form-login').simulate('submit', fakeEvent);
    //expect(wrapper.find(Notification).length).toBe(1);
  });

  // it('should fail if no email or password are provided', () => {
  //   const fakeEvent = { preventDefault: () => console.log('preventDefault') };
  //   const wrapper = shallow(<SignIn />);
  //   expect(wrapper.find('.email').length).toBe(0);
  //   wrapper.find('.login-form').trigger('handleSubmit', fakeEvent);
  //   expect(loginComponent.find(Notification).length).toBe(0);

  // describe("handleChange", () => {
  // it("should call setState on title", () => {
  //   const mockEvent = {
  //     target: {
  //       email: "title",
  //       password: "test"
  //     }
  //   };
  //   const expected = {
  //     loading: false,
  //     buttonLoading: false,
  //     formType: 0,
  //     email: "",
  //     password: ""
  //   };
  //   const wrapper = shallow(<SignIn />);
  //   wrapper.instance().handleChange(mockEvent);
    
  //   expect(wrapper.state()).toEqual(expected);
  // });

    // });


});

