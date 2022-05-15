import { useDispatchStore, useStateStore, ACTIONS } from "@/store";
import { TwiterFill, Like, Liked } from "../Icon";
import styled from './index.module.css';
import { useCallback, useState, useEffect, useRef } from 'react';
import { postLike, deleteLike } from '@/services/like';
import { message } from "antd";
import { useTranslation } from 'react-i18next';

type IProps = {
    liked?: boolean;
    likes?: number;
    twitter?: string;
    toId: string;
    type: string;
    likedId?: string;
    uploaderId?: string;
};
const CardOperateSimple = (props: IProps) => {
    const {
        likes,
        liked,
        twitter,
        toId,
        type,
        likedId,
        uploaderId
    } = props;

    const [likeNum, setLikeNum] = useState<number>(0);
    const [curLiked, setCurLiked] = useState<boolean>(false);
    const [curLikedId, setCurLikedId] = useState(''); 
    const { userInfo, walletAddress } = useStateStore();
    const userIdRef = useRef<string>();
    const dispatch = useDispatchStore();
    const { t } = useTranslation();

    useEffect(() => {
        setLikeNum(likes || 0);
        setCurLiked(liked || false);
        setCurLikedId(likedId || '');
    }, [likes, liked, likedId]);

    useEffect(() => {
        userIdRef.current = userInfo.walletAddress as string;
     }, [userInfo]);

    const onLikeClick = useCallback(async (liked: boolean, curLikeNum: number) => {
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
                dispatch?.({
                    type: ACTIONS.SET_SHOW_LOGIN_MODAL,
                    payload: true
                });
            }
        } catch (error) {
            message.error('post like error');
        }
    }, [walletAddress, type, curLikedId, uploaderId, curLiked]);

    const onShare = (id: string, type: string) => {
        let urlLink = '';
        switch (type) {
            case 'collection':
                urlLink = `/collection/detail?id=${id}`;
                break;
            case 'meme':
                urlLink = `/meme/detail?id=${id}`;
                break;
            case 'article':
                urlLink = `/article/detail?id=${id}`;
                break;
            default:
                break;
        }
        const content = `Gm #mfers, this looks dope:\nhttps://www.mfers.link${urlLink}\n\nWanna be linked with mfers just like you? Join 🌐 mfers.link and follow @MfersLink!\n#mferslink #mfersfollowmfers #NFTCommunity`;
        window.open(`https://twitter.com/intent/tweet?ref_src=twsrc%5Etfw&text=${encodeURIComponent(content)}`);
    };

    return <div className={styled.operate}>
        <div className={styled.line} onClick={() => onLikeClick(curLiked, likeNum)}>
            { curLiked ? <Liked width={16}/>: <Like/>}
            {
                likeNum > 0
                && <span className="mf-gap-left-small">{ likeNum }</span>
            }
        </div>
        <div onClick={() => onShare(toId, type)}>
            <TwiterFill width={16} height={16} fill="#3CB9FF"/>
            <span className="mf-gap-left-small">{ t('app.common.share') }</span>
        </div>
    </div>
};
export default CardOperateSimple;
