import * as React from 'react';
import { memo } from 'react';
import { Form, Input, message, Modal, Upload } from "antd";
import styled from './index.module.css';
import Button from '@/components/Common/Button';
import cx from 'classnames';
import { postArticle } from '@/services/article';
import { useStateStore } from '@/store/index';
import { useTranslation } from 'react-i18next';
import useDebounce from '@/utils/hooks/useDebounce';
import { articleForm } from '@/dicts/form';

interface Iprops {
    visible: boolean;
    onCloseModal: (postStatus: boolean) => void;
};

interface UploadProps {
    value?: string;
    onChange?: (value: string) => void;
}

const AddArticleModal = (props: Iprops) => {
    const {visible, onCloseModal} = props;
    
    const [form] = Form.useForm();
    const { walletAddress } = useStateStore();
    const { t } = useTranslation();

    const onModalConfirm = useDebounce(() => {
        form.validateFields()
        .then(async () => {
            try {
                const params = Object.assign(form.getFieldsValue(), {uploaderID: walletAddress});
                await postArticle(params);
                onCloseModal(true);
                message.success('post article success');
            } catch (error) {
                message.error('post article fail!');
            }
        }).catch(() => {
            message.error('post article fail!');
        });
    }, 1000, [walletAddress]);
    
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
                <div className={cx(styled.title, 'mf-gap-bottom')}>{ t('app.article.modal.title') }</div>
                <div>
                    <Form
                        name="article"
                        form={form}
                        labelAlign="left"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 17 }}
                        colon={false}
                        size="large"
                        requiredMark={false}
                    >
                        {
                            articleForm.map((item: any) => {
                                return <Form.Item
                                    key={item.labelName}
                                    name={item.name}
                                    rules={item.rules}
                                    initialValue=""
                                    validateTrigger="onBlur"
                                    label={
                                        <div className={styled.label}>
                                            <span>{ t(item.labelName) }</span>
                                            {item.required && <span className={cx('mf-gap-left-small', styled.required)}>*</span>}
                                        </div>
                                    }
                                >
                                    {
                                    item.name === 'url'
                                    ? <Input
                                        showCount
                                        maxLength={100}
                                    />
                                    : <Input.TextArea
                                        autoSize={
                                            {
                                                minRows: 1,
                                                maxRows: 4
                                            }
                                        }
                                        showCount
                                        maxLength={100}
                                    />}
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

export default memo(AddArticleModal);