


export async function addParticipant(chatThreadClient) {

    console.log('Adding participant...');

    let idNew = prompt('ID: ');
    let nameNew = prompt('Name: ');

    const addParticipantsRequest = {
        participants: [{
            id: { communicationUserId: idNew },
            displayName: nameNew
        }]
    };
    await chatThreadClient.addParticipants(addParticipantsRequest);


    console.log('Participant added!!!');
}




export async function removeParticipant(chatThreadClient) {

    console.log('Removing participant...');


    // Aks for user id and remove user
    const userId = prompt('ID: ');
    const promise = await chatThreadClient.removeParticipant({ communicationUserId: userId });
    console.log(promise);

    console.log('Participant removed!!!');
}


