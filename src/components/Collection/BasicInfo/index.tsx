import Image from 'next/image';
interface IProps {
    items: number;
    owners: number;
    floorPrice: number;
};
import cx from 'classnames';
import styled from './index.module.css';
import { useTranslation } from "react-i18next";
const BasicInfo = (props: IProps) => {
    const {
        items = 0,
        owners = 0,
        floorPrice = 0
    } = props;
    const { t } = useTranslation(); 
    return <div className={styled.wrap}>
         <div>
            <span className={styled.projInfoName}>{t('app.collection.card.items')}</span>
            <span className={cx(styled.projInfoValue, 'mf-gap-left-small')}>{ items > 0 ? items : '--'}</span>
        </div>
        <div>
            <span className={styled.projInfoName}>{t('app.collection.card.owners')}</span>
            <span className={cx(styled.projInfoValue, 'mf-gap-left-small')}>{ owners > 0 ? owners : '--' }</span>
        </div>
        <div className={cx('mf-flex-ac', 'mf-line-clamp1')}>
            <span className={cx(styled.projInfoName, 'mf-line-clamp1')} style={{flexShrink: 0}}>{ t('app.collection.card.fp') }</span>
            <span className={cx('mf-gap-left-small', 'mf-flex-ac', 'mf-line-clamp1')}>
                <Image
                    src="https://cdn.sanity.io/images/oru63jca/production/30b2677c4499b5bad2b49cf68f625a84daf727e2-31x50.png"
                    width={10}
                    height={16}
                />
                <span className={cx(styled.projInfoValue, 'mf-gap-left-mini', 'mf-line-clamp1')}>{ floorPrice > 0 ? floorPrice.toFixed(4) : '--'}</span>
            </span>   
        </div>
    </div>
};
export default BasicInfo;