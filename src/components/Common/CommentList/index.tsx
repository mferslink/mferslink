import CommentItem from './CommentItem';
import styled from './index.module.css';
import { CommentItemType, CommentListType } from '@/typings/comment';
type IProps = CommentListType & {typeId?: string; onReplySuccess: () => void}

const CommentList = (props: IProps) => {
    const { list, typeId, onReplySuccess } = props;
    return <>
        <div className={styled.wrap}>
        {   
            list
            && list.length > 0
            && list.map((comment: CommentItemType, index: number) => {
                return <div 
                    key={comment.id}
                    className={styled.commentItem}
                    style={{ borderBottom: index === list.length - 1 ? 'none' : '' }}
                >
                        <CommentItem
                            {...comment}
                            onReplySuccess={onReplySuccess}
                            typeId={typeId}
                        />
                    </div>
            })
        }
        </div>
    </>
};
export default CommentList;