import styled from './index.module.css';
import Title from '@/components/Common/Title';
import { useCallback, useEffect, useState } from "react";
import { getCollections, getCollectionNums } from '@/services/collection';
import CollectionCard from '@/components/Collection/Card';
import { Row, Col, message } from 'antd';
import AddCollectionModal from "@/components/Common/AddCollectionModal";
import { useBottom } from '@/utils/hooks/useBottom';
import { SortType } from '@/dicts/common';
import { ACTIONS, useDispatchStore, useStateStore } from '@/store';
import Loading from '@/components/Common/Loading';
// export async function getStaticProps() {
//   const res = await getCollections();
//   return {
//       props: {
//           res
//       }
//   }
// }

function Collection() {
    const [collections, setCollections] = useState<any[]>([]);
    const [collectionNums, setCollectionNums] = useState(0);
    const [curSortType, setCurSortType] = useState(SortType.New);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [curPage, setCurPage] = useState(0);
    const {isBottom} = useBottom();
    const { walletAddress } = useStateStore();
    const dispatch = useDispatchStore();

    const [showAddModal, setShowAddModal] = useState(false);
    
    useEffect(
      () => {
          if (isBottom && !isLoading && !isEmpty) {
            setCurPage(curPage + 1);
            getAllCollections(curSortType);
          }
      },
      [curSortType, isBottom, isLoading, curPage]
    );

    const getAllCollections = useCallback(async (sortType, useCdn = false) => {
      setIsLoading(true);
      try {
        const res = await getCollections(sortType, '*', curPage, 20, useCdn);
        if (res.length === 0) {
          setIsEmpty(true);
          setIsLoading(false);
          return;
        }
        setCollections(curPage > 0 ? collections.concat(res) : res);
        setIsLoading(false);
      } catch (error) {
        message.error('get collection error');
      }
    }, [curSortType, curPage]);

    useEffect(() => {
      setCurPage(0);
      getAllCollections(SortType.New, true);
      getCollectionNums(true).then(({collection: total}) => {
        setCollectionNums(total);
      });
    }, []);

    const onCloseModal = useCallback(async (postStatus) => {
      if (postStatus) { 
        setCurSortType(SortType.New);
        setCurPage(0);
        getAllCollections(SortType.New);
        const {collection: total} = await getCollectionNums();
        setCollectionNums(total);
      }
      setShowAddModal(false);
    }, [showAddModal, curSortType]);


    const onSortTypeSelected = useCallback((value) => {
      setCurSortType(value);
      setCurPage(0);
      setIsEmpty(false);
      getAllCollections(value);
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
        title="app.collection.title"
        total={collectionNums}
        needAddBtn={true}
        needSelect
        selectValue={curSortType}
        className="mf-gap-bottom"
        onSelected={onSortTypeSelected}
        add={onAdd}
      ></Title>
      <Row gutter={16}>
        {
          collections
          && collections.length > 0
          && collections.map((collection: any) => {
              return <Col
                    xs={24}
                    xl={8}
                    key={collection.id}
                    className="mf-gap-bottom"
                >
                <CollectionCard {...collection}/>
              </Col>
          })
        }
      </Row>
      { isLoading && <Loading status="loading" />}
      { isEmpty && <Loading status="loaded" customText="app.collection.listDone" />}
      <AddCollectionModal
        visible={showAddModal}
        onCloseModal={onCloseModal}
      ></AddCollectionModal>
    </div>
}
  
export default Collection;