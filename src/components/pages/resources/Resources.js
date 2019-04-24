import React, { Component } from 'react'
import {Typography, Button, Modal, Card, List, Carousel, Divider, Avatar} from 'antd';
import "./Resources.css";
import "./resComp/Cards.js";
import Cards from './resComp/Cards.js';
import ResourceForm from './CreateResource.js';




const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;
export class Resources extends Component {
  constructor(props){
    super(props);
    this.state ={
      cardsLoading: true,
      visible: false,
      data:[
      {
        title: "Notes for CSCI 152",
        description: "Lecture on Algorithms",
        uri: `https://unsplash.it/150/200?image=11`   
      },
    ]
  };

    this.openCard = this.openCard.bind(this);
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
  };

  openCard = (item) => {
    this.setState({
      currentCard: item,
      cardModalVisible: true
    });
    console.log(`Opening group card '${item.group_name}'`);

  };

  handleCardModalCancel = () => {
    this.setState({
      cardModalVisible: false,
    });
  };


  render() {
    const comments = [
      {
        title: 'This is really helpful!',
        user: "Nina"
      },
      {
        title: 'I almost forgot to study these, thanks for the cards!',
        user: "Stanley"
      },
    ];
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
                  onClick={() => this.openCard(item)}
                  title={item.title}
                  description={item.description}
                />
              </Card>
              
            </List.Item>
          )}
        />,

        <Modal
          title={this.state.currentCard === undefined ? "Loading..." : this.state.currentCard.title}
          style={{top: 30}}
          width={1000}
          visible={this.state.cardModalVisible}
          onCancel={this.handleCardModalCancel}
          footer={null}
        >
          <div >
            <Title level={4}>Posted by: <Text>ecast96</Text></Title>
            <Title level={4} style={{lineHeight: 0}}>Description</Title>
            <div>
              <Paragraph>
                Just some definitions of SOLID principles.
              </Paragraph>
            </div>
            <Carousel>
              <div>
                <Carousel vertical>
                  <div><h3>Open-Closed Principle</h3></div>
                  <div><h3>Software entities should be open for extension, but closed for modification</h3></div>
                </Carousel>
              </div>
              <div>
                <Carousel vertical>
                  <div><h3>Liskov Substitution Principle</h3></div>
                  <div><h3>Inheritance should ensure that any property proved about supertype objects also holds for subtype objects</h3></div>
                </Carousel>
              </div>
              <div>
                <Carousel vertical>
                  <div><h3>Dependency	Inversion Principle</h3></div>
                  <div><h3>High-level	modules	should not depend on low-level module implementations. Both levels should depend on abstractions.</h3></div>
                </Carousel>
              </div>
            </Carousel>
          </div>
          <Divider />
          <Title level={4}>Comments</Title>
          <List
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: '#1890FF'}} icon="user" />}
                  title={<Text>{item.title}</Text>}
                  description={<Text>{item.user}</Text>}
                />
              </List.Item>
            )}
          />
        </Modal>
        {/* <Cards />

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
