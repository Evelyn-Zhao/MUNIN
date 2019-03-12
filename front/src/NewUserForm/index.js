import {
    Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Icon,
  } from 'antd';
  import { withRouter } from "react-router-dom";
import { Link } from 'react-router-dom'
  import React, { Component } from 'react';
  const { Option } = Select;
  
  export default class NewUserForm extends Component {
    state = { visible: false };
  
    showDrawer = () => {
      this.setState({
        visible: true,
      });
    };
  
    onClose = () => {
      this.setState({
        visible: false,
      });
    };
  
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <div style={{width:'100%', marginTop:'10px'}}>
            <p  style={{float: 'left',width:'60%'}}><i>Cannot find?</i></p>
            <Button size = "small" onClick={this.showDrawer} style={{float: 'right',width:'40%'}}>
                <Icon type="plus" /> New experimenter
            </Button>
            <Drawer
                title="Add a new experimenter"
                width={420}
                onClose={this.onClose}
                visible={this.state.visible}
                style={{
                overflow: 'auto',
                height: 'calc(100% - 108px)',
                paddingBottom: '108px',
                }}
            >
                <Form layout="vertical" hideRequiredMark>
                <Row gutter={16}>
              
                    <Form.Item label="Username">
                        {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please enter user name' }],
                        })(<Input placeholder="Please enter user name" />)}
                    </Form.Item>
                  
                    <Form.Item label="Email">
                        {getFieldDecorator('email', {
                        rules: [{ required: true, message: 'Please enter email' }],
                        })(<Input placeholder="Please enter email" />)}
                    </Form.Item>
                   
                </Row>
                <Row gutter={16}>
                
                    <Form.Item label="First/Given Name">
                        {getFieldDecorator('firstname', {
                        rules: [{ required: true, message: 'Please enter firstname' }],
                        })(<Input placeholder="Please enter firstname" />)}
                    </Form.Item>
                  
                    <Form.Item label="Last/Family Name">
                        {getFieldDecorator('lastname', {
                        rules: [{ required: true, message: 'Please enter lastname' }],
                        })(<Input placeholder="Please enter lastname" />)}
                    </Form.Item>
                
                </Row>
              
              
                </Form>
            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 16px',
                background: '#fff',
                textAlign: 'right',
              }}
            >
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={this.onClose} type="primary">
                Submit
              </Button>
            </div>
          </Drawer>
        </div>
      );
    }
  }
  
//Form.create()(NewUserForm);

  