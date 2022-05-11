import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
      <div>
        <h1>Chat program quick start</h1>
        <p>Instructions for chatting with existing user in existing chatroom:</p>
        <ul>
          <li>(Switching page currently resets Chat page)</li>
          <li>Press <b>Login</b> and enter your name, <i>user ID</i>, <i>access token</i></li>
          <li>Press <b>Enter chat</b> and enter <i>thread ID</i></li>
          <li>Type a message and press <b>Send</b></li>
        </ul>
        <p>Instructions for setting up new user & chatroom and for chatting:</p>
        <ul>
          <li>(Switching page currently resets Chat page)</li>
          <li>Press <b>Login</b> and give ID 'new'</li>
          <li>Note down your <i>user ID</i> and <i>access token</i></li>
          <li>Press <b>Enter chat</b> and give thread ID 'new'</li>
          <li>Note down your <i>thread ID</i></li>
          <li>Type a message and press <b>Send</b></li>
        </ul>
        <p>Instructions for combinations:</p>
        <ul>
          <li>Interpolate</li>
        </ul>

      </div>
    );
  }
}
