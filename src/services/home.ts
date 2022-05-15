import {getArticles} from './article';
import {getCollections} from './collection';
import {getMemes} from './meme';
import {getPosts} from './post';
import {SortType} from '@/dicts/common';
import { readClient } from '.';

const getHomeInfo = async (terminalType = 'pc', useCdn = false) => {
    return Promise.all([
        getCollections(SortType.New, '*', 0 ,6, useCdn),
        getArticles(SortType.New, 0, 4, useCdn),
        getMemes(SortType.Popular, 0, terminalType === 'pc' ? 8 : 4, useCdn),
        getPosts(SortType.New, 0, terminalType === 'pc' ? 6 : 4, useCdn),
        getContentNums(useCdn)
    ]).then(([collections, articles, memes, posts, contentNums]) => {
        return Promise.resolve({
            collections,
            articles,
            memes,
            posts,
            contentNums,
        });
    }).catch(err => {
        return Promise.reject(`get home info error ${JSON.stringify(err)}`);
    });
};

 const getContentNums = async (useCdn: boolean = false) => {
    const client = readClient(useCdn);
    const query = `
    {
        "collection": count(*[_type == 'collection' && displayed == true]),
        "article": count(*[_type == 'article' && displayed == true]),
        "meme": count(*[_type == 'meme' && displayed == true]),
        "post": count(*[_type == 'post' && displayed == true]),
    }
    `;
    try {
        const response = await client.fetch(query);
        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(`get nums error: ${JSON.stringify(error)}`);
    }
};

export {
    getHomeInfo
};
