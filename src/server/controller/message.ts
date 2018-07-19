import {getEntityManager} from 'typeorm';
import {User} from '../entity/database/user';
import {getExisting, create} from '../services/database/user.service';

/**
 * Message Endpoint
 */
export default async function message(session: any) {
    // determine who it is, if unknown then prompt for user
    // once we know who it is then determine if this is a command
    // if a command then go to command flow
    // if not a command then determine if we are triggered
    // if triggered then go to trigger + action flow

    const userConfig = {
        source: session.message.user.id,
        name: session.message.user.name
    };
    let user = await getExisting(userConfig);
    // see if we can find user
    if (!user) {
        // need to register: ask for name
        user = await create(userConfig);
        session.send('Nice to meet you ' + user.name);
        flow(session, user);
    }else {
        // parse into command or trigger if neither do nothing
        flow(session, user);
    }
}


function flow(session: any, user: User) {
    // if text has @Dennis Schaller then parse it out

    session.send('You said ' + session.message.text);
}

