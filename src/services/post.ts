import { writeClient, readClient } from './index';
import { checkSecurityGate } from './common';
type SortByType = 'createdTime' | 'likes' | 'comments' | '(likes + comments)';

interface Post {
    name?: string;
    text: string;
    uploaderID: string;

    id?: string;
    createdTime?: string
    pinned?: boolean;
    displayed?: boolean;
    imageIDs?: string[];
    likes?: number;
    comments?: number;
    uploaderName?: string;
    uploaderWalletAddress?: string;
    uploaderProfileImage?: string;
};

 const getPostNums = async (useCdn: boolean = false) => {
    const client = readClient(useCdn);
    const query = `
    {
        "post": count(*[_type == 'post' && displayed == true]),
    }
    `;
    try {
        const response = await client.fetch(query);
        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(`get post num error: ${JSON.stringify(error)}`);
    }
};

/**
 * 
 * Get posts based on sortByType, and pinned posts will be at the beginning of the returned array.
 * @param sortByType 
 * @returns 
 */
const getPosts = async (sortByType?: SortByType, page: number = 0, numPerPage: number = 10, useCdn: boolean = false) => {
    const client = readClient(useCdn);
    const start = page * numPerPage;
    const end = (page + 1) * numPerPage;
    const query = `
        *[_type == 'post' && displayed == true] | order(pinned desc, ${sortByType} desc) [${start}...${end}] {
            "id": _id,
            createdTime,
            pinned,
            displayed,
            text,
            "images": images[].asset->url,
            likes,
            comments,
            "uploaderID": uploader->._id,
            "uploaderName": uploader->.name,
            "uploaderWalletAddress": uploader->.walletAddress,
            "uploaderProfileImage": uploader->.profileImage.asset->url,
            likeReferences[]{
                "likeID": likeID._ref,
                "likeUser": user._ref
            }
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
        return Promise.reject(`get posts error: ${JSON.stringify(error)}`);
    }
}

/**
 * 
 * Get post based on id.
 * @param postID
 * @returns 
 */
 const getPostById = async (postID: string, useCdn: boolean = false) => {
    const client = readClient(useCdn);
    const query = `
        *[_type == 'post' && displayed == true && _id == '${postID}']{
            "id": _id,
            createdTime,
            pinned,
            displayed,
            text,
            "images": images[].asset->url,
            likes,
            comments,
            "uploaderID": uploader->._id,
            "uploaderName": uploader->.name,
            "uploaderWalletAddress": uploader->.walletAddress,
            "uploaderProfileImage": uploader->.profileImage.asset->url,
            likeReferences[]{
                "likeID": likeID._ref,
                "likeUser": user._ref
            }
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
        return Promise.resolve(result[0]);
    } catch (error) {
        return Promise.reject(`get post error: ${JSON.stringify(error)}`);
    }
}

/**
 * Create a post
 * @param params 
 * @returns Promise
 */
 const postPost = async(params: Post) => {
    const {
        text,
        imageIDs,
        uploaderID,
    } = params;
    
    const date = new Date()
    try {
        await checkSecurityGate()
        .then(on => {
            writeClient
            .create({
                _type: 'post',
                createdTime: date.toISOString(),
                images: imageIDs?.map(id => {
                  return {
                    _type: 'file',
                    asset: {
                        _type: 'reference',
                        _ref: id
                    }
                  }
                }),
                text: text,
                uploader: {
                    _type: 'reference',
                    _ref: uploaderID
                },
                pinned: false,
                displayed: !on,
                likes: 0,
                comments: 0,
                likeReferences: [],
            })
        });
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(`post post error: ${JSON.stringify(error)}`);
    }
};

export {
    getPostNums,
    getPosts,
    getPostById,
    postPost,
}
