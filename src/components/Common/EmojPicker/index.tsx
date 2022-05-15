import { MutableRefObject, useEffect, useRef } from 'react';
import data from '@emoji-mart/data'
const EmojPicker = (props: any) => {
    const ref: MutableRefObject<any> = useRef()
    useEffect(() => {
        import('emoji-mart').then((EmojiMart) => {
            new EmojiMart.Picker({ ...props, data, ref })
        });
    }, []);

    return <>
        <div ref={ref}></div>
    </>
};
export default EmojPicker;