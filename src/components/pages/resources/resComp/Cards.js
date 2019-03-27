import { Layout, Menu, Breadcrumb } from 'antd';
import React, { Component } from 'react'
import '../../../../App.css';
import { Card, Icon, Avatar } from 'antd';
import { Col, Row } from 'antd';
const { Content, } = Layout;

const { Meta } = Card;

export class Cards extends Component {
  render() {
    return (

      <Layout>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ textAlign: "center", lineHeight: '64px' }}
          >
            <Menu.Item key='2' style={{ fontSize: "32px" }}>Resources Page</Menu.Item>

          </Menu>

        <Content style={{ padding: "0px 75px", marginTop: 25, marginBottom: "50%" }}>
          <Breadcrumb style={{ margin: '10px' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ background: '#ECECEC', padding: '30px' }}>
            <Row gutter={16}>
              <Col span={8}>
                <Card title="Card title" bordered={false}>Card content</Card>
              </Col>
              <Col span={8}>
                <Card title="Card title" bordered={false}>Card content</Card>
              </Col>
              <Col span={8}>
                <Card title="Card title" bordered={false}>Card content</Card>
              </Col>
            </Row>
          </div>

          <div style={{ background: '#a0beef', padding: '30px' }}>
            <Row gutter={16}>
              <Col span={8}>
                <Card
                  style={{ width: 300 }}
                  cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                  actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                >
                  <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="Card title"
                    description="This is the description"
                  />
                </Card>
                /</Col>

              <Col span={8}>
                <Card
                  style={{ width: 300 }}
                  cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                  actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                >
                  <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="Card title"
                    description="This is the description"
                  />
                </Card>
                /</Col>

              <Col span={8}>
                <Card
                  style={{ width: 300 }}
                  cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                  actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                >
                  <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="Card title"
                    description="This is the description"
                  />
                </Card>
                /</Col>
            </Row>
          </div>

        </Content>

      </Layout>
    )
  }
}

export default Cards