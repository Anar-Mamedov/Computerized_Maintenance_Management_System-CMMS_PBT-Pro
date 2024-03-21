import { useState } from "react"
import { Button, Modal } from 'antd';
import styled from "styled-components";

const StyledButton = styled(Button)`
        border: none !important;
        box-shadow: none !important;
`;

export const ChartModal = ({ chart, title }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className="modal">
            <StyledButton type="secondary" onClick={() => setOpen(true)}>
                Büyüt
            </StyledButton>
            <Modal
                title={title}
                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width={'calc(100% - 100px)'}
                height={'calc(100vh - 120px)'}
            >
                {chart}
            </Modal>
        </div>
    )
}

