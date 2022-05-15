import NextImage from 'next/image';
import styled from './index.module.css';
import Button from '@/components/Common/Button';
import {useState, useCallback, useEffect} from 'react';
import cx from 'classnames';
import { Emoj, Loading, UploadImg } from '@/components/Common/Icon';
import { message, Tooltip, Upload, Input, Row, Col, Image } from 'antd';
import { postImage } from "@/services/common";
import { ACTIONS, useDispatchStore, useStateStore } from '@/store/index';
import {Trash} from '@/components/Common/Icon'
import useDebounce from '@/utils/hooks/useDebounce';
import LoadingAnimation from '@/components/Common/LoadingAnimation';
import EmojPicker from '@/components/Common/EmojPicker';
import { useTranslation } from 'react-i18next'

interface ImageInfoType {
    url: string;
    id: string;
};

interface IProps {
    onPostComment: (paras: any) => void;
    multiplePic?: boolean;
    maxPiclLen?: number;
    btnLoading?: boolean;
    placeholder?: string;
};

const { TextArea } = Input;

const CommentInput = (props: IProps) => {
    const {
        onPostComment,
        btnLoading = false,
        multiplePic = false,
        maxPiclLen = 1,
        placeholder = 'app.common.commentInput.placeholder'
    } = props;
    const [curTextNum, setCurTextNum] = useState<number>(0);
    const [isDiabledBtn, setIsDiabledBtn] = useState(true);
    const { userInfo, walletAddress } = useStateStore();
    const dispatch = useDispatchStore();
    const [uploading, setUploading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [imageInfo, setImageInfo] = useState<ImageInfoType[]>([]);
    const { t } = useTranslation();

    const onCommentPost = useDebounce((inputValue: string) => {
        if (walletAddress) {
            if (!inputValue && !imageInfo.length) {
                message.error('comment is not allowd empty!');
                return;
            };
            if (btnLoading) {
                return;
            }

            onPostComment({
                content: inputValue,
                resourceContent: multiplePic ? imageInfo.map(image => image.id) : imageInfo[0]?.id || ''
            })

        } else {
            dispatch?.({
                type: ACTIONS.SET_SHOW_LOGIN_MODAL,
                payload: true
            });
        }
    }, 1000, [walletAddress, imageInfo]);

    useEffect(() => {
        if(!btnLoading) {
            setInputValue('');
            setImageInfo([]);
            setIsDiabledBtn(true);
        }
    }, [btnLoading]);

    useEffect(() => {
        if (inputValue.length || (imageInfo.length > 0)) {
            setIsDiabledBtn(false);
        } else {
            setIsDiabledBtn(true);
        }
    }, [inputValue, imageInfo]);

    const onInputChange = useCallback((e: any) => {
        setInputValue(e.target.value);
        setCurTextNum(e.target.value.length || 0);
    }, []);

    const onEmojSelect = useCallback((emoj: any) => {
        setInputValue(inputValue => inputValue + emoj.native);
    }, [inputValue]);

    const onBeforeUpload = useCallback(async (file: File) => {
        if (imageInfo.length >= maxPiclLen) {
            message.error('exceed max pic length');
            return Upload.LIST_IGNORE;
        }
        setUploading(true);
        const {url, id} = await postImage(file);
        setImageInfo(imageInfo => [...imageInfo, {url, id}]);
        setUploading(false);
        return Upload.LIST_IGNORE;
    }, [uploading]);

    const onImageRemove = useCallback((id) => {
        const __imageInfo = imageInfo.filter(image => image.id !== id);
        setImageInfo(__imageInfo);
    }, [imageInfo]);

    return <div className={styled.wrap}>
        {
            userInfo
            && userInfo.profileImage
            && <div
                style={{flexShrink: 0}}
            >
                <Image
                    preview={false}
                    src={userInfo.profileImage || ''}
                    width={48}
                    height={48}
                    className={styled.avator}
                    style={{flexShrink: 0}}
                ></Image>
            </div>
        }
        <div className={cx('mf-gap-left-small', styled.content)}>
            <div style={{marginTop: '8px'}}>
                <TextArea
                    autoSize
                    bordered={false}
                    value={inputValue}
                    placeholder={t(placeholder)}
                    onChange={onInputChange}
                    maxLength={200}
                    // className={styled.input}
                ></TextArea>
                <Row
                    gutter={[6, 8]}
                >
                    {
                        imageInfo
                        && imageInfo.length > 0
                        && imageInfo.map(image => (
                            <Col
                                key={image.id}
                                className={styled.uploadPreview}
                                span={12}
                            >
                                <NextImage
                                    src={image.url || ''}
                                    width={138}
                                    height={138}
                                >
                                </NextImage>
                                <div
                                    className={styled.removeImage}
                                    onClick={() => onImageRemove(image.id)}
                                >
                                    <span className={styled.removeTrash}>
                                        <Trash
                                            width={30}
                                            height={30}
                                            fill="#fff"
                                        />
                                    </span>
                                </div>
                            </Col>
                        ))
                    }
                </Row>
            </div>
            <div className={styled.op}>
                <div className={styled.media}>
                    <Tooltip
                        title={`add picture (${maxPiclLen} picture only)`}
                    >
                        <Upload
                            beforeUpload={onBeforeUpload}
                            maxCount={1}
                            accept=".jpg,.jpeg,.png,.gif"
                        >
                            {   uploading ? <LoadingAnimation width={24} height={24} color="#333"/>
                                : <UploadImg style={{cursor: 'pointer'}}/>
                            }
                        </Upload>
                    </Tooltip>
                    <div className={cx(styled.emoj, 'mf-gap-left-middle')}>
                        <Emoj/>
                        <div className={styled.emojPannel}>
                            <EmojPicker
                                theme="auto"
                                set="native"
                                navPosition="bottom"
                                previewPosition="none"
                                autoFocus={true}
                                onEmojiSelect={onEmojSelect}
                            />
                        </div>
                    </div>
                </div>
               
                <div className={styled.post}>
                    <span className={styled.textNum}>{curTextNum} / 200</span>
                    <span
                        className="mf-gap-left-small"
                        onClick={() => onCommentPost(inputValue)}
                    >
                        <Button
                            text={btnLoading ? 'app.common.posting' : 'app.common.post'}
                            color={!isDiabledBtn ? '#3CB9FF' : '#E0E0E0'}
                            textColor={!isDiabledBtn ? '#fff' : 'rgba(0,0,0,0.40)'}
                            textSize={'12px'}
                        ></Button>
                    </span>
                </div>
            </div>
        </div>
    </div>
};
export default CommentInput;