import { useCallback, useEffect, useMemo, useState, memo } from "react";
import * as React from 'react';
import { Form, Input, message, Modal, Upload } from "antd";
import styled from './index.module.css';
import Button from '@/components/Common/Button';
import cx from 'classnames';
import { postImage } from "@/services/common";
import { postCollection } from '@/services/collection';
import { useStateStore } from '@/store/index';
import { UploadImgBig } from '@/components/Common/Icon/index';
import NextImage from 'next/image';
import {Trash} from '@/components/Common/Icon';
import {useTranslation} from 'react-i18next';
import useDebounce from '@/utils/hooks/useDebounce';
import {collectionForm} from '@/dicts/form';
import LoadingAnimation from '@/components/Common/LoadingAnimation';

interface Iprops {
    visible: boolean;
    onCloseModal: (postStatus: boolean) => void;
};

interface UploadProps {
    value?: string;
    onChange?: (value: string) => void;
}

const AddCollectionModal = (props: Iprops) => {
    const {visible, onCloseModal} = props;
    
    const [form] = Form.useForm();
    const { walletAddress } = useStateStore();
    const {t} = useTranslation();
    const [uploading, setUploading] = useState(false);
    const [uploadUrl, setUploadUrl] = useState('');

    const onModalConfirm = useDebounce(async () => {
        form.validateFields().then(async (val) => {
            try {
                const params = Object.assign(form.getFieldsValue(), {uploaderID: walletAddress});
                await postCollection(params);
                onCloseModal(true);
                message.success('post collection successs');
            } catch (error) {
                message.error('post collection fail!');
            }
            
        }).catch(() => {
            message.error('collection form validate fail, please check');
        });
    }, 1000, [walletAddress]);

    const CustomUpload: React.FC<UploadProps> = useCallback(({value, onChange}) => {
        
        const onBeforeUpload = async (file: File) => {

            const getImageSize = async (rawFile: File) => {
                return new Promise<{width: number, height: number}>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(rawFile);
                    reader.onload = (loadFile) => {
                        let image = new Image();
                        // @ts-ignore
                        image.src = loadFile.target.result;
                        image.onload = () => {
                            const width = image.width;
                            const height = image.height;
                            resolve({
                                width,
                                height
                            });
                        }
                    };
                });
            };
            const {width, height} = await getImageSize(file);
            if (width !== height) {
                message.error('logo size is not correct');
                return Upload.LIST_IGNORE;
            }

            setUploading(true);
            const {url, id} = await postImage(file);
            setUploading(false);
            setUploadUrl(url);
            onChange?.(id);
            return Upload.LIST_IGNORE;
        };

        const onUploadRemove = (e: any) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            setUploadUrl('');
        };

        return <div>
            {
                <Upload
                    beforeUpload={onBeforeUpload}
                    style={{width: '100'}}
                    maxCount={1}
                    accept=".jpg,.png,.gif"
                >
                <div className={styled.upload}>
                    {
                        uploadUrl
                        ? <div className={styled.uploadPreview}>
                            <NextImage
                                src={uploadUrl}
                                width={110}
                                height={110}
                            ></NextImage>
                            <div className={styled.removeImage} onClick={e => onUploadRemove(e)}>
                                <span className={styled.removeTrash}>
                                    <Trash width={30} height={30} fill="#fff"></Trash>
                                </span>
                            </div>
                        </div>
                        : <div className={styled.uploadImg}>
                            {
                                uploading
                                ? <LoadingAnimation width={30} height={30} color="#333"/>
                                : <UploadImgBig width={52} height={52}/>
                            }
                        </div>
                    }
                    <div className={cx('mf-gap-left', styled.uploadText)}>
                        <p className={styled.uploadTextTitle}>
                            <span>{ t('app.collection.modal.image') }</span>
                            <span className={cx('mf-gap-left-small', styled.required)}>*</span>
                        </p>
                        <p className={styled.uploadTextDesc}>
                            { t('app.collection.modal.imageLimit') }
                        </p>
                    </div>
                </div>
            </Upload>
            }
        </div>
    }, [uploadUrl, uploading]);
    
    return <div>
        <Modal
            centered
            width={465}
            visible={visible}
            footer={null}
            closable={false}
            maskClosable={true}
            onCancel={() => onCloseModal(false)}
        >
            <div>
                <div className={cx(styled.title, 'mf-gap-bottom')}>{ t('app.collection.addBtn') }</div>
                <div>
                    <Form
                        name="collection"
                        form={form}
                        labelAlign="left"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 17 }}
                        colon={false}
                        size="large"
                        requiredMark={false}
                    >
                        <Form.Item
                            initialValue=""
                            name="collectionImageId"
                            rules={[{required: true, message: 'please choose a image'}]}
                        >
                            <CustomUpload />
                        </Form.Item>
                        {
                            collectionForm.map((item: any) => {
                                return <Form.Item
                                    initialValue=""
                                    key={item.labelName}
                                    name={item.name}
                                    rules={item.rules}
                                    validateTrigger="onBlur"
                                    label={
                                        <div className={styled.label}>
                                            <span>{ t(item.labelName) }</span>
                                            {item.required && <span className={cx('mf-gap-left-small', styled.required)}>*</span>}
                                        </div>
                                    }
                                >
                                    <Input
                                        showCount
                                        maxLength={100}
                                    />
                                </Form.Item>
                            })
                        }
                    </Form>
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
                            text="app.common.add"
                            textSize="14px"
                        ></Button>
                    </span>
                </div>
            </div>
        </Modal>
    </div>
};

export default memo(AddCollectionModal);