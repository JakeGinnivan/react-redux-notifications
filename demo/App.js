import React from 'react';
import Fork from 'react-ghfork';
import pkgInfo from '../package.json';
import Demo from './Demo.js';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Fork className="right" project={pkgInfo.user + '/' + pkgInfo.name} />

        <Demo />
      </div>
    );
  }
}
