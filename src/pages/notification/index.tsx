import {getNotifications, getNotificationNums} from '@/services/notification';
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { ACTIONS, useDispatchStore, useStateStore } from '@/store/index';
import Empty from '@/components/Common/Empty';
import Title from '@/components/Common/Title';
import styled from './index.module.css';
import NotificationList from "@/components/Notifictions/NotificationList";
import { setLastNotificationTime } from '@/services/user';
import Loading from '@/components/Common/Loading';
import {useBottom} from '@/utils/hooks/useBottom';

const Notifiaction = () => {

    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<any[]>();
    const [notificationTotal, setNotificationTotal] = useState(0); 
    const userIdRef: MutableRefObject<string> = useRef<string>('');
    const { userInfo } = useStateStore();
    const dispatch = useDispatchStore();

    const {isBottom} = useBottom();
    const [isEmpty, setIsEmpty] = useState(false);
    const [curPage, setCurPage] = useState(0);


    useEffect(
        () => {
            if (isBottom && !loading && !isEmpty) {
              setCurPage(curPage + 1);
              getAllNotifications(userIdRef.current);
            }
        },
        [isBottom, loading, userIdRef.current]
    );

    useEffect(() => {
        if (userInfo.walletAddress) {
            dispatch?.({
                type: ACTIONS.SET_USER_INFO,
                payload: Object.assign(userInfo, {
                    notifications: 0
                })
            })
            userIdRef.current = userInfo.walletAddress as string;
            setLastNotificationTime(userInfo.walletAddress, new Date());
        }
    }, [userInfo.walletAddress]);

    const getAllNotifications = useCallback((id) => {
        setLoading(true);
        getNotifications(id, 'createdTime', curPage, 20, true).then((res: any) => {
            if (res.length === 0) {
                setIsEmpty(true);
                setLoading(false);
                return;
            }
            const result = res.map((item: any) => {
                let __item = {
                    id: item.id,
                    type: item.type,
                    commenterProfileImage: item.fromUserProfileImage,
                    commenterName: item.fromUserName,
                    createdTime: item.createdTime,
                    contentType: item.fromContentType,
                    fromUserName: item.fromUserName,
                    content: '',
                    resourceContent: [item.commentResourceContent] || [],
                    newCommentContent: item.newCommentContent,
                    newCommentResourceContent: item.newCommentResourceContent,
                    likes: item?.newCommentLikes || 0,
                    comments: item?.newCommentReplies || 0,

                    fromCommentID: item.fromCommentID,
                    fromUserID: item.fromUserID,
                    fromContentID: item.fromContentID,
                    newCommentID: item.newCommentID
                } as any;

                if (item.newCommentLikeReferences && item.newCommentLikeReferences.length > 0) {
                    const likeInfo = item.newCommentLikeReferences.find((user: any) => userIdRef.current === user.likeUser) || '';
                    __item.liked = !!likeInfo;
                    __item.likedId = likeInfo?.likeID || '';
                } else {
                    __item.liked = false;
                    __item.likedId = '';
                }

                if (item.memeContent) {
                    __item.resourceContent = [item.memeContent];
                    return __item;
                }
                if (item.commentContent) {
                    __item.content = item.commentContent;
                    return __item;
                }
                if (item.collectionImage) {
                    __item.content = item.collectionName;
                    __item.resourceContent = [item.collectionImage];
                    return __item;
                }
                if (item.articleTitle) {
                    __item.content = item.articleTitle;
                }
                if (item.postText) {
                    __item.content = item.postText;
                    __item.resourceContent = item.postImages;
                }
                
                return __item;
            });
            setNotifications(curPage > 0 ? notifications?.concat(result) : result);
            setLoading(false);
        })
    }, [curPage]);

    useEffect(() => {
        if (userIdRef.current) {
            getAllNotifications(userIdRef.current);
            getNotificationNums(userIdRef.current).then((total) => {
                setNotificationTotal(total);
            });
        }
    }, [userInfo.walletAddress]);

    return (<>
        <div className={styled.box}>
            <Title
                title="app.notification.title"
                total={notificationTotal}
                needAddBtn={false}
                className="mf-gap-bottom"
            ></Title>
            {
                notifications
                && notifications.length > 0
                && <div className={styled.content}>
                    <NotificationList
                        list={notifications}
                    ></NotificationList>
                </div>
            }
            {
                loading && <Loading status="loading" />
            }
            {
                notifications?.length === 0 && <Empty text="app.notification.listEmpty"/>
            }
            { isEmpty && <Loading status="loaded" customText="app.notification.listDone"/>}
        </div>
    </>)
};
export default Notifiaction;
