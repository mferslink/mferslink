
import Title from '@/components/Common/Title';
import { useCallback, useEffect, useState, memo } from 'react';
import  MemeCard from '@/components/Meme/Card';
import {getMemes, getMemeNums} from '@/services/meme';
import styled from './index.module.css';
import AddMemeModal from '@/components/Common/AddMemeModal';
import { SortType } from '@/dicts/common';
import { useBottom } from '@/utils/hooks/useBottom';
import cx from 'classnames';
import { ACTIONS, useDispatchStore, useStateStore } from '@/store';
import Loading from '@/components/Common/Loading';

const Meme = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [memeNums, setMemeNums] = useState(0);
  const [memesOne, setMemesOne] = useState<any[]>([]);
  const [memesTwo, setMemesTwo] = useState<any[]>([]);
  const [memesThree, setMemesThree] = useState<any[]>([]);
  const [memesFour, setMemesFour] = useState<any[]>([]);
  const [curSortType, setCurSortType] = useState(SortType.New);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const { walletAddress } = useStateStore();
  const dispatch = useDispatchStore();

  const {isBottom} = useBottom();

  useEffect(
      () => {
          if (isBottom && !isLoading && !isEmpty) {
            setCurPage(curPage + 1);
            getAllMemes(curSortType);
          }
      },
      [curSortType, isBottom, isLoading, curPage]
  );

  const getAllMemes = useCallback((sortType, useCdn = false) => {
    setIsLoading(true);
    let data1: any[] = [],
    data2: any[] = [],
    data3: any[] = [],
    data4: any[] = []
    getMemes(sortType, curPage, 20, useCdn).then(res => {
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
          if (i < res.length) {
            data3.push(res[i++]);
          }
          if (i < res.length) {
            data4.push(res[i++]);
          }
        }
        setMemesOne(curPage > 0 ? memesOne.concat(data1) : data1);
        setMemesTwo(curPage > 0 ? memesTwo.concat(data2) : data2);
        setMemesThree(curPage > 0 ? memesThree.concat(data3) : data3);
        setMemesFour(curPage > 0 ? memesFour.concat(data4) : data4);
        setIsLoading(false);
    });
  }, [curSortType, curPage, memesOne, memesTwo, memesThree, memesFour]);

  useEffect(() => {
    setCurPage(0);
    getAllMemes(SortType.New, true);
    getMemeNums(true).then(({meme: total}) => {
      setMemeNums(total);
    });
  }, []);

  const onModalClose = useCallback(async (postStatus) => {
    if (postStatus) {
      setCurSortType(SortType.New);
      setCurPage(0);
      getAllMemes(SortType.New);
      const {mems: total} = await getMemeNums();
      setMemeNums(total);
    }
    setShowAddModal(false);
  }, [showAddModal, curSortType]);

  const onSortTypeSelected = useCallback((value) => {
    setCurSortType(value);
    setCurPage(0);
    setIsEmpty(false);
    getAllMemes(value);
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

  return <div className={styled.box}>
     <Title
        title="app.meme.title"
        total={memeNums}
        needAddBtn
        needSelect
        selectValue={curSortType}
        add={onAdd}
        onSelected={onSortTypeSelected}
        className="mf-gap-bottom"
      />
      <div className={styled.masonry}>
        <div className={styled.column}>
          {
            memesOne
            && memesOne.length > 0
            && memesOne.map((meme: any) => (
              <div key={meme.id} className="mf-gap-bottom"><MemeCard {...meme}/></div>
            ))
          }
        </div>
        <div className={styled.column}>
          {
            memesTwo
            && memesTwo.length > 0
            && memesTwo.map((meme: any) => (
              <div key={meme.id} className="mf-gap-bottom"><MemeCard {...meme}/></div>
            ))
          }
        </div>
        <div className={styled.column}>
        {
            memesThree
            && memesThree.length > 0
            && memesThree.map((meme: any) => (
              <div key={meme.id} className="mf-gap-bottom"><MemeCard {...meme}/></div>
            ))
          }
        </div>
        <div
          className={cx(styled.column)}
          style={{marginRight: '0'}}
        >
        {
            memesFour
            && memesFour.length > 0
            && memesFour.map((meme: any) => (
              <div key={meme.id} className="mf-gap-bottom"><MemeCard {...meme}/></div>
            ))
          }
        </div>
      </div>
      { isLoading && <Loading status="loading"></Loading>}
      {/* { !isLoading && <Loading status="loaded"></Loading>} */}
      { isEmpty && <Loading status="loaded" customText="app.meme.listDone"></Loading>}
      <AddMemeModal
        visible={showAddModal}
        onCloseModal={status => onModalClose(status)}
      ></AddMemeModal>
   </div>
}

export default memo(Meme);