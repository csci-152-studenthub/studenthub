import React, { Component } from 'react';
import '../../../../App.css';
import { Card, List, Button } from 'antd';
import { API, Auth } from "aws-amplify";
import uuid from "uuid";

import game from "./game.jpg";
import booki from "./book1.png"
import pikachu from "./pikachu.png";
import pac from "./pac1.jpg";

//implement search 
//listing of cateory
//contact

const { Meta } = Card;

export class Cards extends Component {
  constructor(){
    super();
    this.state = {
      data: [],
      user:''
    }
  }
  
  async componentDidMount(){
    this.getResources();
    Auth.currentAuthenticatedUser({
      bypassCache:true
    }).then(user =>{
      this.setState({user: user.attributes.preferred_username});
    })
    .catch(error => console.log(error));
  }

  async createResources(){
    let resourceId = 'resource-'+uuid.v4().toString();
    let resource_title = "this.state.title";
    let resource_description = "this.state.description";
    let created_by = this.state.user;
    let timestamp = new Date().toLocaleString();

    let apiName = 'posts';
    let path = '/resources/create-resource';
    let myInit = {
      body: {resourceId, resource_title, resource_description, created_by, timestamp}
    }
    await API.post(apiName, path, myInit).then(response => {
      console.log("Resource post sent", response);
     
    }).catch(error => {
      console.log(error);
    })
  }

  async getResources(){
    const resources = await API.get("posts", "/resources/get-resources");
    console.log("Resources here:", resources);
  }

  render() {
    return (
      <div>
        <Button onClick={() => this.createResources() }>Create Resource</Button>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={this.state.data}
          renderItem={item => (
            <List.Item>
              <Card
                hoverable
                //title={item.title}
                cover={<img src={item.url} />}
                // actions={[<Icon type="setting" />, <Icon type="edit" />]}
              >
                <Meta
                  // avatar={<Avatar src={item.image} />}
                  title={item.title}
                  description={item.description}
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