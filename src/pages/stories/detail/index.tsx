import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import {getArticleById} from '@/services/article';
import styled from './index.module.css';
import BaseInfoCard from "@/components/Article/BaseInfoCard";
import CommentInput from "@/components/Common/CommentInput";
import CommentList from "@/components/Common/CommentList";
import Title from "@/components/Common/Title";
import { useRouter } from "next/router";
import { getComments, postComment, getCommentNums } from '@/services/comment';
import { message } from "antd";
import { useStateStore } from '@/store/index';
import Empty from "@/components/Common/Empty";
import TopNav from "@/components/Common/TopNav";
import {useBottom} from '@/utils/hooks/useBottom';
import { SortType } from '@/dicts/common';
import Loading from "@/components/Common/Loading";

// export const getServerSideProps: GetServerSideProps = async(ctx: any) =>  {
//     const res = await getArticleById(ctx.query.id);
//     return {
//         props: {
//             result: res
//         }
//     }
// }

const ArticleDetail = () => {
    const [baseInfo, setBaseInfo] = useState<any>();
    const [comments, setComments] = useState<any[]>();
    const [commentsTotal, setCommentsTotal] = useState(0);
    const [isPosting, setIsPosting] = useState(false);
    const { userInfo, isWise } = useStateStore();
    const router = useRouter();
    const articleIdRef: MutableRefObject<string> = useRef('');
    const userIdRef: MutableRefObject<string> = useRef('');

    const {isBottom} = useBottom();
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [curPage, setCurPage] = useState(0);
    const [curSortType, setCurSortType] = useState(SortType.New);

    useEffect(
        () => {
            if (isBottom && !isLoading && !isEmpty) {
              setCurPage(curPage + 1);
              getArticleComments(curSortType);
            }
        },
        [curSortType, isBottom, isLoading]
    );

    const fetchCommentTotal = useCallback(async () => {
        const total = await getCommentNums(articleIdRef.current, 'article', true);
        setCommentsTotal(total);
    }, [articleIdRef.current]);

    useEffect(() => {
        articleIdRef.current = router.query.id as string;
        userIdRef.current = userInfo.walletAddress;
    }, [router.query.id, userInfo]);

    const getArticleComments = useCallback((sortType, useCdn = false) => {
        setIsLoading(true);
        if (articleIdRef.current) {
            getComments(articleIdRef.current, 'article', sortType, curPage, 10, useCdn).then((res) => {
                if (res.length === 0) {
                    setIsEmpty(true);
                    setIsLoading(false);
                    return;
                }
                setComments(curPage > 0 ? comments?.concat(res) : res);
                setIsLoading(false);
            });
        }
    }, [userIdRef.current, isPosting, curSortType, curPage]);

    useEffect(() => {
        if (articleIdRef.current) {
            getArticleById(articleIdRef.current).then(result => {
                setBaseInfo(result);
            });
            getArticleComments(curSortType);
            fetchCommentTotal();
        }
    }, [router.query.id, userInfo]);

    const onPostComment = useCallback(async (params) => {
        if (isPosting) {
            return;
        };
        try {
            if (!baseInfo?.uploaderID) {
                return;
            }
            setIsPosting(true);
            await postComment(Object.assign(params, {
                commenterID: userIdRef.current,
                commentToID: articleIdRef.current,
                commentToUploaderID: baseInfo.uploaderID,
            }));
            setIsPosting(false);
            setCurPage(0);
            getArticleComments(SortType.New);
            fetchCommentTotal();
            message.success('post comment success');
        } catch (error) {
            message.error('post comment error');
            setIsPosting(false);
        }
    }, [baseInfo]);

    const onSortTypeSelected = useCallback((value) => {
        setCurSortType(value);
        setCurPage(0);
        setIsEmpty(false);
        getArticleComments(value);
    }, []);

    const onReplySuccess = useCallback(() => {
        setCurPage(0);
        getArticleComments(SortType.New);
        fetchCommentTotal();
    }, []);

    return <div className={styled.wrap}>
        {
            !isWise
            && <div className="mf-gap-bottom">
                <TopNav />
            </div>
        }
        <div className="mf-gap-bottom">
            {
            baseInfo
            && baseInfo.title
            && <BaseInfoCard
                {...baseInfo}
                ></BaseInfoCard>
            }   
        </div>
        <div className="mf-gap-bottom">
            {
                baseInfo
                && baseInfo.title
                && <CommentInput
                    btnLoading={isPosting}
                    onPostComment={onPostComment}
                />
            }
        </div>
        <div>
            <Title
                title="app.comment.title"
                total={commentsTotal}
                needAddBtn={false}
                needSelect
                className="mf-gap-bottom"
                selectValue={curSortType}
                onSelected={onSortTypeSelected}
            />
            {
                comments
                && comments.length > 0
                && <CommentList
                    typeId={articleIdRef.current}
                    list={comments}
                    onReplySuccess={onReplySuccess}
                    />
            }
            { isLoading && <Loading status="loading"></Loading>}
            { isEmpty && <Loading status="loaded" customText="app.comment.listDone"></Loading>}
        </div>
    </div>
};

export default ArticleDetail;
