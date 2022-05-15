import styled from './index.module.css';
import cx from 'classnames';
import { DownLoad, Loading } from '@/components/Common/Icon/index';
import CardOperateSimple from '@/components/Common/CardOperateSimple';
import { useCallback, useState } from 'react';
import { useStateStore } from '@/store/index';
import LoadingAnimation from '@/components/Common/LoadingAnimation';

interface IProps {
    content: string;
    uploaderName: string;
    uploaderID: string;
    description: string;
    tags?: string[];
    likes?: number;
    twitter?: string;
    id: string;
    liked: boolean;
    likedId?: string;
};

const BaseInfoCard = (props: IProps) => {
    const {
        content,
        uploaderName,
        uploaderID,
        description,
        tags,
        likes,
        liked,
        twitter,
        id,
        likedId
    } = props;
    const { isWise } = useStateStore();
    const [downLoading, setDownLoading] = useState(false);

    const downLoad = useCallback(() => {
        setDownLoading(true);
        let xhr = new XMLHttpRequest()
        xhr.open('get', content, true)
        xhr.responseType = 'blob'
        xhr.onload = function(){
            let url = URL.createObjectURL(xhr.response);
            let a = document.createElement('a');
            let event = new MouseEvent('click');
            a.href = url;
            a.download = 'memes';
            a.dispatchEvent(event);
            URL.revokeObjectURL(url);
            setDownLoading(false);
        }
        xhr.send()
    }, [content]);

    return <div>
        <div className={styled.imgBox}>
            {
                content
                && <img
                    src={`${content}?q=50`}
                    width={isWise ? '100%' : 360}
                    height="auto"
                    style={{borderRadius: isWise ? '8px 8px 0 0' : ''}}
                />
            }
            <div className={styled.download} onClick={downLoad}>
                {
                    downLoading
                    ? <LoadingAnimation width={24} height={24} color="#fff"/>
                    : <DownLoad width={30} height={30} fill="#fff" />
                }
            </div>
        </div>
        <div className={styled.content}>
            <div className={styled.title}>{ description }</div>
            <div className={styled.tagBox}>
                {
                    tags?.map((tag, idx) => {
                        return <div
                                key={tag}
                                className={cx(styled.tagItem, idx ? 'mf-gap-left-small' : '')}
                            >
                            <span className={styled.no}>#</span>
                            <span className="mf-gap-left-mini">{ tag }</span>
                        </div>
                    })
                }
            </div>
            <div className={styled.addBy}>add by <span className={styled.userName}>@{ uploaderName }</span></div>
        </div>
        <div>
            <CardOperateSimple
                type="meme"
                likes={likes}
                likedId={likedId}
                liked={liked}
                twitter={twitter}
                toId={id}
                uploaderId={uploaderID}
            />
        </div>
    </div>
};
export default BaseInfoCard;
