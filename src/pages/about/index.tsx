import { memo } from "react";
import styled from './index.module.css';
import { teamMember, qa, contributorMember } from "@/dicts/about";
import IntroductPannel from "@/components/Common/InroductPannel";
import { Row, Col, Collapse } from "antd";
import { useTranslation } from "react-i18next";

const About = () => {

    const { t } = useTranslation();

    return <div
        className={styled.wrap}
    >
        <h2>{t('app.about.team.title')}</h2>
        <Row gutter={12}>
        {
            teamMember
            && teamMember.length
            &&  teamMember.map((item: any) => 
                (
                    <Col key={item.name} lg={8} xs={12} className="mf-gap-bottom">
                        <IntroductPannel
                            key={item.name}
                            avator={item.avator}
                            name={item.name}
                            role={item.role}
                            twitter={item.twitter}
                        ></IntroductPannel>
                    </Col>
                )
            )
        }
        </Row>
        <h2>{t('app.about.contributor.title')}</h2>
        <Row gutter={12}>
        {
            contributorMember
            && contributorMember.length
            &&  contributorMember.map((item: any) => 
                (
                    <Col key={item.name} lg={8} xs={12} className="mf-gap-bottom">
                        <IntroductPannel
                            avator={item.avator}
                            name={item.name}
                            role={item.role}
                            twitter={item.twitter}
                        ></IntroductPannel>
                    </Col>
                )
            )
        }
        </Row>
        <h2>{t('app.about.intro.title')}</h2>
        <div>
            <Collapse
                accordion
                bordered={false}
                defaultActiveKey={['0']}
                expandIconPosition='right'
                style={{borderRadius: '8px'}}
            >
                {
                    qa.map((item, index) => (
                        <Collapse.Panel
                            header={<div className={styled.pannelHeader}>{ t(item.q) }</div>}
                            key={index}
                        >
                            <p className={styled.pannelContent}>{ t(item.a) }</p>
                        </Collapse.Panel>
                    ))
                }
            </Collapse>
        </div>
    </div>
};
export default memo(About);