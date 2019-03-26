import React, { Component } from 'react';
import { Typography } from 'antd';
import './Studygroup.css';


const { Title } = Typography;
export class Studygroup extends Component {
  render() {
    return (
      <div className="studygroup-container">
        <Title>Studygroup Page</Title>
      </div>
    )
  }
}

export default Studygroup
