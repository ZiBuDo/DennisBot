import {getEntityManager} from 'typeorm';
import {User} from '../entity/database/user';

/**
 * Message Endpoint
 */
export default async function message(session: any) {
    // determine who it is, if unknown then prompt for user
    // once we know who it is then determine if this is a command
    // if a command then go to command flow
    // if not a command then determine if we are triggered
    // if triggered then go to trigger + action flow
    const userRepo = getEntityManager().getRepository(User);

    // see if we can find user
    const user = await userRepo.findOne({source: session.message.user.id});
    if (!user) {
        // need to register: ask for name
        userRepo.create({name: session.message.user.name, source: session.message.user.id});
        session.send('Nice to meet you ' + session.message.user.name);
    }else {
        // parse into command or trigger if neither do nothing
    }
}
