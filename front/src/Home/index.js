import React, { Component } from 'react';
import SearchBar from '../SearchBar'
import { Link } from 'react-router-dom'
import './Home.css'


export default class Home extends Component {

    render() {
        return (
            
            <body> 
              
                <section className="intro-section">

                    <div className="container">
                        <div className="row">
                            
                            <div className="intro-text">
                                <span>HCC Group</span>
                                <h3 className="heaingtext">Who are we?</h3>
                                <p>Human-Centred Computing Group (HCC Group) dedicates in the field of understanding human by computers techniques. </p>
                            </div>
                            <div>
                                <img src="https://www.hitinfotech.com/wp-content/uploads/2018/08/career.png"/>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="munin-section">

                    <div className="container">
                        <div className="row">
                            <div>
                                <img className="intro-pic" src="https://cdn.admissiontable.com/wp-content/uploads/2017/08/machine_learning_data_science-1.png"/>
                            </div>
                            <div className="munin-text">
                                <span>MUNIN</span>
                                <h3 className="heaingtext">What is Munin?</h3>
                                <p>Munin is a experiment data repository developed by Human-Centred Computing Group (HCC Group). Experiment data are collected from various students' projects.</p>
                            </div>
                            
                        </div>
                    </div>
                </section>
                <section className="intro-section">

                    <div className="container">
                        <div className="row">
                            
                            <div className="intro-text">
                                <span>Explore More</span>
                                <h3 className="heaingtext">Recent Data</h3>
                                <p>Human-Centred Computing Group (HCC Group) dedicates in the field of understanding human by computers techniques. </p>
                            </div>
                            <div>
                                <img src="https://www.hitinfotech.com/wp-content/uploads/2018/08/career.png"/>
                            </div>
                        </div>
                    </div>
                </section>
            </body>
        )}
}