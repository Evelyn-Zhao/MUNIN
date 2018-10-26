import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import { Menu, Dropdown, Radio,  Upload, Icon, message} from 'antd';

class ManageData extends Component {
    state = {
        service: undefined,
        types: ["Closed","Ongoing","Available"],
        ddescription: undefined,
        exptype: "Closed",
        expid: undefined,
        partid: undefined,
        quipid: undefined,
     
        value: 1,
    }

    handleMenuClick = (e) => {
        this.state.value = e.target.value
        this.state.exptype = this.state.types[this.state.value-1]
    }

    addData = () =>{
        
        this.state.service = "add"
    }

    selectDate = (date, dateString) =>{
        
        this.setState({expstartd :dateString[0]})
        this.state.expendd = dateString[1]
    }

    editExp =  async () =>{
        this.state.service = "edit"
    }

    claimExp = async () =>{
        this.state.service = "claim"
    }

    help = () =>{
        this.state.service = "help"
    }

    submit = async () => {
        
    }
    renderMain (){
        const Dragger = Upload.Dragger;

const props = {
  name: 'file',
  multiple: true,
  action: '//jsonplaceholder.typicode.com/posts/',
  onChange(info) {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
        if(this.state.service){
            if(this.state.service == "add"){
                return[
                    <div className = "ManageApp-Main"> 
                        <h1>Upload New Experiment Data</h1>
                        <p>Please fill in the following form to upload an new experiment data</p>
                        <hr/>
                        <div className = "ManageApp-each-row">
                            <label><b>Data Description</b></label>
                            <input onChange={e => this.setState({ddescription:e.target.value})} className = "Register-input-field" placeholder="Enter Data Description" name="ddescription" required/>
                        </div>

                        

                        <div className = "ManageApp-exptype-row">
                            <label><b>Data Type</b></label>
                            <Radio.Group style={{ marginLeft: '140px'}} onChange={this.handleMenuClick} defaultValue={1}>
                                <Radio.Button value={1}> Text </Radio.Button>
                                <Radio.Button value={2}> Video </Radio.Button>
                                <Radio.Button value={3}> Audio </Radio.Button>
                                <Radio.Button value={4}> EEG </Radio.Button>
                            </Radio.Group>
                           
                        </div>

                        <div className = "ManageApp-each-row">
                            <label><b>Data is Generated From Experiment</b></label>
                            <input onChange={e => this.setState({expid:e.target.value})} className = "Register-input-field" placeholder="Enter Which Experiment This Data is Generated From" name="expid" required/>
                        </div>

                        <div className = "ManageApp-each-row">
                            <label><b>Data is Collected From Participant</b></label>
                            <input onChange={e => this.setState({partid:e.target.value})} className = "Register-input-field" placeholder="Enter Which Paricipant This Data is Collected From" name="partid" required/>
                        </div>

                        <div className = "ManageApp-each-row">
                            <label><b>Data is Collected By Using Equipment</b></label>
                            <input onChange={e => this.setState({quipid:e.target.value})} className = "Register-input-field" placeholder="Enter Which Equipment Was Used to Collected This Data" name="quipid" required/>
                        </div>

                        <div>
                            <Dragger {...props}>
                                <p className="ant-upload-drag-icon">
                                    <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                            </Dragger>
                        </div>
                        <Button style={{ marginTop: '40px', width: '200px',marginBottom: '50px'}}onClick = {this.submit}>upload</Button>
                    </div>
                ];
            } else if(this.state.service == "edit"){
                return[
                    <div className = "ManageApp-Main"> 
                        Manage Experiment Data
                    </div>
                ];
            } else if(this.state.service == "claim"){
                return[
                    <div className = "ManageApp-Main"> 
                        Accessible Data
                    
                    </div>
                ];
            }else if(this.state.service == "help"){
                return[
                    <div className = "ManageApp-Main">
                        <h2>Q&A</h2>
                        
                    </div>
                ];
            } 
        }else{
            return[
                <div className = "ManageApp-Main"> 
                    <h2>Please click the term in left nav bar to manage data</h2>
                    
                
                </div>
            ];
        }
    }

   
    render(){
        return(
            <div>
                <div className="sidenav">
                    <a href="#about" onClick={this.addData}><Icon type="right-circle" /> Upload Experiment Data</a>
                    <a href="#services" onClick={this.editExp}><Icon type="right-circle" /> Manage Experiment Data</a>
                    <a href="#clients" onClick={this.claimExp} ><Icon type="right-circle" /> Accessible Data</a>
                    <a href="#contact" onClick={this.help}><Icon type="right-circle" />   Help</a>
                </div>
                
                <div>
                    {this.renderMain()}
                </div>
            
            </div>
            
            

        );
    }
}export default withRouter(ManageData);
