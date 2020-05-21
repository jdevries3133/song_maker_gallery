import React, { Component } from 'react';

import './App.css';
import * as smpdata from './data.json';
import Header from './header/header';
import TileGrid from './tilegrid/tilegrid';

class App extends Component {

  // I will hard code state now, it'll come from django if deployment ever happens.

  // TODO: change webpack config to get correct path to static assets.

  state = {
    title: 'Sparta Gallery',
    description: null,
    data: smpdata.default
  }

  render () {
    console.log(this.state.data)
    return (
      <div>
        <Header
          title={this.state.title}
          description={this.state.description} />

        {this.state.data.map(group => (
          <TileGrid
            data={group}
            id={group.slice(-1)[0]} />
        ))}

      </div>
    );
  }

}

export default App;
