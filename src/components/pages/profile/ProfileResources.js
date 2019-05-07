import React, { Component } from 'react'
import {
  List,
  Card,
  Carousel, 
  Modal, 
  Typography, 
  Divider, 
  Avatar,
  Empty
} from 'antd';
import './ProfileResources.css'
import { API, Auth } from "aws-amplify";

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;

export class ProfileResources extends Component {
  constructor(props){
    super(props);

    this.state ={
      cardsLoading: true,
    };

    this.openCard = this.openCard.bind(this);
  }

  componentDidMount(){
    this.getResources();
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

  async getResources(){
    
    console.log('prop user: ', this.props.currentUser)
    let apiName = 'posts';
    let path = '/resources/get-resources';
    let myInit = {
      body: {user: this.props.currentUser}
    };
    this.setState({
      resources: [],
    });
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
        });
        // console.log('Success: ', this.state.study_groups);
      })
      .catch((error) => {
        console.log("Something went wrong: ", error);
      });
  }


  render() {
    // let cardsLoading = this.state.cardsLoading;

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
          grid={{ gutter: 16, column: 2 }}
          dataSource={this.state.resources}
          renderItem={item => (
            <List.Item>
              <Card
                hoverable
                style={{ width: '100%', height: 150, overflow: 'auto' }}
              >
                <Meta
                  onClick={() => this.openCard(item)}
                  title={item.resource_title}
                  description={item.resource_description}
                />
              </Card>

            </List.Item>
          )}
        />
      </div>
    )
  }
}

export default ProfileResources
