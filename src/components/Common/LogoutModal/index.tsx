import { Modal, message} from "antd";
import styled from './index.module.css';
import Button from '@/components/Common/Button';
import {useDisconnect} from '@thirdweb-dev/react';
import {ACTIONS, useDispatchStore} from '@/store/index';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';

interface Iprops {
    visible: boolean;
    onCloseModal: (visible: boolean) => void;
};

const LogoutModal = (props: Iprops) => {
    const {visible, onCloseModal} = props;

    const dispatch = useDispatchStore();
    const {t} = useTranslation();
    const disconnectWallet = useDisconnect();

    const onModalConfirm = async () => {
        try {
            await disconnectWallet();
            dispatch && dispatch({
                type: ACTIONS.SET_USER_INFO,
                payload: {}
            });
            dispatch && dispatch({
                type: ACTIONS.SET_WALLET_ADDRESS,
                payload: ''
            });
            sessionStorage.removeItem('wa');
            onCloseModal(false);
            message.success('logout success!');
        } catch (error) {
            message.success('logout fail!');
        }
    };

    
    return <div>
        <Modal
            centered
            width={280}
            visible={visible}
            footer={null}
            closable={false}
            maskClosable
            onCancel={() => onCloseModal(false)}
        >
            <div>
                <div className={styled.logout}>{ t('app.logout.content') }</div>
                <div className={styled.modalFooter}>
                    <span onClick={() => onCloseModal(false)}>
                        <Button
                            text="app.common.cancel"
                            textColor="rgba(34,35,42,0.65)"
                            color="#fff"
                            textSize="12px"
                        ></Button>
                    </span>
                    <span onClick={() => onModalConfirm()}>
                        <Button
                            text="app.logout.button"
                            textSize="12px"
                        ></Button>
                    </span>
                </div>
            </div>
        </Modal>
    </div>
};

export default memo(LogoutModal);