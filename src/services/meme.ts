// import { createReadStream } from 'fs';
// import { basename } from 'path';
import { writeClient, readClient } from './index';
import { checkSecurityGate } from './common';
type SortByType = 'createdTime' | 'likes' | 'comments' | 'items' | 'owners' | 'floorPrice' | 'volumeTraded' | '(likes + comments)';

interface Meme {
    name: string;
    description: string;
    memeImageId: string;
    uploaderID: string;
    memeID: string;

    id?: string;
    createdTime?: string
    pinned?: boolean;
    displayed?: boolean;
    tags?: string[];
    likes?: number;
    comments?: number;
    uploaderName?: string;
    uploaderWalletAddress?: string;
    uploaderProfileImage?: string;
};

 const getMemeNums = async (useCdn: boolean = false) => {
    const client = readClient(useCdn);
    const query = `
    {
        "meme": count(*[_type == 'meme' && displayed == true]),
    }
    `;
    try {
        const response = await client.fetch(query);
        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(`get meme num error: ${JSON.stringify(error)}`);
    }
};

/**
 * 
 * Get memes based on sortByType, and pinned memes will be at the beginning of the returned array.
 * @param sortByType 
 * @returns 
 */
const getMemes = async (sortByType?: SortByType, page: number = 0, numPerPage: number = 20, useCdn: boolean = false) => {
    const client = readClient(useCdn);
    const start = page * numPerPage;
    const end = (page + 1) * numPerPage;
    const query = `
        *[_type == 'meme' && displayed == true] | order(pinned desc, ${sortByType} desc) [${start}...${end}] {
            "id": _id,
            createdTime,
            name,
            description,
            pinned,
            displayed,
            "content": content.asset->url,
            likes,
            comments,
            tags,
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
        return Promise.reject(`get memes error: ${JSON.stringify(error)}`);
    }
}

/**
 * 
 * Get memes based on sortByType, and pinned memes will be at the beginning of the returned array.
 * @param memeId
 * @returns 
 */
 const getMemeById = async (memeId: string, useCdn: boolean = false) => {
    const client = readClient(useCdn);
    const query = `
        *[_type == 'meme' && displayed == true && _id == '${memeId}']{
            "id": _id,
            createdTime,
            name,
            description,
            pinned,
            displayed,
            "content": content.asset->url,
            likes,
            comments,
            tags,
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
        return Promise.reject(`get memes error: ${JSON.stringify(error)}`);
    }
}

/**
 * Create a meme
 * @param params 
 * @returns Promise
 */
 const postMeme = async(params: Meme) => {
    const {
        name = '',
        description,
        memeImageId,
        uploaderID,
        tags,
    } = params;
    
    const date = new Date()
    try {
        await checkSecurityGate()
        .then(on => {
            writeClient
            .create({
                _type: 'meme',
                name: name,
                createdTime: date.toISOString(),
                content: {
                    _type: 'file',
                    asset: {
                        _type: 'reference',
                        _ref: memeImageId
                    }
                },
                tags: tags,
                description: description,
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
        return Promise.reject(`post meme error: ${JSON.stringify(error)}`);
    }
};

export {
    getMemeNums,
    getMemes,
    getMemeById,
    postMeme
}
