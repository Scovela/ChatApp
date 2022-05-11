//import jwt from 'jsonwebtoken';
import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
const { CommunicationIdentityClient } = require('@azure/communication-identity');


const connectionString = 'endpoint=https://acs-chatapp.communication.azure.com/;accesskey=2hHSkN7fAlFGhAbMdskxJa4KqXe48c7gy3AdXQpTQdmyMsjKT1tfVN7QZafaTF/dVCZa9jxxRXi4qgZyOxFBxw==';



export async function login(chatClient, token) {

    // Unsubscribe old chat client
    if (chatClient) {
        unsubscribeFromNotifications(chatClient);
    }

    try {
        // Create a chat client for user with token
        chatClient = await getChatClient(token);
        // Subscribe new chat client
        subscribeToNotifications(chatClient);
    }
    catch (e) {
        console.log(e);
        if (e.message.startsWith('Invalid token specified', 0)) {
            alert('Invalid credentials supplied');
        }
        else
            alert(e.message);
    }

    return chatClient;
}




async function unsubscribeFromNotifications(chatClient) {
    if (chatClient) {
        await chatClient.stopRealtimeNotifications();
        chatClient.off("chatMessageReceived", (e) => { });
        chatClient.off("participantsAdded", (e) => { });
        console.log('Unsubscribed!');
    }
}




async function subscribeToNotifications(chatClient) {

    // Open notifications channel
    await chatClient.startRealtimeNotifications();
    console.log('Subscribing...');

    // Subscribe to message notifications
    chatClient.on("chatMessageReceived", (e) => {
        console.log("Notification channel chatMessageReceived");
        let history = document.getElementById('messageHistory');

        history.innerHTML = history.innerHTML + `${e.senderDisplayName}: ${e.message} ....................${e.createdOn.toLocaleTimeString()}<br/>`;
    });

    // Subscribe to participant notifications
    chatClient.on("participantsAdded", (e) => {
        console.log('Notification channel participantsAdded');
        console.log(e);
        let history = document.getElementById('messageHistory');
        history.innerHTML = history.innerHTML + `<i>${e.participantsAdded[0].displayName} has entered the chat. ....................${e.addedOn.toLocaleTimeString()}</i><br/>`;
        var divParticipants = document.getElementById('participants');
        divParticipants.innerHTML += e.participantsAdded[0].displayName + '<br/>';
    });
    chatClient.on("participantsRemoved", (e) => {
        console.log('Notification channel participantsRemoved');
        console.log(e);
        let history = document.getElementById('messageHistory');
        history.innerHTML = history.innerHTML + `<i>${e.participantsRemoved[0].displayName} has left the chat. ....................${e.addedOn.toLocaleTimeString()}</i><br/>`;
        //showParticipants(???);
        // What to do?
        // Now handled one lvl up
    });

    console.log('Subscribed!');
}




const endpointUrl = 'https://acs-chatapp.communication.azure.com/';

async function getChatClient(token) {

    console.log('Getting chat client...');

    let tokenCredential = new AzureCommunicationTokenCredential(token);
    const chatClient = new ChatClient(endpointUrl, tokenCredential);

    console.log('Chat client created!!!');

    return chatClient;
}




export async function refreshToken(id) {

    console.log('Refreshing token...');


    // Get token for user
    const identityClient = new CommunicationIdentityClient(connectionString);
    const identityResponse = await identityClient.createUser(id);
    const refreshedTokenResponse = await identityClient.getToken(identityResponse, ["chat"]);


    console.log('New user access token: ');
    console.log(refreshedTokenResponse.token);


    console.log('Token refreshed!!!');
    return refreshedTokenResponse.token;
}



export default login