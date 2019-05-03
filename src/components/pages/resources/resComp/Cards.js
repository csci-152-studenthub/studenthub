import React, { Component } from 'react';
import '../../../../App.css';
import { Card, List, Button, Skeleton, Modal, Carousel, Divider, Typography, Empty, ConfigProvider} from 'antd';
import { API, Auth } from "aws-amplify";
import uuid from "uuid";

import "../Resources.css";


//sort by major
//flip box on click

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;

export class Cards extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      loading: true,
      resources: [],
      user:''
    }
  }
  
  async componentDidMount(){
    Auth.currentAuthenticatedUser({
      bypassCache:true
    }).then(user =>{
      this.setState({user: user.attributes.preferred_username});
    })
    .catch(error => console.log(error));
    this.getResources();
  }

  componentDidUpdate(prevProps){
    if(this.props.updateResources !== prevProps.updateResources){
      this.getResources();
    }
  }

  async getResources(){
    console.log("Getting studygroups...");
    let email = this.state.currentUser;

    let apiName = 'posts';
    let path = '/resources/get-resources';
    let myInit = {
      body: {user: email}
    };
    this.setState({
      resources: [],
      loading: true
    })
    await API.get(apiName, path, myInit)
      .then((response) => {
        console.log("Resources:", response);
        response.body.map((item) => {
          this.setState({
            resources:[
              ...this.state.resources,
              {
               resource_title: item.resource_title,
               resource_id: item.resourceId,
               resource_description: item.resource_description,
               created_by: item.created_by,
               resource_url: item.resource_url,
               resource_comments: [],
               resource_noteCards: item.resource_noteCards,
               timestamp: item.timestamp
              }
            ]
          })
        })
        this.setState({ loading: false });
        // console.log('Success: ', this.state.study_groups);
      })
      .catch((error) => {
        console.log("Something went wrong: ", error);
      });
  }

  openCard = (item) => {
    this.setState({
      currentCard: item,
      visible: true
    });
    console.log(`Opening group card '${item.group_name}'`);

  };

  handleCardModalCancel = () => {
    this.setState({
      visible: false,
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

    const blankData = [];
    for (let i = 0; i < 8; i++) {
      blankData.push({
        resource_title: `Blank title`,
        resource_description: 'Blank description',
      });
    }

    let load = this.state.loading;

    return (
      <div>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={load ? blankData : this.state.resources}
          renderItem={item => (
            <List.Item>
                <Card
                  onClick={ () => this.openCard(item)}
                  hoverable
                  cover={item.url === undefined ? <Empty description={<React.Fragment>No Image</React.Fragment>}/> : <img src={item.url} className="img-resize"/>}
                > 
                <Skeleton loading={load} active >
                  <Meta
                    title={item.resource_title}
                    description={item.resource_description}
                  /> 
                </Skeleton>
                </Card>
            </List.Item>
          )}
        />
        {/* MODAL FILLED WITH NOTECARDS */}
        <Modal
          title={this.state.currentCard === undefined ? "Loading..." : this.state.currentCard.title}
          style={{top: 30}}
          width={1000}
          visible={this.state.visible}
          onCancel={this.handleCardModalCancel}
          footer={null}
        >
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={load ? blankData : console.log(this.state.resources.resource_noteCards)}
          renderItem={noteItem => (
            <List.Item>
                <Card
                  onClick={ () => this.openCard(noteItem)}
                  hoverable
                  cover={noteItem.url === undefined ? <Empty description={<React.Fragment>No Image</React.Fragment>}/> : <img src={noteItem.url} className="img-resize"/>}
                > 
                <Skeleton loading={load} active >
                  <Meta
                    title={noteItem.resource_title}
                    description={noteItem.resource_description}
                  /> 
                </Skeleton>
                </Card>
            </List.Item>
            
          )}
        />
        
        
          {/* <Card
            onClick={ () => this.openCard(item)}
            hoverable
            cover={this.state.currentCard.url === undefined ? <Empty description={<React.Fragment>No Image</React.Fragment>}/> : <img src={this.state.currentCard.url} className="img-resize"/>}
          > 
          <Skeleton loading={load} active >
            <Meta
              title={this.state.currentCard.resource_title}
              description={this.state.currentCard.resource_description}
            /> 
          </Skeleton>
          </Card> */}
        
          {/* <div >
            <Title level={4}>Posted by: <Text>{console.log(this.state.resources.created_by)}</Text></Title>
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
                  title={<Text>{item.title}</Text>}
                  description={<Text>{item.user}</Text>}
                />
              </List.Item>
            )}
          /> */}
        </Modal>

      </div>
    )
  }
}

export default Cards