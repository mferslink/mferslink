import { useEffect, useState } from 'react';
import {getScrollTop, getWindowHeight, getScrollHeight} from '@/utils/common/dom';

// 判断是否滚动到底部
export const useBottom = () => {
    const [isBottom, setIsBottom] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);

    const onScrollHandle = () => {
        const scrollTop = getScrollTop();
        const windowHeight = getWindowHeight();
        const scrollHeight = getScrollHeight();
        setScrollTop(scrollTop);
        setIsBottom(scrollTop + windowHeight + 50 >= scrollHeight);
    };

    useEffect(
        () => {
            window.addEventListener('scroll', onScrollHandle);

            return () => {
                window.removeEventListener('scroll', onScrollHandle);
            };
        },
        []
    );

    return {
        isBottom,
        scrollTop
    };
};