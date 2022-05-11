import { id } from './account';
import { chatThreadClient } from './connect';


export async function leave() {

    console.log('Leaving chatroom...');


    await chatThreadClient.removeParticipant({ communicationUserId: id });


    console.log('Left!!!');
}

export default leave