import { useCallback, useEffect, useRef, useState, memo } from 'react';
import SideBar from "@/components/Common/SideBar";
import { useRouter } from "next/router";
import LoginModal from '@/components/Common/LoginModal';
import cx from 'classnames';
import { useStateStore, useDispatchStore, ACTIONS} from '@/store';
import { Drawer } from 'antd';
import styled from './index.module.css';
import Image from 'next/image';
import { useAddress } from '@thirdweb-dev/react';
import { getUser } from '@/services/user';
import { useBottom } from '@/utils/hooks/useBottom';
import DonationModal from '../DonateModal';
import { donate } from '@/services/contract';

const Layout = ({children}: {children: any}) => {
    const [show, setShow] = useState(false);
    const [isActivity, setIsActivity] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();
    const { showLoginModal, showSideBarDrawer, donateModal, walletAddress } = useStateStore();
    const dispatch = useDispatchStore();
    const address = useAddress() as string;
    const {scrollTop} = useBottom();
    const [showFloatNav, setShowFloatNav] = useState(false);

    const closeLoginModal = useCallback(() => {

        dispatch && dispatch({
            type: ACTIONS.SET_SHOW_LOGIN_MODAL,
            payload: false
        });

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
    }, [showLoginModal]);

    const openSiderBarDrawer = useCallback(() => {
        dispatch?.({
            type: ACTIONS.SET_SHOW_SIDEBAR_DRAWER,
            payload: true
        })
    }, []); 

    const closeSiderBarDrawer = useCallback(() => {
        dispatch?.({
            type: ACTIONS.SET_SHOW_SIDEBAR_DRAWER,
            payload: false
        });
    }, [showSideBarDrawer]);

    useEffect(() => {
        const screenWidth = document.documentElement.clientWidth;
        if (screenWidth < 640) {
            setIsMobile(true);
            dispatch && dispatch({
                type: ACTIONS.SET_IS_WISE,
                payload: true
            });
        } else {
            setIsMobile(false);
            dispatch && dispatch({
                type: ACTIONS.SET_IS_WISE,
                payload: false
            });
        }
        
        const cb = () => {
            const screenWidth = document.documentElement.clientWidth;
            if (screenWidth < 640) {
                setIsMobile(true);
                dispatch && dispatch({
                    type: ACTIONS.SET_IS_WISE,
                    payload: true
                });
            } else {
                setIsMobile(false);
                dispatch && dispatch({
                    type: ACTIONS.SET_IS_WISE,
                    payload: false
                });
            }
        };
        window.addEventListener('resize', cb);
        return () => window.removeEventListener('resize', cb);
    }, []);

    useEffect(() => {
        if (location.pathname === '/' || location.pathname === '/activity') {
            setIsActivity(true);
            setShow(true);
            return;
        }
        setShow(true);
        setIsActivity(false);
    }, [router]);

    useEffect(() => {
        if (isMobile) {
            if (scrollTop > 65) {
                setShowFloatNav(true);
            } else {
                setShowFloatNav(false);
            }
        }
    }, [scrollTop, isMobile]);

    const onDonateBtnDone = useCallback(async (price: string) => {
        // console.log('price', price);
        if (price) {
            dispatch?.({
                type: ACTIONS.SET_DONATE_MODAL,
                payload: {
                    status: 1,
                    visible: false
                }
            });
            if (walletAddress) {
                // console.log('add', walletAddress);
                // console.log('price', price);
                await donate(walletAddress, String(price));
                dispatch?.({
                    type: ACTIONS.SET_DONATE_MODAL,
                    payload: {
                        status: 2,
                        visible: true
                    }
                });
            }
        } else {
            dispatch?.({
                type: ACTIONS.SET_DONATE_MODAL,
                payload: {
                    status: 1,
                    visible: false
                }
            });
        }
    }, [walletAddress]);

    const onDonateModalClose = useCallback(() => {
        dispatch?.({
            type: ACTIONS.SET_DONATE_MODAL,
            payload: {
                status: 1,
                visible: false
            }
        });
    }, []);

    return <div>
        {
            show
            && <div className={
                cx(
                    'mfer-container'
                )}>
                {
                   
                   !isMobile
                   && !isActivity
                   && <div className='mfer-sidebar'>
                        <SideBar/>
                    </div>
                }
                {   isMobile
                    && !isActivity
                    && <div className={styled.menu} onClick={() => openSiderBarDrawer()}>
                        {
                            
                            <div style={{display: showFloatNav ? 'block': 'none', position: 'fixed', top: '20px', left: '10px', width: '100%', zIndex: 999}}>
                                <Image
                                    src="https://cdn.sanity.io/files/oru63jca/production/149383825d884b0ec2687ef515408f9be2382b83.png"
                                    width={40}
                                    height={40}
                                ></Image>
                            </div>
                        }
                        {
                            <div style={{display: showFloatNav ? 'none': 'block'}}>
                                <Image
                                    src="https://cdn.sanity.io/images/oru63jca/production/70f550407ce2405c53de8bec8c74d68e98bc75f6-9303x1599.png?h=200"
                                    width={250}
                                    height={43}
                                ></Image>
                            </div>
                        }
                    </div>

                }
                {   isMobile
                    && showFloatNav
                    && !isActivity
                    && <div style={{height: '69.5px'}}></div>
                }
                <div className={cx((!isActivity && !isMobile) ? 'mfer-content' : '', 'mfer-bg')}
                >
                    {children}
                </div>
            </div>
        }
        <LoginModal
            visible={showLoginModal}
            onCloseModal={closeLoginModal}
        />
        <DonationModal
            visible={donateModal.visible}
            donateStatus={donateModal.status}
            onBtnDone={onDonateBtnDone}
            onCloseModal={onDonateModalClose}
        />
        <Drawer
            visible={showSideBarDrawer}
            width={278}
            placement="left"
            closable={false}
            onClose={closeSiderBarDrawer}
        >
            <SideBar />
        </Drawer>
    </div>
};

export default memo(Layout);