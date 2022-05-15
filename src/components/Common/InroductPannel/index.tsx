import { memo } from "react";
import Image from 'next/image';
import { TwiterFill } from '@/components/Common/Icon';
import styled from './index.module.css';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

interface IProps {
    avator: string;
    name: string;
    twitter?: string;
    role: string;
};
const IntroductPannel = (props: IProps) => {
    const {
        avator,
        name,
        twitter,
        role
    } = props;
    const { t } = useTranslation();
    
    return <>
        <div className={styled.wrap}>
            <img
                src={avator}
                width={50}
                height={50}
                className={styled.avator}
            />
            <div className={styled.name}>{ name }</div>
            <div className={styled.role}>{ t(role) }</div>
            {
                twitter
                && <TwiterFill
                    width={30}
                    height={30}
                    fill="#3CB9FF"
                    onClick={() => window.open(twitter)}
                    style={{cursor: 'pointer'}}
                    />
            }
        </div>
    </>
};
export default memo(IntroductPannel);