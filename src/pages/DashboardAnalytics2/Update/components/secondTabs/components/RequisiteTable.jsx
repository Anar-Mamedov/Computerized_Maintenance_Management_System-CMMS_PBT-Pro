import { CheckOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Table, Typography, DatePicker, TimePicker, Checkbox, Select } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http";
import dayjs from "dayjs";
import Workshop from "./DetailedInformationFields/Workshop";
import Personel from "./DetailedInformationFields/PersonelTable";

const { Text, Link } = Typography;
const { TextArea } = Input;

const onSearch = (value) => {};

// Filter `option.label` match the user type `input`
const filterOption = (input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

export default function RequisiteTable() {
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true); // State to manage the disabled state of the fields
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectOptions, setSelectOptions] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const { control, setValue, watch, handleSubmit, reset } = useFormContext();
  const { fields, append, remove, update, replace } = useFieldArray({
    control,
    name: "IsEmriKontrolList",
  });

  const isDoneChecked = watch("done"); // Watch the done field for changes

  const columns = [
    {
      title: "#",
      dataIndex: "sequence",
      key: "sequence",
      // render: (text, record, index) => index + 1, // Render sequence number
    },

    {
      title: "🔧",
      dataIndex: "done",
      key: "done",
      render: (checked) =>
        checked ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />,
    },
    {
      title: "İş Tanım",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Personel",
      dataIndex: "personel",
      key: "personel",
    },
    {
      title: "Maliyet",
      dataIndex: "cost",
      key: "cost",
    },
    {
      title: "Süre",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Başlangıç Zamanı",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => (text ? dayjs(text).format("DD-MM-YYYY") : ""),
    },
    {
      title: "Bitiş Zamanı",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => (text ? dayjs(text).format("DD-MM-YYYY") : ""),
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            // overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "300px", // Adjust this width as needed
          }}>
          {text}
        </div>
      ),
    },
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
  const totalWidth = 1000;

  // If you want to log the array every time it changes
  useEffect(() => {
    // console.log("Current state of fields:", fields);
  }, [fields]);

  useEffect(() => {
    // Function to fetch options
    const fetchOptions = async () => {
      try {
        const response = await AxiosInstance.get("Vardiyalar"); // Replace with your API endpoint
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

  const fetchedRef = useRef(new Set());

  const isEmriId = watch("isEmriSelectedId");

  useEffect(() => {
    console.log("useEffect triggered for isEmriId:", isEmriId);
    if (isEmriId && !fetchedRef.current.has(isEmriId)) {
      fetchedRef.current.add(isEmriId);
      setLoading(true);
      AxiosInstance.get(`FetchIsEmriKontrolList?isemriID=${isEmriId}`)
        .then((response) => {
          console.log("response", response);
          const fetchedData = response.map((item, index) => ({
            key: item.TB_ISEMRI_KONTROLLIST_ID,
            sequence: index + 1,
            // subject: item.DEP_TANIM,
            type: item.DKN_TANIM,
            // startDate: dayjs(item.ATOLYE_TANIM).format("DD-MM-YYYY"),
            // endDate: dayjs(item.LOKASYON_TANIM).format("DD-MM-YYYY"),
            description: item.DKN_ACIKLAMA,
            // personel: item.PERSONEL_ISIM,
            // done: item.ISK_YAPILDI,
            // cost: item.ISK_MALIYET,
            // ISK_DEGISTIREN_ID: item.ISK_DEGISTIREN_ID,
          }));
          replace(fetchedData);
          fetchedData.forEach((item, index) => {
            setValue(`IsEmriKontrolList[${index}].duration`, item.duration || "");
            setValue(`IsEmriKontrolList[${index}].startDate`, item.startDate || "");
            setValue(`IsEmriKontrolList[${index}].endDate`, item.endDate || "");
            setValue(`IsEmriKontrolList[${index}].startTime`, item.startTime || "");
            setValue(`IsEmriKontrolList[${index}].endTime`, item.endTime || "");
            setValue(`IsEmriKontrolList[${index}].shift`, item.shift || "");
            setValue(`IsEmriKontrolList[${index}].shiftId`, item.shiftId || "");
            setValue(`IsEmriKontrolList[${index}].workshop`, item.workshop || "");
            setValue(`IsEmriKontrolList[${index}].workshopSelectedId`, item.workshopSelectedId || "");
            setValue(`IsEmriKontrolList[${index}].personel`, item.personel || "");
            setValue(`IsEmriKontrolList[${index}].personelSelectedId`, item.personelSelectedId || "");
            setValue(`IsEmriKontrolList[${index}].done`, item.done || false);
            // Set other fields similarly
          });
        })
        .catch((error) => console.error("Error fetching data:", error))
        .finally(() => setLoading(false));
    }
  }, [isEmriId, append, setLoading, AxiosInstance]);

  // const selectedId = watch("procedureSelectedId");

  // useEffect(() => {
  //   if (selectedId) {
  //     setLoading(true);
  //     AxiosInstance.get(`IsTanimKontrolList?isTanimID=${selectedId}`)
  //       .then((response) => {
  //         const fetchedData = response.map((item, index) => ({
  //           key: item.TB_IS_TANIM_KONROLLIST_ID,
  //           sequence: index + 1,
  //           // subject: item.DEP_TANIM,
  //           type: item.ISK_TANIM,
  //           // startDate: dayjs(item.ATOLYE_TANIM).format("DD-MM-YYYY"),
  //           // endDate: dayjs(item.LOKASYON_TANIM).format("DD-MM-YYYY"),
  //           description: item.ISK_ACIKLAMA,
  //           // personel: item.PERSONEL_ISIM,
  //           // done: item.ISK_YAPILDI,
  //           // cost: item.ISK_MALIYET,
  //           // ISK_DEGISTIREN_ID: item.ISK_DEGISTIREN_ID,
  //         }));
  //         replace(fetchedData);
  //         fetchedData.forEach((item, index) => {
  //           setValue(`IsEmriKontrolList[${index}].duration`, item.duration || "");
  //           setValue(`IsEmriKontrolList[${index}].startDate`, item.startDate || "");
  //           setValue(`IsEmriKontrolList[${index}].endDate`, item.endDate || "");
  //           setValue(`IsEmriKontrolList[${index}].startTime`, item.startTime || "");
  //           setValue(`IsEmriKontrolList[${index}].endTime`, item.endTime || "");
  //           setValue(`IsEmriKontrolList[${index}].shift`, item.shift || "");
  //           setValue(`IsEmriKontrolList[${index}].shiftId`, item.shiftId || "");
  //           setValue(`IsEmriKontrolList[${index}].workshop`, item.workshop || "");
  //           setValue(`IsEmriKontrolList[${index}].workshopSelectedId`, item.workshopSelectedId || "");
  //           setValue(`IsEmriKontrolList[${index}].personel`, item.personel || "");
  //           setValue(`IsEmriKontrolList[${index}].personelSelectedId`, item.personelSelectedId || "");
  //           setValue(`IsEmriKontrolList[${index}].done`, item.done || false);
  //           // Set other fields similarly
  //         });
  //       })
  //       .catch((error) => console.error("Error fetching data:", error))
  //       .finally(() => setLoading(false));
  //   }
  // }, [selectedId, replace, setLoading, AxiosInstance]);

  // const fetch = useCallback(() => {
  //   setLoading(true);
  //   AxiosInstance.get(`IsTanimKontrolList?isTanimID=${selectedId}`)
  //     .then((response) => {
  //       const fetchedData = response.map((item, index) => ({
  //         key: item.TB_IS_TANIM_KONROLLIST_ID,
  //         sequence: index + 1,
  //         // subject: item.DEP_TANIM,
  //         type: item.ISK_TANIM,
  //         // startDate: dayjs(item.ATOLYE_TANIM).format("DD-MM-YYYY"),
  //         // endDate: dayjs(item.LOKASYON_TANIM).format("DD-MM-YYYY"),
  //         description: item.ISK_ACIKLAMA,
  //         // personel: item.PERSONEL_ISIM,
  //         // done: item.ISK_YAPILDI,
  //         // cost: item.ISK_MALIYET,
  //         // ISK_DEGISTIREN_ID: item.ISK_DEGISTIREN_ID,
  //       }));
  //       replace(fetchedData);
  //       fetchedData.forEach((item, index) => {
  //         setValue(`IsEmriKontrolList[${index}].duration`, item.duration || "");
  //         setValue(`IsEmriKontrolList[${index}].startDate`, item.startDate || "");
  //         setValue(`IsEmriKontrolList[${index}].endDate`, item.endDate || "");
  //         setValue(`IsEmriKontrolList[${index}].startTime`, item.startTime || "");
  //         setValue(`IsEmriKontrolList[${index}].endTime`, item.endTime || "");
  //         setValue(`IsEmriKontrolList[${index}].shift`, item.shift || "");
  //         setValue(`IsEmriKontrolList[${index}].shiftId`, item.shiftId || "");
  //         setValue(`IsEmriKontrolList[${index}].workshop`, item.workshop || "");
  //         setValue(`IsEmriKontrolList[${index}].workshopSelectedId`, item.workshopSelectedId || "");
  //         setValue(`IsEmriKontrolList[${index}].personel`, item.personel || "");
  //         setValue(`IsEmriKontrolList[${index}].personelSelectedId`, item.personelSelectedId || "");
  //         setValue(`IsEmriKontrolList[${index}].done`, item.done || false);
  //         // Set other fields similarly
  //       });
  //     })
  //     .catch((error) => console.error("Error fetching data:", error))
  //     .finally(() => setLoading(false));
  // }, [selectedId, replace]);

  // useEffect(() => {
  //   if (selectedId) {
  //     fetch();
  //   }
  // }, [selectedId, fetch]);

  const showModal = (mode, record = null, index = null) => {
    setModalMode(mode);
    if (mode === "edit") {
      setEditingRecord({ ...record, index }); // Set data for editing
      setValue("sequence", record.sequence);
      setValue("type", record.type);
      setValue("done", record.done);
      setValue("shift", record.shift);
      setValue("shiftId", record.shiftId);
      setValue("startDate", record.startDate);
      setValue("startTime", record.startTime);
      setValue("endDate", record.endDate);
      setValue("endTime", record.endTime);
      setValue("duration", record.duration);
      setValue("description", record.description);
      setValue("workshop", record.workshop);
      setValue("workshopSelectedId", record.workshopSelectedId);
      setValue("personel", record.personel);
      setValue("personelSelectedId", record.personelSelectedId);
    } else {
      // reset(); // Reset form for adding new record
      setEditingRecord(null); // Reset editing record
      setValue("description", ""); // Reset description field
      setValue("duration", ""); // Reset duration field
      setValue("endDate", ""); // Reset endDate field
      setValue("endTime", ""); // Reset endTime field
      setValue("shift", ""); // Reset shift field
      setValue("shiftId", ""); // Reset shiftId field
      setValue("startDate", ""); // Reset startDate field
      setValue("startTime", ""); // Reset startTime field
      setValue("type", ""); // Reset type field
      setValue("done", false); // Reset done field
      setValue("sequence", ""); // Reset sequence field
      setValue("workshop", "");
      setValue("workshopSelectedId", "");
      setValue("personel", "");
      setValue("personelSelectedId", "");
    }
    setIsModalOpen(true);
  };
  // Submit handler
  const onSubmit = (data) => {
    append(data);
    setValue("description", ""); // Reset description field
    setValue("duration", ""); // Reset duration field
    setValue("endDate", ""); // Reset endDate field
    setValue("endTime", ""); // Reset endTime field
    setValue("shift", ""); // Reset shift field
    setValue("shiftId", ""); // Reset shiftId field
    setValue("startDate", ""); // Reset startDate field
    setValue("startTime", ""); // Reset startTime field
    setValue("type", ""); // Reset type field
    setValue("done", false); // Reset done field
    setValue("sequence", ""); // Reset sequence field
    setValue("workshop", "");
    setValue("workshopSelectedId", "");
    setValue("personel", "");
    setValue("personelSelectedId", "");

    // reset(); // Reset form fields after submission
  };
  const handleOk = () => {
    handleSubmit(onSubmit)(); // Trigger form submit
    setIsModalOpen(false);
  };

  const handleFormSubmit = (data) => {
    if (modalMode === "add") {
      append(data);
    } else if (modalMode === "edit" && editingRecord) {
      update(editingRecord.index, data);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onCheckboxChange = (e) => {
    setIsDisabled(!e.target.checked); // Toggle the isDisabled state based on the checkbox value
  };

  return (
    <div>
      <Button
        type="link"
        onClick={() => showModal("add")}
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
      <Modal
        width="701px"
        title={modalMode === "add" ? "Kontrol Ekle" : "Kontrol Düzenle"}
        open={isModalOpen}
        onOk={handleSubmit(handleFormSubmit)}
        onCancel={handleCancel}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "21px" }}>
              <Text>Sira no</Text>
              <Controller
                name="sequence" // Example field name
                control={control}
                render={({ field }) => <Input {...field} style={{ width: "100px" }} />}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Text>İş Tanımı</Text>
              <Controller
                name="type"
                control={control}
                render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
              />
            </div>
            <Controller
              name="done"
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <Checkbox
                  checked={value}
                  onChange={(e) => {
                    onChange(e.target.checked);
                    setIsDisabled(!e.target.checked); // Update disabled state based on checkbox
                  }}
                  ref={ref}>
                  Yapildi
                </Checkbox>
              )}
            />
            <div style={{ border: "1px solid #8080806e ", padding: "10px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
                  <Workshop
                    currentValue={editingRecord?.workshop}
                    workshopSelectedId={editingRecord?.workshopSelectedId}
                    onSubmit={(selectedData) => {
                      setValue("workshop", selectedData.code);
                      setValue("workshopSelectedId", selectedData.key);
                    }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
                  <Personel
                    personelCurrentValue={editingRecord?.personel}
                    personelSelectedId={editingRecord?.personelSelectedId}
                    onSubmit={(selectedData) => {
                      setValue("personel", selectedData.subject);
                      setValue("personelSelectedId", selectedData.key);
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "space-between" }}>
                  <Text>Vardiya</Text>
                  <Controller
                    name="shift"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelInValue
                        disabled={!isDoneChecked}
                        style={{ width: "507px" }}
                        showSearch
                        allowClear
                        placeholder="Seçim yapınız"
                        optionFilterProp="children"
                        options={selectOptions.map((option) => ({ label: option.label, value: option.value }))}
                        // If you need additional handling in onChange, you can do it like this:
                        onChange={(selected) => {
                          field.onChange(selected); // Update the form state
                          setValue("shiftId", selected ? selected.value : null); // Update the form state
                          // Additional actions if needed
                        }}
                      />
                    )}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
                  <Text>Başlangıç Zamanı</Text>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "507px",
                      justifyContent: "space-between",
                    }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => <DatePicker {...field} disabled={!isDoneChecked} format="DD-MM-YYYY" />}
                      />
                      <Controller
                        name="startTime"
                        control={control}
                        render={({ field }) => <TimePicker {...field} disabled={!isDoneChecked} format="HH:mm" />}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
                  <Text>Bitiş Zamanı</Text>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "507px",
                      justifyContent: "space-between",
                    }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => <DatePicker {...field} disabled={!isDoneChecked} format="DD-MM-YYYY" />}
                      />
                      <Controller
                        name="endTime"
                        control={control}
                        render={({ field }) => <TimePicker {...field} disabled={!isDoneChecked} format="HH:mm" />}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <Text>Süre(dk)</Text>
                      <Controller
                        name="duration"
                        control={control}
                        render={({ field }) => (
                          <Input {...field} disabled={!isDoneChecked} style={{ width: "141px" }} />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text>Açıklama</Text>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextArea {...field} disabled={!isDoneChecked} style={{ width: "507px" }} rows={3} />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>
      <Table
        dataSource={fields}
        columns={columns}
        loading={loading}
        scroll={{ x: totalWidth }}
        onRow={(record, index) => ({
          onClick: () => showModal("edit", record, index),
        })}
      />
    </div>
  );
}
