import styled from './index.module.css';
import { Like, Liked, Reply, TwiterFill } from '@/components/Common/Icon';
import Image from 'next/image';
import cx from 'classnames';
import { useRouter } from 'next/router';
import ROUTES from '@/dicts/routesMap';
import { postLike, deleteLike } from '@/services/like';
import { message } from 'antd';
import { useDispatchStore, useStateStore, ACTIONS } from '@/store/index';
import { useState, useEffect, useCallback, useRef } from 'react';

interface IProps{
    id: string;
    likes?: number;
    liked?: boolean;
    comments?: number;
    title: string;
    description: string;
    likedId?: string;
    uploaderID?: string;
    url?: string;
};
const Card = (props: IProps) => {
    const {
        id,
        likes = 0,
        liked = false,
        comments = 0,
        title,
        description,
        likedId,
        uploaderID,
        url
    } = props;

    const router = useRouter();
    const { userInfo, walletAddress } = useStateStore();
    const [likeNum, setLikeNum] = useState<number>(0);
    const [curLiked, setCurLiked] = useState<boolean>(false);
    const [curLikedId, setCurLikedId] = useState('');
    const userIdRef = useRef<string>();
    const dispatch = useDispatchStore();

    useEffect(() => {
        setLikeNum(likes || 0);
        setCurLiked(liked || false);
        setCurLikedId(likedId || '');
    }, [likes, liked, likedId]);

    useEffect(() => {
       userIdRef.current = userInfo.walletAddress as string;
    }, [userInfo]);

    const goDetail = useCallback((id) => {
        router.push(`${ROUTES.ARTICLE_DETAIL}?id=${id}`);
    }, [id]);

    const onLikeClick = useCallback(async(liked: boolean, curLikeNum: number) => {
        try {
            if (walletAddress) {
                if (liked && curLikedId) {
                    await deleteLike({
                        likeFromID: userIdRef.current || '',
                        likeToID: id
                    }, curLikedId);
                    setLikeNum(curLikeNum - 1);
                    setCurLiked(false);
                } else {
                    if (!uploaderID) {
                        return;
                    }
                    const infoId = await postLike({
                        likeFromID: userIdRef.current || '',
                        likeToID: id,
                        likeToType: 'article',
                        uploaderOrCommenterID: uploaderID
                    });
                    setCurLikedId(infoId || '');
                    setLikeNum(curLikeNum + 1);
                    setCurLiked(true);
                }
            } else {
                dispatch?.({
                    type: ACTIONS.SET_SHOW_LOGIN_MODAL,
                    payload: true
                });
            }
        } catch (error) {
            message.error('post like error');
        }
    }, [walletAddress, curLikedId, uploaderID]);

    const onShare = (id: string) => {
        const content = `Gm #mfers, this looks dope:\nhttps://www.mfers.link/article?id=${id}\n\nWanna be linked with mfers just like you? Join 🌐 mfers.link and follow @MfersLink!\n#mferslink #mfersfollowmfers #NFTCommunity`;
        window.open(`https://twitter.com/intent/tweet?ref_src=twsrc%5Etfw&text=${encodeURIComponent(content)}`);
    };

    const goRead = useCallback((url) => {
        if (url) {
            window.open(url);
        }
    }, []);


    return <>
        <div
            className={styled.wrap}
        >
            <div className={styled.content}>
                <div onClick={() => goDetail(id)}>
                    <div className={cx(styled.title, 'mf-line-clamp1')}>{ title }</div>
                    <div className={cx(styled.desc, 'mf-gap-top-mini', 'mf-line-clamp2')}>{ description }</div>
                </div>
                <div className={cx(styled.operate, 'mf-gap-top')}>
                    <div onClick={() => onLikeClick(curLiked, likeNum)}>
                        { curLiked ? <Liked width={16}/> :<Like width={16} />}
                        {
                            likeNum > 0
                            &&  <span className='mf-gap-left-mini'>{ likeNum }</span>
                        }
                    </div>
                    <div className='mf-gap-left' onClick={() => goDetail(id)}>
                        <Reply width={16} />
                        {
                            comments > 0
                            && <span className='mf-gap-left-mini'>{ comments }</span>
                        }
                    </div>
                    <div
                        className='mf-gap-left'
                        onClick={() => onShare(id)}
                    >
                        <TwiterFill width={16} height={15} fill="#3CB9FF" />
                        {/* <span className={styled.text}>share</span> */}
                    </div>
                </div>
            </div>
            <div className={cx(styled.read)} onClick={() => goRead(url)}>
                <span>Read</span>
                <span className="mf-gap-left-small">{ '>' }</span>
            </div>
        </div>
    </>
};
export default Card;
