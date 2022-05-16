

export async function enterChat(chatClient, threadId, id, name) {

    console.log('Connecting...');


    //    // Get a new token in case of expiration and renew chat client with token
    //    refreshToken();
    //    listChats(chatClient);


    // Join a chatroom/thread or create a new one
    if (threadId.toLowerCase().trim() == 'new' ) {   // Create new thread
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
        threadId = createChatThreadResult.chatThread.id;
        prompt('Your brand new thread ID, please note it down:', `${threadId}`);

        console.log('After createChatThread:');
        console.log(createChatThreadResult);
        console.log('Created thread with id ' + threadId);
    }
    else {   // Join existing thread
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