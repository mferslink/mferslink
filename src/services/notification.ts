import { writeClient, readClient } from './index';
type FromContentType = 'article' | 'collection' | 'meme' | 'post';
type SortByType = 'createdTime';
interface Notification {
    type: string;
    fromUserID: string;
    fromContentID: string;
    fromContentType: string;
    userID: string;

    fromCommentID?: string;
    newCommentID?: string;
    id?: string;
    fromUserName?: string;
    fromUserWalletAddress?: string;
    fromUserProfileImage?: string;
};

 const getNotificationNums = async (userID: string, useCdn: boolean = false) => {
    const client = readClient(useCdn);
    const query = `
    {
        "notification": count(*[_type == 'notification' && to->._id == '${userID}']),
    }
    `;
    try {
        const response = await client.fetch(query);
        return Promise.resolve(response?.notification || 0);
    } catch (error) {
        return Promise.reject(`get notification num error: ${JSON.stringify(error)}`);
    }
};

/**
 *  Get notifications for the current user
 * @param userID
 * @param sortByType 
 * @returns 
 */
const getNotifications = async (userID: string, sortByType: SortByType = 'createdTime', page: number = 0, numPerPage: number = 20, useCdn: boolean = false) => {
    const client = readClient(useCdn);
    const start = page * numPerPage;
    const end = (page + 1) * numPerPage;
    const query =  `
        *[_type == 'notification' && to->._id == '${userID}'] | order(${sortByType} desc) [${start}...${end}] {
          "id": _id,
          createdTime,
          "fromUserID": from->._id,
          "fromUserName": from->.name,
          "fromUserWalletAddress": from->.walletAddress,
          "fromUserProfileImage": from->.profileImage.asset->url,
          "fromContentID": fromContent->._id,
          "fromContentType": fromContent->._type,
          type,
          "fromCommentID": fromComment->._id,
          "commentContent": fromComment->.content,
          "commentResourceContent": fromComment->.resourceContent.asset->url,
          "articleTitle": fromContent->.title,
          "collectionImage": fromContent->.collectionImage.asset->url,
          "collectionName": fromContent->.name,
          "memeContent": fromContent->.content.asset->url,
          "memeName": fromContent->.name,
          "postText": fromContent->.text,
          "postImages": fromContent->.images[].asset->url,
          "newCommentID": newComment->._id,
          "newCommentContent": newComment->.content,
          "newCommentResourceContent": newComment->.resourceContent.asset->url,
          "newCommentLikes": newComment->.likes,
          "newCommentReplies": newComment->.comments,
          "newCommentLikeReferences": newComment->.likeReferences[]{
            "likeID": likeID._ref,
            "likeUser": user._ref
          }
        }
    `;
    try {
        const result = await client.fetch(query);
        return Promise.resolve(result);
    } catch (error) {
        return Promise.reject(`get likes error: ${JSON.stringify(error)}`);
    }
};

/**
 * Post a notification
 * @param params 
 * @returns 
 */
const postNotification = async (params : Notification) => {
    const {
        type,
        fromUserID,
        fromContentID,
        fromCommentID,
        userID,
        newCommentID,
    } = params;
    if (fromUserID === userID) {
        return Promise.resolve();
    }
    const date = new Date()
    try {
        await writeClient
        .create({
            _type: 'notification',
            createdTime: date.toISOString(),
            from: {
                _type: 'reference',
                _ref: fromUserID
            },
            fromContent: {
                _type: 'reference',
                _ref: fromContentID
            },
            fromComment: {
                _type: 'reference',
                _ref: fromCommentID,
            },
            to: {
                _type: 'reference',
                _ref: userID
            },
            newComment: {
                _type: 'reference',
                _ref: newCommentID,
            },
            type: type
        })
        .then(() => {
            // Increase the notification number of the current user
            return writeClient
            .patch(userID)
            .inc({notifications: 1})
            .commit();
        })
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(`post notification error: ${JSON.stringify(error)}`);
    }  
}

/**
 * Delete a notification
 * @param userID 
 * @param notificationID 
 * @returns 
 */
const deleteNotification =async (userID: string, notificationID: string) => {
    try {
        await writeClient
        .delete(notificationID)
        .then(() => {
            // Decrease the notification number of the current user
            writeClient
            .patch(userID)
            .dec({notifications: 1})
            .commit();
        })
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(`post notification error: ${JSON.stringify(error)}`);
    }  
}

export {
    getNotificationNums,
    getNotifications,
    postNotification,
    deleteNotification
};
