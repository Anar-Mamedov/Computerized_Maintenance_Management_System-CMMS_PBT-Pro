import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Table, Typography, DatePicker, TimePicker } from "antd";
import React from "react";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import Unit from "./components/unit";
import dayjs from "dayjs";

const { Text } = Typography;

export default function NinthTab() {
  const { control, handleSubmit, reset, setValue, getValues } = useFormContext();
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "IsEmriOlcumDegeriList",
  });

  const isModalOpen = getValues("isModalOpen");
  const isEditModalOpen = getValues("isEditModalOpen");
  const editingIndex = getValues("editingIndex"); // Use index instead of record for editing

  const showModal = () => {
    // Get the current records before resetting the form
    const currentRecords = getValues("IsEmriOlcumDegeriList");

    // Reset the form fields but preserve the existing records
    reset({
      ...getValues(), // Spread all current values
      olcumSeriesNo: "",
      olcumDescription: "",
      olcumDecimalNumber: "",
      olcumTargetValue: "",
      olcumLimit: "",
      olcumMaxValue: "", // Reset the max value
      olcumMinValue: "", // Reset the min value
      olcumUnit: "", // Reset the unit value
      olcumDifference: "",
      olcumMeasurementvalue: "",
      olcumStatus: "",
      // ... any other fields you want to reset
      records: currentRecords, // Preserve the current records
    });

    setValue("isModalOpen", true);
  };

  const showEditModal = (record, index) => {
    // Close the add modal if it's open
    setValue("isModalOpen", false);
    setValue("editingIndex", index); // Set the editing index

    // Extract and set the date and time
    const dateTime = record.dateTime ? dayjs(record.dateTime) : null;
    setValue("editingRecord.date", dateTime ? dateTime.format("DD-MM-YYYY") : null);
    setValue("editingRecord.time", dateTime ? dateTime.format("HH:mm:ss") : null);

    // Set the values for the record being edited
    setValue("olcumSeriesNo", record.olcumSeriesNo);
    setValue("olcumDescription", record.olcumDescription);
    setValue("olcumDecimalNumber", record.olcumDecimalNumber);
    setValue("olcumTargetValue", record.olcumTargetValue);
    setValue("olcumLimit", record.olcumLimit);
    setValue("olcumMaxValue", record.olcumMaxValue);
    setValue("olcumMinValue", record.olcumMinValue);
    setValue("olcumUnit", record.olcumUnit || "defaultUnitValue");
    setValue("olcumDifference", record.olcumDifference);
    setValue("olcumMeasurementvalue", record.olcumMeasurementvalue);
    setValue("olcumStatus", record.olcumStatus);
    // ... add any other fields present in the record ...

    // Open the edit modal
    setValue("isEditModalOpen", true);
  };

  const onSubmit = (data) => {
    // Your form submission logic goes here
    append({
      ...data,
      // ...rest of the data fields
      olcumMeasurementvalue: data.olcumMeasurementvalue,
      olcumDifference: data.olcumDifference,
      olcumStatus: data.olcumStatus,
      olcumUnit: data.olcumUnit, // Include the unit value
      olcumMaxValue: data.olcumMaxValue, // Include the max value
      olcumMinValue: data.olcumMinValue, // Include the min value
      dateTime: dayjs().toISOString(),
      key: fields.length + 1,
    });
    setValue("isModalOpen", false);
  };

  const handleAddOk = () => {
    handleSubmit(onSubmit)();
  };

  const onEditSubmit = (data) => {
    const editingIndex = getValues("editingIndex");
    if (typeof editingIndex === "undefined") {
      console.error("Editing index is undefined");
      return;
    }

    const datePart = getValues("editingRecord.date");
    const timePart = getValues("editingRecord.time");
    let combinedDateTime = datePart && timePart ? dayjs(`${datePart} ${timePart}`, "DD-MM-YYYY HH:mm:ss") : null;

    if (combinedDateTime && !combinedDateTime.isValid()) {
      console.error("Invalid date or time provided");
      return;
    }

    const updatedDateTime = combinedDateTime ? combinedDateTime.toISOString() : null;
    const targetValue = parseFloat(data.olcumTargetValue || 0);
    const measurementValue = parseFloat(data.olcumMeasurementvalue || 0);
    const { difference, status } = calculateDifferenceAndUpdateStatus(measurementValue, targetValue);
    // Update the record in the useFieldArray

    update(editingIndex, {
      ...data,
      olcumDifference: difference.toString(),
      olcumStatus: status,
      dateTime: updatedDateTime,
      // other data manipulations if necessary
    });

    setValue("isEditModalOpen", false); // Close the modal after updating
  };

  const handleDateChange = (date, dateString) => {
    setValue("editingRecord.date", dateString);
  };

  const handleTimeChange = (time, timeString) => {
    setValue("editingRecord.time", timeString);
  };

  const handleCancel = () => {
    setValue("isModalOpen", false);
    setValue("isEditModalOpen", false);
  };

  const columns = [
    {
      title: "Sira No",
      dataIndex: "olcumSeriesNo",
      key: "olcumSeriesNo",
    },
    {
      title: "Tanim",
      dataIndex: "olcumDescription",
      key: "olcumDescription",
    },
    {
      title: "Birim",
      dataIndex: "olcumUnit",
      key: "olcumUnit",
      render: (text) => text || "", // Render the unit text or an empty string if it's not available
    },
    {
      title: "Tarih",
      dataIndex: "dateTime",
      key: "date",
      render: (text) => (text ? dayjs(text).format("DD-MM-YYYY") : ""), // Format the date
    },
    {
      title: "Saat",
      dataIndex: "dateTime",
      key: "time",
      render: (text) => (text ? dayjs(text).format("HH:mm:ss") : ""), // Format the time
    },
    {
      title: "Hedef Deger",
      dataIndex: "olcumTargetValue",
      key: "olcumTargetValue",
    },
    {
      title: "Ölçüm Değeri",
      dataIndex: "olcumMeasurementvalue",
      key: "olcumMeasurementvalue",
    },
    {
      title: "Fark",
      dataIndex: "olcumDifference",
      key: "olcumDifference",
    },
    {
      title: "Durum",
      dataIndex: "olcumStatus",
      key: "olcumStatus",
      // change text color based on the status
      render: (text) => {
        let color = "green";
        if (text === "Geçersiz") {
          color = "red";
        }
        return <span style={{ color }}>{text}</span>;
      },
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
    // ... Add other columns as needed
  ];

  // Function to handle the calculation and updating of max and min values
  const handleValueChange = (name, value) => {
    const targetValue = getValues("olcumTargetValue");
    const limitValue = getValues("olcumLimit");

    if (name === "olcumLimit" || name === "olcumTargetValue") {
      const max = Number(targetValue) + Number(limitValue);
      const min = Number(targetValue) - Number(limitValue);

      setValue("olcumMaxValue", max.toString());
      setValue("olcumMinValue", min.toString());
    }
  };

  // Function to calculate the difference and update the status
  const calculateDifferenceAndUpdateStatus = (measurementValue) => {
    const targetValue = parseFloat(getValues("olcumTargetValue"));
    const difference = measurementValue - targetValue;
    setValue("olcumDifference", difference.toString()); // Update the difference field

    // Update the status field based on the difference
    const status = difference >= 0 ? "Geçerli" : "Geçersiz";
    setValue("olcumStatus", status);
    return { difference, status };
  };

  // Function to handle the deletion of a record
  const handleDelete = (index) => {
    remove(index);
  };

  // // Update your columns array to include the delete button
  // columns.push({
  //   title: "",
  //   key: "delete",
  //   render: (_, record) => (
  //     <Button
  //       danger
  //       onClick={(event) => {
  //         event.stopPropagation(); // This will prevent the event from propagating to the row
  //         handleDelete(record.key);
  //       }}>
  //       Sil
  //     </Button>
  //   ),
  // });

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
      <Modal width="550px" title="Ölçüm Parametre Tanımı" open={isModalOpen} onOk={handleAddOk} onCancel={handleCancel}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Your form inputs go here */}
          <div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Sira No:</Text>
              <Controller
                name="olcumSeriesNo"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "380px" }}
                    onChange={(e) => {
                      // Use a regular expression to replace any non-numeric characters with an empty string
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(e); // Call the original onChange handler
                    }}
                  />
                )}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Tanim:</Text>
              <Controller
                name="olcumDescription"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "380px" }}
                    onChange={(e) => {
                      field.onChange(e); // Call the original onChange handler
                    }}
                  />
                )}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <Unit />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Ondalık Sayı:</Text>
              <Controller
                name="olcumDecimalNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "380px" }}
                    onChange={(e) => {
                      // Use a regular expression to replace any non-numeric characters with an empty string
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(e); // Call the original onChange handler
                    }}
                  />
                )}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Hedef Değer:</Text>
              <Controller
                name="olcumTargetValue"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "380px" }}
                    onChange={(e) => {
                      // Use a regular expression to replace any non-numeric characters with an empty string
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(e); // Call the original onChange handler
                    }}
                  />
                )}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Limit (+)(-):</Text>
              <Controller
                name="olcumLimit"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "380px" }}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(e); // Call the original onChange handler
                      handleValueChange("olcumLimit", e.target.value); // Perform the calculation
                    }}
                  />
                )}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Minumum Değer:</Text>
              <Controller
                name="olcumMinValue"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "380px" }}
                    onChange={(e) => {
                      // Use a regular expression to replace any non-numeric characters with an empty string
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(e); // Call the original onChange handler
                    }}
                    disabled
                  />
                )}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Maximum Değer:</Text>
              <Controller
                name="olcumMaxValue"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "380px" }}
                    onChange={(e) => {
                      // Use a regular expression to replace any non-numeric characters with an empty string
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(e); // Call the original onChange handler
                    }}
                    disabled
                  />
                )}
              />
            </div>
          </div>
        </form>
      </Modal>
      <Modal
        width="550px"
        title="Ölçüm Parametre Tanımı"
        open={isEditModalOpen}
        onOk={() => handleSubmit(onEditSubmit)()}
        onCancel={handleCancel}>
        <form onSubmit={handleSubmit(onEditSubmit)}>
          <div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <Text>Tarih:</Text>
              <Controller
                name="editingRecord.date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    onChange={handleDateChange}
                    value={field.value ? dayjs(field.value, "DD-MM-YYYY") : null}
                    format="DD-MM-YYYY" // This line ensures the date is displayed in the desired format
                    // ... rest of the DatePicker code
                  />
                )}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <Text>Saat:</Text>
              <Controller
                name="editingRecord.time"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    onChange={handleTimeChange}
                    value={field.value ? dayjs(`1970-01-01T${field.value}`) : null}
                    // ... rest of the TimePicker code
                  />
                )}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <Unit defaultValue={getValues("olcumUnit")} />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Ölçüm Değeri:</Text>
              <Controller
                name="olcumMeasurementvalue"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "380px" }}
                    onChange={(e) => {
                      // Use a regular expression to replace any non-numeric characters with an empty string
                      const numericValue = e.target.value.replace(/[^0-9.]/g, ""); // Allow decimal numbers
                      field.onChange(numericValue); // Call the original onChange handler
                      calculateDifferenceAndUpdateStatus(parseFloat(numericValue)); // Perform the calculation and update status
                    }}
                  />
                )}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Fark:</Text>
              <Controller
                name="olcumDifference"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "380px" }}
                    onChange={(e) => {
                      // Use a regular expression to replace any non-numeric characters with an empty string
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(e); // Call the original onChange handler
                    }}
                    disabled
                  />
                )}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Hedef Değer:</Text>
              <Controller
                name="olcumTargetValue"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "380px" }}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(e); // Call the original onChange handler
                      handleValueChange("olcumTargetValue", e.target.value); // Perform the calculation
                    }}
                    disabled
                  />
                )}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Minumum Değer:</Text>
              <Controller
                name="olcumMinValue"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "380px" }}
                    onChange={(e) => {
                      // Use a regular expression to replace any non-numeric characters with an empty string
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(e); // Call the original onChange handler
                    }}
                    disabled
                  />
                )}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Maximum Değer:</Text>
              <Controller
                name="olcumMaxValue"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "380px" }}
                    onChange={(e) => {
                      // Use a regular expression to replace any non-numeric characters with an empty string
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(e); // Call the original onChange handler
                    }}
                    disabled
                  />
                )}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <Text style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Durum:</Text>
              <Controller
                name="olcumStatus"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "380px" }}
                    onChange={(e) => {
                      // Use a regular expression to replace any non-numeric characters with an empty string
                      field.onChange(e); // Call the original onChange handler
                    }}
                    disabled
                  />
                )}
              />
            </div>
          </div>
        </form>
      </Modal>
      <Table
        dataSource={fields}
        columns={columns}
        rowKey="key"
        onRow={(record, index) => {
          return {
            onClick: () => {
              setValue("editingIndex", index);
              showEditModal(record, index);
            },
          };
        }}
      />
    </>
  );
}
