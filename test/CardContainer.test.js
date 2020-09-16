import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CardContainer from '../src/components/pages/Feeds/CardContainer';

Enzyme.configure({adapter: new Adapter() });

describe("Card Container", () => {
  test("renders correctly", () => {
    const wrapper = shallow(<CardContainer />);

    expect(wrapper.exists()).toBe(true);
  });


  // this test needs to have mock functions for the api and made async so it is faster
  // test("Card container should have no values ", () => {
  //   const wrapper = shallow(<CardContainer />);
  //   expect(wrapper.find('.deleteSubfeedLoading').length).toBe(0);
  //   expect(wrapper.find('.confirmModalLoading').length).toBe(0);
  //   // expect(wrapper.find('.buttonLoading').length).toBe(0);
  //   // expect(wrapper.find('.formType').length).toBe(0);
  // });
  
});
