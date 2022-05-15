import CardOperate from '@/components/Common/CardOperate';
import Image from 'next/image';
import styled from './index.module.css';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import ROUTES from '@/dicts/routesMap';
import cx from 'classnames';
import { url } from 'inspector';

interface IProps {
    id: string;
    content: string;
    description: string;
    comments?: number;
    likes?: number;
    liked?: boolean;
    likedId?: string;
    uploaderID?: string;
}

const Card = (props: IProps) => {
    const {
        id,
        content: image,
        description,
        comments,
        likes,
        liked,
        likedId,
        uploaderID
    } = props;

    const router  = useRouter();
    const goDetail = useCallback((id) => {
        router.push(`${ROUTES.MEME_DETAIL}?id=${id}`);
    }, []);

    return <>
        <div 
            className={styled.wrap}
        >
            <div onClick={() => goDetail(id)} style={{position: 'relative'}}>
                <img src={`${image}?q=50&h=250`} width={'100%'} height={'auto'}/>
                <div
                    className={cx(styled.intro)}
                >
                    <div className="mf-line-clamp2">{ description }</div>
                </div>
            </div>
            <div className={styled.cardOperate}>
                <CardOperate
                    comments={comments}
                    likes={likes}
                    liked={liked}
                    likedId={likedId}
                    toId={id}
                    type="meme"
                    uploaderId={uploaderID}
                />
            </div>
        </div>
    </>
};
export default Card;
