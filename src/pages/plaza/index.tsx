import Card from '@/components/Plaza/Card';
import styled from './index.module.css';
import { useState, useCallback, useEffect } from 'react';
import Title from '@/components/Common/Title';
import { SortType } from '@/dicts/common';
import { getPosts, getPostNums } from '@/services/post';
import { ACTIONS, useDispatchStore, useStateStore } from '@/store';
import AddPostModal from '@/components/Common/AddPostModal';
import Loading from '@/components/Common/Loading';
import { useBottom } from '@/utils/hooks/useBottom';

const Plaza = () => {

    const [postOne, setPostOne] = useState<any[]>([]);
    const [postTwo, setPostTwo] = useState<any[]>([]);
    const [postNums, setPostNums] = useState(0);
    const [curSortType, setCurSortType] = useState(SortType.New);
    const [isLoading, setIsLoading] = useState(false);
    const [curPage, setCurPage] = useState(0);
    const [isEmpty, setIsEmpty] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const { walletAddress } = useStateStore();
    const dispatch = useDispatchStore();
    const { isBottom } = useBottom();

    useEffect(
        () => {
            if (isBottom && !isLoading && !isEmpty) {
              setCurPage(curPage + 1);
              getAllPosts(curSortType);
            }
        },
        [curSortType, isBottom, isLoading, curPage]
      );


    const getAllPosts = useCallback((sortType, useCdn = false) => {
        setIsLoading(true);
        let data1: any[] = [],
        data2: any[] = [];
        getPosts(sortType, curPage, 10, useCdn).then(res => {
            if (res.length === 0 ) {
                setIsEmpty(true);
                setIsLoading(false);
                return;
            }
            let i = 0;
            while (i < res.length) {
                data1.push(res[i++]);
                if (i < res.length) {
                data2.push(res[i++]);
                }

            }
            setPostOne(curPage > 0 ? postOne.concat(data1) : data1);
            setPostTwo(curPage > 0 ? postTwo.concat(data2) : data2);
            setIsLoading(false);
        });
    }, [curSortType, curPage, postOne, postTwo]);

    useEffect(() => {
        setCurPage(0);
        getAllPosts(SortType.New, true);
        getPostNums(true).then(({post: total}) => {
          setPostNums(total);
        });
    }, []);

    const onSortTypeSelected = useCallback((value) => {
        setCurSortType(value);
        setCurPage(0);
        setIsEmpty(false);
        getAllPosts(value);
    }, []);

    const onAdd = useCallback(() => {
        if (!walletAddress) {
          dispatch?.({
            type: ACTIONS.SET_SHOW_LOGIN_MODAL,
            payload: true
          });
          return;
        }
        setShowAddModal(true);
    }, [walletAddress]);

    const onModalClose = useCallback(async (postStatus) => {
        if (postStatus) {
            setCurSortType(SortType.New);
            setCurPage(0);
            getPosts(SortType.New);
            const {mems: total} = await getPostNums();
            setPostNums(total);
        }
        setShowAddModal(false);
    }, [showAddModal, curSortType]);
    
    return (
    <div className={styled.box}>
        <Title
            title="Plaza"
            total={postNums}
            needAddBtn
            needSelect
            add={onAdd}
            selectValue={curSortType}
            onSelected={onSortTypeSelected}
            className="mf-gap-bottom"
        />
        <div className={styled.masonry}>
            <div className={styled.column}>
                {
                    postOne
                    && postOne.length > 0
                    && postOne.map(card => (
                        <div
                            key={card.id}
                            className="mf-gap-bottom-small"
                        >
                            <Card {...card}/>
                        </div>
                    ))
                }
            </div>
            <div className={styled.column}>
                {
                    postTwo
                    && postTwo.length > 0
                    && postTwo.map(card => (
                        <div
                            key={card.id}
                            className="mf-gap-bottom-small"
                        >
                            <Card {...card} />
                        </div>
                    ))
                }
            </div>
        </div>
        { isLoading && <Loading status="loading"></Loading>}
        { isEmpty && <Loading status="loaded" customText="No more posts"></Loading>}
        <AddPostModal
            visible={showAddModal}
            onCloseModal={status => onModalClose(status)}
        />
    </div>)
};
export default Plaza;