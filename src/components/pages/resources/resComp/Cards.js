import { Layout, Menu, Breadcrumb } from 'antd';
import React, { Component } from 'react';
import '../../../../App.css';
import { Card, Icon, Avatar, Col, Row } from 'antd';
import game from "./game.jpg";
import music from "./music.jpg";
import book from "./book.jpg";


const { Content, } = Layout;

const { Meta } = Card;

export class Cards extends Component {
  render() {
    return (
      <Layout>

        <Content style={{ padding: "0px 75px", marginTop: 25, marginBottom: "25%" }}>
          <div style={{ background: '#a0beef', padding: '30px' }}>
            <Row gutter={16}>
              <Col span={8}>
                <Card
                  hoverable
                  style={{}}
                  cover={<img alt="example" src={game} height="175" />}
                  actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                >
                  <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="Gaming Room"
                    description="Take a break with some innovating games"
                  />
                </Card>
              </Col>

              <Col span={8}>
                <Card
                  hoverable
                  cover={<img alt="example" src={book} height="175" />}
                  actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                >
                  <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="Books"
                    description="Train your brain with some book reading"
                  />
                </Card>
              </Col>

              <Col span={8}>
                <Card
                  hoverable
                  cover={<img alt="example" src={music} height="175" />}
                  actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                >
                  <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="Media"
                    description="Relax to some great musics of your choice"
                    style={{height:"0px 42px"}}
                  />
                </Card>
              </Col>
            </Row>
          </div>

          <div >
            <Row gutter={16}>
              <Col span={8}>
                <Card hoverable title="Card title" bordered={true}>Card1</Card>
              </Col>
              <Col span={8}>
                <Card hoverable title="Card title" bordered={false}>Card content</Card>
              </Col>
              <Col span={8}>
                <Card hoverable title="Card title" bordered={false}>Card content</Card>
              </Col>
            </Row>
          </div>

        </Content>

      </Layout>
    )
  }
}

export default Cards