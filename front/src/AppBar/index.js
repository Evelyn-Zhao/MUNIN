import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import logo from '../logo.svg';
import './AppBar.css';
import AppLogin from '../AppLogin';
import NaviBar from '../NaviBar';
import { Avatar } from 'antd';
import { Menu, Icon, Dropdown } from 'antd';
import { Link } from 'react-router-dom'
class AppBar extends Component {
    async componentDidMount() {
        //会问服务器又没有登录过 每次刷新后
        try{
            const response = await fetch('/me', {
                method: 'GET',
                mode: 'CORS',
                credentials: 'include', //set up cookies 
            });
            const data = await response.json();
            // { user: { ... } }
            console.log(data)
            if(data.user){
                this.onLoginSuccessful(data.user)
            }
        }catch(e){}

        window.onscroll = () => {
            if(this.appBar)
            this.appBar.onScroll()
        }
    }

    state = {
        user: undefined,
        counter: 0,
        hide: true, // an attribute controls the transparency of the popup
    }
    increaseCounter = () => {
        this.setState({ counter: this.state.counter + 1 })
    }//the method is defined by labmda expression, so can be invoked from this, otherwise, it cannot be found because it is a window
    increaseHide = () => {
        this.setState({ hide: !this.state.hide })
    }
    logout = async () => {
        try{
            const response = await fetch('/logout', {
                method: 'GET',
                mode: 'CORS',
                credentials: 'include', //set up cookies 
            });
            const data = await response.json();
           
            console.log(data)
           
        }catch(e){}
        this.setState({user: undefined})
        this.props.history.push("/");
    }
    onScroll = () => {
        //to be implemented
    }

    onLoginSuccessful = (user) =>{
        this.setState({user: user, hide: true})

    }

    register = async () => {
        this.props.history.push("/register");
        this.setState({hide: true})
    }

    manageExps = () =>{
        this.props.history.push("/manageExps");
    }
    managePersonalInfo = () => {
        this.props.history.push("/editPersonalInfo");
    }

    renderButton() {
        if (this.state.user) {
            console.log(this.state);
            const SubMenu = Menu.SubMenu;
            const MenuItemGroup = Menu.ItemGroup;
            const menu = (
                <Menu>
                    <Menu.Item><Link to ='/editPersonalInfo'>Personal Account</Link></Menu.Item>
                    <Menu.Item><Icon type="setting" theme="outlined"/>Settings</Menu.Item>
                    <Menu.Item> <Icon type="info-circle" theme="outlined" /> Help</Menu.Item>
                    <Menu.Item onClick={this.logout}><Link to ='/'> <Icon type="logout" theme="outlined" /> Log Out </Link></Menu.Item>
                </Menu>
              );
            return  [
                    <div className = "AppBar-navi-and-user">
                        <Menu onClick={this.handleClick} mode="horizontal">
                            <Menu.Item key="1">
                                <Icon type="home" theme="outlined" /><span><Link to ='/main'>Main</Link></span>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Icon type="appstore" /><span><Link to ='/manageExps'>Manage Experiment</Link></span>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Icon type="database" theme="outlined" /><span><Link to ='/manageData'>Manage Data</Link></span>
                            </Menu.Item>
                            
                        </Menu>
                        <Dropdown overlay={menu}>
                            <Avatar shape="square" size="large" style={{ color: '#f56a00', backgroundColor: '#fde3cf', paddingLeft: '140px', marginLeft:'200px' }}> <Icon type="user" theme="outlined" />{this.state.user.usrname} </Avatar>
                        </Dropdown>
                    </div>
        
            ];
        } else {
            return  [
                    <div key = {3} onClick={this.increaseHide} className = "AppBar-button1" > Login </div>,
                    <div key = {4} onClick={this.register} className = "AppBar-button2" > Register </div>
            ];
        }
    }
    
    render() {
    return (
        //green is the style of itself, the later one is its parent style (from App)
        
        <nav style = {{ background: "rgba(255,255,255)", transition: "all 1s", ...this.props.style }} className="AppBar">
            <div>{this.state.hide ? null : <AppLogin onLoginSuccessful={this.onLoginSuccessful}/> } </div>
            <p className = "AppBar-logo">HCC</p>

            { this.renderButton() }
            
        </nav>
    );
  }
}

export default withRouter(AppBar);
//JsonResponse(JSON Object) => the way to change the state of the webpage