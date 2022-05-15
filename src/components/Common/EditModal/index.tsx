import { Modal } from "antd";
import { useEffect, useState, useCallback, useRef, memo, MutableRefObject } from "react";
import { message, Input, Upload } from 'antd';
import styled from './index.module.css';
import Image from 'next/image';
import Button from '@/components/Common/Button';
import cx from 'classnames';
import { editUserInfo  } from '@/services/user';
import { postImage } from "@/services/common";
import { useStateStore, ACTIONS, useDispatchStore } from '@/store/index';
import { UserInfo } from "@/typings/user";
import Edit from '@/components/Common/Icon/Edit';
import useDebounce from "@/utils/hooks/useDebounce";
import { useTranslation } from 'react-i18next';

interface Iprops {
    visible: boolean;
    onCloseModal: (visible: boolean) => void;
};

const EditModal = (props: Iprops) => {
    const {visible, onCloseModal} = props;

    const { walletAddress, userInfo } = useStateStore();
    const idRef: MutableRefObject<string> = useRef('');
    const [innerUserInfo, setInnerUserInfo] = useState<UserInfo>();
    const dispatch = useDispatchStore();
    const { t } = useTranslation();

    useEffect(() => {
        setInnerUserInfo(userInfo);
        idRef.current = userInfo?.profileImageRef || '';
    }, [userInfo]);
    

    const onModalConfirm = useDebounce(async (__userInfo: any) => {
        try {
            await editUserInfo(walletAddress, __userInfo.name, idRef.current || '');
            dispatch && dispatch({
                type: ACTIONS.SET_USER_INFO,
                payload: __userInfo
            });
            message.success('edit success!');
            onCloseModal(false);
        } catch (error) {
            onCloseModal(false);
            message.error('edit fail!');
        }
    }, 1000, [walletAddress, innerUserInfo]);


    const beforeUploadAvator = useCallback(async (file: File, info: UserInfo | any) => {
        try {
            const {url, id} = await postImage(file);
            idRef.current = id;
            setInnerUserInfo(Object.assign({...info, name: info.name, profileImage: url}));
            return Upload.LIST_IGNORE;
        } catch (error) {
            message.error('post avator error');
        }
        return Upload.LIST_IGNORE;
    }, []);

    const onUserNameChange = (e: any) => {
        setInnerUserInfo(Object.assign({...innerUserInfo, name: e.target.value}));
    }; 

    
    return <div>
        <Modal
            centered
            width={360}
            visible={visible}
            footer={null}
            closable={false}
            maskClosable
            onCancel={() => onCloseModal(false)}
        >
            <div>
                <div className={cx("mf-gap-bottom", styled.wrap)}>
                    <div className={styled.editAvator}>
                        <Upload
                            beforeUpload={(file) => beforeUploadAvator(file, innerUserInfo)}
                        >
                            <Image 
                                src={innerUserInfo?.profileImage || ''}
                                width={90}
                                height={90}
                                className={styled.avator}
                            ></Image>
                            <div className={styled.editOp}>
                                <Edit fill="#fff" width={20} height={20}/>
                                <span className="mf-gap-left-mini">{ t('app.login.avator.edit') }</span>
                            </div>
                        </Upload>
                    </div>
                    <div className={styled.editName}>
                       <Input
                            size="large"
                            value={innerUserInfo?.name}
                            style={{
                                textAlign: 'center',
                                borderRadius: '6px'
                            }}
                            onChange={onUserNameChange}
                        ></Input>
                    </div>
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
                    <span onClick={() => onModalConfirm(innerUserInfo)}>
                        <Button
                            text="app.logout.save"
                            textSize="14px"
                        ></Button>
                    </span>
                </div>
            </div>
        </Modal>
    </div>
};

export default memo(EditModal);