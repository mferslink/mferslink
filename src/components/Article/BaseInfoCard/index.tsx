import styled from './index.module.css';
import CardOperateSimple from '@/components/Common/CardOperateSimple';
import { useCallback } from 'react';
import cx from 'classnames';

interface IProps{
    likes?: number;
    liked?: boolean;
    twitter?: string;
    comments?: number;
    title: string;
    description: string;
    uploaderName?: string;
    uploaderID?: string;
    id: string;
    url?: string;
    likedId?: string;
};

const BaseInfoCard = (props: IProps) => {
    const {
        likes,
        liked,
        twitter,
        title,
        description,
        uploaderName,
        uploaderID,
        id,
        url,
        likedId
    } = props;

    const goDetail = useCallback(() => {
        if (url) {
            window.open(url);
        }
    }, [url]);

    return <div className={styled.wrap}>
        <div className={styled.content}
            onClick={goDetail}
        >
            <div className={styled.detail}>
                <div className={styled.title}>{ title }</div>
                <div className={styled.desc}>{ description }</div>
                <div className={cx(styled.addBy, 'mf-gap-top-10')}>
                    add by <span className={styled.uploaderName}>@{ uploaderName } </span>
                </div>
            </div>
            <div className={cx(styled.read)} onClick={goDetail}>
                <span>Read</span>
                <span className="mf-gap-left-small">{ '>' }</span>
            </div>
        </div>
        <div>
            <CardOperateSimple
                type="article"
                likes={likes}
                liked={liked}
                likedId={likedId}
                twitter={twitter}
                toId={id}
                uploaderId={uploaderID}
            />
        </div>
    </div>
};
export default BaseInfoCard;
