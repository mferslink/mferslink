import NextImage from 'next/image';
import styled from './index.module.css';
import { Like, Reply, Liked } from '@/components/Common/Icon';
import cx from 'classnames';
import { CommentItemType } from '@/typings/comment';
import { fromNow } from '@/utils/common/time';
import { message, Image } from'antd';
import { postLike, deleteLike } from '@/services/like';
import { useCallback, useEffect, useRef, useState, memo } from 'react';
import { ACTIONS, useDispatchStore, useStateStore } from '@/store/index';
import CommentInput from '@/components/Common/CommentInput';
import { postComment } from '@/services/comment';
import { useRouter } from 'next/router';
import ROUTES from '@/dicts/routesMap';
import { useTranslation } from 'react-i18next';

type IProps = CommentItemType & {
    contentType: string;
    fromContentId: string;
    fromUserName?: string;
    commenterID ?: string;
    likedId?: string;
    typeId?: string;
    replyToUserName?: string;
    onReplySuccess: () => void;

    replyToCommentResourceContent?: string;
    replyToCommentContent?: string;
}

const CommentItem = (props: IProps) => {
    const {
        commenterProfileImage = '',
        commenterName = '',
        commenterID = '',
        likes = 0,
        liked,
        likedId,
        comments = 0,
        createdTime = '',
        resourceContent = '',
        content = '',
        contentType = '',
        type,
        typeId,
        id,
        fromContentId,
        replyToUserName,
        onReplySuccess,

        replyToCommentContent,
        replyToCommentResourceContent
    } = props;

    const userIdRef = useRef<string>();
    const { userInfo, walletAddress, isWise } = useStateStore();
    const dispatch = useDispatchStore();
    const router = useRouter();

    const [likeNum, setLikeNum] = useState(0);
    const [curLiked, setCurLiked] = useState(false);
    const [curLikedId, setCurLikedId] = useState('');

    const [isPosting, setIsPosting] = useState(false);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        setLikeNum(likes || 0);
        setCurLiked(liked || false);
        setCurLikedId(likedId || '');
    }, [likes, liked, likedId]);

    useEffect(() => {
       userIdRef.current = userInfo.walletAddress as string;
    }, [userInfo]);

    const onPostComment = useCallback(async (params) => {
        if (isPosting) {
            return;
        };
        try {
            if (!commenterID) {
                return;
            }
            setIsPosting(true);
            await postComment(Object.assign(params, {
                commenterID: userIdRef.current,
                // collection、meme、article的id
                commentToID: typeId,
                // 评论类型，collection、meme、article
                commentToType: type,
                // 评论ID
                replyToCommentID: id,
                // 回复评论人的ID
                replyToUserID: commenterID,
            }));
            setIsPosting(false);
            setShowCommentInput(false);
            onReplySuccess();
            // getCollectionComments();
            message.success('post comment success');
        } catch (error) {
            message.error('post comment error');
            setIsPosting(false);
        }
    }, [id, fromContentId, type, typeId, commenterID]);

    const onLikeClick = useCallback(async (liked: boolean, curLikeNum: number) => {
        try {
            if (walletAddress) {
                if (liked && curLikedId) {
                    await deleteLike({
                        likeFromID: userIdRef.current || '',
                        likeToID: typeId || '',
                        likeToCommentID: id
                    }, curLikedId);
                    setLikeNum(curLikeNum - 1);
                    setCurLiked(false);
                } else {
                    if (!commenterID) {
                        return;
                    }
                    const infoId = await postLike({
                        likeFromID: userIdRef.current || '',
                        likeToID: typeId || '',
                        likeToType: contentType,
                        likeToCommentID: id,
                        uploaderOrCommenterID: commenterID,
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
    }, [walletAddress, contentType, id, likedId, typeId, curLikedId, commenterID]);

    const goDetail = useCallback((contType, contentId) => {
        switch (contType) {
            case 'collection':
                router.push(`${ROUTES.COLLECTION_DETAIL}?id=${contentId}`);
                break;
            case 'meme':
                router.push(`${ROUTES.MEME_DETAIL}?id=${contentId}`);
                break;
            case 'article':
                router.push(`${ROUTES.ARTICLE_DETAIL}?id=${contentId}`);
                break;
            default:
                break;
        }
    }, []);

    const [imagePreview, setImagePreview] = useState({
        visible: false,
        imageUrl: ''
    });

    const previewImage = useCallback((e, imageUrl) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        setImagePreview({visible: true, imageUrl});
    }, []);

    return <div>
        <div className={styled.wrap}>
            {
                commenterProfileImage
                && <div>
                    <NextImage
                        src={commenterProfileImage}
                        width={30}
                        height={30}
                        className={styled.avator}
                    ></NextImage>
                </div>
            }
            <div className={
                cx(
                    styled.content,
                    'mf-gap-left'
                )
            }>
                <div className={styled.info}>
                    <span className={styled.userName}>{ commenterName }</span>
                    <span className={cx(styled.time, 'mf-gap-left-small')}> { fromNow(createdTime) } </span>
                </div>
                {
                    replyToUserName
                    && <div className={styled.time}>
                    {
                        `${t('app.common.replySomeOne')} @${replyToUserName}`
                    }
                    </div>
                }
                {
                    (replyToCommentContent || replyToCommentResourceContent)
                    && <div
                        className={cx(styled.contentPannel, styled.referPannel)}
                    >
                        <span className={styled.detail}>{ replyToCommentContent }</span>
                        {
                            replyToCommentResourceContent
                            && <span
                                className={styled.referImage}
                                onClick={(e) => previewImage(e, replyToCommentResourceContent)}
                            >[image]</span>
                        }
                    </div>
                }
                {
                    (content || resourceContent)
                    && <div
                        className={styled.contentPannel}
                        onClick={() => goDetail(contentType, fromContentId)}
                    >
                        <div
                            className={styled.detail}
                            style={{marginBottom: resourceContent.length ? '5px' : ''}}
                        >
                            { content }
                        </div>
                        {
                            resourceContent
                            && resourceContent.length > 0
                            && <div>
                                {
                                    resourceContent[0].split('.').pop() === 'mov'
                                    ? <video
                                        width={isWise ? '100%' : '50%' }
                                        height={'auto'}
                                        className={styled.commentImage}
                                        src={resourceContent[0]}
                                    />
                                    : <img
                                        width={isWise ? '100%' : '50%' }
                                        height={'auto'}
                                        className={styled.commentImage}
                                        src={resourceContent[0]}
                                    />
                                }
                            </div>
                        }
                    </div>
                }
                <div className={styled.operate}>
                    <div onClick={() => onLikeClick(curLiked || false, likeNum)}>
                        { curLiked ? <Liked width={16} /> : <Like width={16} /> } 
                        { likeNum > 0
                            && <span className='mf-gap-left-mini'>{ likeNum }</span>
                        }
                    </div>
                    <div
                        className='mf-gap-left'
                        onClick={() => setShowCommentInput(true)}
                    >
                        <Reply width={16} />
                        {
                            comments > 0
                            && <span className='mf-gap-left-mini'>{ comments }</span>
                        }
                    </div>
                </div>
            </div>
        </div>
        {   showCommentInput
            && <CommentInput
                onPostComment={onPostComment}
                btnLoading={isPosting}
            />
        }
        {
            imagePreview.visible
            && <Image
                width={200}
                style={{ display: 'none' }}
                preview={{
                    visible: imagePreview.visible,
                    src: imagePreview.imageUrl,
                    onVisibleChange: value => {
                        setImagePreview({visible: value, imageUrl: ''});
                    },
                }}
            />
        }
    </div>
};
export default memo(CommentItem);
