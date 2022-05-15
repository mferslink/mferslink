import { Modal, ModalProps } from "antd";
import { useEffect, useState, useCallback, memo } from "react";
import { message } from 'antd';
import styled from './index.module.css';
import Button from '@/components/Common/Button';
import { 
    MetaMask,
    WallectConnect
} from '@/components/Common/Icon';
import cx from 'classnames';
import {useDisconnect, useMetamask, useAccount, useWalletConnect} from '@thirdweb-dev/react';
import {createUserIfNotExist} from '@/services/user';
import { useTranslation } from 'react-i18next';
import { useStateStore } from '@/store/index';

interface Iprops {
    visible: boolean;
    onCloseModal: (visible: boolean) => void;
};

const LoginModal = (props: Iprops) => {
    const {visible, onCloseModal} = props;
    const {t} = useTranslation();
    const { isWise } = useStateStore();
    const [curSelectWallect, seCurSelectWallect] = useState('');

    let wallets = [
        {logo: <MetaMask />, name: 'Meta Mask', key: 'metaMask'},
        {logo: <WallectConnect />, name: 'Wallet Connect', key: 'walletConnect'}
    ];
    if(isWise) {
        wallets = wallets.filter(wallet => wallet.key !== 'metaMask');
    }
    
    const onModalConfirm = useCallback(async () => {
        if (!curSelectWallect) {
            message.warning('Please Select a wallect to connect');
            return;
        };
        let res = {} as any;
        if(curSelectWallect === 'metaMask') {
            res = await connectWithMetamask();
        } else if(curSelectWallect === 'walletConnect'){
            res = await connectWithWalletConnect();
        }
        if (res?.data?.account) {
            await createUserIfNotExist(res?.data?.account);
            message.success('login success!');
            onCloseModal(false);
        } else {
            if (res.error.message === 'Connector not found') {
                message.error('Connector not found, please install wallet plugin');
                return;
            }
            message.error(JSON.stringify(res?.error) || 'login fail!');
        }
    }, [curSelectWallect]);

    const connectWithMetamask = useMetamask();
    const connectWithWalletConnect = useWalletConnect();

    const onWalletSelected = useCallback(async (val) => {
        try {
            let res = {} as any;
            if(val === 'metaMask') {
                res = await connectWithMetamask();
            } else if(val === 'walletConnect'){
                res = await connectWithWalletConnect();
            }
            if (res?.data?.account) {
                await createUserIfNotExist(res?.data?.account);
                message.success('login success!');
                onCloseModal(false);
            } else {
                message.error(JSON.stringify(res?.error) || 'login fail!');
            }   
        } catch (error) {
            console.log('error', error);
        }
    }, []);

    return <div>
        <Modal
            centered
            width={420}
            visible={visible}
            footer={null}
            closable={false}
            maskClosable
            onCancel={() => onCloseModal(false)}
        >
            <div>
                <p className={styled.modalTitle}>{ t('app.login.modal.title') }</p>
                <p className={styled.modalDesc}>{ t('app.login.modal.desc') }</p>
                <div>
                    {
                        wallets.map(wallet => {
                            return <div
                                key={wallet.name}
                                className={
                                    cx(
                                        styled.walletItem,
                                        curSelectWallect === wallet.key ? styled.wallectSelected : ''
                                    )
                                }
                                onClick={() => seCurSelectWallect(wallet.key)}
                            >
                            <span>{ wallet.logo }</span>
                            <span className="mf-gap-left-small">{ wallet.name }</span>
                        </div>
                        })
                    }
                </div>
                <div className={styled.modalFooter}>
                    <span onClick={() => onCloseModal(false)}>
                        <Button
                            text="app.common.cancel"
                            textColor="rgba(34,35,42,0.65)"
                            color="#fff"
                            textSize="14px"
                        ></Button>
                    </span>
                    <span onClick={() => onModalConfirm()}>
                        <Button
                            text="app.login.button"
                            textSize="14px"
                        ></Button>
                    </span>
                </div>
            </div>
        </Modal>
    </div>
};

export default memo(LoginModal);