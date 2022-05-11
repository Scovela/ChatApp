

export async function send(chatThreadClient, name) {

    console.log('Sending...');

    let prop = chatThreadClient.getProperties();
    console.log(prop);

    let newMessage = document.getElementById('newMessage');
    const sendMessageRequest =
    {
        content: newMessage.value
    };
    const sendMessageOptions =
    {
        senderDisplayName: name,
        type: 'text'
    };
    //console.log(`chatThreadClient: ${chatThreadClient}`);
    chatThreadClient.sendMessage(sendMessageRequest, sendMessageOptions);
    newMessage.value = '';

    console.log('Sent!!!');
}


export default send