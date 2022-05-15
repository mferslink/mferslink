import { writeClient, readClient } from './index';
interface User {
    id: string,
    name: string,
    walletAddress: string,
    profileImage: string,
    notifications: Date,
}

/**
 * Create User if user doesn't exist, this function should be called when user tries to connect wallet.
 * @param walletAddress 
 * @returns 
 */
const createUserIfNotExist = async (walletAddress: string) => {
    const date = new Date();
    const userInfo = {
        _type: 'user',
        _id: walletAddress,
        name: 'Mfer(' + walletAddress.substring(0, 8) + '...)',
        walletAddress: walletAddress,
        createdTime: date.toISOString(),
        notifications: 0,
        profileImage: {
            _type: 'image',
            asset: {
                _type: 'reference',
                _ref: 'image-6a734a0e1fcff3d8c4aaf8020fec360b66f55997-2100x2100-png'
            }
        }
    };
    try {
        await writeClient.createIfNotExists(userInfo);
        return Promise.resolve();
    }catch (error) {
        return Promise.reject(`create user error: ${JSON.stringify(error)}`);
    }
}

/**
 * Edit user info
 * @param userID
 * @param name
 * @param avator
 * @returns 
 */
const editUserInfo =async (userID: string, name: string, avatorId: string) => {
    try {
        await writeClient
        .patch(userID)
        .set({
            name: name,
            profileImage: {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: avatorId
                }
            }
        })
        .commit();
        return Promise.resolve();
    }catch (error) {
        return Promise.reject(`edit user name error: ${JSON.stringify(error)}`);
    }
}

/**
 * get user
 * @param userID 
 * @returns 
 */
const getUser = async (userID : string, useCdn: boolean = false) => {
    const client = readClient(useCdn);
    const userInfoQuery = `
    *[_type == 'user' && _id == '${userID}']{
        "id": _id,
        name,
        walletAddress,
        notifications,
        lastNotificationTime,
        "profileImage": profileImage.asset->url,
        "profileImageRef": profileImage.asset._ref
     }
    `;
    try {
        const response = await client.fetch(userInfoQuery);
        return Promise.resolve(response[0]); 
    } catch (error) {
        return Promise.reject(`get user error: ${JSON.stringify(error)}`);
    }
};

const setLastNotificationTime = async (userID: string, lastNotificationTime: Date) => {
    try {
        await writeClient
        .patch(userID)
        .set({
            lastNotificationTime: lastNotificationTime.toISOString(),
            notifications: 0
        })
        .commit();
        return Promise.resolve();
    }catch (error) {
        console.log('eror', error);
        return Promise.reject(`edit user lastNotificationTime error: ${JSON.stringify(error)}`);
    }
}


export {
    createUserIfNotExist,
    editUserInfo,
    getUser,
    setLastNotificationTime,
}
