import { Warning, Security, Question } from "@/components/Common/Icon/index";
import styled from './index.module.css';
import { SecurityBaseType } from '@/typings/collection';
import {useEffect, useState} from 'react';
import cx from 'classnames';
import { Popover } from "antd";
import { useTranslation } from 'react-i18next';
import { formatTime } from '@/utils/common/time';

interface IProps {
    websiteStatus: SecurityBaseType;
    contractStatus: SecurityBaseType;
    contractAddress?: string;
    website?: string;
    contractReviewTime?: string;
    contractReviewerName?: string;
    websiteReviewTime?: string;
    websiteReviewerName?: string;
};
const SecurityInfo = (props: IProps) => {
    const { t } = useTranslation();
    const {
        websiteStatus,
        contractStatus,
        website,
        contractAddress,
        contractReviewTime,
        contractReviewerName,
        websiteReviewTime,
        websiteReviewerName
    } = props;

    const [statusList, setStatusList] = useState<any[]>();
    const statusMap = {
        'Unknown': {
            icon: <Question className="mf-gap-left-small" />,
            auditText: 'app.security.unknown'
        },
        'Verified': {
            icon: <Security className="mf-gap-left-small" />,
            auditText: 'app.security.verified'
        },
        'Unverified': {
            icon: <Warning className="mf-gap-left-small"/>,
            auditText: 'app.security.unverified'
        }
    };

    const renderDetail = (info: any) => {
        return <div className={styled.detailWrap}>
            <div className={styled.title}>{ t('app.security.title') }</div>
            <div className={styled.desc}>{ t('app.security.subTitle') }</div>
            {
                <div key={info.text}>
                    <div className={styled.baseInfo}>
                        <span className={styled.name}>{ t(info.cnText) }</span>
                        {
                            info.status === 'Verified'
                            ? <a href={info.url} className={cx(styled.url, 'mf-gap-right-small', 'mf-line-clamp1')}>
                                { info.url ? info.url : '--'}
                            </a>
                            : <span className={cx(styled.url, 'mf-gap-right-small', 'mf-line-clamp1')}> { info.url ? info.url : '--'}</span>
                        }
                        { info.url && <span>{ info.icon }</span> }
                    </div>
                    <div>
                        <span className={styled.name}>{ t('app.security.auditResult') }</span>
                        <span>{ t(info.auditText) }</span>
                    </div>
                    <div>
                        <span className={styled.name}>
                            { t('app.security.auditRecord') }
                        </span>
                        {
                            info.reviewName
                            && info.reviewTime
                            && <span>
                                <span style={{color: '#2794FF'}}>@{info.reviewName}</span>
                                <span className="mf-gap-left-small">
                                {
                                    formatTime(info.reviewTime)
                                }
                                </span>
                            </span>
                            || '--'
                        }
                    </div>
                </div>
            }
        </div>
    };

    useEffect(() => {
        setStatusList([
        {
            text: 'WebSite',
            cnText: 'app.security.website',
            status: websiteStatus,
            auditText: statusMap[websiteStatus].auditText,
            url: website,
            icon: statusMap[websiteStatus].icon,
            reviewTime: websiteReviewTime,
            reviewName: websiteReviewerName
        }, {
            text: 'Contracts',
            cnText: 'app.security.contract',
            auditText: statusMap[websiteStatus].auditText,
            url: contractAddress?.indexOf('etherscan') ? contractAddress : `https://etherscan.io/address/${contractAddress}`,
            status: contractStatus,
            icon: statusMap[contractStatus].icon,
            reviewTime: contractReviewTime,
            reviewName: contractReviewerName
        }]);
    },
    [   websiteStatus,
        contractStatus,
        website,
        contractAddress,
        websiteReviewerName,
        websiteReviewTime,
        contractReviewerName,
        contractReviewTime
    ]);

    return <div className={styled.wrap}>
        {
            statusList
            && statusList.length
            && statusList.map((item, idx) => {
                return <span
                    key={item.text}
                    onClick={e => e.stopPropagation()}
                >
                    <Popover
                        trigger={['hover', 'click']}
                        content={renderDetail(statusList[idx])}
                    >
                        <div
                            className={cx(styled.statusItem, idx ? 'mf-gap-left-small' : '')}
                        >
                            <span className={styled.siteInfoText}>{ item.text }</span>
                            { item.icon }
                        </div>
                    </Popover>
                </span>
            })
        }
    </div>
};
export default SecurityInfo;