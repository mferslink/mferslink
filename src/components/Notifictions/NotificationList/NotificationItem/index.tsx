import NextImage from 'next/image';
import styled from './index.module.css';
import cx from 'classnames';
import { Like, Reply, Liked } from '@/components/Common/Icon';
import { CommentItemType } from '@/typings/comment';
import { fromNow } from '@/utils/common/time';
import { memo, useCallback} from 'react';
import { useRouter } from 'next/router';
import ROUTES from '@/dicts/routesMap';
import { Image, message } from'antd';
import { useState, useEffect, useRef } from 'react';
import { postLike, deleteLike } from '@/services/like';
import { postComment } from '@/services/comment';
import { ACTIONS, useDispatchStore, useStateStore } from '@/store/index';
import CommentInput from '@/components/Common/CommentInput';
import { useTranslation } from 'react-i18next';

type IProps = CommentItemType & {
    contentType: string;
    fromContentID: string;
    fromUserName?: string;
    likedId?: string;
    fromCommentID?: string;
    fromUserID: string;

    newCommentContent?: string;
    newCommentResourceContent?: string;

    newCommentID?: string;
}

const NotificationItem = (props: IProps) => {
    const {
        commenterProfileImage = '',
        commenterName = '',
        createdTime = '',
        resourceContent = [],
        content = '',
        contentType = '',
        type,
        fromContentID,
        fromUserName,

        fromCommentID = '',
        fromUserID,

        newCommentContent,
        newCommentResourceContent,

        newCommentID,

        likes = 0,
        liked,
        likedId,
        comments = 0
    } = props;

    const router = useRouter();
    const userIdRef = useRef<string>();
    const { userInfo, isWise } = useStateStore();
    const { t } = useTranslation();

    const [imagePreview, setImagePreview] = useState({
        visible: false,
        imageUrl: ''
    });

    const [likeNum, setLikeNum] = useState(0);
    const [curLiked, setCurLiked] = useState(false);
    const [curLikedId, setCurLikedId] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [showCommentInput, setShowCommentInput] = useState(false);

    useEffect(() => {
        setLikeNum(likes || 0);
        setCurLiked(liked || false);
        setCurLikedId(likedId || '');
    }, [likes, liked, likedId]);

    useEffect(() => {
        userIdRef.current = userInfo.walletAddress as string;
     }, [userInfo]);

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
            case 'post':
                router.push(`${ROUTES.POST_DETAIL}?id=${contentId}`);
                break;
            default:
                break;
        }
    }, []);

    const previewImage = useCallback((e, imageUrl) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        setImagePreview({visible: true, imageUrl});
    }, []);

    const onPostComment = useCallback(async (params) => {
        if (isPosting) {
            return;
        };
        try {
            setIsPosting(true);
            await postComment(Object.assign(params, {
                commenterID: userIdRef.current,
                // collection、meme、article的id
                commentToID: fromContentID,
                // 评论类型，collection、meme、article
                commentToType: contentType,
                // 评论ID
                replyToCommentID: newCommentID,
                // 回复评论人的ID
                replyToUserID: fromUserID
            }));
            setIsPosting(false);
            setShowCommentInput(false);
            message.success('post comment success');
        } catch (error) {
            message.error('post comment error');
            setIsPosting(false);
        }
    }, [newCommentID, contentType, fromContentID, fromUserID]);

    const onLikeClick = useCallback(async (liked: boolean, curLikeNum: number) => {
        if (liked && curLikedId) {
            await deleteLike({
                likeFromID: userIdRef.current || '',
                likeToID: fromContentID || '',
                likeToCommentID: newCommentID
            }, curLikedId);
            setLikeNum(curLikeNum - 1);
            setCurLiked(false);
        } else {
            const infoId = await postLike({
                likeFromID: userIdRef.current || '',
                likeToID: fromContentID,
                likeToType: contentType,
                likeToCommentID: newCommentID,
                uploaderOrCommenterID: fromUserID
            });
            setCurLikedId(infoId || '');
            setLikeNum(curLikeNum + 1);
            setCurLiked(true);
        }
    }, [
        contentType,
        fromContentID,
        fromUserID,
        newCommentID,
        curLiked
    ]);

    const showInteractiveText = useCallback((fromCommentID: string, contentType: string) => {
        const textMap: any = {
            'collection': 'app.notification.like.collection',
            'meme': 'app.notification.like.meme',
            'article': 'app.notification.like.story',
            'post': 'app.notification.like.post',
            'comment': 'app.notification.like.comment'
        };
        if (fromCommentID) {return textMap['comment']}
        return textMap[contentType];
    }, [type, fromCommentID, contentType]);

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
                    {
                        type !== 'like'
                        && <span className={cx(styled.time, 'mf-gap-left-small')}> { fromNow(createdTime) } </span>
                    }
                </div>
                {
                    type
                    && contentType
                    && <div className={styled.time}>
                    {
                        type === 'comment'
                        ? t('app.common.relply2you')
                        : t(showInteractiveText(fromCommentID, contentType))
                    }
                    </div>
                }
                {
                    (content || resourceContent)
                    && <div
                        className={
                            cx(
                                styled.contentPannel
                            )
                        }
                        onClick={() => goDetail(contentType, fromContentID)}
                    >
                        <span className={styled.detail}>{ content }</span>
                        { resourceContent
                          && resourceContent.length > 0
                          && resourceContent.map(url => (<span
                            key={url}
                            className={styled.commentImgText}
                            onClick={(e) => previewImage(e, url)}
                        >[image]</span>))
                        }
                    </div>
                }
                {
                    (newCommentContent || newCommentResourceContent)
                    && <div
                        onClick={() => goDetail(contentType, fromContentID)}
                    >
                        <div
                            className={styled.detail}
                        >{ newCommentContent }</div>
                        { 
                            newCommentResourceContent
                            && <div className={styled.detailImage}>
                                {
                                    newCommentResourceContent.split('.').pop() === 'mov'
                                    ? <video
                                        width={isWise ? '100%' : '50%' }
                                        height={'auto'}
                                        className={styled.commentImage}
                                        src={newCommentResourceContent}
                                    />
                                    : <img
                                        width={isWise ? '100%' : '50%' }
                                        height={'auto'}
                                        className={styled.commentImage}
                                        src={newCommentResourceContent}
                                    />
                                }
                            </div>
                        }
                    </div>
                }
                {
                    type !== 'like'
                    && <div className={styled.operate}>
                        <div
                            onClick={
                                () => onLikeClick(curLiked || false, likeNum)
                            }
                        >
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
                }
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
            />}
    </div>
};
export default memo(NotificationItem);
