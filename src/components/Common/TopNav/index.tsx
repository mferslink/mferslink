import { useRouter } from 'next/router';
import styled from './index.module.css';
import { Back } from '../Icon';
import { useTranslation } from 'react-i18next';
const TopNav = () => {
    const router = useRouter();
    const { t } = useTranslation();
    return <>
        {
            window.history.length > 2
            && <div className={styled.wrap} onClick={() => router.back()}>
                <Back fill={'#fff'} width={30} height={24}/>
                <span className="mf-gap-left-small">{ t('app.topNav.text') }</span>
            </div>
        }
    </>
};
export default TopNav;