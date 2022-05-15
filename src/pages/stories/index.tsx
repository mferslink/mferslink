import Title from '@/components/Common/Title';
import { useCallback, useEffect, useState } from 'react';
import { Row, Col, message } from 'antd';
import ArticleCard from '@/components/Article/Card';
import {getArticles, getArticleNums} from '@/services/article';
import styled from './index.module.css';
import AddArticleModal from '@/components/Common/AddArticleModal';
import { useBottom } from '@/utils/hooks/useBottom';
import { SortType } from '@/dicts/common';
import { ACTIONS, useDispatchStore, useStateStore } from '@/store';
import Loading from '@/components/Common/Loading';
// export async function getStaticProps() {
//   const res = await getArticles();
//   return {
//       props: {
//           res
//       }
//   }
// }

const Article = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [articleNums, setArticleNums] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  const [curSortType, setCurSortType] = useState(SortType.New);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const {isBottom} = useBottom();
  const { walletAddress } = useStateStore();
  const dispatch = useDispatchStore();

  useEffect(
    () => {
        if (isBottom && !isLoading && !isEmpty) {
          setCurPage(curPage + 1);
          getAllArticles(curSortType);
        }
    },
    [curSortType, isBottom, isLoading, curPage]
  );

  const getAllArticles = useCallback(async (sortType, useCdn = false) => {
    setIsLoading(true);
    try {
      const res = await getArticles(sortType, curPage, 20, useCdn);
      if (res.length === 0) {
        setIsEmpty(true);
        setIsLoading(false);
        return;
      }
      setArticles(curPage > 0 ? articles.concat(res) : res);
      setIsLoading(false);
    } catch (error) {
      message.error('get collection error');
    }
  }, [curSortType, curPage, articles]);

  const onCloseModal = useCallback(async (postStatus) => {
    if (postStatus) {
      setCurSortType(SortType.New);
      setCurPage(0);
      getAllArticles(SortType.New);
      const { article: total } = await getArticleNums();
      setArticleNums(total);
    }
    setShowAddModal(false);
  }, [showAddModal, curSortType]);

  useEffect(() => {
    setCurPage(0);
    getAllArticles(SortType.New, true);
    getArticleNums(true).then(({article: total}) => {
      setArticleNums(total);
    });
  }, []);

  const onSortTypeSelected = useCallback((value) => {
    setCurSortType(value);
    setCurPage(0);
    setIsEmpty(false);
    getAllArticles(value);
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
        title="app.article.title"
        total={articleNums}
        needAddBtn
        needSelect
        add={onAdd}
        selectValue={curSortType}
        onSelected={onSortTypeSelected}
        className="mf-gap-bottom"
      />
      <div>
        <Row gutter={[16, 16]}>
          {
            articles
            && articles.length > 0
            && articles.map((article: any) => {
              return <Col
                key={article.id}
                xs={24}
                xl={12}
              >
                <ArticleCard {...article}/>
              </Col>
            })
          }
        </Row>
      </div>
      { isLoading && <Loading status="loading"></Loading>}
      { isEmpty && <Loading status="loaded" customText="app.article.listDone"></Loading>}
      <AddArticleModal
        visible={showAddModal}
        onCloseModal={onCloseModal}
      ></AddArticleModal>
   </div>
}

export default Article;