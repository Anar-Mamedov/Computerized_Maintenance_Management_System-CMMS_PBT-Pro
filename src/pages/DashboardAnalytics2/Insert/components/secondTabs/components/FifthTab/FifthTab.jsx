import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Typography, Checkbox, DatePicker, TimePicker, Select, Table } from "antd";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import Project from "../DetailedInformationFields/Project";
import ReasonForStopping from "./components/reasonForStopping";
import dayjs from "dayjs"; // Changed from 'moment' to 'dayjs'

const { Text, Link } = Typography;

export default function FifthTab() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // Track the index of the editing item
  const [inputValue, setInputValue] = useState("");
  const { control, setValue, watch, getValues, reset, handleSubmit } = useFormContext();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "IsEmriDurusList",
  });

  const showModalToAdd = () => {
    setEditingIndex(null);
    // reset();
    setValue("machineDescription", "");
    setValue("statusLocation", "");
    setValue("durusStartedDate", null);
    setValue("durusStartedTime", null);
    setValue("durusFinishedDate", null);
    setValue("durusFinishedTime", null);
    setValue("durusWorkingTimeHours", "");
    setValue("durusWorkingTimeMinutes", "");
    setValue("downtimeCost", "");
    setValue("durusTotalCost", "");
    setValue("DurusStallDescription", "");
    setValue("plannedDowntime", false);
    setIsModalVisible(true);
  };

  const showModalToEdit = (index) => {
    setEditingIndex(index);
    const record = fields[index];

    // Set values for each field individually according to your form structure
    setValue("machineDescription", record.machineDescription);
    setValue("statusLocation", record.statusLocation);
    // Assuming 'durusStartedDate', 'durusStartedTime', etc., are the correct field names
    setValue("durusStartedDate", record.durusStartedDate);
    setValue("durusStartedTime", record.durusStartedTime);
    setValue("durusFinishedDate", record.durusFinishedDate);
    setValue("durusFinishedTime", record.durusFinishedTime);
    setValue("durusWorkingTimeHours", record.durusWorkingTimeHours);
    setValue("durusWorkingTimeMinutes", record.durusWorkingTimeMinutes);
    setValue("downtimeCost", record.downtimeCost);
    setValue("durusTotalCost", record.durusTotalCost);
    setValue("DurusStallDescription", record.DurusStallDescription);
    setValue("plannedDowntime", record.plannedDowntime);

    setIsModalVisible(true);
  };

  const handleFormSubmit = (data) => {
    const formData = {
      ...data,
      machineDescription: inputValue, // Assuming you want to use the inputValue state
      // ... include other fields as necessary
    };

    if (editingIndex !== null) {
      update(editingIndex, formData);
    } else {
      append(formData);
    }
    setIsModalVisible(false);
    // reset(); // Reset the form after submission
  };

  const calculateTimeDifference = () => {
    const startDate = watch("durusStartedDate");
    const startTime = watch("durusStartedTime");
    const endDate = watch("durusFinishedDate");
    const endTime = watch("durusFinishedTime");

    if (startDate && startTime && endDate && endTime) {
      // Check if the day, month, and year of the start and end dates are the same
      if (
        startDate.format("DD") === endDate.format("DD") &&
        startDate.format("MM") === endDate.format("MM") &&
        startDate.format("YYYY") === endDate.format("YYYY")
      ) {
        // Combine date and time for start and end
        const startDateTime = dayjs(
          `${startDate.format("DD-MM-YYYY")} ${startTime.format("HH:mm")}`,
          "DD-MM-YYYY HH:mm"
        );
        const endDateTime = dayjs(`${endDate.format("DD-MM-YYYY")} ${endTime.format("HH:mm")}`, "DD-MM-YYYY HH:mm");

        // Calculate the difference in minutes
        const diffInMinutes = endDateTime.diff(startDateTime, "minutes");

        // Convert the difference to hours and minutes
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;

        // Set the values to the form fields
        setValue("durusWorkingTimeHours", hours);
        setValue("durusWorkingTimeMinutes", minutes);
      } else {
        // If the day, month, and year are not the same, you can reset the fields or show an error message
        setValue("durusWorkingTimeHours", "");
        setValue("durusWorkingTimeMinutes", "");
        // Optionally, show an error message to the user
        // alert("Start and end dates must be on the same day!");
      }
    }
  };

  const columns = [
    {
      title: "Duruş Nedeni",
      dataIndex: "DurusNedeni",
      key: "DurusNedeni",
    },
    {
      title: "Planlı",
      dataIndex: "plannedDowntime",
      key: "plannedDowntime",
      render: (text, record) => <Checkbox checked={record.plannedDowntime} disabled />,
    },
    {
      title: "Başlama Tarihi",
      dataIndex: "durusStartedDate",
      key: "durusStartedDate",
      render: (text) => (text ? dayjs(text).format("DD-MM-YYYY") : ""),
    },
    {
      title: "Başlama Saati",
      dataIndex: "durusStartedTime",
      key: "durusStartedTime",
      render: (text) => (text ? dayjs(text).format("HH:mm") : ""),
    },
    {
      title: "Bitiş Tarihi",
      dataIndex: "durusFinishedDate",
      key: "durusFinishedDate",
      render: (text) => (text ? dayjs(text).format("DD-MM-YYYY") : ""),
    },
    {
      title: "Bitiş Saati",
      dataIndex: "durusFinishedTime",
      key: "durusFinishedTime",
      render: (text) => (text ? dayjs(text).format("HH:mm") : ""),
    },
    {
      title: "Süre (Saat)",
      dataIndex: "durusWorkingTimeHours",
      key: "durusWorkingTimeHours",
    },
    {
      title: "Süre (Dakika)",
      dataIndex: "durusWorkingTimeMinutes",
      key: "durusWorkingTimeMinutes",
    },
    {
      title: "Toplam Maliyet",
      dataIndex: "durusTotalCost",
      key: "durusTotalCost",
    },
    {
      title: "",
      key: "delete",
      render: (_, field, index) => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button
            danger
            onClick={(e) => {
              e.stopPropagation(); // Prevent event from reaching the row
              remove(index);
            }}
            icon={<DeleteOutlined />}>
            Sil
          </Button>
        </div>
      ),
    },
    // ... define other columns based on the data you want to show
  ];

  return (
    <div>
      <Button
        type="link"
        onClick={showModalToAdd}
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
        width="793px"
        title={editingIndex !== null ? "Edit Item" : "Add Item"}
        open={isModalVisible}
        onOk={handleSubmit(handleFormSubmit)}
        onCancel={() => setIsModalVisible(false)}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "29px" }}>
              <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Makine Tanımı:</Text>
              <Controller
                name="machineDescription"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    style={{ width: "100%" }}
                    {...field}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      field.onChange(e.target.value);
                    }}
                    disabled
                  />
                )}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "60px" }}>
              <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Lokasyon:</Text>
              <Controller
                name="statusLocation"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    style={{ width: "100%" }}
                    {...field}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      field.onChange(e.target.value);
                    }}
                    disabled
                  />
                )}
              />
            </div>
            <Project />
            <ReasonForStopping />
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #80808063",
                  width: "450px",
                  padding: "10px",
                  gap: "10px",
                }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: "14px" }}>Başlangıç Zamanı</Text>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Controller
                      name="durusStartedDate"
                      control={control}
                      rules={{ required: true }} // Add validation rules as needed
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          style={{ width: "100%" }}
                          format="DD-MM-YYYY"
                          onChange={(date) => {
                            field.onChange(date);
                            calculateTimeDifference();
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="durusStartedTime"
                      control={control}
                      rules={{ required: true }} // Add validation rules as needed
                      render={({ field }) => (
                        <TimePicker
                          {...field}
                          format="HH:mm"
                          onChange={(time) => {
                            field.onChange(time);
                            calculateTimeDifference();
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: "14px" }}>Bitiş Zamanı:</Text>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Controller
                      name="durusFinishedDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          style={{ width: "168px" }}
                          placeholder="Tarih seçiniz"
                          format="DD-MM-YYYY"
                          onChange={(date, dateString) => {
                            field.onChange(date);
                            calculateTimeDifference();
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="durusFinishedTime"
                      control={control}
                      render={({ field }) => (
                        <TimePicker
                          {...field}
                          format="HH:mm"
                          placeholder="saat seçiniz"
                          onChange={(date, dateString) => {
                            field.onChange(date);
                            calculateTimeDifference();
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                  <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Duruş Süresi (saat - dk.):</Text>
                  <div style={{ width: "100%", display: "flex", justifyContent: "space-between", gap: "10px" }}>
                    <Controller
                      name="durusWorkingTimeHours"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          style={{ width: "100%" }}
                          onChange={(e) => {
                            // Use a regular expression to replace any non-numeric characters with an empty string
                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                            field.onChange(e); // Call the original onChange handler
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="durusWorkingTimeMinutes"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          style={{ width: "100%" }}
                          onChange={(e) => {
                            // Use a regular expression to replace any non-numeric characters with an empty string
                            e.target.value = e.target.value.replace(/[^0-9]/g, "");

                            // Check if the value is greater than 59
                            if (parseInt(e.target.value, 10) > 59) {
                              e.target.value = "59";
                            }

                            field.onChange(e); // Call the original onChange handler
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #80808063",
                  width: "285px",
                  padding: "10px",
                  gap: "10px",
                }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                  <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Duruş Maliyeti (Saat):</Text>
                  <Controller
                    name="downtimeCost"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        style={{ width: "100%" }}
                        onChange={(e) => {
                          // Use a regular expression to replace any non-numeric characters with an empty string
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                          field.onChange(e); // Call the original onChange handler
                        }}
                      />
                    )}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                  <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Toplam Maliyet:</Text>
                  <Controller
                    name="durusTotalCost"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        style={{ width: "100%", maxWidth: "114px" }}
                        onChange={(e) => {
                          // Use a regular expression to replace any non-numeric characters with an empty string
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                          field.onChange(e); // Call the original onChange handler
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
              <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Duruş Açıklaması:</Text>
              <Controller
                name="DurusStallDescription"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      field.onChange(e); // Call the original onChange handler
                    }}
                  />
                )}
              />
            </div>
            <Controller
              name="plannedDowntime"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                  Planlı Duruş
                </Checkbox>
              )}
            />
          </div>
        </form>
      </Modal>
      <Table
        dataSource={fields}
        columns={columns}
        onRow={(record, rowIndex) => ({
          onClick: () => showModalToEdit(rowIndex),
        })}
      />
    </div>
  );
}
