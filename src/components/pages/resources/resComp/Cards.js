import { Layout } from 'antd';
import React, { Component } from 'react';
import { Card, Icon, Avatar, Col, Row, List } from 'antd';
import game from "./game.jpg";
import music from "./music.jpg";
import book from "./book.jpg";


const { Meta } = Card;

export class Cards extends Component {
  constructor(){
    super();
    
    this.state = {
      data: [
        {
          title: 'Title 1',
          description: 'Blah Blah Blah',
          image: ''
        },
        {
          title: 'Title 2',
          description: 'Blah Blah Blah',
          image: ''
        },
        {
          title: 'Title 3',
          description: 'Blah Blah Blah',
          image: ''
        },
        {
          title: 'Title 4',
          description: 'Blah Blah Blah',
          image: ''
        },
        {
          title: 'Title 1',
          description: 'Blah Blah Blah',
          image: ''
        },
        {
          title: 'Title 2',
          description: 'Blah Blah Blah',
          image: ''
        },
        {
          title: 'Title 3',
          description: 'Blah Blah Blah',
          image: ''
        },
        {
          title: 'Title 4',
          description: 'Blah Blah Blah',
          image: ''
        },

      ]
     
    }
  }



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

          <div style={{ background: '#ECECEC', padding: '30px' }}>
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
  
      //         <Col span={8}>
      //           <Card
      //             cover={<img alt="example" src={book} height="175" />}
      //             actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
      //           >
      //             <Meta
      //               avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
      //               title="Books"
      //               description="Train your brain with some book reading"
      //             />
      //           </Card>
      //         </Col>

      //         <Col span={8}>
      //           <Card
      //             cover={<img alt="example" src={music} height="175" />}
      //             actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
      //           >
      //             <Meta
      //               avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
      //               title="Media"
      //               description="Relax to some great musics of your choice"
      //             />
      //           </Card>
      //         </Col>
      //       </Row>
      //     </div>
      //   </Content>
      // </Layout>
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={this.state.data}
      renderItem={item => (
        <List.Item>
          <Card
            hoverable
            cover={<img alt="example" src={game} />}
            actions={[<Icon type="setting" />, <Icon type="edit" />]}
          >
          <Meta
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