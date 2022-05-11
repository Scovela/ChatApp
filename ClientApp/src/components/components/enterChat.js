

export async function enterChat(chatClient, threadId, id, name) {

    console.log('Connecting...');


    //    // Get a new token in case of expiration and renew chat client with token
    //    refreshToken();
    //    listChats(chatClient);


    // Join a chatroom/thread or create a new one
    if (threadId.toLowerCase().trim() == 'new' ) {
        const createChatThreadRequest = {
            topic: "Test topic"
        };
        const createChatThreadOptions = {
            participants: [
                {
                    id: { communicationUserId: id },
                    displayName: name
                },
            ]
        };
        console.log('Before createChatThread');
        const createChatThreadResult = await chatClient.createChatThread(
            createChatThreadRequest,
            createChatThreadOptions
        );
        console.log('After createChatThread:');
        console.log(createChatThreadResult);

        threadId = createChatThreadResult.chatThread.id;
        console.log('Created thread with id ' + threadId);
    }
    else {
        console.log('Joining thread with id ' + threadId);
    }

    let chatThreadClient;
    try {
        // Get chat client with id
        chatThreadClient = await chatClient.getChatThreadClient(threadId);
    }
    catch (e) {
        console.log(e);
        alert('Could not connect. Perhaps the token is expired');
        //chatThreadClient = null;
    }


    //// Test
    //let prop = chatThreadClient.getProperties();
    //console.log(prop);


console.log('Connected!!!');

    return chatThreadClient
}


export default enterChat