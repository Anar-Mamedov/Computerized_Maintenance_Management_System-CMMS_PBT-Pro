import React, { useEffect, useState } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Table } from "antd";
import AxiosInstance from "../../../../api/http";

export default function MainTable() {
  const { watch, control, setValue } = useFormContext();
  const { fields, append, replace } = useFieldArray({
    control,
    name: "lokasyon", // Name of the field array
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    fetchEquipmentData();
  }, []);

  const fetchEquipmentData = async () => {
    try {
      const response = await AxiosInstance.get("Lokasyon?ID=30");
      if (response) {
        const formattedData = formatDataForTable(response);
        replace(formattedData); // Populate the field array
      } else {
        console.error("API response is not in expected format");
      }
    } catch (error) {
      console.error("Error in API request:", error);
    }
  };

  const formatDataForTable = (data) => {
    let nodes = {};
    let tree = [];

    // Her bir lokasyonu bir node olarak hazırlayın
    data.forEach((item) => {
      nodes[item.TB_LOKASYON_ID] = {
        ...item,
        key: item.TB_LOKASYON_ID,
        children: [],
      };
    });

    // Lokasyonlar arasındaki ilişkileri kurun
    data.forEach((item) => {
      if (item.LOK_ANA_LOKASYON_ID && nodes[item.LOK_ANA_LOKASYON_ID]) {
        // Çocuk düğümleri burada oluşturun
        nodes[item.LOK_ANA_LOKASYON_ID].children.push(nodes[item.TB_LOKASYON_ID]);
      } else {
        // Eğer üst düzey bir lokasyon ise, ağacın köküne ekleyin
        tree.push(nodes[item.TB_LOKASYON_ID]);
      }
    });

    // Çocukları olmayan düğümlerde children alanını silin
    Object.values(nodes).forEach((node) => {
      if (node.children.length === 0) {
        delete node.children;
      }
    });

    return tree;
  };

  const columns = [
    // {
    //   title: "",
    //   key: "key",
    //   dataIndex: "key",
    //   width: 150,
    //   render: (text, record) => <div style={{ marginTop: "6px" }}>{record.key}</div>,
    // },
    {
      title: "",
      key: "lokasyonBilgisi",
      render: (text, record) => <div style={{ marginTop: "6px" }}>{record.LOK_TANIM}</div>,
    },
    // Other columns...
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    // Seçilen satırın ID'sini formun bir alanına yazdır
    if (newSelectedRowKeys.length > 0) {
      setValue("selectedLokasyonId", newSelectedRowKeys[0]);
    } else {
      setValue("selectedLokasyonId", null);
    }
  };

  const rowSelection = {
    type: "radio", // Radio tipi seçim kutuları kullan
    selectedRowKeys,
    onChange: onSelectChange,
    // You can add more configuration here if needed
  };

  return (
    <div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={fields}
        pagination={false}
        scroll={{
          // x: "auto",
          y: "calc(100vh - 360px)",
        }}
      />
    </div>
  );
}
