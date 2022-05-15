import styled from './index.module.css';
import Image from 'next/image';
import Platform from '@/components/Common/Platform';
import BasicInfo from '../BasicInfo';
import { BaseInfoType } from '@/typings/collection';
import SecurityInfo from '../SecurityInfo';
import CardOperateSimple from '@/components/Common/CardOperateSimple';
import { useStateStore } from '@/store/index';
import { useTranslation } from 'react-i18next';

type IProps = BaseInfoType & {
    website?: string;
    contractAddress?: string;
    id: string;
    liked: boolean;
    likedId?: string;
    contractReviewTime?: string;
    contractReviewerName?: string;
    websiteReviewTime?: string;
    websiteReviewerName?: string;
}

const BaseInfoCard = (props: IProps) => {
    const {
        name = '',
        collectionImage = '',
        likes,
        liked,
        items = 0,
        owners = 0,
        floorPrice = 0,
        opensea,
        discord,
        twitter,
        uploaderName = '',
        uploaderID = '',
        websiteStatus,
        contractStatus,
        website,
        contractAddress,
        id,
        likedId,

        contractReviewTime,
        contractReviewerName,
        websiteReviewTime,
        websiteReviewerName
    } = props;

    const { isWise } = useStateStore();
    const { t } = useTranslation();

    return <div className={styled.wrap}>
        <div className={styled.content}>
            <div className={styled.avatorBox}>
                <Image 
                    src={`${collectionImage}?q=50`}
                    width={90}
                    height={90}
                    className={styled.avator}
                />
            </div>
            <div className={styled.detail}>
                <div className={styled.middle}>
                    <div className={styled.title}>{ name || ''}</div>
                    <div style={{width: isWise ? '100%' : '70%'}}>
                        <BasicInfo
                            items={items}
                            owners={owners}
                            floorPrice={floorPrice}
                        />
                    </div>
                    <p>{ t('app.common.uploader') } <span className={styled.uploader}>@{ uploaderName } </span></p>
                </div>
                <div className={styled.right}>
                    {
                        !isWise
                        && <SecurityInfo
                            websiteStatus={websiteStatus}
                            contractStatus={contractStatus}
                            website={website}
                            contractAddress={contractAddress}
                            contractReviewTime={contractReviewTime}
                            contractReviewerName={contractReviewerName}
                            websiteReviewTime={websiteReviewTime}
                            websiteReviewerName={websiteReviewerName}
                        />
                    }
                    <div className={ isWise ? '' : 'mf-gap-top'}>
                        <Platform
                            twitter={twitter}
                            opensea={opensea}
                            discord={discord}
                        />
                    </div>
                </div>
            </div>
        </div>
        <CardOperateSimple
            type="collection"
            likes={likes}
            liked={liked}
            toId={id}
            likedId={likedId}
            twitter={twitter}
            uploaderId={uploaderID}
        />
    </div>
};
export default BaseInfoCard;
