import CardOperate from '@/components/Common/CardOperate';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Platform from '@/components/Common/Platform';
import SecurityInfo from '@/components/Collection/SecurityInfo';
import { SecurityBaseType } from '@/typings/collection';
interface IProps {
    id: string;
    collectionImage?: string;
    comments?: number;
    likes?: number;
    liked?: boolean;
    floorPrice?: number;
    name: string;
    items?: number;
    owners?: number;

    twitter?: string;
    discord?: string;
    opensea?: string;
    websiteStatus: SecurityBaseType;
    contractStatus: SecurityBaseType;
    website?: string;
    contractAddress?: string;
    likedId?: string;
    uploaderID?: string;
    
    contractReviewTime?: string;
    contractReviewerName?: string;
    websiteReviewTime?: string;
    websiteReviewerName?: string;
}

import styled from './index.module.css';
import cx from 'classnames';
import { useCallback, useState } from "react";
import ROUTES from '@/dicts/routesMap';
import BasicInfo from '../BasicInfo';

const Card = (props: IProps) => {
    const {
        collectionImage = '',
        comments,
        likes,
        liked,
        floorPrice,
        name,
        items = 0,
        owners = 0,
        id,
        twitter,
        discord,
        opensea,
        websiteStatus,
        contractStatus,
        website,
        contractAddress,
        likedId,
        uploaderID,
        contractReviewTime,
        contractReviewerName,
        websiteReviewTime,
        websiteReviewerName
    } = props;
    const router = useRouter();
    const goDetail = useCallback((id) => {
        router.push(`${ROUTES.COLLECTION_DETAIL}?id=${id}`);
    }, []);

    return <>
        <div
            className={styled.wrap}
        >
            <div
                className={styled.top}
                onClick={() => goDetail(id)}
            >
                <div className={styled.base}>
                    <div className={styled.imgCoverBox}>
                        <Image
                            src={`${collectionImage}?q=50&h=250`}
                            width={90}
                            height={90}
                            className={styled.imgCover}
                        ></Image>
                    </div>
                    <div className='mf-gap-left'>
                        <div className={styled.projName}>{ name }</div>
                        <div className={styled.siteInfo}>
                            <SecurityInfo
                                websiteStatus={websiteStatus}
                                contractStatus={contractStatus}
                                website={website}
                                contractAddress={contractAddress}
                                contractReviewTime={contractReviewTime}
                                contractReviewerName={contractReviewerName}
                                websiteReviewTime={websiteReviewTime}
                                websiteReviewerName={websiteReviewerName}
                            />
                        </div>
                        <div className={styled.platform}>
                            <Platform
                                opensea={opensea}
                                discord={discord}
                                twitter={twitter}
                            />
                        </div>
                    </div>
            </div>
            <div className={styled.projInfo}>
                <BasicInfo
                    items={items}
                    owners={owners}
                    floorPrice={floorPrice || 0}
                />
            </div>
            </div>
            <div className={styled.cardOperate}>
                <CardOperate
                    toId={id}
                    likes={likes}
                    likedId={likedId}
                    liked={liked}
                    comments={comments}
                    type="collection"
                    uploaderId={uploaderID}
                />
            </div>
        </div>
    </>
};
export default Card;
