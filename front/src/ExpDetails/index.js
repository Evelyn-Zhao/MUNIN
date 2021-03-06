import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './ExpDetails.css'
import { message} from 'antd';

export default class ExpDetails extends Component {

    async componentDidMount() {
        console.log(this.props.match.params.id)
        //会问服务器又没有登录过 每次刷新后
        try {
            const response = await fetch('/expdetails?id='+this.props.match.params.id, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include', //set up cookies 
            });
            const data = await response.json();
            // { user: { ... } }
            if(data.error){
                print("dkfbhfb")
                message.info("experiment does not exist, please check the file system.")
            }
            console.log(data.data)
            this.setState({details:data.data})
        } catch (e) { }
    }

    state = {
        details: undefined,
    }


    render() {
        const details = this.state.details;
        if(details === undefined){
            return <h1 style={{marginTop:'60px', marginLeft:'100px'}}>Loading...</h1>
        }
        return (
            <div style={{ paddingTop: "60px" }}>
                <div style={{margin: 30}}>
                    <center>
                        <h1>{details.name}</h1>
                    </center>
                    <div style={{marginLeft: 70}}>
                        <h3 style = {{textAlign:"left"}} >Experiment ID</h3>
                        <p style={{marginLeft: 30}}>{details.expid}</p>
                        <h3 style = {{textAlign:"left"}} >Experiment Name</h3>
                        <p style={{marginLeft: 30}}>{details.expname}</p>
                        <h3 style = {{textAlign:"left"}} >Experiment Type</h3>
                        <p style={{marginLeft: 30}}>{details.exptype}</p>
                        <h3 style = {{textAlign:"left"}}>Description</h3>
                        <p style={{marginLeft: 30}}>{details.expdescription}</p>
                        <h3 style = {{textAlign:"left"}}>Experiment Period</h3>
                        <p style={{marginLeft: 30}}>{details.expstartd} ~ {details.expendd}</p>
                        
                        <h3 style = {{textAlign:"left"}} >Experimenters</h3>
                        <p style={{marginLeft: 30}}>{details.experimenters.map (exper => <p>{exper}</p>)}</p>
                        
                        <h3 style = {{textAlign:"left"}}>Outcomes</h3>
                        <p style={{marginLeft: 30}}>{details.outcomes ? details.outcomes.map(d =>                         
                                                                                                <tr>
                                                                                                    <td>{d}</td>
                                                                                                </tr>
                                                                                            ) : 'NULL'}</p>
                        <h3 style = {{textAlign:"left"}}>Data Generated</h3>
                        <p style={{marginLeft: 30}}>{details.data ? details.data.map(d =>                         
                                                                                                <tr>
                                                                                                    <a href={'/downloadData?id=' + d.dataid}>{d.dataid}: {d.datadescription}</a>
                                                                                                    
                                                                                                </tr>
                                                                                            ) : 'NULL'}</p>
                        <h3 style = {{textAlign:"left"}}>Related Experiments</h3>
                    </div>
                </div>

                {/*<Link to='/'>Back to home</Link>*/}
            </div>

        );
    }
}