import { writeClient, readClient } from './index';
import { checkSecurityGate } from './common';
type SortByType = 'createdTime' | 'likes' | 'comments' | '(likes + comments)';
interface Article {
    title: string;
    description: string;
    uploaderID: string;
    url: string; 

    id?: string;
    createdTime?: string;
    pinned?: boolean;
    displayed?: boolean;
    tags?: string[];
    likes?: number;
    comments?: number;
    uploaderName?: string;
    uploaderWalletAddress?: string;
    uploaderProfileImage?: string;
}

 const getArticleNums = async (useCdn: boolean = false) => {
    const client = readClient(useCdn);
    const query = `
    {
        "article": count(*[_type == 'article' && displayed == true]),
    }
    `;
    try {
        const response = await client.fetch(query);
        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(`get article num error: ${JSON.stringify(error)}`);
    }
};

/**
 * Get articles based on the sortByType, and pinned articles will be at the beginning of the returned array.
 * @param sortByType 
 * @returns Promise
 */
const getArticles = async (sortByType: SortByType = 'createdTime', page: number = 0, numPerPage: number = 20, useCdn: boolean = false) => {
    const client = readClient(useCdn);
    const start = page * numPerPage;
    const end = (page + 1) * numPerPage;
    const query = `
        *[_type == 'article' && displayed == true] | order(pinned desc, ${sortByType} desc) [${start}...${end}] {
            "id": _id,
            createdTime,
            title,
            description,
            pinned,
            displayed,
            url,
            tags,
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
        }
        return Promise.resolve(__result || []);
    } catch (error) {
        return Promise.reject(`get articles error: ${JSON.stringify(error)}`);
    }
}

/**
 * Get articles based on the sortByType, and pinned articles will be at the beginning of the returned array.
 * @param articleId
 * @returns Promise
 */
 const getArticleById = async (articleId: string, useCdn: boolean = false) => {
    const client = readClient(useCdn);
    const query = `
        *[_type == 'article' && displayed == true && _id == '${articleId}'] {
            "id": _id,
            createdTime,
            title,
            description,
            pinned,
            displayed,
            url,
            tags,
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
        return Promise.resolve(__result[0] || []);
    } catch (error) {
        return Promise.reject(`get articles error: ${JSON.stringify(error)}`);
    }
}

/**
 * Create an article.
 * @param params 
 * @returns Promise
 */
 const postArticle = async(params: Article) => {
    const {title, description, url, tags = [], uploaderID} = params;
    const date = new Date();
    try {
        checkSecurityGate()
        .then(on => {
            writeClient.createIfNotExists({
                _id: Date.now().toString(),
                _type: 'article',
                createdTime: date.toISOString(),
                title: title,
                description: description,
                url: url,
                tags: tags,
                uploader: {
                    _type: 'reference',
                    _ref: uploaderID
                },
                pinned: false,
                displayed: !on,
                likes: 0,
                comments: 0,
                likeReferences: [],
            }).then(() => {
                return Promise.resolve();
            })
        })
    } catch (error) {
        return Promise.reject(`post article error: ${JSON.stringify(error)}`);
    }
};

export {
    getArticleNums,
    getArticles,
    getArticleById,
    postArticle,
}
