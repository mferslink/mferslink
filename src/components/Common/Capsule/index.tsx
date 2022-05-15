interface IProps {
    color?: string;
    num: number;
}
import cx from 'classnames';
import styled from './index.module.css';
const Capsule = (props: IProps) => {
    return <>
        <div
            className={
                cx(styled.wrap)
            }
            style={{backgroundColor: props.color || '#FF5085'}}
        >
            <span>{ props.num }</span>
        </div>
    </>
};
export default Capsule;