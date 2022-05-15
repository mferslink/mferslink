import { useCallback, useEffect, useMemo, useState, memo } from "react";
import * as React from 'react';
import { Form, Input, message, Modal, Upload } from "antd";
import styled from './index.module.css';
import Button from '@/components/Common/Button';
import cx from 'classnames';
import { postImage } from "@/services/common";
import { postMeme } from '@/services/meme';
import { useStateStore } from '@/store/index';
import { UploadImgBig } from '@/components/Common/Icon/index';
import NextImage from 'next/image';
import {Trash, AddBtnCircle} from '@/components/Common/Icon'
import {useTranslation} from 'react-i18next'
import useDebounce from '@/utils/hooks/useDebounce';
import LoadingAnimation from '@/components/Common/LoadingAnimation';

interface Iprops {
    visible: boolean;
    onCloseModal: (postStatus: boolean) => void;
};

interface UploadProps {
    value?: string;
    onChange?: (value: string) => void;
}

const AddMemeModal = (props: Iprops) => {
    const {visible, onCloseModal} = props;
    
    const [form] = Form.useForm();
    const { walletAddress } = useStateStore();
    const { t } = useTranslation();
    const [uploading, setUploading] = useState(false);
    const [uploadUrl, setUploadUrl] = useState<string>('');

    const onModalConfirm = useDebounce(() => {
        form.validateFields().then(async (val) => {
            try {
                const params = Object.assign(val, {uploaderID: walletAddress});
                await postMeme(params as any);
                onCloseModal(true);
                message.success(t('app.common.post.success'));
            } catch (error) {
                message.error('post meme fail!');
            }
        }).catch(() => {
            message.error('post meme fail!');
        });
        
    }, 1000, [walletAddress]);

    const CustomUpload: React.FC<UploadProps> = useCallback(({value, onChange}) => {
        const onBeforeUpload = async (file: File) => {
            setUploading(true);
            const {url, id} = await postImage(file);
            // console.log(url);
            // console.log(id);
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
                            <span>{ t('app.meme.form.meme') }</span>
                            <span className={cx('mf-gap-left-small', styled.required)}>*</span>
                        </p>
                        <p className={styled.uploadTextDesc}>{
                            t('app.meme.form.uploadTip')
                        }</p>
                    </div>
                </div>
            </Upload>
            }
        </div>
    }, [uploading, uploadUrl]);

    const CustomTagInput = (
        {value, onChange, curIndex, remove, name} : {
            value?: string;
            onChange?: (val: string) => void;
            curIndex: number;
            remove: any,
            name: number;
        }
    ) => {
        const onTextChange = (e: any) => {
            onChange?.(e?.target?.value || '');
        }
        return <>
            <div className={
                cx(styled.tagItem, curIndex === 0 ? '' : 'mf-gap-left-small')
            }>

                <span className={styled.no}>#</span>
                <Input
                    bordered={false}
                    value={value}
                    disabled={curIndex < 2}
                    className={styled.input}
                    onChange={onTextChange}
                />
                {
                    curIndex > 1
                    && <span onClick={() => remove(name)} className={styled.closeIcon}>x</span>
                }    
            </div>
        </>
    }
    
    return <div>
        <Modal
            centered
            width={465}
            visible={visible}
            footer={null}
            closable={false}
            maskClosable
            onCancel={() => onCloseModal(false)}
        >
            <div>
                <div className={cx(styled.title, 'mf-gap-bottom')}>{ t('app.meme.form.meme') }</div>
                <div>
                    <Form
                        form={form}
                        labelAlign="left"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 17 }}
                        colon={false}
                        size="large"
                        name="meme"
                        requiredMark={false}
                    >
                        <Form.Item
                            name="memeImageId"
                            initialValue=""
                            rules={[{required: true, message: 'Please choose a meme'}]}
                        >
                            <CustomUpload />
                        </Form.Item>
                        <Form.Item
                            key="description"
                            name="description"
                            rules={[{required: true, message: `Please input description!` }]}
                            label={
                                <div className={styled.label}>
                                   <span>{ t('app.meme.form.desc') }</span>
                                   <span className={cx('mf-gap-left-small', styled.required)}>*</span>
                                </div>
                            }
                        >
                            <Input.TextArea
                                autoSize={
                                    {
                                        minRows: 1,
                                        maxRows: 4
                                    }
                                }
                                showCount
                                maxLength={100}
                            />
                        </Form.Item>
                        <Form.Item
                            name="tags"
                            initialValue={['mfers', 'mfers.link']}
                            label={
                                <div className={styled.label}>
                                   <span>{ t('app.meme.form.tags') }</span>
                                </div>
                            }
                        >
                            <Form.List
                                name="tags"
                            >
                                {
                                    (fields, {add, remove}) => {
                                        return <div className={styled.tagListWrap}>
                                            {
                                                fields.map((field, index) => (
                                                    <Form.Item
                                                        {...field}
                                                        key={field.name}
                                                    >
                                                        <CustomTagInput
                                                            curIndex={index}
                                                            name={field.name}
                                                            remove={remove}
                                                        />
                                                    </Form.Item>
                                                ))
                                            }
                                            <Form.Item>
                                                <AddBtnCircle
                                                    onClick={() => add('')}
                                                    className="mf-gap-left-small"
                                                    style={{cursor: 'pointer'}}
                                                ></AddBtnCircle>
                                            </Form.Item>
                                        </div>
                                    }
                                }
                            </Form.List>
                        </Form.Item>
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
                            text="app.meme.addBtn"
                            textSize="14px"
                        ></Button>
                    </span>
                </div>
            </div>
        </Modal>
    </div>
};

export default memo(AddMemeModal);