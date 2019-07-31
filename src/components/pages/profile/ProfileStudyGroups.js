import React, { Component } from 'react'
import {
  List,
  Card, 
} from 'antd';

const { Meta } = Card;

export class ProfileStudyGroups extends Component {
  constructor(props){
    super(props);

    this.state ={
      cardsLoading: true,
    };

  }

  render() {
    let studygroups = this.props.study_groups;

    const blankData = [];
    for (let i = 0; i < 5; i++) {
      blankData.push({
        title: `Blank title`,
        description: 'Blank description',
        content: 'Blank content',
      });
    }

    return (
      <div>
        <List
          grid={{ column: 1 }}
          dataSource={studygroups === undefined ? blankData : studygroups}
          renderItem={item => (
            <List.Item
              key={item.groupId}
            >
              <Card
                hoverable
                style={{ width: "100%", marginTop: 16 }}
                loading={item.title === ""}
              >
                <Meta
                  onClick={() => this.props.switch(item)}
                  title={item.group_name}
                  description={item.description}
                />
              </Card>
            </List.Item>
          )}
        />

        {/*<Modal*/}
        {/*  title={this.state.currentCard === undefined ? "Loading..." : this.state.currentCard.group_name}*/}
        {/*  style={{top: 30}}*/}
        {/*  visible={this.state.cardModalVisible}*/}
        {/*  onCancel={this.handleCardModalCancel}*/}
        {/*  footer={null}*/}
        {/*    >*/}
        {/*  {this.state.currentCard === undefined ?*/}
        {/*    <Skeleton />*/}
        {/*    :*/}
        {/*    <div>*/}
        {/*      <Text><Text style={{fontWeight: "bold"}}>Description: </Text>{this.state.currentCard.description}</Text><br/>*/}
        {/*      <Text><Text style={{fontWeight: "bold"}}>Course: </Text>{this.state.currentCard.course}</Text><br/>*/}
        {/*      <Text><Text style={{fontWeight: "bold"}}>Professor: </Text>{this.state.currentCard.professor}</Text><br/>*/}
        {/*      <Text style={{fontWeight: "bold"}}>Members: </Text>{this.state.currentCard.members.map((member, key) => {*/}
        {/*      return (<div key={key}><Text>{member}</Text></div>)*/}
        {/*    })}*/}
        {/*    </div>*/}
        {/*    }*/}
        {/*</Modal>*/}
      </div>
    )
  }
}

export default ProfileStudyGroups
