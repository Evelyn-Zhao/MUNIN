import {Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Icon,Cascader,} from 'antd';
import SearchInput from '../SearchInput'
import { withRouter } from "react-router-dom";
import { Link } from 'react-router-dom'
import React, { Component } from 'react';
import NewUserForm from '../NewUserForm';
import FormItem from 'antd/lib/form/FormItem';
import SingleSearchInput from '../SingleSearchInput';

const { Option } = Select;
let id = 0;
export default class NewExperimentForm extends Component {
    
    state = {
        data: [],
        disableDate: true,
        startValue: null,
        endValue: null,
    }

    handleSearch = (value) => {
        const { form } = this.props;
        // can use data-binding to get
        const selects = form.getFieldValue('names');
        //selected = this.props.form.getFieldValue('names')
        
        fetch('/getAllUsers')
              .then(response => response.json())
              .then((body) => {
                
                //console.log(body)
                //console.log(body['data'])
                //for (user in body['data']){
        
                //}
                var data = [];
                var user;
                for(user in body['data']){ 
                    var usrname = body['data'][user]["usrname"]
                    var usrfirstname = body['data'][user]["usrfirstname"]
                    var usrlastname = body['data'][user]["usrlastname"]
                    
                    if(typeof selects === "undefined"|| selects == null||(selects.length == 1&&selects[0]== null)){
                        //console.log("it is undefined or null")
                        var obj = {};
                            obj["text"] = [usrfirstname, usrlastname].join(" ")
                            obj["value"] = usrname
                            data.push(obj);
                    }
                    else{
                        if(!selects.includes(usrname)){
                            //console.log(usrname+" was already selected previously");
                            var obj = {};
                            obj["text"] = [usrfirstname, usrlastname].join(" ")
                            obj["value"] = usrname
                            data.push(obj);
                           
                        }
                        
                    }
                    
                }
                              
                this.setState({ data});
                
              });
      }

    handleMenuClick = (e) => {
        console.log(e)
        //this.state.exptype = e[0]
        if (e[0]==='complete'){
            this.setState({disableDate:false})
        }else{
            this.setState({disableDate:true})
        }
    }

    onStartChange = (value) => {
        console.log(value)
        this.setState({startValue:value});
      }
    
    onEndChange = (value) => {
        this.setState({endValue:value});
    }
    

    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
          return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }
    
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
          return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    addExper = () =>{
        console.log("addexper ");
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
          keys: nextKeys,
        });
    }
    remove = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
          return;
        }
    
        // can use data-binding to set
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
    }

    handleChange = (value) => {
        console.log("value: "+JSON.stringify(this.state["value"]))
        //this.setState({ value });
    }

    handleSubmit = async (e) => {
        console.log("the new experiment:")
        this.props.form.validateFieldsAndScroll (async (err, fieldsValue) => 
            {
                
                if(!err){
                    console.log('Received values of form without error: ', fieldsValue);
                    try{
                        const response = await fetch('/newexp', {
                            method: 'POST',
                            mode: 'cors',
                            body: `exp=${JSON.stringify(fieldsValue)}`,
                           // body: `expname=${fieldsValue['expname']}&expstartd=${fieldsValue['expstartd'].format('YYYY-MM-DD')}&expendd=${fieldsValue['expendd'].format('YYYY-MM-DD')}&expdescription=${fieldsValue['expdescription']}&expers=${fieldsValue['names']}&exptype=${this.state.exptype}`,
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        });
                    }catch(e) {
                        //两次错误处理
                        message.info(e.message)
                    }
                        
                    
                    //console.log("value of field expname: "+fieldsValue['expname'])
                    //console.log("value of field expdescription: "+fieldsValue['expdescription'])
                    //console.log("value of field expstatus: "+fieldsValue['expstatus'])
                    //console.log("value of field expstartd: "+fieldsValue['expstartd'].format('YYYY-MM-DD'))
                    //if(this.state.disableDate===false){
                    //console.log("value of field expendd: "+fieldsValue['expendd'].format('YYYY-MM-DD'))}
                    //console.log("value of field experimenters: "+fieldsValue['keys'])
                }else{
                    console.log('Received values of form with error : ', fieldsValue);
                }
            }
        );
    }
    render() {
        const DrawerForm = Form.create()(NewUserForm)
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
        const formItemLayout = {
            labelCol: {
            xs: { span: 24 },sm: { span: 30 },},
            wrapperCol: {
            xs: { span: 24 },sm: { span: 30 },},
        };
        const tailFormItemLayout = {
            wrapperCol: {
            xs: {span: 24,offset: 0,},
            sm: {span: 16,offset: 8,},
            },
        };

        const formItemLayoutWithOutLabel = {
            wrapperCol: {
              xs: { span: 24, offset: 0 },
              sm: { span: 24, offset: 0 },
            },
        };

        const formItemLayout2 = {
            labelCol: { xs: { span: 24 },sm: { span: 4 },},
            wrapperCol: {xs: { span: 24 },sm: { span: 20 },},
        };

        const options = [{
            value: 'incomplete',
            label: 'Incomplete',
            children: [{
                value: 'claimable',
                label: 'Claimable',
            },
            {
                value: 'onQuery',
                label: 'OnQuery',
            },
            {
                value: 'authorised',
                label: 'Authorised',
            }],
          }, {
            value: 'complete',
            label: 'Complete',
        }];

       

        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Form.Item 
                {... formItemLayoutWithOutLabel}
                required={false}
                key={k}
                style={{marginBottom:'2px'}}
            >
                {getFieldDecorator(`names[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{
                    required: true,
                    whitespace: true,
                    message: "Please input experimenter's name or delete this field.",
                }],
                })(
                    <Select
                        showSearch
                        placeholder={this.props.placeholder}
                        style = {{width:'75%', marginRight: 8}}
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={true}
                        onSearch={this.handleSearch}
                        onChange={this.handleChange}
                        notFoundContent={null}
                    >
                        {this.state.data.map(d => <Select.Option key={d.value}>{d.text}</Select.Option>)}
                    </Select>
                )}
                {keys.length > 1 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        disabled={keys.length === 1}
                        onClick={() => this.remove(k)}
                    />
                ) : null}
                
            </Form.Item>
        ));
    
        return (
        <div>
              <Form layout='vertical' onSubmit={this.handleSubmit}>
                <Form.Item {...formItemLayout} label="Experiment Name">
                    {getFieldDecorator('expname', {
                        rules: [{ required: true, message: 'Please enter experiment name' }],
                    })(<Input placeholder="Please enter experiment name" />)}
                </Form.Item>
                
                <Form.Item {...formItemLayout} label="Experiment Description">
                    {getFieldDecorator('expdescription', {
                        rules: [{ required: true, message: 'Please enter experiment description' }],
                    })(<Input.TextArea rows={4} placeholder="Please enter experiment description" />)}
                </Form.Item>
                
                <Form.Item {...formItemLayout} label="Experiment Status">
                    {getFieldDecorator('expstatus', {
                        initialValue: ['incomplete', 'claimable'],
                        rules: [{ required: true, message: 'Please select experiment status' }],
                    })(<Cascader onChange={this.handleMenuClick} options={options} placeholder="Please select a experiment status" />)}
                </Form.Item>
                
                <Form.Item {...formItemLayout} label="Experiment Start Date - End Date">
                    {getFieldDecorator('expstartd', {
                        rules: [{ required: true, message: 'Please select experiment start date' }],
                    })(
                        <DatePicker 
                            disabledDate={this.disabledStartDate}
                            onChange={this.onStartChange}
                            placeholder="Please select a start date" 
                            style={{width:'80%', marginBottom:'2px'}}/> 
                    )}
                </Form.Item>

                <Form.Item {...formItemLayoutWithOutLabel} extra="Applicable only when the experiment status is complete">
                    {getFieldDecorator('expendd', {
                        rules: [{ required: true, message: 'Please select experiment end date' }],
                    })(
                        <DatePicker 
                            disabledDate={this.disabledEndDate}
                            disabled={this.state.disableDate} 
                            onChange={this.onEndChange}  
                            placeholder="Please select a end date"  
                            style={{width:'80%'}}/>
                    )}
                </Form.Item> 
                
                <FormItem {...formItemLayout} label='Experimenters'>
                    {formItems}
                    <Button type="dashed" onClick={this.addExper}>
                        <Icon type="plus"/> Add Experimenter
                    </Button>
                    <DrawerForm/>
                </FormItem>           
                
                <FormItem {...tailFormItemLayout}>      
                    <Button type="primary" style={{ marginTop: '40px', width: '200px',marginBottom: '50px'}} htmlType="submit">Submit</Button>
                </FormItem>
            </Form>
        </div>
      );
    }
  }


  