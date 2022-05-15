import { memo, useState } from 'react';
import { Form, Input, message, Modal, Upload } from "antd";
import styled from './index.module.css';
import Button from '@/components/Common/Button';
import cx from 'classnames';
import { postPost } from '@/services/post';
import { useStateStore } from '@/store/index';
import { useTranslation } from 'react-i18next';
import useDebounce from '@/utils/hooks/useDebounce';
import CommentInput from '@/components/Common/CommentInput';

interface Iprops {
    visible: boolean;
    onCloseModal: (postStatus: boolean) => void;
};

const AddPostModal = (props: Iprops) => {
    const {visible, onCloseModal} = props;
    const { walletAddress } = useStateStore();
    const { t } = useTranslation();
    const [btnLoading, setBtnLoading] = useState(false);

    const onPostposts = useDebounce(async (post) => {
        try {
            setBtnLoading(true);
            await postPost({
                text: post.content || '',
                imageIDs: post.resourceContent || [],
                uploaderID: walletAddress
            });
            setBtnLoading(false);
            onCloseModal(true);
            message.success(t('app.common.post.success'));
        } catch (error) {
            setBtnLoading(false);
            message.error('post error');
        }
    }, 1000, [walletAddress]);
    
    return <div>
        <Modal
            centered
            width={465}
            visible={visible}
            footer={null}
            closable={true}
            maskClosable
            onCancel={() => onCloseModal(false)}
        >
            <div>
                <div>
                    <CommentInput
                        placeholder="add a post"
                        btnLoading={btnLoading}
                        multiplePic
                        maxPiclLen={4}
                        onPostComment={onPostposts}
                    />
                </div>
            </div>
        </Modal>
    </div>
};

export default memo(AddPostModal);