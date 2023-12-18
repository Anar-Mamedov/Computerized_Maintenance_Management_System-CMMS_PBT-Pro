import { Col, Input, InputNumber, Row, Select, Slider, Typography, DatePicker, TimePicker, Checkbox } from "antd";
import React, { useState } from "react";
import { useForm, Controller, useFormContext } from "react-hook-form";
import Procedure from "../components/DetailedInformationFields/Procedure";
import Priority from "./DetailedInformationFields/Priority";
import Workshop from "./DetailedInformationFields/Workshop";
import CalendarTable from "./DetailedInformationFields/CalendarTable";
import Instruction from "./DetailedInformationFields/Instruction";
import Reason from "./DetailedInformationFields/Reason";
import Type from "./DetailedInformationFields/Type";
import CostCenter from "./DetailedInformationFields/CostCenter";
import Project from "./DetailedInformationFields/Project";
import Contract from "./DetailedInformationFields/contract";
import Company from "./DetailedInformationFields/company";
import dayjs from "dayjs";

const { TextArea } = Input;

const { Text, Link } = Typography;

const onChange = (date, dateString) => {};

const onChangeCheck = (e) => {};

const FinancialDetailsTable = () => {
  const { control, watch, setValue } = useFormContext();
  const [sliderInputValue, setSliderInputValue] = useState(0);
  const [editingRecord, setEditingRecord] = useState(null);
  const startDate = watch("StartedDate");
  const startTime = watch("StartedTime");
  const endDate = watch("FinishedDate");
  const endTime = watch("FinishedTime");

  const onChangeSlider = (newSliderValue) => {
    setSliderInputValue(newSliderValue);
  };

  const onChange = (value) => {};
  const onSearch = (value) => {};

  // Filter `option.label` match the user type `input`
  const filterOption = (input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  // const [value, setValue] = React.useState(30);

  // working time calculation

  const calculateTimeDifference = () => {
    const startDate = watch("StartedDate");
    const startTime = watch("StartedTime");
    const endDate = watch("FinishedDate");
    const endTime = watch("FinishedTime");

    if (startDate && startTime && endDate && endTime) {
      if (
        dayjs(startDate).format("DD") === dayjs(endDate).format("DD") &&
        dayjs(startDate).format("MM") === dayjs(endDate).format("MM") &&
        dayjs(startDate).format("YYYY") === dayjs(endDate).format("YYYY")
      ) {
        const startDateTime = dayjs(
          `${startDate.format("DD-MM-YYYY")} ${startTime.format("HH:mm")}`,
          "DD-MM-YYYY HH:mm"
        );
        const endDateTime = dayjs(`${endDate.format("DD-MM-YYYY")} ${endTime.format("HH:mm")}`, "DD-MM-YYYY HH:mm");

        const diffInMinutes = endDateTime.diff(startDateTime, "minute");

        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;

        setValue("WorkingTimeHours", hours);
        setValue("WorkingTimeMinutes", minutes);
      } else {
        setValue("WorkingTimeHours", "");
        setValue("WorkingTimeMinutes", "");
      }
    }
  };

  // working time calculation end

  const handleDateChange = (date, onChange) => {
    // Format the date to day-month-year and call the onChange function of Controller
    onChange(date ? dayjs(date).format("DD-MM-YYYY") : "");
  };

  return (
    <Row
      style={{ display: "flex", gap: "20px" }}
      // container xs={12} gap="20px"
    >
      <Col
        style={{ display: "flex", flexDirection: "column", gap: "20px", width: "840px" }}
        // container maxWidth="53%"
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ borderBottom: "1px solid gray", marginBottom: "10px" }}>
            <Text style={{ color: "#0084ff", fontWeight: "400" }}>İş Bilgileri</Text>
          </div>
          <div style={{ display: "flex", gap: "5px", flexDirection: "row", flexWrap: "wrap", columnGap: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "space-between",
                width: "380px",
              }}>
              <Procedure />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "space-between",
                width: "380px",
              }}>
              <Text style={{ fontSize: "14px" }}>Konu:</Text>
              <Controller
                name="Konu"
                control={control}
                render={({ field }) => <Input disabled {...field} style={{ width: "300px" }} />}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "space-between",
                width: "380px",
              }}>
              <Type />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "space-between",
                width: "380px",
              }}>
              <Reason />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "space-between",
                width: "380px",
              }}>
              <Priority />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "space-between",
                width: "380px",
              }}>
              <Workshop
                currentValue={editingRecord?.workshop}
                workshopSelectedId={editingRecord?.workshopSelectedId}
                onSubmit={(selectedData) => {
                  setValue("workshop", selectedData.code);
                  setValue("workshopSelectedId", selectedData.key);
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "space-between",
                width: "380px",
              }}>
              <CalendarTable />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "space-between",
                width: "380px",
              }}>
              <Instruction />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", width: "400px" }}>
            <div style={{ borderBottom: "1px solid gray", marginBottom: "10px" }}>
              <Text style={{ color: "#0084ff", fontWeight: "400" }}>İş Talebi</Text>
            </div>
            <div style={{ display: "flex", gap: "5px", flexDirection: "column", flexWrap: "wrap" }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "space-between",
                }}>
                <Text style={{ fontSize: "14px" }}>İş Takip Kodu:</Text>
                <Controller
                  name="İşTakipKodu"
                  control={control}
                  render={({ field }) => <Input {...field} style={{ width: "300px" }} disabled />}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "space-between",
                }}>
                <Text style={{ fontSize: "14px" }}>Talep Eden:</Text>
                <Controller
                  name="TalepEden"
                  control={control}
                  render={({ field }) => <Input {...field} style={{ width: "300px" }} disabled />}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "space-between",
                }}>
                <Text style={{ fontSize: "14px" }}>Tarih:</Text>
                <div style={{ width: "300px", display: "flex", gap: "10px" }}>
                  <Controller
                    name="detailDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        style={{ width: "168px" }}
                        format="DD-MM-YYYY"
                        placeholder="Tarih seçiniz"
                        disabled
                      />
                    )}
                  />
                  <Controller
                    name="detailTime"
                    control={control}
                    render={({ field }) => <TimePicker {...field} format="HH:mm" placeholder="saat seçiniz" disabled />}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  gap: "10px",
                  justifyContent: "space-between",
                }}>
                <Text style={{ fontSize: "14px" }}>Açıklama:</Text>
                <Controller
                  name="aciklama"
                  control={control}
                  render={({ field }) => <TextArea {...field} style={{ width: "300px" }} />}
                />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column", width: "420px" }}>
            <div style={{ dispaly: "flex", flexWrap: "wrap", borderBottom: "1px solid gray", marginBottom: "10px" }}>
              <Text style={{ color: "#0084ff", fontWeight: "400" }}>Detay Bilgiler</Text>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", flexDirection: "column" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", flexDirection: "column" }}>
                <CostCenter
                  onSubmit={(selectedData) => {
                    setValue("costcenterDetailsTab", selectedData.age);
                    setValue("costcenterSelectedIdDetailsTab", selectedData.key);
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "space-between",
                }}>
                <Project />
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "space-between",
                }}>
                <Text style={{ fontSize: "14px" }}>Referans No:</Text>
                <Controller
                  name="ReferansNo"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} style={{ width: "300px" }} placeholder="Referans No giriniz" />
                  )}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "space-between",
                }}>
                <Text style={{ fontSize: "14px" }}>Tamamlama (%):</Text>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", width: "300px" }}>
                  <div>
                    <Controller
                      name="Tamamlama"
                      control={control}
                      render={({ field }) => (
                        <div style={{ display: "flex", width: "300px" }}>
                          <Col span={15}>
                            <Slider
                              min={0}
                              max={100}
                              onChange={(value) => {
                                field.onChange(value); // Update the form state
                                setSliderInputValue(value); // Update the local state if necessary
                              }}
                              value={field.value || 0} // Use the field's value
                            />
                          </Col>
                          <Col span={4}>
                            <InputNumber
                              {...field}
                              min={0}
                              max={100}
                              style={{ margin: "0 16px" }}
                              value={field.value || 0} // Use the field's value
                            />
                          </Col>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Col>
      <div width="500px">
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", borderBottom: "1px solid gray", marginBottom: "10px" }}>
            <Text style={{ color: "#0084ff", fontWeight: "400" }}>Çalışma Süresi</Text>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}>
            <Text style={{ fontSize: "14px" }}>Planlanan Başlama:</Text>
            <div style={{ width: "300px", display: "flex", gap: "10px" }}>
              <Controller
                name="PlannedCommencementDate"
                control={control}
                render={({ field }) => (
                  <DatePicker {...field} style={{ width: "168px" }} format="DD-MM-YYYY" placeholder="Tarih seçiniz" />
                )}
              />
              <Controller
                name="PlannedCommencementTime"
                control={control}
                render={({ field }) => <TimePicker {...field} format="HH:mm" placeholder="saat seçiniz" />}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}>
            <Text style={{ fontSize: "14px" }}>Planlanan Bitiş:</Text>
            <div style={{ width: "300px", display: "flex", gap: "10px" }}>
              <Controller
                name="PlannedCompletionDate"
                control={control}
                render={({ field }) => (
                  <DatePicker {...field} format="DD-MM-YYYY" style={{ width: "168px" }} placeholder="Tarih seçiniz" />
                )}
              />
              <Controller
                name="PlannedCompletionTime"
                control={control}
                render={({ field }) => <TimePicker {...field} format="HH:mm" placeholder="saat seçiniz" />}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}>
            <Text style={{ fontSize: "14px" }}>Başlama Zamanı:</Text>
            <div style={{ width: "300px", display: "flex", gap: "10px" }}>
              <Controller
                name="StartedDate"
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
                name="StartedTime"
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
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}>
            <Text style={{ fontSize: "14px" }}>Bitiş Zamanı:</Text>
            <div style={{ width: "300px", display: "flex", gap: "10px" }}>
              <Controller
                name="FinishedDate"
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
                name="FinishedTime"
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
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}>
            <Text style={{ fontSize: "14px" }}>Çalışma Süresi (saat - dk.):</Text>
            <div style={{ width: "300px", display: "flex", justifyContent: "space-between" }}>
              <Controller
                name="WorkingTimeHours"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "168px" }}
                    onChange={(e) => {
                      // Use a regular expression to replace any non-numeric characters with an empty string
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(e); // Call the original onChange handler
                    }}
                  />
                )}
              />

              <Controller
                name="WorkingTimeMinutes"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ width: "122px" }}
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
        <div>
          <div style={{ borderBottom: "1px solid gray", marginBottom: "10px" }}>
            <Text style={{ color: "#0084ff", fontWeight: "400" }}>Dış Servis</Text>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}>
            <Company
              onSubmit={(selectedData) => {
                setValue("companyDetailsTab", selectedData.subject);
                setValue("companySelectedIdDetailsTab", selectedData.key);
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}>
            <Contract />
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}>
            <Text style={{ fontSize: "14px" }}>Evrak No/Tarihi:</Text>
            <div>
              <Controller
                name="EvrakNo"
                control={control}
                render={({ field }) => (
                  <Input {...field} style={{ width: "160px", marginRight: "10px" }} placeholder="Evrak No giriniz" />
                )}
              />
              <Controller
                name="EvrakTarihi"
                control={control}
                render={({ field }) => (
                  <DatePicker {...field} style={{ width: "168px" }} format="DD-MM-YYYY" placeholder="Tarih seçiniz" />
                )}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}>
            <Text style={{ fontSize: "14px" }}>Dış Servis Maliyet:</Text>
            <div style={{ display: "flex", gap: "10px", width: "350px" }}>
              <Controller
                name="Maliyet"
                control={control}
                render={({ field }) => <Input {...field} style={{ width: "145px" }} placeholder="" />}
              />

              <Controller
                name="MaliyetKapsaminda"
                control={control}
                render={({ field: { onChange, value, ...restField } }) => (
                  <Checkbox
                    {...restField}
                    checked={value} // Use the field's value to determine the checked state
                    onChange={(e) => onChange(e.target.checked)} // Update the form state with true or false
                    style={{ display: "flex", alignItems: "center" }}>
                    Garanti Kapsamında
                  </Checkbox>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </Row>
  );
};

export default FinancialDetailsTable;
