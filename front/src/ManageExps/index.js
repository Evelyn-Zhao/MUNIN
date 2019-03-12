import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import './ManageExps.css'
import { Link } from 'react-router-dom'
import SearchInput from '../SearchInput'
import { Menu, Dropdown, Icon, message, Radio, DatePicker, Select, Spin, Input, Cascader} from 'antd';
import {Drawer, Form, Col, Row, Button } from 'antd';
import NewExperimentForm from '../NewExperimentForm';
export default class ManageExps extends Component {

    state = {
        service: undefined,
        types: ["Closed","Ongoing","Available"],
        expname: undefined,
        exptype: "Closed",
        expstartd: undefined,
        expendd: undefined,
        expdescription: undefined,
        expers: undefined,
        cexps: undefined,
        myexps: undefined,
        value: 1,
        visible: false,
    }

    handleMenuClick = (e) => {
        console.log(e)
        
        
        this.state.exptype = e[0]
    }

    addExp = () =>{
        this.setState()
        this.state.service = "add"
    }

    selectDate = (date, dateString) =>{
        
        this.setState({expstartd :dateString[0]})
        this.state.expendd = dateString[1]
    }

    editExp =  async () =>{
        this.state.service = "edit"
        try{
            const response = await fetch('/myExps', {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include',
                });
            const data = await response.json();
            console.log(data)
            this.setState({myexps:data["myexps"]})
        }catch(e) {
            //两次错误处理
            alert(e.message)
        }
    }

    claimExp = async () =>{
        this.state.service = "claim"
        try{
            const response = await fetch('/claimableExps', {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include',
                });
            const data = await response.json();
            console.log(data)
            this.setState({cexps:data["cexps"]})
        }catch(e) {
            //两次错误处理
            alert(e.message)
        }
    }

    help = () =>{
        this.state.service = "help"
    }

    submit = async () => {
        console.log([this.state.expname, this.state.expstartd, this.state.expendd, this.state.expdescription, this.state.exptype]);
        if (this.state.expname !== "" && (this.state.expstartd !== "" && this.state.expendd !== "" && this.state.expdescription !== "" && this.state.exptype !== "")){
            try{
                console.log([this.state.expname, this.state.expstartd]);
                const response = await fetch('/newexp', {
                    method: 'POST',
                    mode: 'cors',
                    body: `expname=${this.state.expname}&expstartd=${this.state.expstartd}&expendd=${this.state.expendd}&expdescription=${this.state.expdescription}&expers=${this.state.expers}&exptype=${this.state.exptype}`,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                const data = await response.json();
            
                //console.log(data);

                //throw to chatch ()
                //all exceptions will be dealt in catch(e) 
                if (data.error) throw new Error(data.error);
               
                message.info("Experiment has been successfully added");
                console.log("experiment registered");
                
                    
            } catch(e) {
                //两次错误处理
                message.info(e.message)
            }
        }else{
        }
    }

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
    
    renderMain (){
    
        const MainForm = Form.create()(NewExperimentForm)
        const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
        
          
       

        if(this.state.service){
            if(this.state.service == "add"){
                return[
                    <div className = "ManageApp-Main"> 
                        <h1>Create New Experiment Page</h1>
                        <p>Please fill in the following form to create a new experiment</p>
                        <hr/>
                        <MainForm/>
                    </div>
                ];
            } else if(this.state.service == "edit"){
                return[
                    <div className = "ManageApp-Main"> 
                        <h2>Edit My Experiments</h2>
                        
                        <table>
                            <tbody>
                                <tr >
                                    <th className="Exp-th">Experiment Name</th>
                                    <th className="Exp-th">Type</th>
                                    <th className="Exp-th">Click to Edit</th>
                                    <th className="Exp-th"></th>
                                </tr>
                                {
                                    this.state.myexps && this.state.myexps.map(d =>                         
                                
                                    <tr className="Exp-th">
                                        <td className="ManageApp-claim-expname"><Link to={'/experiments/' + d.expid}>{d.expname}</Link></td>
                                        <td className="Exp-th">{d.exptype}</td>
                                        <td className="Exp-th"><a> <Icon type="edit" theme="filled" /> Edit </a></td>
                                        <td className="Exp-th"><a> <Icon type="folder-add" theme="filled" /> Data Entry </a></td>
                                    </tr>)
                                }
                            </tbody>
                        </table>
                    
                    </div>
                ];
            } else if(this.state.service == "claim"){
                return[
                    <div className = "ManageApp-Main"> 
                    <h2>Claim Open Experiments</h2>
                    <table>
                    <tbody>
                         <tr >
                            
                            <th className="Exp-th">Experiment Name</th>
                            <th className="Exp-th">Type</th>
                            <th className="Exp-th">Click to Claim</th>
                        </tr>
                        {
                            this.state.cexps && this.state.cexps.map(d =>                         
                                
                                <tr className="Exp-th">
                                       
                                        <td className="ManageApp-claim-expname"><Link to={'/experiments/' + d.expid}>{d.expname}</Link></td>
                                        <td className="Exp-th">{d.exptype}</td>
                                        
                                        <td className="Exp-th"><a href={'/claimExp?id=' + d.expid}> <Icon type="shopping" theme="filled" /> Claim </a></td>
                                    
                                </tr>
                            )
                        }
                    </tbody>
                    </table>
                    
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
                    <h2>Please click the term in left nav bar to manage experiments</h2>
                    
                
                </div>
            ];
        }
    }

    render(){
       
        return(
            <div>
                <div className="sidenav">
                    <a href="#about" onClick={this.addExp}><Icon type="right-circle" /> Add New Experiment</a>
                    <a href="#services" onClick={this.editExp}><Icon type="right-circle" /> Manage My Experiments</a>
                    <a href="#clients" onClick={this.claimExp} ><Icon type="right-circle" /> Claimable Experiments</a>
                    <a href="#contact" onClick={this.help}><Icon type="right-circle" />   Help</a>
                </div>
                
                <div>
                    {this.renderMain()}
                </div>
            
            </div>
            

        );
    }
}

