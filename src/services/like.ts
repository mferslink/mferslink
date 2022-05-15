import { postNotification } from './notification';
import { writeClient, readClient } from './index';
type LikeToType = 'article' | 'collection' | 'meme' | 'post';
type SortByType = 'createdTime';
interface Like {
    likeFromID: string;
    likeToID: string;

    likeToType?: string;
    likeToCommentID?: string;
    uploaderOrCommenterID?: string;
    replyToUserID?: string;
    id?: string
    likeFromName?: string;
    likeFromWalletAddress?: string;
    likeFromProfileImage?: string;
};

/**
 * get likes of an item, and item can be article, collection, meme, or comment.
 * @param likeToID 
 * @param likeToType 
 * @param sortByType 
 * @returns 
 */
const getLikes = async (likeToID: string, likeToType: LikeToType, sortByType: SortByType = 'createdTime', useCdn: boolean = false) => {
    const client = readClient(useCdn);
    const query =  `
        *[_type == 'like' && to->._id == '${likeToID}' && to->._type == '${likeToType}' ] | order(${sortByType} desc) {
          "id": _id,
          createdTime,
          "likeFromID": from->._id,
          "likeFromName": from->.name,
          "likeFromWalletAddress": from->.walletAddress,
          "likeFromProfileImage": from->.profileImage.asset->url,
          "likeToCommentID": toComment->._id,
          "likeToType": to->._type,
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
 * Post a like
 * @param params 
 * @returns 
 */
const postLike = async (params: Like) => {
    const {
        likeFromID,
        likeToID,
        likeToType,
        likeToCommentID,
        uploaderOrCommenterID,
    } = params;
    const date = new Date()
    try {
        const res = await writeClient.create({
            _type: 'like',
            createdTime: date.toISOString(),
            from: {
                _type: 'reference',
                _ref: likeFromID
            },
            toComment: {
                _type: 'reference',
                _ref: likeToCommentID,
            },
            to: {
                _type: 'reference',
                _ref: likeToID

            }
        });
        
        let patchID = likeToID;
        if (likeToCommentID) {
            patchID = likeToCommentID;
        }
        writeClient
        .patch(patchID)
        .inc({likes: 1})
        .setIfMissing({likeReferences: []})
        .append('likeReferences', [{
            _type: 'likeReference',
            _key: res._id,
            likeID: {
                _type: 'reference',
                _ref: res._id
            },
            user: {
                _type: 'reference',
                _ref: likeFromID
            }
        }])
        .commit();

        postNotification({
            type: 'like',
            fromUserID: likeFromID,
            fromContentID: likeToID,
            fromContentType: likeToType || '',
            fromCommentID: likeToCommentID,
            userID: uploaderOrCommenterID || '',
        });
        return Promise.resolve(res?._id);
    } catch (error) {
        return Promise.reject(`post like error: ${JSON.stringify(error)}`);
    }  
}

const deleteLike = async (params: Like, likeID: string) => {
    const {
        // likeFromID,
        likeToID,
        likeToCommentID
    } = params;

    let patchID = likeToID;
    if (likeToCommentID) {
        patchID = likeToCommentID;
    }
    try {
        await writeClient
        .patch(patchID)
        .dec({likes: 1})
        .unset([`likeReferences[_key=="${likeID}"]`])
        .commit()
        .then(() => {
            writeClient.delete(likeID);
        })
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(`post like error: ${JSON.stringify(error)}`);
    }
}

export {
    getLikes,
    postLike,
    deleteLike,
};
