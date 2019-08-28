import React, { Component } from 'react';
import './App.css';
import background1 from './cubes_1.jpg';
import Home from './Home';

class App extends Component {
  async componentDidMount() {
   
    //it is not excuted in sequence, after the fetch method has been excuted, the then() method will be put in the end of Event Loop
    
  } 

  // after getting the new json data, the webpage will refresh the content. 
  // if only refresh a component, just update the info within the component 
  //background url backups: url(https://carleton.ca/datapower/wp-content/uploads/BannereDark.png)

  render() {
    return (
      <div>
        <div>
        
          <header className="App-header">
          {/*<AppBackground/>*/}
            <div className="App-content">
              <div className = "App-title">
                <span className = "App-title1" > MUNIN </span>
                <p>HCC Experiment Data Management Platform</p>
              </div>
              <img className="App-raven" src="https://www.freeiconspng.com/uploads/raven-png-photo-10.png" align= "right"/>
            </div>
          </header>
          
        </div>

        <Home/>
      </div>
    );
  }
}

export default App;
