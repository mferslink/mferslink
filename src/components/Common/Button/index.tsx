import { useTranslation } from 'react-i18next';
import styled from './index.module.css';
import { HTMLAttributes } from 'react';
type IProps = {
    color?: string;
    textColor?: string;
    textSize?: string;
    text: string;
    onClick?: (e: Event) => void;
} & HTMLAttributes<HTMLElement>;

const Button = (props: IProps) => {
    const {onClick, color = '#3CB9FF', text, textColor, textSize} = props;
    const {t} = useTranslation();

    return (<>
        <div
            className={styled.wrap}
            style={{backgroundColor: color}}
            onClick={onClick}
        >
            <span style={{
                color: textColor,
                fontSize: textSize
            }}>{ t(text) }</span>
        </div>
    </>)
};
export default Button;