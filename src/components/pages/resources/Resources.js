import React, { Component } from 'react'
import {Typography, Button, Modal, Card, List, Carousel, Divider, Avatar} from 'antd';
import "./Resources.css";
import "./resComp/Cards.js";
import Cards from './resComp/Cards.js';
import CreateResource from './CreateResource.js';


export class Resources extends Component {
  constructor(props){
    super(props);
    this.state ={
      newResource: false, 
      visible: false, //controls Create Resource modal
    };
  }

  componentDidMount() {
    this.props.handler("Resources");
  }


  showComponent = () => {
    this.setState( prevState => ({
      visible: !prevState.visible,
    }));
  }

  hideComponent = (value) => {
    this.setState({
      visible: value,
    });
  };

  handleResources = (value) => {
    this.setState({
      newResource: value,
    });
  }
  

  render() {
    return (
      <div className="resources-container">

        <Cards updateResources={this.state.newResource} />
        <Button type="primary" onClick={this.showComponent}>Create Flashcards</Button>
        {this.state.visible ? <CreateResource handleComponent={this.hideComponent} handleCards={this.handleResources}/> : null} 
      </div>
    )
  }
}

export default Resources
