import { Modal } from "antd";
import { useEffect, useState, useCallback } from "react";
import { message, InputNumber} from 'antd';
import styled from './index.module.css';
import Image from 'next/image';
import Button from '@/components/Common/Button';
import cx from 'classnames';
import { useStateStore, ACTIONS, useDispatchStore } from "@/store";
import useDebounce from '@/utils/hooks/useDebounce';
import { useTranslation } from 'react-i18next';

interface Iprops {
    visible: boolean;
    donateStatus: number;
    onCloseModal: (visible: boolean) => void;
    onBtnDone: (price: string) => void;
};

const DonationModal = (props: Iprops) => {
    const {visible, onCloseModal, donateStatus, onBtnDone} = props;
    const { walletAddress } = useStateStore();

    const priceList = ['0.01', '0.069', '0.69', '1', '6.9'];
    const [curPrice, setCurPrice] = useState('0.01');
    const [curCustomSelected, setCurCustomSelected] = useState(false);
    const dispatch = useDispatchStore();
    const { t } = useTranslation();

    const onModalConfirm = useDebounce(async () => {
        try {
            if (walletAddress) {
                if (donateStatus === 2) {
                    onBtnDone('');
                    return;
                }
                try {
                    onBtnDone(String(curPrice));
                } catch (error) {
                    message.warning('Payment failed！');   
                }
            } else {
                dispatch?.({
                    type: ACTIONS.SET_SHOW_LOGIN_MODAL,
                    payload: true
                });
            }
        } catch (error) {
            message.error('donate error!');
        }
    }, 1000, [walletAddress, curPrice, donateStatus]);

    const onInputChange = useCallback((val) => {
        setCurPrice(val);
    }, []);

    const onInputFocus = useCallback(() => {
        setCurCustomSelected(true);
        setCurPrice('');
    }, []);

    const onPriceSelected = useCallback((price) => {
        setCurPrice(price);
        setCurCustomSelected(false);
    }, [curPrice]);
    
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
                {
                    donateStatus === 1
                    ? <div>
                        <p className={cx(styled.title, 'mf-gap-bottom')}>{ t('app.donation.modal.title') }</p>
                        <p className={cx(styled.desc, 'mf-gap-bottom')}>
                            {t('app.donation.modal.desc')}
                        </p>
                        <div>
                            <p className={cx('mf-gap-bottom', styled.text)}>
                               { t('app.donation.modal.selectMoney') }
                            </p>
                            <div className={styled.priceBox}>
                                {
                                    priceList.map((item) => {
                                        return <span
                                            key={item}
                                            className={cx(styled.priceItem, item === curPrice ? styled.priceItemSelected : '')}
                                            onClick={() => onPriceSelected(item)}
                                        >
                                            <div style={{flexShrink: '0'}}>
                                                <Image
                                                    src="https://cdn.sanity.io/images/oru63jca/production/30b2677c4499b5bad2b49cf68f625a84daf727e2-31x50.png"
                                                    width={10}
                                                    height={16}
                                                    
                                                />
                                            </div>
                                            <span className="mf-gap-left-mini">{item}</span>
                                        </span>
                                    })
                                }
                            </div>
                            <p className={cx(styled.text, 'mf-gap-bottom')}>
                                {t('app.donation.modal.inputMoney')}
                            </p>
                            <div
                                className={cx(styled.customPrice, 'mf-gap-bottom', curCustomSelected ? styled.priceItemSelected : '')}
                            >
                                <div style={{flexShrink: '0'}}>
                                    <Image
                                        src="https://cdn.sanity.io/images/oru63jca/production/30b2677c4499b5bad2b49cf68f625a84daf727e2-31x50.png"
                                        width={10}
                                        height={16}
                                    />
                                </div>
                                <InputNumber
                                    bordered={false}
                                    min={0}
                                    className={styled.customInput}
                                    onFocus={onInputFocus}
                                    onChange={onInputChange}
                                />
                            </div>
                            <p className={cx(styled.text, 'mf-gap-bottom')}>
                                { t('app.donation.modal.desc2') }
                            </p>
                            {/* <p className={styled.text}>
                                NFTs to donors will be airdropped in May，Stay tuned !
                            </p> */}
                        </div>
                    </div>
                    : <div>
                        <p className={styled.title}>
                            <span>{ t('app.donation.success.title') }</span>
                            <span className="mf-gap-left-mini"> { curPrice }</span>
                            <span className="mf-gap-left-small">
                                <Image
                                    src="https://cdn.sanity.io/images/oru63jca/production/30b2677c4499b5bad2b49cf68f625a84daf727e2-31x50.png"
                                    width={10}
                                    height={16}
                                    className="mf-gap-left-small"
                                />
                            </span>
                        </p>
                        <p className={styled.text}>
                         { t('app.donation.success.desc1') }
                        </p>
                        <p className={styled.text}>
                         { t('app.donation.success.desc2') }
                        </p>
                        {/* <p className={cx(styled.text, 'mf-gap-bottom')}>
                        NFTs to donors will be airdropped in May，Stay tuned !
                        </p> */}
                    </div>
                }
                <div className={cx(styled.modalFooter, 'mf-gap-top')}>
                    {
                        donateStatus === 1 && <span onClick={() => onCloseModal(false)}>
                            <Button
                                text="app.common.cancel"
                                textColor="rgba(34,35,42,0.65)"
                                color="#fff"
                                textSize="14px"
                            ></Button>
                        </span>
                    }
                    <span onClick={() => onModalConfirm()}>
                        <Button
                            text={donateStatus === 1 ? t('app.donation.modal.button') : t('app.donation.success.button') }
                            textSize="14px"
                        ></Button>
                    </span>
                </div>
            </div>
        </Modal>
    </div>
};

export default DonationModal;
