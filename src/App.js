import React, { Component } from 'react';
import './App.css';
import cat from './assets/CrytoCat.png'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={cat} alt="cat"></img>
          <p>
            HELLO WORLD
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
