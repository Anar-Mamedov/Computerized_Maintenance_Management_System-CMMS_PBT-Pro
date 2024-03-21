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
    const { selectedDate } = useDate()
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const handleDownload = () => {
        const chartContainer = document.getElementById('aylik_bakim_maliyeti');
        html2pdf(chartContainer, {
            margin: 1,
            filename: 'AylikBakimMaliyetleri.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        });
    };

    const content = (
        <Space direction="vertical">
            <ChartModal chart={chart} title={`Aylık Bakım Maliyetleri (${selectedDate.aylik_bakim_maliyeti})`} />
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
        >
            <Button><EllipsisOutlined /></Button>
        </Popover>
    )
}