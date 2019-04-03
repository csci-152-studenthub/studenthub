import { Layout, Menu, Breadcrumb } from 'antd';
import React, { Component } from 'react';
import '../../../../App.css';
import { Card, Icon, Avatar, Col, Row } from 'antd';
import game from "./game.jpg";
import music from "./music.jpg";
import book from "./book.jpg";
import booki from "./book1.png"
import pikachu from "./pikachu.png";
import pac from "./pac1.jpg";

//implement search 
//listing of cateory
//contact
const { Content, } = Layout;
const { Meta } = Card;

export class Cards extends Component {
  render() {
    return (
      <Layout>
        <div style={{ color: "white", padding: "10px 400px", textAlign: "center", lineHeight: '64px', fontSize: "40px" }}>
          <Content style={{ backgroundColor: "#000066" }}>
            Resources Page
          </Content>
        </div>

        <Content style={{ padding: "0px 75px", marginTop: 0, marginBottom: "25%" }}>
          <Breadcrumb style={{ margin: '10px' }}>
            <Breadcrumb.Item ><a onClick={this.props.switchPage}>Home</a></Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>

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
                <Card title="References" bordered={false} > Our webpage is created using
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

        </Content>

      </Layout>
    )
  }
}

export default Cards