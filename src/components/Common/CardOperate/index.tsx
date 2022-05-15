import { TwiterFill, Like, Reply, Liked } from "@/components/Common/Icon";
import styled from './index.module.css';
import cx from 'classnames';
import { useCallback, useEffect, useRef, useState } from "react";
import { postLike, deleteLike } from '@/services/like';
import { message } from "antd";
import { useDispatchStore, useStateStore, ACTIONS } from '@/store/index';
import { useRouter } from 'next/router';
import ROUTE from '@/dicts/routesMap';
import { useTranslation } from 'react-i18next'

interface IProps {
    toId: string;
    twiter?: string;
    likes?: number;
    liked?: boolean;
    comments?: number;
    type: string;
    likedId?: string;
    uploaderId?: string;
}

const CardOperate = (props: IProps) => {
    
    const {twiter, likes, liked, comments = 0, toId, type, likedId, uploaderId} = props;
    const [likeNum, setLikeNum] = useState<number>(0);
    const [curLiked, setCurLiked] = useState<boolean>(false);
    const [curLikedId, setCurLikedId] = useState('');
    const { userInfo, walletAddress } = useStateStore();
    const userIdRef = useRef<string>();
    const dispatch = useDispatchStore();
    const router = useRouter();
    const { t } = useTranslation();

    useEffect(() => {
        setLikeNum(likes || 0);
        setCurLiked(liked || false);
        setCurLikedId(likedId || '');
    }, [likes, liked, likedId]);

    useEffect(() => {
       userIdRef.current = userInfo.walletAddress as string;
    }, [userInfo]);


    const onLikeClick = useCallback(async(liked: boolean, curLikeNum: number) => {
        try {
            if (walletAddress) {
                if (liked && curLikedId) {
                    await deleteLike({
                        likeFromID: userIdRef.current || '',
                        likeToID: toId
                    }, curLikedId);
                    setLikeNum(curLikeNum - 1);
                    setCurLiked(false);
                } else {
                    if (!uploaderId) {
                        return;
                    }
                    const id = await postLike({
                        likeFromID: userIdRef.current || '',
                        likeToID: toId,
                        likeToType: type,
                        uploaderOrCommenterID: uploaderId
                    });
                    setCurLikedId(id || '');
                    setLikeNum(curLikeNum + 1);
                    setCurLiked(true);   
                }
            } else {
                dispatch && dispatch({
                    type: ACTIONS.SET_SHOW_LOGIN_MODAL,
                    payload: true
                });
            }
        } catch (error) {
            message.error('post like error');
        }
    }, [walletAddress, type, curLikedId, uploaderId]);

    const onCommentClick = useCallback((id: string) => {
        switch (type) {
            case 'collection':
                router.push(`${ROUTE.COLLECTION_DETAIL}?id=${id}`);
                break;
            case 'meme':
                router.push(`${ROUTE.MEME_DETAIL}?id=${id}`);
                break;
            case 'post':
                router.push(`${ROUTE.POST_DETAIL}?id=${id}`);
                break;
            default:
                break;
        }
    }, [type]);

    const onShare = (id: string, type: string) => {
        let urlLink = '';
        switch (type) {
            case 'collection':
                urlLink = `/collection/detail?id=${id}`;
                break;
            case 'meme':
                urlLink = `/meme/detail?id=${id}`;
                break;
            default:
                break;
        }
        const content = `Gm #mfers, this looks dope:\nhttps://www.mfers.link${urlLink}\n\nWanna be linked with mfers just like you? Join 🌐 mfers.link and follow @MfersLink!\n#mferslink #mfersfollowmfers #NFTCommunity`;
        window.open(`https://twitter.com/intent/tweet?ref_src=twsrc%5Etfw&text=${encodeURIComponent(content)}`);
    };

    return (<>
        <div className={styled.wrap}>
            <div className={cx(styled.line)} onClick={() => onCommentClick(toId)}>
                <Reply/>
                {
                    comments > 0
                    && <span className={styled.text}>{ comments }</span>
                }
            </div>
            <div className={cx(styled.line)} onClick={() => onLikeClick(curLiked, likeNum)}>
                {curLiked ? <Liked/> : <Like/>}
                {
                    likeNum > 0
                    && <span className={styled.text}>{ likeNum }</span>
                }
            </div>
            <div onClick={() => onShare(toId, type)}>
                <TwiterFill width={16} height={15} fill="#3CB9FF" />
                <span className={styled.text}>{ t('app.common.share') }</span>
            </div>
        </div>
    </>)
};
export default CardOperate;
