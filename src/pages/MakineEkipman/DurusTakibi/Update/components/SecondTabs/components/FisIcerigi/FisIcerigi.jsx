import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Table, Button, message } from "antd";
import { useFieldArray, useFormContext } from "react-hook-form";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
// import Malzemeler from "../../../../../../../../pages/Malzeme&DepoYonetimi/MalzemeTanimlari/Table/Table";
import MakineTablo from "../../../../../../../../utils/components/Machina/MakineTablo";
// import PlakaSelectBox from "../../../../../../../../components/PlakaSelectbox";
// Removed unused MasrafMerkeziTablo and KodIDSelectbox imports after column simplification

// Makine seçimi util bileşeni ile kontrol edilecek

function FisIcerigi({ modalOpen }) {
  const { t } = useTranslation();
  const { control, watch } = useFormContext();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { fields, append, replace } = useFieldArray({
    control,
    name: "fisIcerigi",
    shouldUnregister: true,
    shouldFocus: false,
  });

  const lokasyon = watch("lokasyon");
  const lokasyonID = watch("lokasyonID");
  // no-op effects removed for simplicity

  // Safe handleMalzemeSelect with error handling
  const handleMakineSelect = (selectedRows) => {
    try {
      const existingMakineIds = new Set((fields || []).map((item) => item.makineId));
      const newRows = selectedRows.filter((row) => !existingMakineIds.has(row.TB_MAKINE_ID || row.key));

      if (newRows.length === 0) {
        message.warning("Seçilen makineler zaten tabloda mevcut.");
        setIsModalVisible(false);
        return;
      }

      if (newRows.length < selectedRows.length) {
        message.info(`${selectedRows.length - newRows.length} makine zaten tabloda mevcut olduğu için eklenmedi.`);
      }

      newRows.forEach((row) => {
        const newRow = {
          id: Date.now() + Math.random(), // Generate unique ID
          makineId: row.TB_MAKINE_ID || row.key,
          makineKodu: row.code || row.MKN_KOD,
          makineTanimi: row.definition || row.MKN_TANIM,
          makineTipi: row.machine_type || row.MKN_TIP,
          makineLokasyon: row.location || row.MKN_LOKASYON || lokasyon || "",
          makineLokasyonID: row.machinelocationid || row.MKN_LOKASYON_ID || lokasyonID || null,
        };

        append(newRow);
      });
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error in handleMakineSelect:", error);
      message.error("Makine eklenirken bir hata oluştu.");
      setIsModalVisible(false);
    }
  };

  const handleDelete = (id) => {
    try {
      const newData = (fields || []).filter((item) => item.id !== id);
      // Sync form array
      setTimeout(() => {
        replace(newData);
      }, 0);
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const defaultColumns = [
    {
      title: t("makineKodu"),
      dataIndex: "makineKodu",
      key: "makineKodu",
      width: 150,
      ellipsis: true,
      visible: true,
    },
    {
      title: t("makineTanimi"),
      dataIndex: "makineTanimi",
      key: "makineTanimi",
      width: 220,
      ellipsis: true,
      visible: true,
    },
    {
      title: t("lokasyon"),
      dataIndex: "makineLokasyon",
      key: "makineLokasyon",
      width: 180,
      ellipsis: true,
      visible: true,
    },
    {
      title: t("makineTipi"),
      dataIndex: "makineTipi",
      key: "makineTipi",
      width: 220,
      ellipsis: true,
      visible: true,
    },
    {
      title: t("sil") || "Sil",
      key: "actions",
      width: 60,
      ellipsis: true,
      visible: true,
      render: (_, record) => <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />,
    },
  ];

  const columns = defaultColumns;

  return (
    <div style={{ marginTop: "-55px", zIndex: 10 }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Button style={{ zIndex: 21 }} type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Ekle
        </Button>
      </div>
      <Table
        size="small"
        bordered
        dataSource={fields}
        columns={columns}
        pagination={false}
        rowKey={(record) => record.id || Math.random().toString(36).substr(2, 9)}
        scroll={{ y: "calc(100vh - 540px)" }}
      />
      <MakineTablo
        controlledOpen={isModalVisible}
        onControlledOk={(rows) => {
          handleMakineSelect(rows);
          setIsModalVisible(false);
        }}
        onControlledCancel={() => setIsModalVisible(false)}
        selectionType="checkbox"
        hideHeader
        suppressFormFields
      />
    </div>
  );
}

export default FisIcerigi;
