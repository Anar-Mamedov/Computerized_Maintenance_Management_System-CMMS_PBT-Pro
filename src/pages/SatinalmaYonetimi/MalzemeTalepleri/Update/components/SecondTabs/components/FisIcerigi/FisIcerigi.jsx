import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { Table, Button, Form as AntForm, Input, InputNumber, Popconfirm, Modal, Typography, message, Radio, Select } from "antd";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { PlusOutlined } from "@ant-design/icons";
import { t } from "i18next";
import Malzemeler from "../../../../../../../Malzeme&DepoYonetimi/MalzemeTanimlari/Table/Table";
// import PlakaSelectBox from "../../../../../../../../components/PlakaSelectbox";
import LokasyonTablo from "../../../../../../../../utils/components/LokasyonTablo";
import MasrafMerkeziTablo from "../../../../../../../../utils/components/MasrafMerkeziTablo";
import MakineTablo from "../../../../../components/MakineTablo";
import KodIDSelectbox from "../../../../../../../../utils/components/KodIDSelectbox";
import ContextMenu from "./ContextMenu"

const { Text, Link } = Typography;
const { TextArea } = Input;

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = AntForm.useForm();
  return (
    <AntForm form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </AntForm>
  );
};

const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, inputType, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const formInstance = useContext(EditableContext);
  const [decimalSeparator, setDecimalSeparator] = useState(".");

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [editing]);

  useEffect(() => {
    const language = localStorage.getItem("i18nextLng") || "en";
    // Set decimal separator based on language
    if (["tr", "az"].includes(language)) {
      setDecimalSeparator(",");
    } else {
      setDecimalSeparator(".");
    }
  }, []);

  const toggleEdit = () => {
    setEditing(!editing);
    formInstance.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await formInstance.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.error("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <AntForm.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: dataIndex !== "aciklama", // Only make fields other than "aciklama" required
            message: `${title} zorunludur.`,
          },
        ]}
      >
        {inputType === "number" ? (
          <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} min={0} style={{ width: "100%", textAlign: "center" }} decimalSeparator={decimalSeparator} />
        ) : (
          <Input ref={inputRef} onPressEnter={save} onBlur={save} style={{ textAlign: "center" }} />
        )}
      </AntForm.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
          textAlign: "center",
          cursor: "pointer",
          minHeight: "22px",
          display: "flex",
          alignItems: "center",
          // justifyContent: "center",
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return (
    <td {...restProps} style={{ ...restProps.style /* textAlign: "center"  */ }}>
      {childNode}
    </td>
  );
};

const MalzemeSecModal = ({ visible, onCancel, onOk }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalKey, setModalKey] = useState(Date.now());

  const handleMalzemeSelect = (rows) => {
    setSelectedRows(rows);
  };

  useEffect(() => {
    if (visible) {
      setModalKey(Date.now());
      setSelectedRows([]);
    }
  }, [visible]);

  // Burada hangi kolonlar gözükmeli belirliyorsun
  const visibleColumns = ["malzemeKodu", "malzemeTanimi", "ureticiKodu","tip", "birim", "stokMiktar","grup", "lokasyon", "marka", "model", "malzemeSinifi"]; // örnek kolonlar

  return (
    <Modal
      title="Malzeme Listesi"
      open={visible}
      onCancel={onCancel}
      onOk={() => onOk(selectedRows)}
      width={1200}
      style={{ top: 20 }}
      destroyOnClose
    >
      <Malzemeler
        key={modalKey}
        onRowSelect={handleMalzemeSelect}
        isSelectionMode={true}
        visibleColumns={visibleColumns} // props ile gönderiyoruz
      />
    </Modal>
  );
};

function FisIcerigi({ modalOpen, disabled }) {
  const { control, setValue, watch, getValues } = useFormContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [previousModalState, setPreviousModalState] = useState(false);
  const [isIndirimManuallyEdited, setIsIndirimManuallyEdited] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "fisIcerigi",
    shouldUnregister: true,
    shouldFocus: false,
  });

  const [dataSource, setDataSource] = useState([]);

  // Add useEffect for calculating totals
  useEffect(() => {
    try {
      const totals = dataSource.reduce(
        (acc, item) => {
          acc.araToplam += Number(item.araToplam) || 0;
          acc.indirim += Number(item.indirimTutari) || 0;
          acc.kdvToplam += Number(item.kdvTutar) || 0;
          acc.genelToplam += Number(item.toplam) || 0;
          return acc;
        },
        {
          araToplam: 0,
          indirim: 0,
          kdvToplam: 0,
          genelToplam: 0,
        }
      );

      // Update form values with calculated totals
      setValue("totalAraToplam", totals.araToplam.toFixed(2));

      // Only update indirim if not manually edited
      if (!isIndirimManuallyEdited) {
        setValue("totalIndirim", totals.indirim.toFixed(2));
      }

      setValue("totalKdvToplam", totals.kdvToplam.toFixed(2));

      // If discount was manually edited, recalculate general total
      if (isIndirimManuallyEdited) {
        const manualIndirim = parseFloat(getValues("totalIndirim")) || 0;
        const newGenelToplam = totals.araToplam - manualIndirim + totals.kdvToplam;
        setValue("totalGenelToplam", newGenelToplam.toFixed(2));
      } else {
        setValue("totalGenelToplam", totals.genelToplam.toFixed(2));
      }
    } catch (error) {
      console.error("Error calculating totals:", error);
    }
  }, [dataSource, setValue, isIndirimManuallyEdited, getValues]);

  // Safely update dataSource when fields change
  useEffect(() => {
    try {
      setDataSource(fields || []);
    } catch (error) {
      console.error("Error updating dataSource:", error);
      setDataSource([]);
    }
  }, [fields]);

  // Safely handle modal state changes
  useEffect(() => {
    if (modalOpen !== previousModalState) {
      setPreviousModalState(modalOpen);

      if (modalOpen) {
        // Modal just opened, safely reset the table
        try {
          setDataSource([]);
          replace([]);
          setIsIndirimManuallyEdited(false); // Reset manual edit state
        } catch (error) {
          console.error("Error resetting dataSource:", error);
        }
      } else {
        // Modal just closed, reset manual edit state
        setIsIndirimManuallyEdited(false);
      }
    }
  }, [modalOpen, previousModalState, replace]);

  const lokasyon = watch("lokasyon");
  const lokasyonID = watch("lokasyonID");

  // Use ref to store previous lokasyon values to prevent unnecessary updates
  const prevLokasyonRef = useRef({ lokasyon: null, lokasyonID: null });

  // Function to update empty locations
  const updateEmptyLocations = useCallback(() => {
    if (!lokasyon && !lokasyonID) return;

    setDataSource((currentDataSource) => {
      if (currentDataSource.length === 0) return currentDataSource;

      let hasChanges = false;
      const updatedData = currentDataSource.map((item, index) => {
        // Only update if the item doesn't have a location set or if it's empty
        if (!item.malzemeLokasyon || item.malzemeLokasyon === "" || item.malzemeLokasyon === null || item.malzemeLokasyon === undefined) {
          hasChanges = true;

          return {
            ...item,
            malzemeLokasyon: lokasyon || "",
            malzemeLokasyonID: lokasyonID || null,
          };
        }
        // Keep existing location if already set
        return item;
      });

      if (hasChanges) {
        // Use replace to update the form fields
        setTimeout(() => {
          replace(updatedData);
        }, 0);
        return updatedData;
      }

      return currentDataSource;
    });
  }, [lokasyon, lokasyonID, replace]);

  // Safely update fields with watched values - only update empty locations
  useEffect(() => {
    // Check if lokasyon values actually changed
    const prevValues = prevLokasyonRef.current;
    if (prevValues.lokasyon === lokasyon && prevValues.lokasyonID === lokasyonID) {
      return; // No change, exit early
    }

    // Update ref with new values
    prevLokasyonRef.current = { lokasyon, lokasyonID };

    try {
      updateEmptyLocations();
    } catch (error) {
      console.error("Error in lokasyon useEffect:", error);
    }
  }, [lokasyon, lokasyonID, updateEmptyLocations]);

  // Watch for birim changes and update dataSource
  useEffect(() => {
    try {
      const subscription = watch((value, { name }) => {
        if (name && name.includes(".birim") && !name.includes(".birimKodId")) {
          const indexMatch = name.match(/fisIcerigi\.(\d+)\.birim$/);
          if (indexMatch) {
            const index = parseInt(indexMatch[1]);
            const birimValue = value.fisIcerigi?.[index]?.birim;
            const birimIdValue = value.fisIcerigi?.[index]?.birimID;

            if (dataSource[index] && birimValue) {
              const newData = [...dataSource];
              const item = newData[index];
              newData.splice(index, 1, {
                ...item,
                birim: birimValue,
                birimKodId: birimIdValue,
              });
              setDataSource(newData);
            }
          }
        }
      });
      return () => subscription.unsubscribe();
    } catch (error) {
      console.error("Error in birim watch effect:", error);
    }
  }, [watch, dataSource, setValue]);

  // Safe handleSave with error handling
  const handleSave = (row) => {
    try {
      const newData = [...dataSource];
      const index = newData.findIndex((item) => row.id === item.id);
      if (index < 0) return;

      const item = newData[index];

      // Helper function to round to 2 decimal places
      const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

      // Check if price has changed
      const isPriceChanged = item.fiyat !== row.fiyat;

      // Check if discount has changed (either discount rate or amount)
      const isDiscountChanged = item.indirimOrani !== row.indirimOrani || item.indirimTutari !== row.indirimTutari;

      // If discount was edited in table, reset manual edit flag so table calculations take precedence
      if (isDiscountChanged) {
        setIsIndirimManuallyEdited(false);
      }

      // Calculate totals
      const miktar = Number(row.miktar) || 0;
      const fiyat = Number(row.fiyat) || 0;
      const kdvOrani = Number(row.kdvOrani) || 0;
      const kdvDH = Boolean(row.kdvDahilHaric);

      // Exception: Always calculate araToplam as miktar * fiyat regardless of kdvDH
      const araToplam = round(miktar * fiyat);

      let indirimOrani = Number(row.indirimOrani) || 0;
      let indirimTutari = Number(row.indirimTutari) || 0;

      // If indirimOrani was changed
      if (item.indirimOrani !== row.indirimOrani) {
        indirimTutari = round((araToplam * indirimOrani) / 100);
      }
      // If indirimTutari was changed
      else if (item.indirimTutari !== row.indirimTutari) {
        indirimOrani = round((indirimTutari / araToplam) * 100);
      }

      // Calculate KDV amount based on kdvDH
      const kdvMatrah = round(araToplam - indirimTutari);
      let kdvTutar;

      if (kdvDH) {
        // If KDV is inclusive, calculate KDV portion from the price
        const baseAmount = round(kdvMatrah / (1 + kdvOrani / 100));
        kdvTutar = round(kdvMatrah - baseAmount);
      } else {
        // If KDV is exclusive, calculate KDV as additional
        kdvTutar = round(kdvMatrah * (kdvOrani / 100));
      }

      // Calculate total
      const toplam = kdvDH ? round(kdvMatrah) : round(kdvMatrah + kdvTutar);

      const updatedRow = {
        ...item,
        ...row,
        birim: item.birim,
        birimKodId: item.birimKodId,
        araToplam,
        indirimOrani: round(indirimOrani),
        indirimTutari: round(indirimTutari),
        kdvTutar: round(kdvTutar),
        toplam: round(toplam),
        isPriceChanged: isPriceChanged || item.isPriceChanged,
      };

      newData.splice(index, 1, updatedRow);
      setDataSource(newData);

      // Update form value safely
      setTimeout(() => {
        try {
          setValue(`fisIcerigi.${index}`, updatedRow);
        } catch (error) {
          console.error(`Error updating form value for index ${index}:`, error);
        }
      }, 0);
    } catch (error) {
      console.error("Error in handleSave:", error);
    }
  };

  // Safe handleMalzemeSelect with error handling
  const handleMalzemeSelect = (selectedRows) => {
    try {
      // Get existing malzemeIds from the current dataSource
      const existingMalzemeIds = new Set(dataSource.map((item) => item.malzemeId));

      // Filter out already existing materials
      const newRows = selectedRows.filter((row) => !existingMalzemeIds.has(row.TB_STOK_ID));

      // If all selected materials already exist, show a warning
      if (newRows.length === 0) {
        message.warning("Seçilen malzemeler zaten tabloda mevcut.");
        setIsModalVisible(false);
        return;
      }

      // If some materials were filtered out, show an info message
      if (newRows.length < selectedRows.length) {
        message.info(`${selectedRows.length - newRows.length} malzeme zaten tabloda mevcut olduğu için eklenmedi.`);
      }

      // Helper function to round to 2 decimal places
      const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

      newRows.forEach((row) => {
        const miktar = 1;
        const fiyat = row.STK_CIKIS_FIYAT_DEGERI || 0;
        const kdvOrani = row.STK_KDV_ORAN || 0;
        const kdvDH = Boolean(row.STK_KDV_DH);

        // Exception: Always calculate araToplam as miktar * fiyat regardless of kdvDH
        const araToplam = round(miktar * fiyat);
        const indirimOrani = 0;
        const indirimTutari = 0;
        const kdvMatrah = round(araToplam - indirimTutari);

        let kdvTutar;
        if (kdvDH) {
          // If KDV is inclusive, calculate KDV portion from the price
          const baseAmount = round(kdvMatrah / (1 + kdvOrani / 100));
          kdvTutar = round(kdvMatrah - baseAmount);
        } else {
          // If KDV is exclusive, calculate KDV as additional
          kdvTutar = round(kdvMatrah * (kdvOrani / 100));
        }

        // Calculate total based on kdvDH
        const toplam = kdvDH ? round(kdvMatrah) : round(kdvMatrah + kdvTutar);

        const newRow = {
  id: Date.now() + Math.random(), // Unique ID, frontend için
  siraNo: 0,
  fisId: 0,
  malzemeKod: row.STK_KOD,
  malzemeName: row.STK_TANIM,
  malzemeId: row.TB_STOK_ID,
  malDurumID: 0,
  malDurumName: "AÇIK", // isteğe göre formdaki talepDurumName ile de set edilebilir
  malKarsilamaSekli: "SATINALMA",
  talepMiktar: miktar || 0,
  gelenMiktar: 0,
  kalanMiktar: 0,
  satinalmaMiktar: 0,
  iptalMiktar: 0,
  stokKullanimMiktar: 0,
  birimKodId: row.STK_BIRIM_KOD_ID,
  birimName: row.STK_BIRIM,
  makineId: 0,
  makineName: "",
  malzemeLokasyon: row.STK_LOKASYON || lokasyon || "",
  malzemeLokasyonID: row.STK_LOKASYON_ID || lokasyonID || null,
  masrafMerkezi: row.STK_MASRAFMERKEZ || "",
  masrafMerkeziID: row.STK_MASRAF_MERKEZI_ID || null,
  aciklama: "",
  isDeleted: false,
};

        append(newRow);
      });
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error in handleMalzemeSelect:", error);
      message.error("Malzeme eklenirken bir hata oluştu.");
      setIsModalVisible(false);
    }
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleRowSelect = (record) => {
    console.log("Seçilen malzemeId:", record.malzemeId);
    setSelectedRowId(record.malzemeId);
  };

  const defaultColumns = [
    {
      title: '',
      dataIndex: 'radio',
      render: (_, record) => (
        <Radio
          checked={selectedRowId === record.malzemeId}
          onChange={() => setSelectedRowId(record.malzemeId)}
        />
      ),
      width: 50,
    },
    {
      title: "Malzeme Kodu",
      dataIndex: "malzemeKod",
      key: "malzemeKod",
      width: 150,
      editable: false,
      inputType: "text",
    },
    {
      title: "Malzeme Tanımı",
      dataIndex: "malzemeName",
      key: "malzemeName",
      width: 200,
      editable: false,
      inputType: "text",
    },
    {
      title: "Durum",
      dataIndex: "malDurumName",
      key: "malDurumName",
      width: 200,
      editable: false,
      inputType: "text",
    },
    {
      title: "Karşılama Şekli",
      dataIndex: "malKarsilamaSekli",
      key: "malKarsilamaSekli",
      width: 150,
      editable: false,
      render: (text, record, index) => (
        <Controller
          name={`fisIcerigi.${index}.malKarsilamaSekli`}
          control={control}
          defaultValue="SATINALMA" // default değer
          render={({ field }) => (
            <Select
              {...field}
              disabled={disabled}
              style={{ width: "100%" }}
              options={[
                { label: "SATINALMA", value: "SATINALMA" },
                { label: "STOKTAN", value: "STOKTAN" },
              ]}
            />
          )}
        />
      ),
    },
    {
      title: "Talep Miktarı",
      dataIndex: "talepMiktar",
      key: "talepMiktar",
      width: 100,
      editable: true,
      inputType: "number",
      render: (text, record, index) => (
        <Controller
          name={`fisIcerigi.${index}.talepMiktar`}
          control={control}
          defaultValue={text}
          render={({ field }) => (
            <InputNumber
              {...field}
              style={{ width: "100%" }}
              disabled={disabled} // 🔥 burası
            />
          )}
        />
      ),
    },
    {
      title: "Birim",
      dataIndex: "birimName",
      key: "birimName",
      width: 150,
      editable: false,
      render: (text, record, index) => (
        <Controller
          name={`fisIcerigi.${index}.birimName`}
          control={control}
          render={({ field }) => (
            <div style={{ ...(disabled ? { pointerEvents: "none", opacity: 0.6 } : {}) }}>
              <KodIDSelectbox
                name1={`fisIcerigi.${index}.birimName`}
                kodID={13001}
                isRequired={false}
              />
            </div>
          )}
        />
      ),
    },
    {
      title: "Makine",
      dataIndex: "makine",
      key: "makine",
      width: 200,
      ellipsis: true,
      render: (text, record, index) => (
        <MakineTablo
          disabled={disabled}
          makineFieldName={`fisIcerigi.${index}.makineTanim`}
          makineIdFieldName={`fisIcerigi.${index}.makineID`}
          onSubmit={(selectedData) => {
            // Update the specific row's masraf merkezi data
            const newData = [...dataSource];
            if (newData[index]) {
              newData[index] = {
                ...newData[index],
                makineTanim: selectedData.MKN_KOD,
                makineID: selectedData.key,
              };
              setDataSource(newData);

              // Update form values
              setValue(`fisIcerigi.${index}.makineTanim`, selectedData.MKN_KOD);
              setValue(`fisIcerigi.${index}.makineID`, selectedData.key);
            }
          }}
          onClear={() => {
            // Update the specific row's masraf merkezi data to empty
            const newData = [...dataSource];
            if (newData[index]) {
              newData[index] = {
                ...newData[index],
                makineTanim: "",
                makineID: null,
              };
              setDataSource(newData);
            }
          }}
        />
      ),
    },
    {
      title: "Açıklama",
      dataIndex: "aciklama",
      key: "aciklama",
      width: 200,
      editable: true,
      inputType: "text",
      ellipsis: true,
      render: (text, record, index) => (
        <Controller
          name={`fisIcerigi.${index}.aciklama`}
          control={control}
          defaultValue={text}
          render={({ field }) => (
            <Input
              {...field}
              style={{ width: "100%" }}
              disabled={disabled}
            />
          )}
        />
      ),
    },
    {
      title: "Marka",
      dataIndex: "marka",
      key: "marka",
      width: 150,
      editable: false,
      render: (text, record, index) => (
        <Controller
          name={`fisIcerigi.${index}.marka`}
          control={control}
          render={({ field }) => (
            <div style={{ ...(disabled ? { pointerEvents: "none", opacity: 0.6 } : {}) }}>
              <KodIDSelectbox
                name1={`fisIcerigi.${index}.marka`}
                kodID={13002}
                isRequired={false}
              />
            </div>
          )}
        />
      ),
    },
    {
      title: "Model",
      dataIndex: "Model",
      key: "Model",
      width: 150,
      editable: false,
      render: (text, record, index) => (
        <Controller
          name={`fisIcerigi.${index}.Model`}
          control={control}
          render={({ field }) => (
            <div style={{ ...(disabled ? { pointerEvents: "none", opacity: 0.6 } : {}) }}>
              <KodIDSelectbox
                name1={`fisIcerigi.${index}.Model`}
                kodID={13003}
                isRequired={false}
              />
            </div>
          )}
        />
      ),
    },
    {
      title: "İşlemler",
      dataIndex: "operation",
      width: 100,
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Silmek istediğinize emin misiniz?" onConfirm={() => remove(dataSource.findIndex((item) => item.id === record.id))}>
            <Button type="link" danger disabled={disabled}>
              Sil
            </Button>
          </Popconfirm>
        ) : null,
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        inputType: col.inputType,
        handleSave,
      }),
    };
  });

  return (
    <div style={{ marginTop: "-55px", zIndex: 10 }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, position: "relative", zIndex: 1000, gap: "10px", }}>
     <ContextMenu selectedRowId={selectedRowId} />
  <Button style={{ zIndex: 1001 }} type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}  disabled={disabled} >
    Ekle
  </Button>
</div>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        size="small"
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        rowKey={(record) => record.id || Math.random().toString(36).substr(2, 9)} // Ensure stable keys
        scroll={{ y: "calc(100vh - 540px)" }}
      />
      <MalzemeSecModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={handleMalzemeSelect} />
    </div>
  );
}

export default FisIcerigi;
