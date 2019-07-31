import React, { Component } from 'react'
import { Button } from 'antd';
import Cards from './Cards.js';
import CreateResource from './CreateResource.js';
import "./Resources.css";

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
  };

  hideComponent = (value) => {
    this.setState({
      visible: value,
    });
  };

  handleResources = (value) => {
    this.setState({
      newResource: value,
    });
  };
  

  render() {
    return (
      <div className="resources-container">
        <Button type="primary" onClick={this.showComponent} style={{width:200}}>Create Flashcards</Button>
        <Cards updateResources={this.state.newResource} />
        {this.state.visible ? <CreateResource handleComponent={this.hideComponent} handleCards={this.handleResources}/> : null} 
      </div>
    )
  }
}

export default Resources
