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
    const [parts, setParts] = useState([]);
//    const [messages, setMessages] = useState([]);
    const [name, setName] = useState();
    const [id, setId] = useState();
    

    //useEffect(() => {
    //    if (chatThreadClient) {
    //        console.log('useEffect list threads:');
    //        const messages = chatThreadClient.listMessages();
    //        const tmpMessages = [];
    //        if (messages) {
    //            (async () => {
    //                let lastTime = null;    // 1970-01-01 0:00
    //                const msInDay = 24 * 60 * 60 * 1000;
    //                // messages are ordered newest-first 
    //                for await (const message of messages) {

    //                    // Show the day, when day changes
    //                    if (lastTime &&
    //                        (message.createdOn.getDay() != lastTime.getDay()
    //                            || message.createdOn - lastTime >= msInDay)) {
    //                        tmpMessages.push({
    //                            str: `${lastTime.toDateString()}`,
    //                            italic: false,
    //                            id: message.id
    //                        });
    //                    }

    //                    // Show system and user/chat messages
    //                    if (message.type == 'participantAdded') {
    //                        for await (const part of message.content.participants) {
    //                            tmpMessages.push({
    //                                str: `${part.displayName} has entered the chat. ....................${message.createdOn.toLocaleTimeString()}`,
    //                                italic: true,
    //                                id: message.id
    //                            });
    //                        }
    //                    }
    //                    else if (message.type == 'topicUpdated' && message.sequenceId <= 2) {
    //                        tmpMessages.push({
    //                            str: `Topic \'${message.content.topic}\' created. ....................${message.createdOn.toLocaleTimeString()}`,
    //                            italic: true,
    //                            id: message.id
    //                        });
    //                    }
    //                    else if (message.type == 'participantRemoved') {
    //                        for await (const part of message.content.participants) {
    //                            tmpMessages.push({
    //                                str: `${part.displayName} has left the chat. ....................${message.createdOn.toLocaleTimeString()}`,
    //                                italic: true,
    //                                id: message.id
    //                            });
    //                        }
    //                    }
    //                    else { // just a message
    //                        tmpMessages.push({
    //                            str: `${message.senderDisplayName}: ${message.content.message} ....................${message.createdOn.toLocaleTimeString()}`,
    //                            italic: false,
    //                            id: message.id
    //                        });
    //                    }

    //                    // Show the day at top
    //                    if (message.sequenceId == '1')
    //                        tmpMessages.push({
    //                            str: `${message.createdOn.toDateString()}`,
    //                            italic: false,
    //                            id: message.id
    //                        });

    //                    lastTime = message.createdOn;

    //                }
    //                setMessages(tmpMessages.reverse());
    //                //console.log(tmpMessages);
    //            })();
    //        }
    //    }
    //    else
    //        setMessages([]);
    //}, [chatClient, chatThreadClient])

    useEffect(() => {
        if (chatThreadClient) {
            console.log('useEffect list threads:');
            const p = chatThreadClient.listParticipants();
            const tmpParts = [];
            if (p) {
                (async () => {
                    for await (const part of p) {
                        tmpParts.push(part);
                        //console.log(part);
                    }
                    setParts(tmpParts);
                    //console.log(tmpParts);
                })();
            }
        }
        else
            setParts([]);
    }, [chatThreadClient])

    useEffect(() => {
        if (chatClient) {
            console.log('useEffect list threads:');
            const t = chatClient.listChatThreads();
            const tmpThreads = [];
            if (t) {
                (async () => {
                    for await (const thread of t) {
                        tmpThreads.push(thread);
                        //console.log(thread);
                    }
                    setThreads(tmpThreads);
                    //console.log(tmpThreads);
                })();
            }
        }
        else
            setThreads([]);
    }, [chatClient, chatThreadClient])



    const sendAction = () => {
        console.log('sendAction');
        console.log(chatClient);
        send(chatThreadClient, name);
    }

    const loginAction = async () => {
        console.log('loginAction');
        // Get name
        const nameT = prompt('Name: ');

        // Get id
        let idT = prompt('User ID or \'new\', please: ');
        const identityClient = new CommunicationIdentityClient(connectionString);
        let token;
        if (idT.toLowerCase().trim() == 'new') {
            console.log('Creating new user...');

            // Create user
            const identityResponse = await identityClient.createUser();
            idT = identityResponse.communicationUserId;
            console.log(`\nCreated an identity with user ID: ${idT}`);
            prompt('Your brand new user ID, please note it down:', `${idT}`);

            // Get token for user
            let tokenResponse = await identityClient.getToken(identityResponse, ["chat"]);
            token = tokenResponse.token;
            var expiresOn = tokenResponse.expiresOn;
            console.log(`\nIssued an access token with 'chat' scope that expires at ${expiresOn}:`);
            console.log(token);
            prompt('Your brand new user access token, please note it down:', `${token}`);
        }
        else { // existing user
            // Get token for user
            token = prompt('Token or \'new\', please: ');

        }
        if (token.toLowerCase().trim() == 'new') {
            // Method has different renewal procedure than standard login
            token = await checkRefreshTokenAction(idT, true, false);
        }

        // Login and get chat client
        const clientPromise = login(chatClient, token);
        clientPromise.then((client) => {
            if (client) {
                if (chatClient)
                    logoutAction();
                setId(idT);
                setName(nameT);
                setChatClient(client);
            }
            else
                alert('Failed to login.');
        });
        
        console.log(`Account chosen with name ${name}`);
    }

    const logoutAction = () => {
        console.log('logoutAction');
        chatClient.stopRealtimeNotifications();
        setChatClient(null);
        setThreads([]);
        setId(null)
        document.getElementById('participants').innerHTML = 'Participants:';
        exitChatAction();
    }

    const exitChatAction = () => {
        console.log('exitChatAction');
        setChatThreadClient(null);
        document.getElementById('participants').innerHTML = 'Participants:<br/>';
        document.getElementById('messageHistory').innerHTML = '';
    }

    const enterChatAction = (threadId) => {
        console.log('enterChatAction');

        //if (threadId == "")   // temporary
        //    threadId = prompt('Give the thread id of the chat room or \'new\' for creation:')

        enterChat(chatClient, threadId, id, name).then(client => {
            setChatThreadClient(client);
            showMessages(client);
            setChatClient(chatThreadClient)
            //showParticipants(client);
        });

    }

    const remPartAction = async () => {
        console.log('remPartAction');
        removeParticipant(chatThreadClient);
        setChatThreadClient(chatThreadClient)
        //showParticipants(chatThreadClient);
    }

    const addPartAction = () => {
        console.log('addPartAction');
        addParticipant(chatThreadClient);
        setChatThreadClient(chatThreadClient)
        //showParticipants(chatThreadClient);
    }

    const checkRefreshTokenAction = (userId, isSpecialRequest, resetNeeded) => {
        console.log('checkRefreshTokenAction');
        let token;
        if (isSpecialRequest || chatClient.tokenCredential.tokenCredential.token.expiresOnTimestamp < Date.now()) {
        
            let tokenPromise = refreshToken(userId);
            token = tokenPromise.then((tokenT) => {
                prompt('Your brand new user access token, please note it down:', `${tokenT}`)
                if (resetNeeded) {
                    const clientPromise = login(chatClient, tokenT);
                    clientPromise.then((client) => {
                        if (client) {
                            setChatClient(client);
                            if (chatThreadClient)
                                enterChatAction(chatThreadClient.threadId);
                        }
                        else
                            alert('Failed to login.');
                    });
                }
            });

        }

        return token;
    }


    //<div id='messages2'>
    //    {messages.map((mess) => {
    //        return (
    //            [mess.italic && [<i>{mess.str}</i>, <br />],
    //            !mess.italic && [mess.str, <br />]]
    //        );
    //    })}
    //</div>
    return (
        <>
            <div id='messageHistory' className="rowtop">
                Chat history
            </div>
            <br/>
            <div className="rowbottom">
                <div className="messageCon">
                    <div className='containertext'>
                        <div className="vertical-center">
                            <textarea placeholder='Type!' id='newMessage' className="message">
                                
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
                            {/*<button className="button" onClick={() => { showMessages(chatThreadClient); showParticipants(chatThreadClient); }}>*/}
                            {/*    Retrieve chat*/}
                            {/*</button>*/}
                        </div>
                        <div className="vertical-center">
                            <button className="button" onClick={loginAction}>
                                Login
                            </button>
                            <button className="button" onClick={logoutAction}>
                                Logout
                            </button>
                            <button className="button" onClick={exitChatAction}>
                                Exit chat
                            </button>
                            {/*<button className="button" onClick={() => checkRefreshTokenAction(id, false, true)}>*/}
                            {/*    Refresh access token*/}
                            {/*</button>*/}
                        </div>
                    </div>
                </div>
            </div>
            <br/>
            <div id='participants'>
                <p><br />{parts.length > 0 && 'Participants:'}<br /></p>
                <ul>
                    {parts.map((part) => {
                        return (
                            <li key={part.id}>{part.displayName}</li>
                        );
                    })}
                </ul>
            </div>
            <div id='chatrooms'>
                <p><br/>{threads.length > 0 && 'Chatrooms:'}<br/></p>
                <ul>
                    {threads.map((thread) => {
                        return (
                            <li key={thread.id}><button title={thread.id} alt={thread.id} onClick={() => enterChatAction(thread.id)} >{thread.topic}</button></li>
                        );
                    })}
                    {chatClient && <li key='new'><button onClick={() => enterChatAction('new')}>New chat</button></li> }
                </ul>
            </div>
            <br/>
            <p> Using account with ID:<br /> &nbsp;&nbsp; {id}</p>
            {chatThreadClient && <p> Using chatroom ID:<br /> &nbsp;&nbsp; {chatThreadClient.threadId} </p>}
        </>
    );
}
// <br /> Current token expires on {(new Date(chatClient.tokenCredential.tokenCredential.token.expiresOnTimestamp)).toLocaleString()}. </p>}

//<div id='participants'>
//    <p>{chatThreadClient && 'Participants:'}<br /></p>
//</div>

export default Chat;
