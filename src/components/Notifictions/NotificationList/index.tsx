import NotificationItem from './NotificationItem';
import styled from './index.module.css';
import { CommentItemType } from '@/typings/comment';
import { memo } from 'react';

type IProps = {
    list: ICommentItemType[];
}

type ICommentItemType = CommentItemType & {
    needOperate?: boolean;
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

const NotificationList = (props: IProps) => {
    const { list } = props;
    return <>
        <div className={styled.wrap}>
        {   
            list
            && list.length > 0
            && list.map((comment: ICommentItemType, index: number) => {
                return <div 
                    key={comment.id}
                    className={styled.commentItem}
                    style={{ borderBottom: index === list.length - 1 ? 'none' : '' }}
                >
                        <NotificationItem
                            {...comment}
                        />
                    </div>
            })
        }
        </div>
    </>
};
export default memo(NotificationList);