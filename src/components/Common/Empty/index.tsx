import { Home } from "@/components/Common/Icon";
import styled from './index.module.css';
import {useTranslation} from 'react-i18next';
import Image from 'next/image';
interface IProps {
    text: string;
};
const Empty = (props: IProps) => {
    const { text } = props;
    const { t } = useTranslation();
    return <div className={styled.wrap}>
        <Image
            src="https://cdn.sanity.io/images/oru63jca/production/1849036965928bc955c339b4db7aa6fdd6d4c6ae-1026x972.png"
            width={100}
            height={100}
        ></Image>
        {text && <div className={styled.text}>{ t(text) }</div>}
    </div>
};
export default Empty;