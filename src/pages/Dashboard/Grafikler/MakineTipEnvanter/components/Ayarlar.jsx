import { useState } from 'react';
import { Button, Popover, Space } from 'antd';
import { EllipsisOutlined } from "@ant-design/icons"
import styled from "styled-components";
import { ChartModal } from '../../components/Modal';
import html2pdf from 'html2pdf.js';

const StyledButton = styled(Button)`
        border: none !important;
        box-shadow: none !important;
`;

export const Ayarlar = ({ chart }) => {
    const [open, setOpen] = useState(false)
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const handleDownload = () => {
        const chartContainer = document.getElementById('makine_tip_dagilim');
        html2pdf(chartContainer, {
            margin: 1,
            filename: 'MakineTiplerineGoreEnvanterDagilimi.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 1 },
            jsPDF: { unit: 'in', format: 'A4', orientation: 'landscape' }
        });
    };

    const content = (
        <Space direction="vertical">
            <ChartModal chart={chart} title={'Makine Tiplerine Göre Envanter Dağılımı'} />
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