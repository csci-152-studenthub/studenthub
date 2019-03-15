import React, { Component } from 'react';
// import { Layout } from 'antd';
// import { Button } from 'antd';
// import { List, Icon, Tag } from 'antd';

import { List, Avatar, Icon } from 'antd';

export class CardContainer extends Component {
    
  render() {
    const listData = [];
    for (let i = 0; i < 22; i++) {
      listData.push({
        href: 'http://ant.design',
        title: `ant design part ${i}`,
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
        image: 'https://picsum.photos/200',
      });
    }

    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 2}} />
        {text}
      </span>
    );

    return (
      <List
      itemLayout="vertical"
      size="large"
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 3,
      }}
      dataSource={listData}
      renderItem={item => (
        <List.Item
          key={item.title}
          actions={[<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />, <IconText type="message" text="2" />]}
          // extra={<img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />}
        >
        <List.Item.Meta
          avatar={<Avatar src={item.avatar} />}
          title={<a href={item.href}>{item.title}</a>}
          description={item.description}
          image={<img alt="Insert Image here" width={272} src={item.image}/>}
        />
        {item.content}
        </List.Item>
      )}
    />
);
  }
}

export default CardContainer
