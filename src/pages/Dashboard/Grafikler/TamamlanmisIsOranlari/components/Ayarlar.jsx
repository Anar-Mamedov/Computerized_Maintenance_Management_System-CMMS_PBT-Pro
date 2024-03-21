import { useState } from 'react';
import { Button, Popover, Space } from 'antd';
import { EllipsisOutlined } from "@ant-design/icons"
import YearDatePicker from "./YearDateComp";
import MonthDatePicker from "./MonthDateComp";
import styled from "styled-components";
import DayDatePicker from './DayDateComp';
import { ChartModal } from '../../components/Modal';
import html2pdf from 'html2pdf.js';
import { useDate } from '../../../../DateContext';

const StyledButton = styled(Button)`
        border: none !important;
        box-shadow: none !important;
`;

const contentDate = (
    <>
        {/* <DayDatePicker /> */}
        {/* <MonthDatePicker /> */}
        <YearDatePicker />
    </>
)

export const Ayarlar = ({ chart }) => {
    const [open, setOpen] = useState(false)
    const { selectedDate } = useDate();

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const handleDownload = () => {
        const chartContainer = document.getElementById('tamamlanmis_oranlar');
        html2pdf(chartContainer, {
            margin: 1,
            filename: 'TamamlanmısIsTalepleriVeIsEmirleriOranları.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        });
    };

    const content = (
        <Space direction="vertical">
            <ChartModal chart={chart} title={`Tamamlanmış İş talepleri ve İş Emirleri Oranları (${selectedDate.tamamlanmis_oranlar_zaman})`} />
            {/* <Popover placement="rightTop" content={contentDate} style={{ border: 0 }}>
                <StyledButton>Zamana göre seç</StyledButton>
            </Popover> */}
            <YearDatePicker />
            <StyledButton onClick={handleDownload}>İndir</StyledButton>
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