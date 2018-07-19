
import { getEntityManager } from 'typeorm';
import { User } from '../../entity/database/user';

const UserSerivce = (function() {
    return {
        getExisting: getExisting,
        findByName: findByName,
        findBySource: findBySource,
        create: create
    };

    async function findBySource(source: String) {
        const userRepo = getEntityManager().getRepository(User);
        // see if we can find user
        return await userRepo.findOne({ source: source });
    }

    async function findByName(name: String) {
        const userRepo = getEntityManager().getRepository(User);
        // see if we can find user
        return await userRepo.findOne({ name: name });
    }

    async function create(userConfig: any) {
        const userRepo = getEntityManager().getRepository(User);
        // return created user
        // ensure unique name
        let newUserName = await generateUniqueUserName(userConfig.name, 0);
        // need to register: ask for name
        let newUser = userRepo.create({ name: newUserName, source: userConfig.source });
        await getEntityManager().persist(newUser);

        return newUser;
        async function generateUniqueUserName(name: String, counter: number): Promise<String> {
            let unique = counter ? name + (counter + '') : name;
            if (await findByName(unique)) {
                return await generateUniqueUserName(name, ++counter);
            }
            return unique;
        }
    }

    async function getExisting(userConfig: any): Promise<User> {
        // check if user exists by source, then by name as fallback
        let exists = await findBySource(userConfig.source);
        if (exists) {
            return exists;
        } else {
            exists = await findByName(userConfig.name);
            if (exists) {
                return exists;
            }
        }
    }

})();

export default UserSerivce;
