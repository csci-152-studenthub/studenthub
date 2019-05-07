import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ExceptionPage from '../src/components/pages/exception/Exception';
import Exception from 'ant-design-pro/lib/Exception';

Enzyme.configure({adapter: new Adapter() });

// const obj ={Symbol(enzyme.__root__): [Circular], Symbol(enzyme.__unrendered__): <ExceptionPage />, Symbol(enzyme.__renderer__): {"batchedUpdates": [Function batchedUpdates], "checkPropTypes": [Function checkPropTypes], "getNode": [Function getNode], "render": [Function render], "simulateError": [Function simulateError], "simulateEvent": [Function simulateEvent], "unmount": [Function unmount]}, Symbol(enzyme.__node__): {"instance": null, "key": undefined, "nodeType": "class", "props": {"backText": "back to sign in", "desc": "You don't have access to this page.", "redirect": "/", "type": "403"}, "ref": null, "rendered": null, "type": [Function Exception]}, Symbol(enzyme.__nodes__): [{"instance": null, "key": undefined, "nodeType": "class", "props": {"backText": "back to sign in", "desc": "You don't have access to this page.", "redirect": "/", "type": "403"}, "ref": null, "rendered": null, "type": [Function Exception]}], Symbol(enzyme.__options__): {"adapter": {"options": {"enableComponentDidUpdateOnSetState": true, "legacyContextMode": "parent", "lifecycles": {"componentDidUpdate": {"onSetState": true}, "getChildContext": {"calledByRenderer": false}, "getDerivedStateFromProps": true, "getSnapshotBeforeUpdate": true, "setState": {"skipsComponentDidUpdateOnNullish": true}}}}}, Symbol(enzyme.__childContext__): null};
describe("Exception page ", () => {
  test("exception component renders correctly", () => {
    const wrapper = shallow(< ExceptionPage/>);

    expect(wrapper.exists()).toBe(true);
  });

// this test not working should return an object of exception need to be done  
//   test("Should have Exception Type ", () => {
//     const wrapper = shallow(<ExceptionPage />);
//     expect(wrapper).toMatchObject(obj)
//   });
 


});

