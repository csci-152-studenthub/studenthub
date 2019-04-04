import React, { Component } from 'react'
import { Typography, Layout } from 'antd';
import "./Resources.css";
import "./resComp/Cards.js";
import Cards from './resComp/Cards.js';

const { Title } = Typography;
export class Resources extends Component {
  constructor(props){
    super(props);


  }

  componentDidMount() {
    this.props.handler("Resources");
  }

  render() {
    return (
      <div className="resources-container">
        <Cards/>
      </div>
    )
  }
}

export default Resources
