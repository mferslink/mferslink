import CollectionCard from '@/components/Collection/Card';
import MemeCard from '@/components/Meme/Card';
import ArticleCard from '@/components/Article/Card';
import Title from '@/components/Common/Title';
import styled from './index.module.css';
import Button from '@/components/Common/Button';
import AddCollectionModal from '@/components/Common/AddCollectionModal';
import AddMemeModal from '@/components/Common/AddMemeModal';
import AddArticleModal from '@/components/Common/AddArticleModal';
import AddPostModal from '@/components/Common/AddPostModal';
import { getHomeInfo } from '@/services/home';
import { ACTIONS, useDispatchStore, useStateStore } from '@/store/index';
import { useCallback, useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { useRouter } from 'next/router';
import ROUTE from '@/dicts/routesMap';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import Image from 'next/image';
import Loading from "@/components/Common/Loading";
import Ellipsis from '@/components/Common/Ellipsis';
import PostCard from '@/components/Plaza/Card';

// interface ResultType {
//     collections?: any[];
//     memes?: any[];
//     articles?: any[];
// }

const Home = () => {
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [showMemeModal, setShowMemeModal] = useState(false);
    const [showArticleModal, setShowArticleModal] = useState(false);
    const [showPlazaModal, setShowPlazaModal] = useState(false);
    const [collections, setCollectios] = useState<any[]>([]);
    const [contentNums, setContentNums] = useState({
        article: 0,
        collection: 0,
        meme: 0,
        post: 0
    });

    const [memesOne, setMemesOne] = useState<any[]>([]);
    const [memesTwo, setMemesTwo] = useState<any[]>([]);
    const [memesThree, setMemesThree] = useState<any[]>([]);
    const [memesFour, setMemesFour] = useState<any[]>([]);
    const [articles, setArticles] = useState<any[]>([]);
    const [postOne, setPostOne] = useState<any[]>([]);
    const [postTwo, setPostTwo] = useState<any[]>([]);

    const { walletAddress, isWise } = useStateStore();
    const dispatch = useDispatchStore();
    const { t } = useTranslation();

    const router = useRouter();

    const onAdd = useCallback((type) => {
        if (!walletAddress) {
            dispatch?.({
                type: ACTIONS.SET_SHOW_LOGIN_MODAL,
                payload: true
            })
            return;
        }
        switch (type) {
            case 'collection':
                setShowCollectionModal(true);
                break;
            case 'meme':
                setShowMemeModal(true);
                break;
            case 'article':
                setShowArticleModal(true);
                break;
            case 'plaza':
                setShowPlazaModal(true);
                break;
            default:
                break;
        }
    }, [walletAddress]);

    const getAllInfo = useCallback((useCdn = false) => {
        getHomeInfo(isWise ? 'wise' : 'pc', useCdn).then(res => {
            const {memes, articles, collections, contentNums, posts} = res;
            setContentNums(contentNums);
            let data1: any[] = [],
            data2: any[] = [],
            data3: any[] = [],
            data4: any[] = []
            let i = 0;
            while (i < memes.length) {
                data1.push(memes[i++]);
                if (i < memes.length) {
                data2.push(memes[i++]);
                }
                if (i < memes.length) {
                data3.push(memes[i++]);
                }
                if (i < memes.length) {
                data4.push(memes[i++]);
                }
            }

            let post1: any[] = [],
            post2: any[] = [];

            let j = 0;
            while (j < posts.length) {
                post1.push(posts[j++]);
                if (j < memes.length) {
                    post2.push(posts[j++]);
                }
            }

            setMemesOne(data1);
            setMemesTwo(data2);
            setMemesThree(data3);
            setMemesFour(data4);

            setPostOne(post1);
            setPostTwo(post2);
            setArticles(articles || []);
            setCollectios(collections || []);
        });
    }, [isWise]);
    
    useEffect(() => {
        getAllInfo(true);
    }, [walletAddress]);

    const goMore = useCallback((path: string) => {
        router.push(path);
    }, []);
    
    const onModalClose = useCallback((status, type) => {
        switch (type) {
            case 'collection':
                setShowCollectionModal(false);
                break;
            case 'meme':
                setShowMemeModal(false);
                break;
            case 'article':
                setShowArticleModal(false);
                break;
            case 'plaza':
                setShowPlazaModal(false);
                break;
            default:
                break;
        }
        if (status) {
            getAllInfo();
        }
    }, []);

    return (<div className={styled.homeBox}>
        <div>
            {
                <div className={styled.headBg}>
                    <div>
                        <Image
                            src="https://cdn.sanity.io/images/oru63jca/production/54394e4faa7b207224b5442748f75e2f93fc98d2-634x678.png?h=300"
                            width={200}
                            height={200}
                            className={styled.headPic}
                        ></Image>
                    </div>
                    <div className={styled.slogan}>
                        {
                            isWise 
                            ? <Ellipsis
                                rows={3}
                                content={t('app.home.slogan')}
                                expandText="expand"
                                collapseText="fold"
                            ></Ellipsis>
                            : t('app.home.slogan')
                        }
                    </div>
                </div>
            }
            <Title
                title="app.collection.title"
                intro="app.collection.desc"
                total={contentNums.collection}
                add={() => onAdd('collection')}
                className="mf-gap-bottom"
            />
            <Row
                className={styled.wrap}
                gutter={[16, 16]}
                justify="start"
            >
            {
                collections
                && collections.length
                ? collections.slice(0, 3).map((card: any) => {
                    return <Col
                        key={card?.id}
                        xs={24}
                        xl={8}
                        xxl={6}
                        
                    >
                        <CollectionCard {...card}/>
                    </Col>
                })
                : <Loading status="loading"></Loading>
            }
            </Row>
            {   
                contentNums.collection > 0
                && <div className={cx('mf-tac', 'mf-gap-bottom-large')}>
                    <Button
                        className={styled.moreBtn}
                        text="app.common.moreBtn"
                        onClick={() => goMore(ROUTE.COLLECTION_MAIN)}
                    ></Button>
                </div>
            }
        </div>
        <div>
            <Title
                title="app.plaza.title"
                intro="app.plaza.desc"
                total={contentNums.post}
                add={() => onAdd('plaza')}
                className="mf-gap-bottom"
            />
            <div className={styled.masonry}>
                <div className={styled.columnPost}>
                    {
                        postOne
                        && postOne.length > 0
                        && postOne.map((post: any) => (
                            <div
                                key={post.id}
                                className="mf-gap-bottom"
                            >
                                <PostCard {...post}/>
                            </div>
                        ))
                    }
                </div>
                <div className={styled.columnPost}>
                    {
                        postTwo
                        && postTwo.length > 0
                        && postTwo.map((post: any) => (
                            <div
                                key={post.id}
                                className="mf-gap-bottom"
                            >
                                <PostCard {...post}/>
                            </div>
                        ))
                    }
                </div>
            </div>
            {
                contentNums.post > 0
                && <div className={cx('mf-tac', 'mf-gap-bottom-large')}>
                    <Button
                        className={styled.moreBtn}
                        text="app.common.moreBtn"
                        onClick={() => goMore(ROUTE.PLAZA_MAIN)}
                    ></Button>
                </div>
                || <Loading status="loading"></Loading>
            }
        </div>
        <div>
            <Title
                title="app.meme.title"
                intro="app.meme.desc"
                total={contentNums.meme}
                add={() => onAdd('meme')}
                className="mf-gap-bottom"
            />
            <div className={styled.masonry}>
                <div className={styled.column}>
            {
                memesOne
                && memesOne.length > 0
                && memesOne.map((meme: any) => (
                <div key={meme.id} className="mf-gap-bottom"><MemeCard {...meme}/></div>
                ))
            }
            </div>
                <div className={styled.column}>
            {
                memesTwo
                && memesTwo.length > 0
                && memesTwo.map((meme: any) => (
                <div key={meme.id} className="mf-gap-bottom"><MemeCard {...meme}/></div>
                ))
            }
            </div>
                <div className={styled.column}>
            {
                memesThree
                && memesThree.length > 0
                && memesThree.map((meme: any) => (
                <div key={meme.id} className="mf-gap-bottom"><MemeCard {...meme}/></div>
                ))
            }
            </div>
            <div
                className={styled.column}
                style={{marginRight: '0'}}
            >
            {
                memesFour
                && memesFour.length > 0
                && memesFour.map((meme: any) => (
                <div key={meme.id} className="mf-gap-bottom"><MemeCard {...meme}/></div>
                ))
            }
            </div>
        </div>
            {
                contentNums.meme > 0
                && <div className={cx('mf-tac', 'mf-gap-bottom-large')}>
                    <Button
                        className={styled.moreBtn}
                        text="app.common.moreBtn"
                        onClick={() => goMore(ROUTE.MEME_MAIN)}
                    ></Button>
                </div>
                || <Loading status="loading"></Loading>
            }
        </div>
        <div>
            <Title
                title="app.article.title"
                intro="app.article.desc"
                total={contentNums.article}
                add={() => onAdd('article')}
                className="mf-gap-bottom"
            />
            <Row
                className={styled.wrap}
                gutter={[16, 4]}
                justify="start"
            >
            {
                articles
                && articles.length
                ? articles.slice(0, 4).map((card: any) => {
                    return <Col
                        key={card.id}
                        className="mf-gap-bottom"
                        xs={24}
                        xl={12}
                        xxl={6}
                    >
                        <ArticleCard {...card}/>
                    </Col>
                })
                : <Loading status="loading"></Loading>
            }
            </Row>
            { contentNums.article > 0
              && <div className={cx('mf-tac', 'mf-gap-bottom-large')}>
                  <Button
                    className={styled.moreBtn}
                    text="app.common.moreBtn"
                    onClick={() => goMore(ROUTE.ARTICLE_MAIN)}></Button>
              </div>
            }
        </div>

        <AddCollectionModal
            visible={showCollectionModal}
            onCloseModal={val => onModalClose(val, 'collection')}
        />
        <AddArticleModal
            visible={showArticleModal}
            onCloseModal={val => onModalClose(val, 'article')}
        />
        <AddMemeModal
            visible={showMemeModal}
            onCloseModal={val => onModalClose(val, 'meme')}
        />
        <AddPostModal
            visible={showPlazaModal}
            onCloseModal={val => onModalClose(val, 'plaza')}
        />
    </div>)
};
export default Home;
