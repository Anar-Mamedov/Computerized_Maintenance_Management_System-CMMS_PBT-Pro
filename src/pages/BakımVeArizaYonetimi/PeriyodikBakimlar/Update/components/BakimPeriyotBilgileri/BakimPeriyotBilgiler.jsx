import {
    Typography,
    Tabs
} from "antd";
import styled from "styled-components";

const { Text } = Typography;

const onChange = (key) => {
    // console.log(key);
};

//styled components
const StyledTabs = styled(Tabs)`
    .ant-tabs-tab {
      margin: 0 !important;
      width: fit-content;
      padding: 10px 15px;
      justify-content: center;
      background-color: rgba(230, 230, 230, 0.3);
    }
  
    .ant-tabs-tab-active {
      background-color: #2bc77135;
    }
  
    .ant-tabs-nav .ant-tabs-tab-active .ant-tabs-tab-btn {
      color: rgba(0, 0, 0, 0.88) !important;
    }
  
    .ant-tabs-tab:hover .ant-tabs-tab-btn {
      color: rgba(0, 0, 0, 0.88) !important;
    }
  
    .ant-tabs-tab:not(:first-child) {
      border-left: 1px solid #80808024;
    }
  
    .ant-tabs-ink-bar {
      background: #2bc770;
    }
  `;

export default function BakimPeriyotBilgiler() {
    const items = [
        {
            key: "1",
            label: "Tarih 've ya' sayaç bazlı bakım",
            // children: <KontrolListesiTablo />,
        },
        {
            key: "2",
            label: "Tarih 've' sayaç bazlı bakım",
            // children: <Tablo />,
        },
    ];

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                marginBottom: "15px",
                gap: "20px",
                rowGap: "10px",
            }}>
            <div
                style={{
                    display: "flex",
                    marginBottom: "15px",
                    flexDirection: "column",
                    gap: "10px",
                    width: "100%",
                    maxWidth: "50%",
                }}>
                <div style={{ borderBottom: "1px solid #e8e8e8", marginBottom: "5px", paddingBottom: "5px", width: "100%" }}>
                    <Text style={{ fontSize: "14px", fontWeight: "500", color: "#0062ff" }}>Periyot Bilgileri</Text>
                </div>
                <StyledTabs defaultActiveKey="1" items={items} onChange={onChange} />
            </div>
            <div
                style={{
                    display: "flex",
                    marginBottom: "15px",
                    flexDirection: "column",
                    gap: "10px",
                    width: "100%",
                    maxWidth: "50%",
                }}>
                <div style={{ borderBottom: "1px solid #e8e8e8", marginBottom: "5px", paddingBottom: "5px", width: "100%" }}>
                    <Text style={{ fontSize: "14px", fontWeight: "500", color: "#0062ff" }}>Başlangıç ve Bitiş</Text>
                </div>
            </div>
        </div>
    )
}
