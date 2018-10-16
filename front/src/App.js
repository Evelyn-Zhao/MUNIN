import React, { Component } from 'react';
import './App.css';
import background1 from './cubes_1.jpg';

class App extends Component {
  async componentDidMount() {
   
    //it is not excuted in sequence, after the fetch method has been excuted, the then() method will be put in the end of Event Loop
    
  } 

  // after getting the new json data, the webpage will refresh the content. 
  // if only refresh a component, just update the info within the component 
  //background url backups: url(https://carleton.ca/datapower/wp-content/uploads/BannereDark.png)

  render() {
    return (
      <div className="App">
       
        <header className="App-header">
         {/*<AppBackground/>*/}
         
         <p className = "App-title" style={{zIndex: 10}}> MUNIN </p>
         
        </header>
        <p className="App-intro">
          
        </p>
      </div>
    );
  }
}

export default App;
