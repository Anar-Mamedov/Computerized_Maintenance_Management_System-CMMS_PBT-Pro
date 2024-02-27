import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Tabs } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import styled from "styled-components";

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

//styled components end

export default function ProsedurTablo({ workshopSelectedId, onSubmit }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys1, setSelectedRowKeys1] = useState([]);
  const [selectedRowKeys2, setSelectedRowKeys2] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns1 = [
    {
      title: "Arıza Kodu",
      dataIndex: "IST_KOD",
      key: "IST_KOD",
      width: "70px",
      ellipsis: true,
    },
    {
      title: "Arıza Tanımı",
      dataIndex: "IST_TANIM",
      key: "IST_TANIM",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Arıza Tanımı",
      dataIndex: "IST_TIP",
      key: "IST_TIP",
      width: "150px",
      ellipsis: true,
    },
    // Diğer sütun tanımları...
  ];
  const columns2 = [
    {
      title: "Bakım Kodu",
      dataIndex: "IST_KOD",
      key: "IST_KOD",
      width: "70px",
      ellipsis: true,
    },
    {
      title: "Bakım Tanımı",
      dataIndex: "IST_TANIM",
      key: "IST_TANIM",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Bakım Tanımı",
      dataIndex: "IST_TIP",
      key: "IST_TIP",
      width: "150px",
      ellipsis: true,
    },
    // Diğer sütun tanımları...
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    // İlk tablo verilerini çeken API isteği
    AxiosInstance.get(`GetProsedur?tipId=1`)
      .then((response) => {
        const fetchedData = response.PROSEDUR_LISTE.map((item) => ({
          ...item,
          key: item.TB_IS_TANIM_ID,
        }));
        setData1(fetchedData);
      })
      .finally(() => setLoading(false));

    // İkinci tablo verilerini çeken API isteği
    AxiosInstance.get(`GetProsedur?tipId=2`)
      .then((response) => {
        const fetchedData = response.PROSEDUR_LISTE.map((item) => ({
          ...item,
          key: item.TB_IS_TANIM_ID,
        }));
        setData2(fetchedData);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      fetch();
      setSelectedRowKeys1([]);
      setSelectedRowKeys2([]);
    }
  };

  const handleModalOk = () => {
    let selectedData;
    // Assuming only one set of row keys will be selected at a time.
    if (selectedRowKeys1.length) {
      selectedData = data1.find((item) => item.key === selectedRowKeys1[0]);
    } else if (selectedRowKeys2.length) {
      selectedData = data2.find((item) => item.key === selectedRowKeys2[0]);
    }

    if (selectedData) {
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    setSelectedRowKeys1(workshopSelectedId ? [workshopSelectedId] : []);
    setSelectedRowKeys2(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  const onRowSelectChange1 = (selectedKeys) => {
    setSelectedRowKeys1(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  const onRowSelectChange2 = (selectedKeys) => {
    setSelectedRowKeys2(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  // sekmelerin içerisindeki tablo bileşenleri

  const tabItems = [
    {
      label: "Arıza",
      key: "1",
      children: (
        <div>
          <Table
            rowSelection={{
              type: "radio",
              selectedRowKeys: selectedRowKeys1,
              onChange: onRowSelectChange1,
            }}
            columns={columns1}
            dataSource={data1}
            loading={loading}
            scroll={{
              y: "calc(100vh - 360px)",
            }}
          />
        </div>
      ),
    },
    {
      label: "Bakım",
      key: "2",
      children: (
        <div>
          <Table
            rowSelection={{
              type: "radio",
              selectedRowKeys: selectedRowKeys2,
              onChange: onRowSelectChange2,
            }}
            columns={columns2}
            dataSource={data2}
            loading={loading}
            scroll={{
              y: "calc(100vh - 360px)",
            }}
          />
        </div>
      ),
    },
  ];

  // sekmelerin içerisindeki tablo bileşenleri sonu

  return (
    <div>
      <Button onClick={handleModalToggle}> + </Button>
      <Modal
        width={1200}
        centered
        title="Prosedür Listesi"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}>
        <StyledTabs defaultActiveKey="1" items={tabItems} />
      </Modal>
    </div>
  );
}
