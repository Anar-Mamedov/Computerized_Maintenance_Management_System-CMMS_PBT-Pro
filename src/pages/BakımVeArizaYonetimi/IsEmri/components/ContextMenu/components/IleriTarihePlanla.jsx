import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Button, Form, Input, message, Modal } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import AxiosInstance from "../../../../../../api/http";
import FullDatePicker from "../../../../../../utils/components/FullDatePicker";
import FullTimePicker from "../../../../../../utils/components/FullTimePicker";
import MenuItem from "./MenuItem";

dayjs.extend(customParseFormat);

const buildDisplayEquipment = (row) => {
  const code = row?.MAKINE_KODU?.trim?.() || "";
  const name = row?.MAKINE_TANIMI?.trim?.() || "";

  if (code && name) return `${code} · ${name}`;
  if (code) return code;
  if (name) return name;
  return "-";
};

const formatDateForRequest = (value) => {
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("YYYY-MM-DDT00:00:00") : null;
};

const formatTimeForRequest = (value) => {
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("HH:mm:ss") : null;
};

const parseTimeValue = (value) => {
  if (!value) return null;

  const parsed = dayjs(value, ["HH:mm:ss", "HH:mm"]);
  return parsed.isValid() ? parsed : null;
};

const formatDuration = (startDate, startTime, endDate, endTime, t) => {
  if (!startDate || !startTime || !endDate || !endTime) {
    return "-";
  }

  const start = dayjs(
    `${dayjs(startDate).format("YYYY-MM-DD")} ${dayjs(startTime).format("HH:mm:ss")}`,
    "YYYY-MM-DD HH:mm:ss"
  );
  const end = dayjs(
    `${dayjs(endDate).format("YYYY-MM-DD")} ${dayjs(endTime).format("HH:mm:ss")}`,
    "YYYY-MM-DD HH:mm:ss"
  );

  if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
    return "-";
  }

  const totalMinutes = end.diff(start, "minute");
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours && minutes) {
    return `${hours} ${t("workOrder.planLater.hourShort")} ${minutes} ${t("workOrder.planLater.minuteShort")}`;
  }
  if (hours) {
    return `${hours} ${t("workOrder.planLater.hourShort")}`;
  }
  return `${minutes} ${t("workOrder.planLater.minuteShort")}`;
};

const FieldLabel = ({ children, required = false }) => (
  <div
    style={{
      fontSize: "14px",
      color: "#1F3251",
      marginBottom: "8px",
      fontWeight: 500,
    }}
  >
    {required && <span style={{ color: "#FF4D4F", marginRight: "4px" }}>*</span>}
    {children}
  </div>
);

const buildPlanDefaults = (item) => ({
  planlananBaslamaTarih: item?.PLAN_BASLAMA_TARIH ? dayjs(item.PLAN_BASLAMA_TARIH) : null,
  planlananBaslamaSaat: parseTimeValue(item?.PLAN_BASLAMA_SAAT),
  planlananBitisTarih: item?.PLAN_BITIS_TARIH ? dayjs(item.PLAN_BITIS_TARIH) : null,
  planlananBitisSaat: parseTimeValue(item?.PLAN_BITIS_SAAT),
  aciklama: "",
});

const isSameDay = (firstDate, secondDate) => {
  if (!firstDate || !secondDate) return false;
  return dayjs(firstDate).isSame(dayjs(secondDate), "day");
};

export default function IleriTarihePlanla({ selectedRows, refreshTableData, hidePopover }) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const methods = useForm({
    defaultValues: {
      planlananBaslamaTarih: null,
      planlananBaslamaSaat: null,
      planlananBitisTarih: null,
      planlananBitisSaat: null,
      aciklama: "",
    },
  });

  const { reset, watch } = methods;
  const selectedRow = selectedRows?.[0];

  const watchedStartDate = watch("planlananBaslamaTarih");
  const watchedStartTime = watch("planlananBaslamaSaat");
  const watchedEndDate = watch("planlananBitisTarih");
  const watchedEndTime = watch("planlananBitisSaat");

  const plannedDuration = useMemo(
    () => formatDuration(watchedStartDate, watchedStartTime, watchedEndDate, watchedEndTime, t),
    [watchedEndDate, watchedEndTime, watchedStartDate, watchedStartTime, t]
  );

  const disableStartDate = (current) => {
    if (!watchedEndDate || !current) return false;
    return current.isAfter(dayjs(watchedEndDate), "day");
  };

  const disableEndDate = (current) => {
    if (!watchedStartDate || !current) return false;
    return current.isBefore(dayjs(watchedStartDate), "day");
  };

  const disableStartTime = () => {
    if (!isSameDay(watchedStartDate, watchedEndDate) || !watchedEndTime) {
      return {};
    }

    const endHour = dayjs(watchedEndTime).hour();
    const endMinute = dayjs(watchedEndTime).minute();

    return {
      disabledHours: () => Array.from({ length: 24 }, (_, hour) => hour).filter((hour) => hour > endHour),
      disabledMinutes: (selectedHour) => {
        if (selectedHour !== endHour) return [];
        return Array.from({ length: 60 }, (_, minute) => minute).filter((minute) => minute > endMinute);
      },
    };
  };

  const disableEndTime = () => {
    if (!isSameDay(watchedStartDate, watchedEndDate) || !watchedStartTime) {
      return {};
    }

    const startHour = dayjs(watchedStartTime).hour();
    const startMinute = dayjs(watchedStartTime).minute();

    return {
      disabledHours: () => Array.from({ length: 24 }, (_, hour) => hour).filter((hour) => hour < startHour),
      disabledMinutes: (selectedHour) => {
        if (selectedHour !== startHour) return [];
        return Array.from({ length: 60 }, (_, minute) => minute).filter((minute) => minute < startMinute);
      },
    };
  };

  useEffect(() => {
    if (!isModalOpen || !selectedRow?.key) {
      return;
    }

    reset(buildPlanDefaults(selectedRow));
  }, [isModalOpen, reset, selectedRow]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleSubmit = async (data) => {
    const startDate = data.planlananBaslamaTarih;
    const startTime = data.planlananBaslamaSaat;
    const endDate = data.planlananBitisTarih;
    const endTime = data.planlananBitisSaat;

    const start = dayjs(
      `${dayjs(startDate).format("YYYY-MM-DD")} ${dayjs(startTime).format("HH:mm:ss")}`,
      "YYYY-MM-DD HH:mm:ss"
    );
    const end = dayjs(
      `${dayjs(endDate).format("YYYY-MM-DD")} ${dayjs(endTime).format("HH:mm:ss")}`,
      "YYYY-MM-DD HH:mm:ss"
    );

    if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
      message.error(t("workOrder.planLater.invalidRange"));
      return;
    }

    const body = {
      IsEmriId: selectedRow?.key,
      PlanlananBaslamaTarih: formatDateForRequest(startDate),
      PlanlananBaslamaSaat: formatTimeForRequest(startTime),
      PlanlananBitisTarih: formatDateForRequest(endDate),
      PlanlananBitisSaat: formatTimeForRequest(endTime),
      Aciklama: data.aciklama ?? "",
    };

    setSaving(true);

    try {
      const response = await AxiosInstance.post("IsEmriIleriTarihePlanla", body);

      if (response.status_code === 200 || response.status_code === 201) {
        message.success(response.status || t("workOrder.planLater.success"));
        closeModal();
        hidePopover?.();
        refreshTableData?.();
      } else if (response.status_code === 401) {
        message.error(t("workOrder.planLater.noPermission"));
      } else {
        message.error(response.status || t("workOrder.planLater.error"));
      }
    } catch (error) {
      console.error("İş emri ileri tarihe planlanırken hata oluştu:", error);
      if (navigator.onLine) {
        message.error(`${t("workOrder.planLater.error")} ${error.message}`);
      } else {
        message.error(t("internetBaglantisiMevcutDegil"));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <MenuItem icon={<CalendarOutlined />} title={t("workOrder.planLater.menuTitle")} description={t("workOrder.planLater.menuDescription")} onClick={openModal} />

      <Modal
        width={760}
        centered
        open={isModalOpen}
        onCancel={closeModal}
        title={
          <div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#1F3251", lineHeight: 1.25 }}>{t("workOrder.planLater.modalTitle")}</div>
            <div style={{ fontSize: "14px", color: "#60708A", marginTop: "8px" }}>
              {t("workOrder.planLater.selectedRecord", {
                no: selectedRow?.ISEMRI_NO ?? "-",
              })}
            </div>
          </div>
        }
        footer={[
          <Button key="cancel" onClick={closeModal}>
            {t("workOrder.planLater.cancel")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={saving}
            onClick={methods.handleSubmit(handleSubmit)}
            style={{ backgroundColor: "#18233A", borderColor: "#18233A" }}
          >
            {t("workOrder.planLater.submit")}
          </Button>,
        ]}
      >
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Form layout="vertical" component={false}>
            <div
              style={{
                borderTop: "1px solid #E7EDF5",
                margin: "0 -24px",
                padding: "20px 24px 0",
              }}
            >
              <div
                style={{
                  border: "1px solid #D9E5F2",
                  borderRadius: "16px",
                  background: "#FFFFFF",
                  padding: "16px 18px",
                  marginBottom: "18px",
                }}
              >
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#1F3251", marginBottom: "8px" }}>{selectedRow?.KONU || "-"}</div>
                <div style={{ fontSize: "14px", color: "#60708A" }}>{buildDisplayEquipment(selectedRow)}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <FieldLabel required>{t("workOrder.planLater.startDate")}</FieldLabel>
                  <FullDatePicker
                    name1="planlananBaslamaTarih"
                    isRequired
                    placeholder={t("workOrder.planLater.startDate")}
                    disabledDate={disableStartDate}
                  />
                </div>
                <div>
                  <FieldLabel required>{t("workOrder.planLater.startTime")}</FieldLabel>
                  <FullTimePicker name1="planlananBaslamaSaat" isRequired disabledTime={disableStartTime} />
                </div>
                <div>
                  <FieldLabel required>{t("workOrder.planLater.endDate")}</FieldLabel>
                  <FullDatePicker
                    name1="planlananBitisTarih"
                    isRequired
                    placeholder={t("workOrder.planLater.endDate")}
                    disabledDate={disableEndDate}
                  />
                </div>
                <div>
                  <FieldLabel required>{t("workOrder.planLater.endTime")}</FieldLabel>
                  <FullTimePicker name1="planlananBitisSaat" isRequired disabledTime={disableEndTime} />
                </div>
              </div>

              <div
                style={{
                  border: "1px solid #D9E5F2",
                  borderRadius: "16px",
                  background: "#F8FBFF",
                  padding: "14px 16px",
                  marginBottom: "16px",
                }}
              >
                <div style={{ fontSize: "14px", color: "#60708A", marginBottom: "6px" }}>{t("workOrder.planLater.duration")}</div>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "#1F3251" }}>{plannedDuration}</div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <FieldLabel>{t("workOrder.planLater.responsiblePerson")}</FieldLabel>
                <Input value={selectedRow?.PERSONEL_ADI || ""} disabled />
              </div>

              <div>
                <FieldLabel>{t("workOrder.planLater.note")}</FieldLabel>
                <Controller
                  name="aciklama"
                  control={methods.control}
                  render={({ field }) => <Input.TextArea {...field} rows={5} />}
                />
              </div>
            </div>
          </Form>
        </form>
      </Modal>
    </FormProvider>
  );
}

IleriTarihePlanla.propTypes = {
  selectedRows: PropTypes.arrayOf(PropTypes.object),
  refreshTableData: PropTypes.func,
  hidePopover: PropTypes.func,
};

FieldLabel.propTypes = {
  children: PropTypes.node,
  required: PropTypes.bool,
};
