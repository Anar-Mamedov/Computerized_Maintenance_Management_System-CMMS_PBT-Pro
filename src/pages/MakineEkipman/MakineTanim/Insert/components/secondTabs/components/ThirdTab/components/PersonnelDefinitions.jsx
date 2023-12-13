import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input, Modal, Select, Table, Typography } from "antd";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import styled from "styled-components";
import AxiosInstance from "../../../../../../../../../api/http";
import CostCenter from "../../DetailedInformationFields/CostCenter";

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

export default function PersonnelDefinitions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, setValue, watch } = useFormContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [selectedRecords, setSelectedRecords] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editingRecordIndex, setEditingRecordIndex] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true); // State to manage the disabled state of the fields
  const [selectOptions, setSelectOptions] = useState([]);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "IsEmriPersonelList",
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
      title: "Personel Kodu",
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
      title: "Personel Adı",
      dataIndex: "subject",
      key: "subject",
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
      title: "Ünvan",
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
      title: "Personel Tipi",
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
      title: "Departman",
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
  ];

  const selectedColumns = [
    {
      title: "Personel Adı",
      dataIndex: "subject",
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
      title: "Vardiya",
      dataIndex: "shift",
      key: "shift",
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
      title: "Çalışma Süresi (dk.)",
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
      title: "Saat Ücreti",
      dataIndex: "hourlyrate",
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
      title: "Fazla Mesai",
      dataIndex: "overtime",
      key: "overtime",
      render: (checked) => <Checkbox checked={checked} disabled={true} />,
    },
    {
      title: "Mesai Süresi (dk.)",
      dataIndex: "workinghours",
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
    {
      title: "Mesai Ücreti",
      dataIndex: "overtimepay",
      key: "overtimepay",
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
      key: "cost",
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
      title: "Masraf Merkezi",
      dataIndex: "costCenter",
      key: "costCenter",
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
      title: "Açıklama",
      dataIndex: "customdescription",
      key: "customdescription",
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
      title: "",
      key: "action",
      render: (text, record, index) => (
        <Button
          danger
          onClick={(e) => {
            e.stopPropagation();
            remove(index);
          }}
          icon={<DeleteOutlined />}>
          Sil
        </Button>
      ),
    },

    // Add more columns as needed
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`Personel`)
      .then((response) => {
        const fetchedData = response.map((item) => {
          return {
            key: item.TB_PERSONEL_ID,
            code: item.PRS_PERSONEL_KOD,
            subject: item.PRS_ISIM,
            workdays: item.PRS_UNVAN,
            description: item.PRS_TIP,
            fifthcolumn: item.PRS_DEPARTMAN,
            sixthcolumn: item.PRS_LOKASYON,
          };
        });
        setData(fetchedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Function to fetch options
    const fetchOptions = async () => {
      try {
        const response = await AxiosInstance.get("Vardiyalar?userId=24"); // Replace with your API endpoint
        const options = response.map((item) => ({
          label: `${item.TB_VARDIYA_ID}. ${item.VAR_TANIM} (${dayjs("1970-01-01 " + item.VAR_BASLAMA_SAATI).format(
            "HH:mm"
          )} - ${dayjs("1970-01-01 " + item.VAR_BITIS_SAATI).format("HH:mm")})`,
          value: item.TB_VARDIYA_ID,
        }));

        setSelectOptions(options);
      } catch (error) {
        console.error("Error fetching select options:", error);
      }
    };

    fetchOptions();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
    fetch();
  };

  const handleOk = () => {
    // Handle the scenario where new records are added from the modal
    const newSelectedData = selectedRowKeys.map((key) => {
      const record = data.find((item) => item.key === key);
      return {
        ...record,
        uniqueKey: `${record.key}_${Date.now()}`, // appending a timestamp to ensure uniqueness
      };
    });

    append(newSelectedData);

    // setSelectedRecords((prevRecords) => [...prevRecords, ...newSelectedData]);
    setSelectedRowKeys([]);

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const onRowClick = (record, index) => {
    setEditingRecord(record);
    setEditingRecordIndex(index);
    setIsDisabled(!record.overtime);
    setIsEditModalOpen(true);
  };

  const handleEditOk = () => {
    update(editingRecordIndex, editingRecord);
    setEditingRecord(null);
    setEditingRecordIndex(null);
    setIsEditModalOpen(false);
  };

  // tabloyu sağa sola kaydıra bilme özelliği eklemek için
  const totalTableWidth = columns.reduce((acc, column) => acc + (parseInt(column.width, 10) || 0), 0);
  // tabloyu sağa sola kaydıra bilme özelliği eklemek için son
  return (
    <>
      <Button
        type="link"
        onClick={showModal}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "auto",
          marginTop: "-10px",
          marginBottom: "10px",
        }}>
        <PlusOutlined />
        Yeni Kayıt
      </Button>
      <Modal centered width="1200px" title="Kontrol Listesi" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
      <div style={{ marginTop: "20px" }}>
        <StyledTable
          columns={selectedColumns}
          dataSource={fields}
          pagination={false}
          onRow={(record, index) => {
            return {
              onClick: () => onRowClick(record, index),
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
                <Controller
                  name="personel"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      disabled
                      style={{ width: "485px" }}
                      value={editingRecord ? editingRecord.subject : ""}
                      onChange={(e) => setEditingRecord({ ...editingRecord, subject: e.target.value })}
                      placeholder="Personel Adı"
                    />
                  )}
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
                    <Controller
                      name="workingtime"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          style={{ width: "100px" }}
                          value={editingRecord ? editingRecord.workingtime : ""}
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
                            setEditingRecord({ ...editingRecord, workingtime: e.target.value });
                          }}
                        />
                      )}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Text>Saat Ücreti</Text>
                    <Controller
                      name="hourlywage"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
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
                      )}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Text>Maliyet</Text>
                    <Controller
                      name="cost"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
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
                      )}
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
                  <Controller
                    name="overtime"
                    control={control}
                    defaultValue={false} // Set default value as false to ensure the checkbox is unchecked initially
                    render={({ field: { onChange, value, ref } }) => (
                      <Checkbox
                        checked={editingRecord ? editingRecord.overtime : false}
                        onChange={onCheckboxChange}
                        ref={ref}>
                        Fazla Mesai
                      </Checkbox>
                    )}
                  />

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Text>Mesai Süresi (dk.)</Text>
                    <Controller
                      name="workingHours"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          disabled={isDisabled}
                          style={{ width: "100px" }}
                          value={editingRecord ? editingRecord.workinghours : ""}
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                            setEditingRecord({ ...editingRecord, workinghours: e.target.value });
                          }}
                        />
                      )}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Text>Mesai Ücreti (Saat)</Text>
                    <Controller
                      name="overtimePay"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
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
                      )}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", flexDirection: "column", marginBottom: "10px" }}>
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "610px" }}>
                  <Text>Vardiya</Text>
                  <Controller
                    name="shift"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        style={{ width: "485px" }}
                        showSearch
                        allowClear
                        value={editingRecord ? editingRecord.shift : undefined}
                        placeholder="Seçim yapınız"
                        optionFilterProp="children"
                        onChange={(value, option) => {
                          if (editingRecord) {
                            setEditingRecord({
                              ...editingRecord,
                              shift: option ? option.label : "", // Check if option is defined
                              shiftId: option ? option.value : "",
                            });
                          }
                        }}
                        onSearch={onSearch}
                        filterOption={filterOption}
                        options={selectOptions}
                      />
                    )}
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
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  rows={4}
                  style={{ width: "702px" }}
                  value={editingRecord ? editingRecord.customdescription : ""} // Bind the value to the editingRecord's description
                  onChange={(e) => {
                    if (editingRecord) {
                      setEditingRecord({ ...editingRecord, customdescription: e.target.value }); // Update the editingRecord's description on change
                    }
                  }}
                />
              )}
            />
          </div>

          {/* Add other fields as needed */}
        </Modal>
      </div>
    </>
  );
}
