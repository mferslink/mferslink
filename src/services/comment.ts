import {postNotification} from './notification';
import { writeClient, readClient } from './index';
import { checkSecurityGate } from './common';
type CommentToType = 'article' | 'collection' | 'meme' | 'post';
type SortByType = 'likes' | 'createdTime' | '(likes + comments)';
interface Comment {
    content: string;
    commenterID: string;
    // CommentTo information
    commentToID: string;
    commentToUploaderID: string;
    replyToCommentID?: string;
    replyToUserID?: string;
    commentToType: string;

    id?: string;
    createdTime?: string;
    pinned?: boolean;
    displayed?: boolean;
    likes?: number;
    // resourceContent can be GIFs, images or files
    resourceContent?: string;
    // Commenter Information
    commenterName?: string;
    commenterWalletAddress?: string;
    commenterProfileImage?: string;
}

 const getCommentNums = async (commentToID: string, commentToType: CommentToType, useCdn: boolean = false) => {
    const client = readClient(useCdn);
    const query = `
    {
        "comment": count(*[_type == 'comment' && displayed == true && to->._id == '${commentToID}' && to->._type == '${commentToType}']),
    }
    `;
    try {
        const response = await client.fetch(query);
        return Promise.resolve(response.comment || 0);
    } catch (error) {
        return Promise.reject(`get comment num error: ${JSON.stringify(error)}`);
    }
};

/**
 * Get comments based on the commentToType and sortByType, and pinned comments will be at the beginning of the returned array.
 * @param commentToID 
 * @param commentToType 
 * @param sortByType 
 * @returns 
 */
const getComments = async (commentToID: string, commentToType: CommentToType, sortByType: SortByType = 'createdTime', page: number = 0, numPerPage: number = 10, useCdn: boolean = false) => {
    const client = readClient(useCdn);
    const start = page * numPerPage;
    const end = (page + 1) * numPerPage;
    const query = `
        *[_type == 'comment' && displayed == true && to->._id == '${commentToID}' && to->._type == '${commentToType}' ] | order(pinned desc, ${sortByType} desc) [${start}...${end}] {
            "id": _id,
            createdTime,
            content,
            "resourceContent": resourceContent.asset->url,
            pinned,
            displayed,
            likes,
            "commenterID": from->._id,
            "commenterName": from->.name,
            "commenterWalletAddress": from->.walletAddress,
            "commenterProfileImage": from->.profileImage.asset->url,
            likeReferences[]{
                "likeID": likeID._ref,
                "likeUser": user._ref
            },
            "replyToUser": replyTo->._id,
            "replyToUserName": replyTo->.name,
            "replyToWalletAddress": replyTo->.walletAddress,
            "replyToProfileImage": replyTo->.profileImage.asset->url,
            "replyToCommentID": toComment->._id,
            "replyToCommentContent": toComment->.content,
            "replyToCommentResourceContent": toComment->.resourceContent.asset->url,
            "commentToType": to->._type,
        }
    `;
    try {
        const result = await client.fetch(query);
        const wa = sessionStorage.getItem('wa');
        let __result = result;
        if (wa) {
            __result = result.map((item: any) => {
                if (item.likeReferences && item.likeReferences.length) {
                    const likeInfo = item.likeReferences.find((user: any) => wa === user.likeUser) || '';
                    item.liked = !!likeInfo;
                    item.likedId = likeInfo?.likeID || '';
                } else {
                    item.liked = false;
                    item.likedId = '';
                }

                return item;
            });
        }
        return Promise.resolve(__result || []);
    } catch (error) {
        return Promise.reject(`get comments error: ${JSON.stringify(error)}`);
    }
}

/**
 * Post a comment.
 * @param params 
 * @returns Promise
 */
 const postComment = async(params: Comment) => {
    const {
        content,
        resourceContent,
        commenterID,
        commentToID,
        commentToUploaderID,
        replyToUserID,
        commentToType,
        replyToCommentID,
    } = params;
    const date = new Date()
    try {
        // Build comment document
        let commentDoc = {
            _type: 'comment',
            createdTime: date.toISOString(),
            content: content,
            from: {
                _type: 'reference',
                _ref: commenterID
            },
            to: {
                _type: 'reference',
                _ref: commentToID
            },
            pinned: false,
            displayed: true,
            likes: 0,
            likeReferences: [],
            comments: 0
        }
        if (resourceContent) {
            commentDoc = {...commentDoc, ...{
                resourceContent: {
                    _type: 'file',
                    asset: {
                        _type: 'reference',
                        _ref: resourceContent
                    }
                }
            }};
        }
        let replyToUser = commentToUploaderID;
        if (replyToCommentID) {
            if (replyToUserID) {
                replyToUser = replyToUserID;
            }
            commentDoc = {...commentDoc, ...{
                toComment: {
                    _type: 'reference',
                    _ref: replyToCommentID,
                },
                replyTo: {
                    _type: 'reference',
                    _ref: replyToUser
                }
            }};
            writeClient.patch(replyToCommentID).inc({comments: 1}).commit();
        }
        // Update comment number in the collection, article, memes resources
        writeClient.patch(commentToID).inc({comments:1}).commit();

        // Create comment
        const res = await writeClient.create(commentDoc);

        // push notification
        postNotification({
            type: 'comment',
            fromUserID: commenterID,
            fromContentID: commentToID,
            fromContentType: commentToType,
            fromCommentID: replyToCommentID,
            userID: replyToUser,
            newCommentID: res._id,
        }); 
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(`post comment error: ${JSON.stringify(error)}`);
    }
};

export {
    getCommentNums,
    getComments,
    postComment
}
