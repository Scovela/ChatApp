

export async function showMessages(chatThreadClient) {

    console.log('Receiving...');

    // Refresh messages
    const messages = chatThreadClient.listMessages();

    // Clear chat history textarea
    let textArea = document.getElementById('messageHistory');
    textArea.innerHTML = '';

    let lastTime = null;    // 1970-01-01 0:00
    // messages are ordered newest-first 
    const msInDay = 24 * 60 * 60 * 1000;
    for await (const message of messages) {

        // Show the day, when day changes
        if (lastTime &&
            (message.createdOn.getDay() != lastTime.getDay()
                || message.createdOn - lastTime >= msInDay) ) {
            textArea.innerHTML = `${lastTime.toDateString()}<br/>` + textArea.innerHTML;
        }

        // Show system and user/chat messages
        if (message.type == 'participantAdded') {
            for await (const part of message.content.participants) {
                textArea.innerHTML = `<i>${part.displayName} has entered the chat. ....................${message.createdOn.toLocaleTimeString()}</i><br/>` + textArea.innerHTML;
            }
        }
        else if (message.type == 'topicUpdated' && message.sequenceId <= 2) {
            textArea.innerHTML = `<i>Topic \'${message.content.topic}\' created. ....................${message.createdOn.toLocaleTimeString()}</i><br/>` + textArea.innerHTML;
        }
        else if (message.type == 'participantRemoved') {
            for await (const part of message.content.participants) {
                textArea.innerHTML = `<i>${part.displayName} has left the chat. ....................${message.createdOn.toLocaleTimeString()}</i><br/>` + textArea.innerHTML;
            }
        }
        else { // just a message
            textArea.innerHTML = `${message.senderDisplayName}: ${message.content.message} ....................${message.createdOn.toLocaleTimeString()}<br/>` + textArea.innerHTML;
        }

        // Show the day at top
        if (message.sequenceId == '1')
            textArea.innerHTML = `${message.createdOn.toDateString()}<br/>` + textArea.innerHTML;

        lastTime = message.createdOn;

    }


    console.log('Received...');
}


export async function showParticipants(chatThreadClient) {

    console.log('Listing participants...');

    // List participants
    const participants = chatThreadClient.listParticipants();
    var divParticipants = document.getElementById('participants');
    divParticipants.innerHTML = '<br/>Participants:<br/>';
    for await (const participant of participants) {
        //console.log(participant);
        if (participant.displayName !== undefined)
            divParticipants.innerHTML += participant.displayName + '<br/>';
    }

    console.log('Listed!!!');
}