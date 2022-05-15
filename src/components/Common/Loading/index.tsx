import { memo } from 'react';
import styled from './index.module.css';
import { useTranslation } from 'react-i18next';
interface IProps {
    status: 'loading' | 'loaded';
    customText?: string;
};

const Loading = (props: IProps) => {
    const { status, customText } = props;
    const { t } = useTranslation();
    return <div className={styled.loading}>
        {
            status === 'loading'
            && <div>{ t('app.common.loading') }</div>
        }
        {
            status === 'loaded'
            && <div>
                {
                    customText ? t(customText) : 'loaded'
                }
            </div>
        }
    </div>
};
export default memo(Loading);