import { Select } from 'antd';
import React, { Component } from 'react';
const Option = Select.Option;

let timeout;
let currentValue;

export default class SingleExpSearch extends React.Component {
  state = {
    data: [],
    value: undefined,
  }

  handleSearch = (value) => {
    fetch('/getAllExp')
          .then(response => response.json())
          .then((body) => {
         
            //console.log(body)
            //console.log(body['data'])
            const data = body['data'].map(exp => ({
              text: `${exp.expid} ${exp.expname}`,
              value: exp.expid,
            }));
            
            this.setState({ data});
            
          });
  }

  handleChange = (value) => {
    this.setState({ value });
  }

  handleSelect = (value) => {
    console.log("select value: "+JSON.stringify(value))
  }

  handleDeselect = (value) => {
    console.log("deselect value: "+JSON.stringify(value))
  }

  render() {
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
    return (
      <Select
        showSearch
        value={this.state.value}
        placeholder= "Select experiment"
        style = {{width:'100%'}}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={true}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={null}
        onSelect={this.handleSelect}
        onDeselect = {this.handleDeselect}
      >
        {options}
      </Select>
    );
  }
}

