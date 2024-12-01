import React, { useEffect, useState, useCallback } from "react";
import { Table, Tag, message } from "antd";
import AxiosInstance from "../../../../../../api/http";
import { LockOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { t } from "i18next";
import EditModal from "./Update/EditModal";

function OtomatikKodlarTablosu({ setLoading }) {
  const [data, setData] = useState([]);
  // edit drawer için
  const [drawer, setDrawer] = useState({
    visible: false,
    data: null,
  });
  // edit drawer için son

  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get("Numbering/GetModulesCodes");
      const items = response.data.map((item) => ({
        ...item,
        key: item.tbNumaratorId,
      }));
      setData(items);
    } catch (error) {
      message.error(t("hataMesaji"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handler for opening the EditModal with the selected row's data
  const handleRowClick = (record) => {
    setDrawer({
      visible: true,
      data: record,
    });
  };

  const columns = [
    {
      title: t("tanim"),
      dataIndex: "tanim",
      key: "tanim",
      width: "150px",
      ellipsis: true,
      render: (text, record) => <a onClick={() => handleRowClick(record)}>{text}</a>,
    },
    {
      title: (
        <div>
          <LockOutlined />
        </div>
      ),
      dataIndex: "alaniKilitle",
      key: "alaniKilitle",
      width: "50px",
      ellipsis: true,
      render: (alaniKilitle) => (alaniKilitle ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />),
    },
    {
      title: (
        <div>
          <CheckOutlined style={{ color: "green" }} />
        </div>
      ),
      dataIndex: "aktif",
      key: "aktif",
      width: "50px",
      ellipsis: true,
      render: (aktif) => (aktif ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />),
    },
    {
      title: t("onEk"),
      dataIndex: "onEk",
      key: "onEk",
      width: "100px",
      ellipsis: true,
    },
    {
      title: t("no"),
      dataIndex: "numara",
      key: "numara",
      width: "100px",
      ellipsis: true,
    },
    {
      title: t("haneSayisi"),
      dataIndex: "haneSayisi",
      key: "haneSayisi",
      width: "100px",
      ellipsis: true,
    },
  ];

  const refreshTableData = useCallback(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Table columns={columns} dataSource={data} scroll={{ x: "max-content" }} />
      <EditModal selectedRow={drawer.data} onDrawerClose={() => setDrawer({ ...drawer, visible: false })} drawerVisible={drawer.visible} onRefresh={refreshTableData} />
    </div>
  );
}

export default OtomatikKodlarTablosu;
