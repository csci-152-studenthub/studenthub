import React, { Component } from 'react'
import { Menu, Icon, Switch, Layout } from 'antd';
import CardContainer from './CardContainer';
import './feeds.css'

const SubMenu = Menu.SubMenu;

export class SiderContainer extends Component {
    render() {
      const {
        Header, Content, Footer, Sider,
      } = Layout;
      return(
        <Layout>
          <Sider
            collapsible
            // breakpoint="lg"
            // collapsedWidth="0"
            // onBreakpoint={(broken) => { console.log(broken); }}
            // onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
          >
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
              <Menu.Item key="1">
                <Icon type="user" />
                <span className="nav-text">nav 1</span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="video-camera" />
                <span className="nav-text">nav 2</span>
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="upload" />
                <span className="nav-text">nav 3</span>
              </Menu.Item>
              <Menu.Item key="4">
                <Icon type="user" />
                <span className="nav-text">nav 4</span>
              </Menu.Item>
            </Menu>
          </Sider>

          <Layout>
            <Header style={{ background: '#fff', padding: 0 }} />
            <Content style={{ className: 'item-grid item-main' }}>
              <div style={{ padding: 24, background: '#fff', minHeight: 618}}>
                <CardContainer/>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              Ant Design ©2018 Created by Ant UED
            </Footer>
         
          </Layout>
        </Layout>
        
      );
    }
  }

    
export default SiderContainer
