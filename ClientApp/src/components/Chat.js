import React, { useEffect, useState } from 'react'

import {login, refreshToken} from './components/login'
import enterChat from './components/enterChat'
import {showMessages, showParticipants} from './components/displayChat';
import send from './components/send'
import {addParticipant, removeParticipant} from './components/participants'

const { CommunicationIdentityClient } = require('@azure/communication-identity');

//import './App.css';

const connectionString = 'endpoint=https://acs-chatapp.communication.azure.com/;accesskey=2hHSkN7fAlFGhAbMdskxJa4KqXe48c7gy3AdXQpTQdmyMsjKT1tfVN7QZafaTF/dVCZa9jxxRXi4qgZyOxFBxw==';


export function Chat() {

    const [chatClient, setChatClient] = useState(null);
    const [chatThreadClient, setChatThreadClient] = useState();
    const [threads, setThreads] = useState([]);
    const [name, setName] = useState();
    const [id, setId] = useState();



    useEffect(() => {
        if (chatClient) {
            const t = chatClient.listChatThreads();
            //setThreads(t);
            console.log('useEffect list threads:');
            console.log(t);

            const tmpThreads = [];
            if (t) {
                (async () => {
                    for await (const thread of t) {
                        tmpThreads.push(thread);
                        console.log(thread);
                    }
                })();
                setThreads(tmpThreads);
                console.log(tmpThreads);
            }

        }
        else
            setThreads([]);
    }, [chatClient])



    const sendAction = () => {
        console.log('sendAction');
        console.log(chatClient);
        send(chatThreadClient, name);
    }

    const loginAction = async () => {
        console.log('loginAction');
        // Get name
        const nameT = prompt('Name: ');
        setName(nameT);

        // Get id
        let idT = prompt('User ID or \'new\', please: ');
        const identityClient = new CommunicationIdentityClient(connectionString);
        let token;
        if (idT == 'new') {
            console.log('Creating new user...');

            // Create user
            const identityResponse = await identityClient.createUser();
            idT = identityResponse.communicationUserId;
            console.log(`\nCreated an identity with user ID: ${idT}`);
            prompt('Your brand new user ID, please note it down:', `${idT}}`);

            // Get token for user
            let tokenResponse = await identityClient.getToken(identityResponse, ["chat"]);
            token = tokenResponse.token;
            var expiresOn = tokenResponse.expiresOn;
            console.log(`\nIssued an access token with 'chat' scope that expires at ${expiresOn}:`);
            console.log(token);
            prompt('Your brand new user access token, please note it down:', `${token}`);
        }
        else { // existing user
            token = prompt('Token: ');
            //token = refreshToken(identityClient, id);

        }
        setId(idT);

        // Login and get chat client
        const clientPromise = login(chatClient, token);
        clientPromise.then((client) => {
            if (client)
                setChatClient(client);
            else
                alert('Failed to login.');
        });

        console.log(`Account chosen with name ${name}`);
    }

    const logoutAction = () => {
        chatClient.stopRealtimeNotifications();
        setChatClient(null);
        document.getElementById('participants').innerHTML = 'Participants:';
        exitChatAction();
    }

    const exitChatAction = () => {
        setChatThreadClient(null);
        document.getElementById('participants').innerHTML = 'Participants:<br/>';
        document.getElementById('messageHistory').innerHTML = '';
    }

    const enterChatAction = (threadId) => {
        console.log('enterChatAction');

        if (threadId == "")   // temporary
            threadId = prompt('Give the thread id of the chat room or \'new\' for creation:')

        enterChat(chatClient, threadId, id, name).then(client => {
            console.log('*Promise*');

            // Set chat-thread client
            setChatThreadClient(client);
            console.log(chatClient);
            console.log(chatThreadClient);
            console.log(client);
            // Show chat history and participants
            showMessages(client);
            showParticipants(client);
        });

    }

    const remPartAction = async () => {
        console.log('remPartAction');
        removeParticipant(chatThreadClient);
        showParticipants(chatThreadClient);
    }

    const addPartAction = () => {
        console.log('addPartAction');
        addParticipant(chatThreadClient);
    }

    const checkRefreshTokenAction = () => {
        if (chatClient.tokenCredential.tokenCredential.token.expiresOnTimestamp < Date.now()) {
        
            let token = refreshToken(id);

            const clientPromise = login(chatClient, token);
            clientPromise.then((client) => {
                if (client)
                    setChatClient(client);
                else
                    alert('Failed to login.');
            });
        }
        console.log('Logged in also!');
    }


    return (
        <>
            {chatClient && <p> Using account with ID:<br />{id}<br />Current token expires on {(new Date(chatClient.tokenCredential.tokenCredential.token.expiresOnTimestamp)).toLocaleString()}. </p>}
            {chatThreadClient && <p> Using chatroom ID:<br/>{chatThreadClient.threadId} </p>}
            <div id='messageHistory' className="rowtop">
                Messages
            </div>
            <div className="rowbottom">
                <div className="messageCon">
                    <div className='containertext'>
                        <div className="vertical-center">
                            <textarea placeholder='Messages' id='newMessage' className="message">
                                
                            </textarea>
                        </div>
                    </div>
                </div>
                <div className="buttonCon">
                    <div className="containerbutton">
                        <div className="vertical-center">
                            <button className="button" onClick={sendAction}>
                                Send
                            </button>
                            <button className="button" onClick={addPartAction}>
                                Add participant
                            </button>
                            <button className="button" onClick={remPartAction}>
                                Remove participant
                            </button>
                        </div>
                        <div className="vertical-center">
                            <button className="button" onClick={loginAction}>
                                Login
                            </button>
                            <button className="button" onClick={logoutAction}>
                                Logout
                            </button>
                            <button className="button" onClick={() => enterChatAction('')}>
                                Enter chat
                            </button>
                            <button className="button" onClick={exitChatAction}>
                                Exit chat
                            </button>
                            <button className="button" onClick={checkRefreshTokenAction}>
                                Refresh access token
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id='participants'>
                <p>{chatClient && 'Participants:'}<br/></p>
                Participants:<br/>
            </div>
            <div id='chatrooms'>
                <p>{threads.length>0 && 'Chatrooms:'}<br/></p>
                <ul>
                    {threads.map((thread) => {
                        return (
                            <li key={thread.id}><button onClick={() => enterChatAction(thread.id)} >{thread.id}</button></li>
                        );
                    } ) }
                </ul>
            </div>
        </>
    );
}

export default Chat;
