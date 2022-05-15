import { Opensea, DiscordFill, TwiterFill } from "@/components/Common/Icon";
import { useCallback, useEffect, useState } from "react";
import styled from './index.module.css';

interface IProps {
    twitter?: string;
    opensea?: string;
    discord?: string;
};
const Platform = (props: IProps) => {
    const {
        twitter = '',
        opensea = '',
        discord = ''
    } = props;

    const goUrl = useCallback((e, url: string) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        if (url) {
            window.open(url);
        }
    }, []);

    return <div className={styled.platform}>
        {
            twitter
            && <TwiterFill
                width={24}
                height={22}
                onClick={(e) => goUrl(e, twitter)}
            />
        }
        {
            opensea
            && <Opensea
                className={twitter ? 'mf-gap-left' : ''}
                width={24}
                height={22}
                onClick={(e) => goUrl(e, opensea)}
            />
        }
        {
            discord
            && <DiscordFill
                className={opensea ? 'mf-gap-left' : ''}
                width={24}
                height={22}
                onClick={(e) => goUrl(e, discord)}
            />
        }
    </div>
};
export default Platform;