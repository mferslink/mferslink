import { writeClient, readClient, readOnlyDBClient } from './index';
import { checkSecurityGate } from './common';
// import { getOpenSeaStats } from './common';
type SortByType = 'createdTime' | 'likes' | 'comments' | 'items' | 'owners' | 'floorPrice' | 'volumeTraded' | '(likes + comments)';
type FilterType = 'Verified' | '*';

import { BaseInfoType } from "@/typings/collection";
interface Collection {
    name: string;
    collectionImageId: string;
    contractAddress: string;
    website: string;
    uploaderID: string;

    id?: string;
    createdTime?: string
    pinned?: boolean;
    displayed?: boolean;
    contractStatus?: string;
    websiteStatus?: string;
    twitter?: string;
    opensea?: string;
    discord?: string;
    items?: number;
    owners?: number;
    floorPrice?: number;
    volumeTraded?: number;
    likes?: number;
    comments?: number;
    uploaderName?: string;
    uploaderWalletAddress?: string;
    uploaderProfileImage?: string;
};

 const getCollectionNums = async (useCdn: boolean = false) => {
    const client = readClient(useCdn)
    const query = `
    {
        "collection": count(*[_type == 'collection' && displayed == true]),
    }
    `;
    try {
        const response = await client.fetch(query);
        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(`get collection num error: ${JSON.stringify(error)}`);
    }
};

/**
 * Get collections based on sortByType and filterType, and pinned collections will be at the beginning of the returned array.
 * @param sortByType 
 * @param filterType
 * @returns Promise
 */
const getCollections = async (sortByType: SortByType = 'volumeTraded', filterType: FilterType = '*', page: number = 0, numPerPage: number = 20, useCdn: boolean = false) => {
    const rClient = readClient(useCdn);
    const rOnlyClient = readOnlyDBClient(useCdn);
    const start = page * numPerPage;
    const end = (page + 1) * numPerPage;
    const query = `
        *[_type == 'collection' && displayed == true && contractStatus match '${filterType}' && websiteStatus match '${filterType}'] | order(pinned desc, ${sortByType} desc) [${start}...${end}] {
            "id": _id,
            createdTime,
            name,
            pinned,
            displayed,
            "collectionImage": collectionImage.asset->url,
            contractAddress,
            contractStatus,
            contractReviewTime,
            "contractReviewerName": contractReviewer->.name,
            website,
            websiteStatus,
            websiteReviewTime,
            "websiteReviewerName": websiteReviewer->.name,
            twitter,
            opensea,
            discord,
            items,
            owners,
            floorPrice,
            volumeTraded,
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
    const readQuery = `
        *[_type == 'collection' && contractStatus match '${filterType}' && websiteStatus match '${filterType}'] {
            "id": _id,
            name,
            contractAddress,
            contractStatus,
            contractReviewTime,
            "contractReviewerName": contractReviewer,
            website,
            websiteStatus,
            websiteReviewTime,
            "websiteReviewerName": websiteReviewer,
            twitter,
            opensea,
            discord,
            items,
            owners,
            floorPrice,
            volumeTraded,
        }
    `
    try {
        const [result, readResult] = await Promise.all([rClient.fetch(query), rOnlyClient.fetch(readQuery)]);
        let readMap = new Map(readResult.map((i: any) => [i.id, i]));
        let res = result.map((item: any) => {
            if (readMap.has(item.id)) {
                return {...item, ...(readMap.get(item.id) as Record<any, any>)};
            }else {
                return {...item,websiteStatus: 'Unknown', contractStatus: 'Unknown'};
            }
        });
        const wa = sessionStorage.getItem('wa');
        let __result = res;
        if (wa) {
            __result = res.map((item: any) => {
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
        return Promise.reject(`get collections error: ${JSON.stringify(error)}`);
    }
}

/**
 * Get collections based on sortByType and filterType, and pinned collections will be at the beginning of the returned array.
 * @param collectionId
 * @returns Promise
 */
 const getCollectionById = async (collectionId: string, useCdn: boolean = false) => {
    const rClient = readClient(useCdn);
    const rOnlyClient = readOnlyDBClient(useCdn);
    const query = `
        *[_type == 'collection' && displayed == true && _id == '${collectionId}']{
            "id": _id,
            createdTime,
            name,
            pinned,
            displayed,
            "collectionImage": collectionImage.asset->url,
            contractAddress,
            contractStatus,
            contractReviewTime,
            "contractReviewerName": contractReviewer->.name,
            website,
            websiteStatus,
            websiteReviewTime,
            "websiteReviewerName": websiteReviewer->.name,
            twitter,
            opensea,
            discord,
            items,
            owners,
            floorPrice,
            volumeTraded,
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
    const readQuery = `
        *[_type == 'collection' && _id == '${collectionId}'] {
            "id": _id,
            name,
            contractAddress,
            contractStatus,
            contractReviewTime,
            "contractReviewerName": contractReviewer,
            website,
            websiteStatus,
            websiteReviewTime,
            "websiteReviewerName": websiteReviewer,
            twitter,
            opensea,
            discord,
            items,
            owners,
            floorPrice,
            volumeTraded,
        }
    `
    try {
        const [result, readResult] = await Promise.all([rClient.fetch(query), rOnlyClient.fetch(readQuery)]);
        let readMap = new Map(readResult.map((i: any) => [i.id, i]));
        let res = result.map((item: any) => {
            if (readMap.has(item.id)) {
                return {...item, ...(readMap.get(item.id) as Record<any, any>)};
            }else {
                return {...item,websiteStatus: 'Unknown', contractStatus: 'Unknown'};
            }
        });
        const wa = sessionStorage.getItem('wa');
        let __result = res;
        if (wa) {
            __result = res.map((item: any) => {
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
        return Promise.resolve(__result[0] as BaseInfoType);
    } catch (error) {
        return Promise.reject(`get collections error: ${JSON.stringify(error)}`);
    }
}

/**
 * Create a collection
 * @param params 
 * @returns Promise
 */
 const postCollection = async(params: Collection) => {
    const {
        name,
        collectionImageId,
        contractAddress,
        website,
        twitter,
        opensea,
        discord,
        uploaderID
    } = params;
    const date = new Date()
    try {
            await checkSecurityGate()
            .then(on => {
                writeClient
                .createIfNotExists({
                    _id: name.replaceAll(' ', '_'),
                    _type: 'collection',
                    createdTime: date.toISOString(),
                    name: name,
                    collectionImage: {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: collectionImageId
                        }
                    },
                    contractAddress: contractAddress,
                    contractStatus: 'Unknown',
                    website: website,
                    websiteStatus: 'Unknown',
                    twitter: twitter,
                    opensea: opensea,
                    discord: discord,
                    uploader: {
                        _type: 'reference',
                        _ref: uploaderID
                    },
                    pinned: false,
                    displayed: !on,
                    likes: 0,
                    comments: 0,
                    likeReferences: [],
                }).then(res => {
                    //         if ((opensea !== undefined ) && (opensea.startsWith("https://opensea.io/collection/"))) {
                    //             const ars = opensea.split('/');
                    //             const slug = ars[ars.length - 1];
                    //             getOpenSeaStats(slug)
                    //             .then(stats => {
                    //                 patchCollection(res._id, stats.stats.count, stats.stats.num_owners, stats.stats.floor_price, stats.stats.total_volume);
                    //             })
                    // }
                    return Promise.resolve();
                })
            })
    } catch (error) {
        return Promise.reject(`post collection error: ${JSON.stringify(error)}`);
    }
};

const patchCollection = async (collectionID: string, items: string, owners: string, floorPrice: string, volumeTraded: string) => {
    try{
        writeClient
        .patch(collectionID)
        .set(
            {
                items: items,
                owners: owners,
                floorPrice: floorPrice,
                volumeTraded: volumeTraded
            }
        )
        .commit()
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(`patch collection error: ${JSON.stringify(error)}`);
    }
};


export {
    getCollectionNums,
    getCollections,
    getCollectionById,
    postCollection,
    patchCollection
}
