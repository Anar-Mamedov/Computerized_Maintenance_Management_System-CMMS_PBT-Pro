import { CheckOutlined, CloseOutlined, DeleteOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Modal,
  Typography,
  Checkbox,
  DatePicker,
  TimePicker,
  Select,
  Table,
  Dropdown,
  Space,
  Menu,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import AxiosInstance from "../../../../../../../api/http";
import Warehouse from "./components/warehouse";
import Stockless from "./components/Stockless/stockless";
import MaterialCode from "./components/Stockless/materialCode";
import MaterialType from "./components/Stockless/MaterialType";
import MaterialBrand from "./components/Stockless/MaterialBrand";
import Company from "../DetailedInformationFields/company";
import CostCenter from "../DetailedInformationFields/CostCenter";

const { Text, Link } = Typography;
const { TextArea } = Input;

const StyledTable = styled(Table)`
  .ant-pagination {
    margin-right: 0px !important;
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 5px;
  }
  &.custom-table .ant-table-thead > tr > th {
    height: 10px; // Adjust this value to your desired height
    line-height: 2px; // Adjust this value to vertically center the text
  }
`;

const onChange = (value) => {};
const onSearch = (value) => {};

// Filter `option.label` match the user type `input`
const filterOption = (input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

export default function FourthTab() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, setValue, watch, handleSubmit, getValues } = useFormContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true); // State to manage the disabled state of the fields
  const [isOutOfStockModalOpen, setIsOutOfStockModalOpen] = useState(false);
  const { fields, append, update, remove, replace } = useFieldArray({
    control,
    name: "IsEmriMalzemeList",
  });

  const onCheckboxChange = (e) => {
    if (editingRecord) {
      setEditingRecord((prevRecord) => ({
        ...prevRecord,
        overtime: e.target.checked,
      }));
      setIsDisabled(!e.target.checked);
    }
  };

  const columns = [
    {
      title: "Malzeme Kodu",
      dataIndex: "code",
      key: "code",
      width: "150px",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Malzeme Tanımı",
      dataIndex: "materialDescription",
      key: "materialDescription",
      width: "150px",

      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Tip",
      dataIndex: "workdays",
      key: "workdays",
      width: "150px",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Birim",
      dataIndex: "description",
      key: "description",
      width: "150px",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },

    {
      title: "Grup",
      dataIndex: "fifthcolumn",
      key: "fifthcolumn",
      width: "150px",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Lokasyon",
      dataIndex: "sixthcolumn",
      key: "sixthcolumn",
      width: "150px",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Atölye",
      dataIndex: "workshop",
      key: "workshop",
      width: "150px",

      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Marka",
      dataIndex: "brand",
      key: "brand",
      width: "150px",

      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      width: "150px",

      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Malzeme Sınıfı",
      dataIndex: " materialClass",
      key: "materialClass",
      width: "150px",

      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Barkod No",
      dataIndex: "barcodeNo",
      key: "barcodeNo",
      width: "150px",

      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
  ];

  const selectedColumns = [
    {
      title: "Stok",
      dataIndex: "stockMaterialCheckbox",
      key: "stockMaterialCheckbox",
      render: (checked) =>
        !checked ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />,
    },
    {
      title: "G",
      dataIndex: "G",
      key: "G",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Malzeme Kodu",
      dataIndex: "code",
      key: "materialCode",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Malzeme Tanımı",
      dataIndex: "materialDescription",
      key: "uniqueKey", // use the uniqueKey for the key property
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Depo",
      dataIndex: "warehouseTable",
      key: "warehouseTable",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Miktar",
      dataIndex: "workingtime",
      key: "workingtime",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Birim",
      dataIndex: "description",
      key: "hourlyrate",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Birim Fiyat",
      dataIndex: "unitPrice",
      key: "overtime",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Maliyet",
      dataIndex: "cost",
      key: "workinghours",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    // {
    //   title: "Mesai Ücreti",
    //   dataIndex: "overtimepay",
    //   key: "overtimepay",
    //   render: (text) => (
    //     <div
    //       style={{
    //         lineHeight: "20px",
    //         whiteSpace: "nowrap",
    //         overflow: "hidden",
    //         textOverflow: "ellipsis",
    //       }}>
    //       {text}
    //     </div>
    //   ),
    // },
    // {
    //   title: "Maliyet",
    //   dataIndex: "cost",
    //   key: "cost",
    //   render: (text) => (
    //     <div
    //       style={{
    //         lineHeight: "20px",
    //         whiteSpace: "nowrap",
    //         overflow: "hidden",
    //         textOverflow: "ellipsis",
    //       }}>
    //       {text}
    //     </div>
    //   ),
    // },

    {
      title: "",
      key: "delete",
      render: (_, field, index) => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button
            danger
            onClick={(e) => {
              e.stopPropagation(); // This will prevent the event from reaching the row
              remove(index);
            }}
            icon={<DeleteOutlined />}>
            Sil
          </Button>
        </div>
      ),
    },

    // Add more columns as needed
  ];

  const isEmriId = watch("isEmriSelectedId");

  useEffect(() => {
    if (isEmriId) {
      setLoading(true);
      AxiosInstance.get(`IsEmriMalzemeList?isemriID=${isEmriId}`)
        .then((response) => {
          console.log("response", response);
          const fetchedData = response.map((item, index) => ({
            key: item.IDM_STOK_ID,
            code: item.IDM_STOK_KOD,
            materialDescription: item.IDM_STOK_TANIM,
            // workdays: item.STK_TIP,
            description: item.IDM_BIRIM,
            // fifthcolumn: item.STK_GRUP,
            // sixthcolumn: item.STK_LOKASYON,
            // seventhcolumn: item.STK_ATOLYE,
            // brand: item.STK_MARKA, id var tanımda lazımdı
            // model: item.STK_MODEL,
            // materialClass: item.STK_MALZEME_SINIF,
            // barcodeNo: item.STK_BARKOD_NO,
            // stockMaterialCheckbox: item.STK_STOKSUZ_MALZEME,
            // unitPrice: item.STK_GIRIS_FIYAT_DEGERI,
            // cost: item.IDM_MALIYET,
            warehouseTable: item.IDM_DEPO,
            STK_BIRIM_KOD_ID: item.IDM_BIRIM_KOD_ID,
            STK_MARKA_KOD_ID: item.IDM_MARKA_KOD_ID,
            STK_MODEL_KOD_ID: item.IDM_MODEL_KOD_ID,
          }));
          replace(fetchedData);
        })
        .catch((error) => console.error("Error fetching data:", error))
        .finally(() => setLoading(false));
    }
  }, [isEmriId, append, setLoading, AxiosInstance]);

  const warehouseId = watch("warehouse");

  const fetch = useCallback(() => {
    if (warehouseId) {
      // Check if warehouseId is not null or undefined
      setLoading(true);
      AxiosInstance.get(`GetDepoStok?depoID=${warehouseId}&stoklu=true`)
        .then((response) => {
          const fetchedData = response.map((item) => {
            return {
              key: item.TB_STOK_ID,
              code: item.STK_KOD,
              materialDescription: item.STK_TANIM,
              workdays: item.STK_TIP,
              description: item.STK_BIRIM,
              fifthcolumn: item.STK_GRUP,
              sixthcolumn: item.STK_LOKASYON,
              seventhcolumn: item.STK_ATOLYE,
              brand: item.STK_MARKA,
              model: item.STK_MODEL,
              materialClass: item.STK_MALZEME_SINIF,
              barcodeNo: item.STK_BARKOD_NO,
              stockMaterialCheckbox: item.STK_STOKSUZ_MALZEME,
              unitPrice: item.STK_GIRIS_FIYAT_DEGERI,
              cost: item.STK_MALIYET,
              warehouseTable: item.STK_DEPO,
              STK_BIRIM_KOD_ID: item.STK_BIRIM_KOD_ID,
              STK_MARKA_KOD_ID: item.STK_MARKA_KOD_ID,
              STK_MODEL_KOD_ID: item.STK_MODEL_KOD_ID,
            };
          });
          setData(fetchedData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [warehouseId]);

  useEffect(() => {
    fetch(); // Call fetch when the component mounts or warehouseId changes
  }, [fetch]);

  // const selectedId = watch("procedureSelectedId");

  // useEffect(() => {
  //   if (selectedId) {
  //     setLoading(true);
  //     AxiosInstance.get(`IsTanimMazleme?isTanimID=${selectedId}`)
  //       .then((response) => {
  //         // Assuming the API returns an array of objects compatible with your table structure
  //         const formattedData = response.map((item) => ({
  //           key: item.TB_ISEMRI_MLZ_ID,
  //           // stok: item.IDM_STOK_TANIM,
  //           // G: item.IDM_STOK_TIP,
  //           // code: item.IDM_STOK_TANIM,
  //           materialDescription: item.IDM_STOK_TANIM,
  //           // warehouseTable: item.IDM_STOK_DEPO,
  //           workingtime: item.IDM_MIKTAR,
  //           description: item.IDM_BIRIM,
  //           unitPrice: item.IDM_BIRIM_FIYAT,
  //           cost: item.IDM_TUTAR,
  //         }));
  //         replace(formattedData); // Update the selectedRecords state
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching data:", error);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }
  // }, [selectedId, replace, setLoading, AxiosInstance]);

  // Function to fetch data from the API
  // const fetchData = useCallback(() => {
  //   setLoading(true);
  //   AxiosInstance.get(`IsTanimMazleme?isTanimID=${selectedId}`)
  //     .then((response) => {
  //       // Assuming the API returns an array of objects compatible with your table structure
  //       const formattedData = response.map((item) => ({
  //         key: item.TB_ISEMRI_MLZ_ID,
  //         // stok: item.IDM_STOK_TANIM,
  //         // G: item.IDM_STOK_TIP,
  //         // code: item.IDM_STOK_TANIM,
  //         materialDescription: item.IDM_STOK_TANIM,
  //         // warehouseTable: item.IDM_STOK_DEPO,
  //         workingtime: item.IDM_MIKTAR,
  //         description: item.IDM_BIRIM,
  //         unitPrice: item.IDM_BIRIM_FIYAT,
  //         cost: item.IDM_TUTAR,
  //       }));
  //       setSelectedRecords(formattedData); // Update the selectedRecords state
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, [selectedId]);

  // // Fetch data when the component mounts or when certain conditions are met

  // useEffect(() => {
  //   if (selectedId) {
  //     fetchData();
  //   }
  // }, [selectedId, fetchData]);

  const showModal = () => {
    setIsModalOpen(true);
    fetch();
  };

  const handleOk = () => {
    if (editingRecord) {
      // Update the record in the selectedRecords state
      setSelectedRecords((prevRecords) =>
        prevRecords.map((record) => (record.uniqueKey === editingRecord.uniqueKey ? editingRecord : record))
      );
      setEditingRecord(null);
    } else {
      // Handle the scenario where new records are added from the modal
      const newSelectedData = selectedRowKeys.map((key) => {
        const record = data.find((item) => item.key === key);
        return {
          ...record,
          uniqueKey: `${record.key}_${Date.now()}`, // appending a timestamp to ensure uniqueness
        };
      });
      setSelectedRecords((prevRecords) => [...prevRecords, ...newSelectedData]);
      setSelectedRowKeys([]);
      append(newSelectedData);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (uniqueKey) => {
    setSelectedRecords((prevRecords) => prevRecords.filter((record) => record.uniqueKey !== uniqueKey));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const handleEditOk = () => {
    setSelectedRecords((prevRecords) =>
      prevRecords.map((record) => (record.uniqueKey === editingRecord.uniqueKey ? editingRecord : record))
    );
    setEditingRecord(null);
    setIsEditModalOpen(false);
  };

  const showOutOfStockModal = () => {
    setIsOutOfStockModalOpen(true);
  };

  const handleFormSubmit = (formData) => {
    const materialTypeValue = getValues("materialType");
    const materialTypeLabel = getValues("materialTypeLabel");

    const MaterialBrandValue = getValues("MaterialBrand");
    const MaterialBrandLabel = getValues("MaterialBrandLabel");

    const MaterialModelValue = getValues("MaterialModel");
    const MaterialModelLabel = getValues("MaterialModelLabel");

    const dataToSubmit = {
      ...formData,
      materialType: materialTypeValue,
      materialTypeLabel: materialTypeLabel,
      MaterialBrand: MaterialBrandValue,
      MaterialBrandLabel: MaterialBrandLabel,
      MaterialModel: MaterialModelValue,
      MaterialModelLabel: MaterialModelLabel,
    };

    append(dataToSubmit);
    setIsOutOfStockModalOpen(false);
  };

  const handleOutOfStockOk = () => {
    handleSubmit(handleFormSubmit)(); // Submit the form
  };

  const handleOutOfStockCancel = () => {
    setIsOutOfStockModalOpen(false);
  };

  // tabloyu sağa sola kaydıra bilme özelliği eklemek için
  const totalTableWidth = columns.reduce((acc, column) => acc + (parseInt(column.width, 10) || 0), 0);
  // tabloyu sağa sola kaydıra bilme özelliği eklemek için son

  // Dropdown menü için
  const items = [
    {
      label: "Stoklu",
      key: "0",
      onClick: showModal, // Assuming showModal is defined elsewhere
    },
    {
      label: "Stoksuz",
      key: "1",
      onClick: showOutOfStockModal, // Assuming showOutOfStockModal is defined elsewhere
    },
  ];

  // Create a menu based on the items
  const dropdownMenu = <Menu items={items} />;

  const handleDropdownClick = (e) => {
    e.preventDefault();
  };

  // Dropdown menü son
  const workingtime = watch("workingtime");
  const unitPrice = watch("unitPrice");
  // Calculate the product whenever inputOne or inputTwo changes
  React.useEffect(() => {
    if (workingtime && unitPrice) {
      const cost = Number(workingtime) * Number(unitPrice);
      setValue("cost", cost);
    } else {
      setValue("cost", "");
    }
  }, [workingtime, unitPrice, setValue]);

  // Watch the value of materialCodeTanim
  const materialCodeTanimValue = watch("materialCodeTanim");

  // Effect to update materialDescription when materialCodeTanim changes
  useEffect(() => {
    if (materialCodeTanimValue) {
      // Assuming materialCodeTanimValue contains the data you want to set in materialDescription
      setValue("materialDescription", materialCodeTanimValue);
    }
  }, [materialCodeTanimValue, setValue]);

  return (
    <>
      <div className="Anar" style={{ display: "flex", justifyContent: "end" }}>
        <Dropdown overlay={dropdownMenu} trigger={["click"]}>
          <a onClick={handleDropdownClick}>
            <Space>
              <PlusOutlined />
              Yeni Kayıt
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
      <Modal centered width="1200px" title="Malzemeler" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Warehouse />
        <StyledTable
          className="custom-table"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{
            x: totalTableWidth,
            y: "500px",
          }}
        />
      </Modal>

      <Modal
        centered
        width="auto"
        title="Malzeme Giriş"
        open={isOutOfStockModalOpen}
        onOk={handleOutOfStockOk}
        onCancel={handleOutOfStockCancel}>
        {/* Modal Content */}
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                border: "1px solid #80808068",
                padding: "10px",
                borderRadius: "5px",
                alignItems: "center",
                marginBottom: "10px",
                justifyContent: "center",
              }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  width: "500px",
                }}>
                <div style={{ width: "170px" }}>
                  <Controller
                    name="stockMaterialCheckbox"
                    control={control}
                    render={({ field: { onChange, onBlur, value, name, ref } }) => (
                      <Checkbox
                        // disabled
                        onChange={(e) => onChange(e.target.checked)}
                        onBlur={onBlur}
                        checked={value}
                        ref={ref}>
                        Stoksuz Malzeme
                      </Checkbox>
                    )}
                  />
                </div>

                <div
                  style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                  <Text>Depo</Text>
                  <Controller
                    name="warehouseTable"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        {...field}
                        style={{ width: "290px" }}
                        disabled
                        placeholder="Select a option and change input text above"
                        allowClear>
                        <Select.Option value="demo">Demo</Select.Option>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <MaterialCode
                    materialCodeCurrentValue={editingRecord?.materialCode}
                    materialCodeSelectedId={editingRecord?.materialCodeSelectedId}
                    onSubmit={(selectedData) => {
                      setValue("materialCode", selectedData.code);
                      console.log(selectedData.code);
                      setValue("materialCodeSelectedId", selectedData.key);
                      setValue("materialCodeTanim", selectedData.subject);
                    }}
                  />
                </div>
                <div
                  style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                  <Text>Barkod / Alternativ Malzeme</Text>
                  <Controller
                    name="barcode"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        {...field}
                        style={{ width: "290px" }}
                        disabled
                        placeholder="Select a option and change input text above"
                        allowClear>
                        <Select.Option value="demo">Demo</Select.Option>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: "200px",
                  height: "200px",
                  backgroundColor: "#80808065",
                }}>
                <Text>Resim Yok</Text>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                border: "1px solid #80808068",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "10px",
                flexDirection: "column",
                justifyContent: "center",
              }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  maxWidth: "490px",
                }}>
                <Text>Tarih / Saat</Text>
                <div style={{ display: "flex", gap: "10px", width: "290px" }}>
                  <Controller
                    name="productDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker {...field} format="DD-MM-YYYY" onChange={(date) => field.onChange(date)} />
                    )}
                  />
                  <Controller
                    name="productTime"
                    control={control}
                    render={({ field }) => (
                      <TimePicker {...field}
                                  changeOnScroll needConfirm={false} format="HH:mm" onChange={(time) => field.onChange(time)} />
                    )}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}>
                <Text>Malzeme Tanımı</Text>
                <Controller
                  name="materialDescription"
                  control={control}
                  defaultValue=""
                  render={({ field }) => <Input {...field} placeholder="" style={{ width: "510px" }} />}
                />
              </div>
              <div>
                <MaterialType />
              </div>
              <div>
                <MaterialBrand />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "486px" }}>
                <Text>Garanti Başlama / Bitiş Tarihi</Text>
                <div style={{ display: "flex", gap: "10px", width: "286px" }}>
                  <Controller
                    name="warrantyStartDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        format="DD-MM-YYYY"
                        onChange={(date, dateString) => field.onChange(date)}
                      />
                    )}
                  />
                  <Controller
                    name="warrantyEndDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        format="DD-MM-YYYY"
                        onChange={(date, dateString) => field.onChange(date)}
                      />
                    )}
                  />
                </div>
              </div>
              <div style={{ width: "550px" }}>
                <Company
                  companyCurrentValue={editingRecord?.company}
                  companySelectedId={editingRecord?.companySelectedId}
                  onSubmit={(selectedData) => {
                    setValue("company", selectedData.subject);
                    setValue("companySelectedId", selectedData.key);
                  }}
                />
              </div>
              <div style={{ width: "500px" }}>
                <CostCenter
                  currentValue={editingRecord?.costCenter}
                  onSubmit={(selectedData) => {
                    setEditingRecord({
                      ...editingRecord,
                      costCenter: selectedData.age,
                      costCenterId: selectedData.key,
                    });
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Text>Açıklama</Text>
                <Controller
                  name="aciklama"
                  control={control}
                  defaultValue=""
                  render={({ field }) => <TextArea {...field} placeholder="" style={{ width: "510px" }} />}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                border: "1px solid #80808068",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "10px",
                flexDirection: "column",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "400px" }}>
                <Text>Miktar</Text>
                <Controller
                  name="workingtime"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} style={{ width: "200px" }} type="number" placeholder="Input One" />
                  )}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "400px" }}>
                <Text>Fiyat</Text>
                <Controller
                  name="unitPrice"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} style={{ width: "200px" }} type="number" placeholder="Input Two" />
                  )}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "400px" }}>
                <Text>Maliyet</Text>
                <Controller
                  name="cost"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} style={{ width: "200px" }} type="number" placeholder="Product" />
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>
      <div style={{ marginTop: "20px" }}>
        <StyledTable
          columns={selectedColumns}
          dataSource={fields}
          pagination={false}
          onRow={(record) => {
            return {
              onClick: () => {
                setEditingRecord(record);
                setIsDisabled(!record.overtime);
                setIsEditModalOpen(true);
              },
            };
          }}
        />

        <Modal
          centered
          width="875px"
          title="Edit Record"
          open={isEditModalOpen}
          onOk={handleEditOk} // Use the handleEditOk function here
          onCancel={() => setIsEditModalOpen(false)}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "610px",
                  marginBottom: "10px",
                }}>
                <Text>Personel</Text>
                <Input
                  disabled
                  style={{ width: "485px" }}
                  value={editingRecord ? editingRecord.materialDescription : ""}
                  onChange={(e) => setEditingRecord({ ...editingRecord, materialDescription: e.target.value })}
                  placeholder="Personel Adı"
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid #8080807a",
                    width: "300px",
                    padding: "10px",
                    gap: "10px",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Text>Çalışma Süresi (dk.)</Text>
                    <Input
                      style={{ width: "100px" }}
                      value={editingRecord ? editingRecord.workingtime : ""}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
                        setEditingRecord({ ...editingRecord, workingtime: e.target.value });
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Text>Saat Ücreti</Text>
                    <Input
                      style={{ width: "100px" }}
                      value={editingRecord ? editingRecord.hourlyrate : ""}
                      onChange={(e) => {
                        // Use a regular expression to check if the entered value contains only numbers and commas
                        const regex = /^[0-9,]*$/;
                        if (regex.test(e.target.value)) {
                          setEditingRecord({ ...editingRecord, hourlyrate: e.target.value });
                        }
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Text>Maliyet</Text>
                    <Input
                      disabled={true}
                      style={{ width: "100px" }}
                      value={editingRecord ? editingRecord.cost : ""}
                      onChange={(e) => {
                        // Use a regular expression to check if the entered value contains only numbers and commas
                        const regex = /^[0-9,]*$/;
                        if (regex.test(e.target.value)) {
                          setEditingRecord({ ...editingRecord, cost: e.target.value });
                        }
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid #8080807a",
                    width: "300px",
                    padding: "10px",
                    gap: "10px",
                  }}>
                  <Checkbox checked={editingRecord ? editingRecord.overtime : false} onChange={onCheckboxChange}>
                    Fazla Mesai
                  </Checkbox>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Text>Mesai Süresi (dk.)</Text>
                    <Input
                      disabled={isDisabled}
                      style={{ width: "100px" }}
                      value={editingRecord ? editingRecord.workinghours : ""}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        setEditingRecord({ ...editingRecord, workinghours: e.target.value });
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Text>Mesai Ücreti (Saat)</Text>
                    <Input
                      disabled={isDisabled}
                      style={{ width: "100px" }}
                      value={editingRecord ? editingRecord.overtimepay : ""}
                      onChange={(e) => {
                        // Use a regular expression to check if the entered value contains only numbers and commas
                        const regex = /^[0-9,]*$/;
                        if (regex.test(e.target.value)) {
                          setEditingRecord({ ...editingRecord, overtimepay: e.target.value });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", flexDirection: "column", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "610px" }}>
                  <Text>Vardiya</Text>
                  <Select
                    style={{ width: "485px" }}
                    showSearch
                    value={editingRecord ? editingRecord.shift : undefined} // Bind the value to the editingRecord's selectedShift
                    placeholder="Seçim yapınız"
                    optionFilterProp="children"
                    onChange={(value) => {
                      if (editingRecord) {
                        setEditingRecord({ ...editingRecord, shift: value }); // Update the editingRecord's selectedShift on change
                      }
                    }}
                    onSearch={onSearch}
                    filterOption={filterOption}
                    options={[
                      {
                        value: "jack",
                        label: "Jack",
                      },
                      {
                        value: "lucy",
                        label: "Lucy",
                      },
                      {
                        value: "tom",
                        label: "Tom",
                      },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #80808075",
                width: "200px",
                height: "250px",
              }}>
              Resim Yok
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text>Açıklama</Text>
            <TextArea
              rows={4}
              style={{ width: "702px" }}
              value={editingRecord ? editingRecord.customdescription : ""} // Bind the value to the editingRecord's description
              onChange={(e) => {
                if (editingRecord) {
                  setEditingRecord({ ...editingRecord, customdescription: e.target.value }); // Update the editingRecord's description on change
                }
              }}
            />
          </div>

          {/* Add other fields as needed */}
        </Modal>
      </div>
    </>
  );
}
