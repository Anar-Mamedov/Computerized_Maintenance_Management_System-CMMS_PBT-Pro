import { useState } from 'react';
import { Button, Popover, Space } from 'antd';
import { EllipsisOutlined } from "@ant-design/icons"
import styled from "styled-components";
import { ChartModal } from './Modal';

const StyledButton = styled(Button)`
        border: none !important;
        box-shadow: none !important;
`;

export const Ayarlar = ({ chart, title }) => {
    const [open, setOpen] = useState(false)
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const content = (
        <Space direction="vertical">
            <ChartModal chart={chart} title={title}/>
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