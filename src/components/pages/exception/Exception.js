import React from 'react';
import 'antd/dist/antd.css';
import '../../../index.css';
import 'ant-design-pro/dist/ant-design-pro.css';
import Exception from 'ant-design-pro/lib/Exception';

export default class ExceptionPage extends React.Component{

  render() {
    return (
      <Exception type="403" desc="You don't have access to this page." backText="back to sign in" />
    );
  }
}
