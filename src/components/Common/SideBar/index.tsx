import routes from '@/routes/index';
import styled from './index.module.css';
import { 
    Home,
    Globe,
    Twiter,
    Discord,
    Github
} from '@/components/Common/Icon';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import Image from 'next/image';
import Capsule from '@/components/Common/Capsule';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Common/Button';
import { useDispatchStore, ACTIONS, useStateStore } from '@/store';
import { useAddress, useDisconnect, useMetamask, useAccount} from '@thirdweb-dev/react';
import LoginModal from '@/components/Common/LoginModal';
import LogoutModal from '@/components/Common/LogoutModal';
import EditModal from '@/components/Common/EditModal';
import DonateModal from '@/components/Common/DonateModal';
import {getUser} from '@/services/user';
import {UserInfo} from '@/typings/user';
import { Popover, Row, Col } from 'antd';
import Select from '../Select';
import { selectList } from '@/dicts/language';
import Platform from '@/dicts/platform';

const SideBar = () => {

    const router = useRouter();
    const [curRoute, setCurRoute] = useState<string>('/home');
    const {t, i18n} = useTranslation();
    const dispatch = useDispatchStore();
    const { userInfo, isWise } = useStateStore();

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDonateModal, setShowDonateModal] = useState(false);
    const [popoverVisible, setPopoverVisible] = useState(false);

    const platformList = [
        {logo: <Twiter />, url: Platform.TWITER},
        {logo: <Discord />, url: Platform.DISCORD},
        {logo: <Github />, url: Platform.GITHUB},
    ];

    useEffect(() => {
        if (location && location.pathname) {
            const firstLevelRotue = location.pathname.split('/')[1];
            setCurRoute(`/${firstLevelRotue}`);
        }
    }, [location.pathname]);

    const goPlatform = useCallback((url: string) => {
        if (url) {
            window.open(url);
        }
    }, []);

    const login = useCallback(() => {
        dispatch?.({
            type: ACTIONS.SET_SHOW_LOGIN_MODAL,
            payload: true
        });
    }, [showLogoutModal]);

    const address = useAddress() as string;

    useEffect(() => {
        if (address) {
            getUser(address).then((data: any) => {
                if (data) {
                    dispatch && dispatch({
                        type: ACTIONS.SET_WALLET_ADDRESS,
                        payload: data.walletAddress
                    });
                    dispatch && dispatch({
                        type: ACTIONS.SET_USER_INFO,
                        payload: {
                            name: data.name,
                            walletAddress: data.walletAddress,
                            profileImage: data?.profileImage || 'https://avatars.githubusercontent.com/u/2573844?v=4',
                            profileImageRef: data?.profileImageRef || '',
                            notifications: data?.notifications || 0,
                            lastNotificationTime: data.lastNotificationTime
                        }
                    });
                    if(data.walletAddress) {
                        sessionStorage.setItem('wa', data.walletAddress);
                    }
                }
            });    
        }
    }, [address]);

    const onItemClick = useCallback((path: string) => {
        router.push(path);
        setCurRoute(path);
        dispatch?.({
            type: ACTIONS.SET_SHOW_SIDEBAR_DRAWER,
            payload: false
        })
    }, []);

    const changeLanguage = useCallback((language) => {
        i18n.changeLanguage(language);
    }, []);

    const onLoginOpSelected = useCallback((type) => {
        if (type === 'edit') {
            setShowEditModal(true)
        } else if (type === 'logout') {
            setShowLogoutModal(true)
        }
        setPopoverVisible(false);
    }, []);

    const loginOpContent = (<div className={styled.operate}>
        <div onClick={() => onLoginOpSelected('edit')}>{ t('app.login.avator.edit') }</div>
        <div onClick={() => onLoginOpSelected('logout')}>{ t('app.logout.button') }</div>
    </div>);

    const onDonateBtnClick = useCallback(() => {
        dispatch?.({
            type: ACTIONS.SET_DONATE_MODAL,
            payload: {
                status: 1,
                visible: true
            }
        });
    }, []);


    return (<>
        <div className={styled.wrap}>
            <div className={styled.main}>
                <div>
                    <Select
                        boxsStyle={{
                            backgroundColor: '#F2F3F0',
                            borderRadius: '28px'
                        }}
                        selectedStyle={{
                            color: 'rgba(0,0,0,0.85)'
                        }}
                        icon={<Globe width={16} height={16} fill={'#8c8c8c'} style={{marginRight: '5px'}}/>}
                        list={selectList}
                        onSelected={changeLanguage}
                    />
                </div>
               {
                    <div className={styled.logo}>
                        <Image
                            src="https://cdn.sanity.io/images/oru63jca/production/64c3d091b14d776514c703db9b86e1e128a2b29f-1038x240.png?h=100"
                            width={isWise ? 230 : 276}
                            height={isWise ? 53 : 64}
                        />
                    </div>
               }
                <div className={styled.sider}>
                    {
                        routes.map(item => {
                            return <div
                                key={item.key}
                                className={styled.sidebarItem}
                            >
                                <div 
                                    className={cx(
                                        styled.itemContent,
                                        curRoute === item.path
                                        ? styled.itemContentSelected : ''
                                    )}
                                    onClick={() => onItemClick(item.path)}
                                >
                                    {item.icon}
                                    <span className={styled.itemContentText}>{ t(item.name) }</span>
                                    {
                                        item.path === '/notification'
                                        && (userInfo?.notifications || 0) > 0
                                        && <span style={{marginLeft: '12px'}}>
                                            {
                                                <Capsule num={userInfo?.notifications || 0}/>
                                            }
                                        </span>
                                    }
                                </div>
                            </div>
                        })
                    }
                </div>
                <div className={styled.personal}>
                    {
                        userInfo?.walletAddress
                        ? <Popover
                            visible={popoverVisible}
                            placement="topLeft"
                            trigger="hover"
                            content={loginOpContent}
                            overlayInnerStyle={{borderRadius: '8px'}}
                            onVisibleChange={val => setPopoverVisible(val)}
                        >
                             <div className={styled.login}>
                                <div className={styled.avatorBox}>
                                    <Image
                                        src={userInfo?.profileImage || 'https://avatars.githubusercontent.com/u/2573844?v=4'}
                                        width={48}
                                        height={48}
                                        className={styled.avator}
                                    ></Image>
                                </div>
                                <div className={styled.info}>
                                    <div className={styled.userName}>{ userInfo?.name }</div>
                                    <div className={cx(styled.ethName, 'mf-line-clamp1')}>
                                        { isWise
                                            ? userInfo?.walletAddress.slice(0, 15)
                                            : userInfo?.walletAddress.slice(0, 25)
                                        }
                                        ...
                                    </div>
                                </div>
                            </div>
                        </Popover>
                        : <div
                            onClick={login}
                            className={styled.unLogin}
                        >
                           <Home />
                           <span
                            className={cx(styled.unLoginText, 'mf-gap-left-small')}
                           >{ t('app.sidebar.login') }</span>
                        </div>
                    }
                </div>
                <div style={{paddingBottom: '20px'}}>
                    <div className={styled.platform}>
                        {
                            platformList.map((platform, index) => {
                                return <span
                                    key={platform.url}
                                    className={index !== platformList.length ? 'mf-gap-right' : ''}
                                    onClick={() => goPlatform(platform.url)}
                                >
                                    {platform.logo}
                                </span>
                            })
                        }
                    </div>
                    <div onClick={() => onDonateBtnClick()}>
                        <Button text={t('app.donation.button')}></Button>
                    </div>
                    <div className={cx(styled.intro, 'mf-gap-bottom-small')}>
                        {t('app.donation.intro')}
                    </div>
                </div>
            </div>
            <LogoutModal visible={showLogoutModal} onCloseModal={val => setShowLogoutModal(val)}></LogoutModal>
            <EditModal visible={showEditModal} onCloseModal={val => setShowEditModal(val)}></EditModal>
        </div>
    </>)
};

export default SideBar;