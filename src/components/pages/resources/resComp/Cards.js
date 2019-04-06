import React, { Component } from 'react';
import '../../../../App.css';
import { Card, Icon, Avatar, List, } from 'antd';
import game from "./game.jpg";
import music from "./music.jpg";
import book from "./book.jpg";
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
      data: [
        {
          title: 'Gamer',
          url: game,
          image: pikachu,
          description: 'Take a break with some innovating games',
        },
        {
          title: 'Title 2',
          url: game,
          image: booki,
          description: 'Take a break with some innovating games',
        },
        {
          title: 'Title 3',
          url: game,
          image: pac,
          description: 'Take a break with some innovating games',
        },
      ]
    }
  }
  render() {
    return (
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={this.state.data}
        renderItem={item => (
          <List.Item>
            <Card
              hoverable
              //title={item.title}
              cover={<img src={item.url} />}
              actions={[<Icon type="setting" />, <Icon type="edit" />]}
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
    )
  }
}

export default Cards