import Capsule from "../Capsule";
import { AddBtn, AddBtnRadius } from "../Icon/index";
import styled from './index.module.css';
import {HTMLAttributes} from 'react';
type IProps = {
    title: string;
    intro?: string;
    total: number;
    needAddBtn?: boolean;
    select?: any[];
    needSelect?: boolean;
    add?: () => void;
    className?: string;
    selectValue?: string;
    onSelected?: (value: string | number) => void;
} & HTMLAttributes<HTMLElement>;

import { useTranslation } from 'react-i18next';
import Select from "../Select";
import { SortTypeList } from '@/dicts/common'
const Title = (props: IProps) => {
    const {
        title,
        intro,
        total,
        select,
        needAddBtn = true,
        needSelect = false,
        selectValue,
        add,
        className = '',
        onSelected
    } = props;
    
    const {t} = useTranslation();
    return <div className={className}>
        <div className={styled.wrap}>
            <div className={styled.detail}>
                <div className={styled.base}>
                    <span className={styled.title}>{ t(title) }</span>
                    {   total > 0
                        && <span className="mf-gap-left-14">
                            {
                            total && <Capsule num={total} color="rgba(255,255,255,0.12)" />
                            }
                        </span>
                    }
                    {   needAddBtn
                        && <AddBtnRadius
                            className="mf-gap-left-14"
                            style={{cursor: 'pointer'}}
                            width={34}
                            height={34}
                            onClick={add}
                            />
                    }
                </div>
                {
                    needSelect
                    && <Select
                         selectValue={selectValue}
                         list={select && select.length > 0 ? select : SortTypeList}
                         onSelected={onSelected}
                        ></Select>
                }
            </div>
            {
                intro
                && intro.length
                && <div className={styled.intro}>
                    {t(intro)}
                </div>
            }
        </div>
    </div>
};
export default Title;