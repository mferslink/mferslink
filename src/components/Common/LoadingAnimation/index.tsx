import { memo } from 'react';
import {Loading} from '@/components/Common/Icon/index';
import styled from './index.module.css';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}
const LoadingAnimation = (props: IProps) => {
    const {
        width,
        height,
        color
    } = props;
    return <span className={styled.wrap}>
        <Loading
            width={width}
            height={height}
            fill={color}
        />
    </span>
};
export default memo(LoadingAnimation);