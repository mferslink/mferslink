import { useCallback, useEffect, useState } from 'react';
import styled from './index.module.css';
import cx from 'classnames';
import { Popover } from 'antd';
import { useTranslation } from 'react-i18next';

interface Item {
    name: string;
    value: string;
}
interface IProps {
    list: Item[];
    selectValue?: string;
    onSelected?: (value: string | number) => void;
    boxsStyle?: any;
    selectedStyle?: any;
    icon?: any;
}

const Select = (props: IProps) => {
    const {list = [], onSelected, boxsStyle, selectedStyle, icon = '', selectValue} = props;
    const [selected, setSelected] = useState<string>('');
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation();
    const onItemSelected = useCallback((info: Item) => {
        const name = (list.find(item => item.value === info.value) as Item).name;
        setSelected(name);
        setVisible(false);
        onSelected?.(info.value);
    }, []);

    
    const handleHoverChange = (visible: boolean) => {
        setVisible(visible);
    }

    useEffect(() => {
        const name = list.find(item => item.value === selectValue)?.name;
        setSelected(name || list[0].name);
    }, [selectValue]);

    const renderContent = useCallback((curSelected) => {
        return<>
            <div className={styled.dropDownPannel}>
            {
                list.map((item: Item, index) => {
                    return <div
                        key={item.value}
                        className={
                            cx(
                                styled.item,
                                curSelected === item.name ? styled.selected : '',
                                index !== list.length - 1 ? 'mf-gap-bottom-10' : ''
                            )
                        }
                        onClick={() => onItemSelected(item)}
                    >
                        { t(item.name) }
                    </div>
                })
            }
            </div>
        </>
    }, [selected]);

    return <div
        className={styled.wrap}
        style={{...boxsStyle}}
    >
        <Popover
            visible={visible}
            trigger="hover"
            placement="bottom"
            content={renderContent(selected)}
            className={styled.box}
            overlayInnerStyle={{borderRadius: '8px'}}
            onVisibleChange={handleHoverChange}
        >
            <div style={{...selectedStyle}}>
                {icon}{ t(selected) }
            </div>
        </Popover>
    </div>
};
export default Select;