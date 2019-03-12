import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import { Menu, Dropdown, Radio,  Upload, Icon, Input, message, Select, Spin} from 'antd';
import debounce from 'lodash/debounce';
import SingleExpSearch from '../SingleExpSearch';
import SingleEquipSearch from '../SingleEquipSearch';

class ManageData extends Component {
    state = {
        service: undefined,
        types: ["Text","Video","Audio","EEG"],
        ddescription: undefined,
        datatype: "Text",
        expid: undefined,
        partid: undefined,
        quipid: undefined,
        value_d: 1,
        data: [],
        value: [],
        fetching: false,
        selectedFiles: [],
        uploadData: undefined,
    }

    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.fetchUser = debounce(this.fetchUser, 800);
    }
      
    fetchUser = async (value) => {
        console.log('fetching user', value);
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.state.data = []
        this.state.fetching = false;
        const response = await fetch('/getAllUsers',{
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        });

        const data = await response.json();
        
        if (fetchId !== this.lastFetchId) { // for fetch callback order
            return;
        }
        const para = data.data.map(user => ({
            text: `${user.usrfirstname} ${user.usrlastname}`,
            value: user.usrname,
          }))
        
        this.state.data = para;
        this.state.fetching = false;
        console.log('state.data', this.state.data);
        //});
    }
    
    showData = () => {
        console.log('it is show data');
        console.log('show data: state.data', this.state.data);

    }
    handleChange = (e) => {
        //TODO: need to be corrected after ui is adjusted
        this.state.value_d = e.target.value
        this.state.datatype = this.state.types[this.state.value_d-1]
    }

    addData = () =>{
        
        this.state.service = "add"
    }

    selectDate = (date, dateString) =>{
        
        this.setState({expstartd :dateString[0]})
        this.state.expendd = dateString[1]
    }

    editData =  async () =>{
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

    add (index) {
        console("the index is: "+index)
        this.setState({UploadData:index});
        console.log("the data id is"+this.state.uploadData)
     }
    renderMain (){
        const Dragger = Upload.Dragger;
     
        const props = {
            name: 'file',
            multiple: false,
            action: '/upload',
            
            onChange(info) {
                const status = info.file.status;
                if (status !== 'uploading') {
                    print(info.file, info.fileList)
                    console.log(info.file, info.fileList);
                    console.log(info.file["response"]["updataid"])
                    //props.add(info.file["response"]["updataid"])
                    this.setState((state) => {state.uploadData = info.file["response"]["updataid"]})
                    //.state.uploadData = info.file["response"]["updataid"]
                    
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
                            <Input.TextArea rows={4} onChange={e => this.setState({ddescription:e.target.value})} className = "Register-input-field" placeholder="Enter Data Description" name="ddescription" required/>
                        </div>

                        

                        <div className = "ManageApp-exptype-row">
                        <div style={{width:'95%'}}>
                            <label style={{float: 'left',width:'50%'}}><b>Data Type</b></label>

                            <Select defaultValue="Please select data type" style={{float: 'right',width:'50%'}} onChange={this.handleChange}>
                                <Select.Option value="text">Text</Select.Option>
                                <Select.Option value="video">Video</Select.Option>
                                <Select.Option value="audio">Audio</Select.Option>
                                <Select.Option value="EEG">EEG</Select.Option>
                            </Select>      

                        </div>     
                        </div>

                        <div className = "ManageApp-each-row">
                            <label><b>Experiment generates this data</b></label>
                            <SingleExpSearch/>
                        </div>


                        <div className = "ManageApp-each-row">
                            <label><b>Equipment used to collect data</b></label>
                            <SingleEquipSearch/>
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
                        Manage Experiment Data (Allow you manage the data which has the user as an experimenter)     
                  
                    </div>
                ];
            } else if(this.state.service == "claim"){
                return[
                    <div className = "ManageApp-Main"> 
                        Accessible Data (Allow user download the accessible data and also make request to download unaccessible data)

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
                    <a href="#services" onClick={this.editData}><Icon type="right-circle" /> Manage Experiment Data</a>
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
