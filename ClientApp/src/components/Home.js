import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
      <div>
        <h1>Chat program quick start</h1>
        <br/>
        <h3>Chatting with existing user in existing chatroom:</h3>
        <ul>
          <li>(Switching page currently resets Chat page)</li>
          <li>Press <b>Login</b></li>
          <li>Enter your name, <i>user ID</i>, <i>access token</i></li>
          <li>Make sure you have the <i>thread ID</i> of a chat, <br/>which you have created yourself, <br/>or to which you were added by someone else</li>
          <li>Press <b>Enter chat</b></li>
          <li>Enter <i>thread ID</i></li>
          <li>Type a message and press <b>Send</b></li>
        </ul>
        <h3>Setting up new user & chatroom and chatting:</h3>
        <ul>
          <li>(Switching page currently resets Chat page)</li>
          <li>Press <b>Login</b></li>
          <li>Write for ID the text 'new'</li>
          <li>Note down your <i>user ID</i> and <i>access token</i> for later use</li>
          <li>Press <b>Enter chat</b></li>
          <li>Write for thread ID the text 'new'</li>
          <li>Note down your <i>thread ID</i></li>
          <li>Type a message and press <b>Send</b></li>
        </ul>
        <h3>Combinations:</h3>
        <ul>
          <li>Interpolate</li>
        </ul>
        <h3>Add/remove participants:</h3>
        <ul>
          <li>(While already in a chat)</li>
          <li>Press <b>Add/Remove participant</b></li>
          <li>Enter <i>user ID</i> of participant</li>
        </ul>
        <br/>
        <h1>Known issues:</h1>
        <ul>
          <li>There should be buttons to enter an existing chat at the bottom, but these do not always show up.</li>
          <li>After some time (at least hours) the accounts seem unauthorised and cannot enter a chat anymore, although after some attempts it might still work and the button will work better than manually entering.</li>
          <li>After 24 hours the token has to be refreshed by pressing <b>Refresh token</b>. This is not yet automatic.</li>
        </ul>
      </div>
    );
  }
}
