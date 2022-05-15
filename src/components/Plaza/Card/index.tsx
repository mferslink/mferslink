import { memo, useCallback, useState } from 'react';
import CardOperate from '@/components/Common/CardOperate';
import NextImage from 'next/image';
import styled from './index.module.css';
import {Row, Col, Image} from 'antd';
import cx from 'classnames';
import { fromNow } from '@/utils/common/time';
import { useRouter } from 'next/router';
import ROUTES from '@/dicts/routesMap';
import { urlFor } from '@/services/image';
import { useStateStore } from '@/store/index';

interface IProps {
    // 组件调用方
    source: string;
    id: string;
    text: string;
    images: string[];
    createdTime: string;
    uploaderProfileImage: string;
    uploaderName: string;

    likes?: number;
    liked: boolean;
    likedId: string;
    comments?: number;
    uploaderID: string;
};
const Card = (props: IProps) => {
    const {
        text = '',
        images = [],
        uploaderProfileImage,
        uploaderName,
        createdTime,
        id,
        likes,
        liked,
        likedId,
        comments,
        uploaderID,
        source
    } = props;
    const router = useRouter();
    const { isWise } = useStateStore();

    const goDetail = useCallback(() => {
        router.push(`${ROUTES.POST_DETAIL}?id=${id}`);
    }, [id]);

    const [previewImage, setPreviewImage] = useState({
        visible: false,
        src: ''
    });

    const onImageClick = useCallback((e, url) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        setPreviewImage({
            visible: true,
            src: url
        });
    }, []);

    return (
        <>
        <div
            className={styled.wrap}>
            <div className={styled.content} onClick={() => goDetail()}>
                <div className={styled.baseInfo}>
                    <NextImage
                        src={uploaderProfileImage}
                        width={40}
                        height={40}
                        className={styled.avator}
                    />
                    <div className="mf-gap-left-middle">
                        <div className={styled.userName}>{ uploaderName }</div>
                        <div className={styled.time}>{ fromNow(createdTime) }</div>
                    </div>
                </div>
                {/* text area */}
                {
                    text
                    && <div className={
                        cx(
                            'mf-gap-top-mini',
                            source === 'detail'
                            ? 'mf-gap-bottom-mini'
                            : 'mf-line-clamp4'
                        )
                    }>
                    { text }
                    </div>
                }
                {/* image area */}
                <Row
                    gutter={[8, 8]}
                >
                    {
                        images
                        && images.length > 1
                        && images.map(imageUrl => (
                            <Col
                                key={imageUrl}
                                span={12}
                                flex={'50%'}
                            >
                                <div
                                    // preview={false}
                                    // src={`${imageUrl}?fit=crop&crop=center`}
                                    // width={'100%'}
                                    // height={'100%'}
                                    className={styled.imageGalleryItem}
                                    onClick={e => onImageClick(e, imageUrl)}
                                    style={{
                                        backgroundImage: `url(${imageUrl}?h=250)`,
                                        backgroundPosition: 'center center',
                                        minWidth: isWise ? '100%' : '100%',
                                        // height: isWise ? '100%' : '231px',
                                        paddingBottom: '100%',
                                        backgroundSize: 'cover'
                                    }}
                                />
                            </Col>
                        ))
                    }
                    {
                        images
                        && images.length === 1
                        && <Image
                                preview={false}
                                src={`${images[0]}?h=250`}
                                width={'100%'}
                                height={'auto'}
                                style={{borderRadius: '8px'}}
                                onClick={e => onImageClick(e, images[0])}
                            />
                    }
                </Row>
            </div>
            <CardOperate
                type="post"
                toId={id}
                likes={likes}
                likedId={likedId}
                liked={liked}
                uploaderId={uploaderID}
                comments={comments}
            />
        </div>
        {
            previewImage.visible
                && <Image
                    style={{ display: 'none' }}
                    preview={{
                        visible: previewImage.visible,
                        src: previewImage.src,
                        onVisibleChange: value => {
                            setPreviewImage({
                                visible: value,
                                src: previewImage.src
                            })
                        },
                    }}
                />
            }
        </>
    )
};
export default memo(Card);