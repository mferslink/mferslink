import { writeClient, readOnlyDBClient } from './index';
/**
 * post file
 * @param file image/word/pdf
 * @returns 
 */
 const postFile = async (file: File) => {
    try {
        const resInfo = await writeClient.assets.upload('file', file);
        return Promise.resolve({url: resInfo.url, id: resInfo._id});
    } catch (error) {
        return Promise.reject(`upload file error: ${JSON.stringify(error)}`);
    }
};

/**
 * post image
 * @param image
 * @returns 
 */
 const postImage = async (image: File) => {
    try {
        const resInfo = await writeClient.assets.upload('image', image);
        return Promise.resolve({url: resInfo.url, id: resInfo._id});
    } catch (error) {
        return Promise.reject(`upload file error: ${JSON.stringify(error)}`);
    }
};
// const getOpenSeaStats = async (slug: string) => {
//     try {
//         const res = openSeaClient({collection_slug: slug});
//         return Promise.resolve(res);
//     } catch (error) {
//         return Promise.reject(`get collection stat from opensea: ${JSON.stringify(error)}`);
//     }
// }

const checkSecurityGate = async (useCdn: boolean = false) => {
    const client = readOnlyDBClient(useCdn);
    try {
        const query = `        
        *[_type == 'securityGate']{
            _id,
            on
        }
        `;
        const res = await client.fetch(query);
        return Promise.resolve(res[0].on);
    } catch (error) {
        return Promise.reject(`get security gate: ${JSON.stringify(error)}`);
    }
}

export {
    postFile,
    postImage,
    // getOpenSeaStats
    checkSecurityGate
}
