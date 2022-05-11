

export async function listChats(chatClient) {

    console.log('Listing chats...');


    const threads = chatClient.listChatThreads();
    console.log('Available chats:');
    for await (const thread of threads) {
        console.log(thread.id);
    }


    console.log('Chats listed!!!');
}

export default listChats