import React, { Component } from 'react'
import { Typography, Button, Modal, Card, List } from 'antd';
import "./Resources.css";
import "./resComp/Cards.js";
import Cards from './resComp/Cards.js';
import ResourceForm from './CreateResource.js';




const { Title } = Typography;
const { Meta } = Card;
export class Resources extends Component {
  constructor(props){
    super(props);
    this.state ={
      visible: false,
      data:[
      {
        title: "Notes for CSCI 115",
        description: "Lecture on Algorithms",
        uri: `https://unsplash.it/150/200?image=11`   
      },
    ]
  }
}

  componentDidMount() {
    this.props.handler("Resources");
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }


  render() {
    return (
      <div className="resources-container">
       <List
          grid={{ gutter: 10, column: 4 }}
          dataSource={this.state.data}
          renderItem={item => (
            <List.Item>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt="example" src={item.uri} />}
              >
                <Meta
                  title={item.title}
                  description={item.description}
                />
              </Card>
              
            </List.Item>
          )}
        />,
        <Cards />
        <Button type="primary" onClick={this.showModal}>Create a Resource</Button>
        <Modal
            title="Create a Resource"
            style={{top: 30}}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
          <ResourceForm/>
        </Modal>
      </div>
    )
  }
}

export default Resources
