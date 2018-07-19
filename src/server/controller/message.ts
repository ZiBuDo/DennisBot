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
    console.log(JSON.stringify(session.message.user));
    const userRepo = getEntityManager().getRepository(User);

    // // see if we can find user
    // const user = await userRepo.findOne({source: ''});
    // if (!user) {
    //     // need to register

    // }else {
    //     // parse into command or trigger if neither do nothing
    // }
}
