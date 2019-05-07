import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Cards from '../src/components/pages/dashboard/Cards';

Enzyme.configure({adapter: new Adapter() });

describe("Cards", () => {
  test("renders correctly", () => {
    const wrapper = shallow(<Cards />);

    expect(wrapper.exists()).toBe(true);
  });

 
  
});

