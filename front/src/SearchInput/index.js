import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Link } from 'react-router-dom'
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';


const Option = Select.Option;

export default class SearchInput extends Component {
    
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.fetchUser = debounce(this.fetchUser, 800);
      }
    
      state = {
        data: [],
        value: [],
        fetching: false,
      }
    
      fetchUser = (value) => {
        console.log('fetching user', value);
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ data: [], fetching: true });
        fetch('/getAllUsers')
          .then(response => response.json())
          .then((body) => {
            if (fetchId !== this.lastFetchId) { // for fetch callback order
              return;
            }
            //console.log(body)
            //console.log(body['data'])
            const data = body['data'].map(user => ({
              text: `${user.usrfirstname} ${user.usrlastname}`,
              value: user.usrname,
            }));
            
            this.setState({ data, fetching: false });
            
          });
      }
    
      handleChange = (value) => {
        console.log("value: "+JSON.stringify(this.state["value"]))
        
        this.setState({
          value,
          data: [],
          fetching: false,
        });
        
      }

      handleSelect = (value) => {
        console.log("select value: "+JSON.stringify(value))
      }

      handleDeselect = (value) => {
        console.log("deselect value: "+JSON.stringify(value))
      }

    
    render() {
        const Option = Select.Option;

        const { fetching, data, value } = this.state;
        return (
           
                <Select
                    mode="multiple"
                    labelInValue
                    value={value}
                    placeholder="experimenter name"
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    filterOption={true}
                    onSearch={this.fetchUser}
                    onChange={this.handleChange}
                    onSelect={this.handleSelect}
                    onDeselect = {this.handleDeselect}
                    style = {{width:'75%', marginRight: 8}}
                >
                    {data.map(d => <Option key={d.value}>{d.text}</Option>)}
                </Select>
           
        );
    }
}