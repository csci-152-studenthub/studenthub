//unit test for functions in signIn.js page\
import React, { Component } from 'react';
import { shallow, mount, render } from 'enzyme';
import SignInComponent from '../SignIn.component.js';


describe('Sign in Component see if it renders', () => {
    // make our assertion and what we expect to happen 
    it('should render without throwing an error', () => {
      expect(shallow(<SignInComponent/>).find('sign_in').exists()).toBe(true)
    })
   })