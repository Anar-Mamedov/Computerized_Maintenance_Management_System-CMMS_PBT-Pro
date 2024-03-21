import { useState } from 'react';
import { Button, Popover, Space } from 'antd';
import { EllipsisOutlined } from "@ant-design/icons"
import YearDatePicker from "./YearDateComp";
import MonthDatePicker from "./MonthDateComp";
import styled from "styled-components";
import DayDatePicker from './DayDateComp';
import { ChartModal } from '../../components/Modal';

const StyledButton = styled(Button)`
        border: none !important;
        box-shadow: none !important;
`;

const contentDate = (
    <>
        <DayDatePicker />
        <MonthDatePicker />
        <YearDatePicker />
    </>
)

export const Ayarlar = ({ chart }) => {
    const [open, setOpen] = useState(false)
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const content = (
        <Space direction="vertical">
            <ChartModal chart={chart} title={'Toplam Harcanan İş Gücü'}/>
            <Popover placement="leftTop" content={contentDate} style={{ border: 0 }}>
                <StyledButton>Zamana göre seç</StyledButton>
            </Popover>
        </Space>
    )

    return (
        <Popover
            placement="bottom"
            content={content}
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
            zIndex={9999}
        >
            <Button><EllipsisOutlined /></Button>
        </Popover>
    )
}