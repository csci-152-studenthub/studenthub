import React, { Component } from 'react'
import {
  List,
  Card,
  Carousel, Skeleton, Modal, Icon, Typography, Divider, Avatar
} from 'antd';
import './ProfileResources.css'
const { Title, Paragraph, Text } = Typography;

// import { API } from "aws-amplify";

const { Meta } = Card;

export class ProfileResources extends Component {
  constructor(props){
    super(props);

    this.state ={
      cardsLoading: true,
    };

    this.openCard = this.openCard.bind(this);
  }

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
    // let cardsLoading = this.state.cardsLoading;
    let data = [
      {
        title: "Notes for CSCI 152",
        description: "Lecture on Solid Principles",
        uri: `https://unsplash.it/150/200?image=11`
      },
      {
        title: "Notes for Physics",
        description: "E=mc square",
        uri: `https://unsplash.it/150/200?image=1`
      },
      {
        title: "Notes for CSCI 130",
        description: "Lecture on Web dev",
        uri: `https://unsplash.it/150/200?image=3`
      },
      {
        title: "Notes for Chemisty",
        description: "Chemisty",
        uri: `https://unsplash.it/150/200?image=8`
      },
      {
        title: "Notes for Biology",
        description: "Cells",
        uri: `https://unsplash.it/150/200?image=9`
      },
      {
        title: "Notes for English",
        description: "English",
        uri: `https://unsplash.it/150/200?image=4`
      },
    ];

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

    function onChange(a, b, c) {
      console.log(a, b, c);
    }

    // const blankData = [];
    // for (let i = 0; i < 5; i++) {
    //   blankData.push({
    //     title: `Blank title`,
    //     description: 'Blank description',
    //     content: 'Blank content',
    //   });
    // }

    return (
      <div>
        <List
          grid={{ gutter: 10, column: 3 }}
          dataSource={data}
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
        />

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
            <Carousel afterChange={onChange}>
              <div>
                <Carousel vertical afterChange={onChange}>
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
      </div>
    )
  }
}

export default ProfileResources
