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
const data = [
  {
    title: 'Gamer',
    url: game,
    ava: pikachu,
    discr: 'Take a break with some innovating games',
  },
  {
    title: 'Title 2',
    url: book,
    ava: booki,
    discr: '',
  },
  {
    title: 'Title 3',
    url: music,
    ava: pac,
    discr: '',
  },
];

export class Cards extends Component {
  render() {
    return (
      <div style={{ backgroundColor: "white" }}>
        <a onClick={this.props.switchPage} >Home</a>
        <p> </p>
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <Card
                //title={item.title}
                cover={<img src={item.url} height="175" />}
                actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
              >
                <Meta
                  avatar={<Avatar src={item.ava} />}
                  title={item.title}
                  description={item.discr}
                />
              </Card>
            </List.Item>
            /* <Layout>
              <a onClick={this.props.switchPage}>Home</a>
                
      
                <div style={{ background: '#a0beef', padding: '30px' }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Card
                        style={{}}
                        cover={<img alt="example" src={game} height="175" />}
                        actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                      >
                        <Meta
                          avatar={<Avatar src={pikachu} />}
                          title="Gaming Room"
                          description="Take a break with some innovating games"
                        />
                      </Card>
                    </Col>
      
                    <Col span={8}>
                      <Card
                        cover={<img alt="example" src={book} height="175" />}
                        actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                      >
                        <Meta
                          avatar={<Avatar src={booki} />}
                          title="Books"
                          description="Train your brain with some book reading"
                        />
                      </Card>
                    </Col>
      
                    <Col span={8}>
                      <Card
                        cover={<img alt="example" src={music} height="175" />}
                        actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                      >
                        <Meta
                          avatar={<Avatar src={pac} />}
                          title="Media"
                          description="Relax to some great musics of your choice"
                          style={{ height: "0px 42px" }}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
      
                <div style={{ background: '#ECECEC', padding: '30px' }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Card title="Interested" bordered={true}>Find out what makes Student Hub a one of a kind website</Card>
                    </Col>
                    <Col span={8}>
                      <Card title="References" bordered={false} > Our webpage was created using
                        <a href ="https://reactjs.org/" style={{textDecoration:"underline"}}>
                        <span> Reactjs </span>
                        </a>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card title="Events" bordered={false}>Check back later for new events near your local community</Card>
                    </Col>
                  </Row>
                </div>
      
            </Layout> */
          )}
        />
      </div>
    )
  }
}

export default Cards