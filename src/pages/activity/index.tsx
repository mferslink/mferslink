import styled from './index.module.css';
import { TwiterFill } from '@/components/Common/Icon';

const Activity = () => {
    return <div className={styled.wrap}>
        {/* <Logo></Logo> */}
        <div className={styled.title}>coming soon...</div>
        <div
            className={styled.twiter}
            onClick={() => window.open('https://twitter.com/MfersLink')}
        >
            <TwiterFill
                width={40}
                height={40}
                fill="#3CB9FF"
            ></TwiterFill>
        </div>
    </div>
};
export default Activity;