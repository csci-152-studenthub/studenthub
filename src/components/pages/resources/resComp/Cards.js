import React, { Component } from 'react';
import '../../../../App.css';
import { Card, List, Button } from 'antd';
import { API, Auth } from "aws-amplify";
import uuid from "uuid";


//implement search 
//listing of cateory
//contact

const { Meta } = Card;

export class Cards extends Component {
  constructor(){
    super();
    this.state = {
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

  async getResources(){
    console.log("Getting studygroups...");
    let email = this.state.currentUser;

    let apiName = 'posts';
    let path = '/resources/get-resources';
    let myInit = {
      body: {user: email}
    };
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
               timestamp: item.timestamp
              }
            ]
          })
        })
        // console.log('Success: ', this.state.study_groups);
      })
      .catch((error) => {
        console.log("Something went wrong: ", error);
      });
  }

  render() {
    return (
      <div>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={this.state.resources}
          renderItem={item => (
            <List.Item>
              <Card
                hoverable
                title={item.resource_title}
                cover={<img src={item.url} />}
                // actions={[<Icon type="setting" />, <Icon type="edit" />]}
              >
                <Meta
                  // avatar={<Avatar src={item.image} />}
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

export default Cards