import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Spin,
  Button,
  Popover,
  Modal,
  DatePicker,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../api/http.jsx";
import { Controller, useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const { Text } = Typography;

function LokasyonBazindaIsTalepleri(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format
  const [baslamaTarihi, setBaslamaTarihi] = useState();
  const [bitisTarihi, setBitisTarihi] = useState();
  const {
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useFormContext();

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  // sistemin locale'una göre tarih formatlamasını yapar
  const formatDateWithLocale = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(navigator.language).format(date);
  };

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın

  useEffect(() => {
    // Format the date based on the user's locale
    const dateFormatter = new Intl.DateTimeFormat(navigator.language);
    const sampleDate = new Date(2021, 10, 21);
    const formattedSampleDate = dateFormatter.format(sampleDate);
    setLocaleDateFormat(
      formattedSampleDate
        .replace("2021", "YYYY")
        .replace("21", "DD")
        .replace("11", "MM")
    );

    // Format the time based on the user's locale
    const timeFormatter = new Intl.DateTimeFormat(navigator.language, {
      hour: "numeric",
      minute: "numeric",
    });
    const sampleTime = new Date(2021, 10, 21, 13, 45); // Use a sample time, e.g., 13:45
    const formattedSampleTime = timeFormatter.format(sampleTime);

    // Check if the formatted time contains AM/PM, which implies a 12-hour format
    const is12HourFormat = /AM|PM/.test(formattedSampleTime);
    setLocaleTimeFormat(is12HourFormat ? "hh:mm A" : "HH:mm");
  }, []);

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın sonu

  const showModal = (content) => {
    setModalContent(content);
    setIsModalVisible(true);
  };

  useEffect(() => {
    const baslamaTarihiValue = watch("baslamaTarihi");
    const bitisTarihiValue = watch("bitisTarihi");
    const aySecimiValue = watch("aySecimi");
    const yilSecimiValue = watch("yilSecimi");

    if (
      !baslamaTarihiValue &&
      !bitisTarihiValue &&
      !aySecimiValue &&
      !yilSecimiValue
    ) {
      const currentYear = dayjs().year();
      const firstDayOfYear = dayjs()
        .year(currentYear)
        .startOf("year")
        .format("YYYY-MM-DD");
      const lastDayOfYear = dayjs()
        .year(currentYear)
        .endOf("year")
        .format("YYYY-MM-DD");
      setBaslamaTarihi(firstDayOfYear);
      setBitisTarihi(lastDayOfYear);
    } else if (baslamaTarihiValue && bitisTarihiValue) {
      setBaslamaTarihi(formatDateWithDayjs(baslamaTarihiValue));
      setBitisTarihi(formatDateWithDayjs(bitisTarihiValue));
    } else if (aySecimiValue) {
      const startOfMonth = dayjs(aySecimiValue).startOf("month");
      const endOfMonth = dayjs(aySecimiValue).endOf("month");
      setBaslamaTarihi(formatDateWithDayjs(startOfMonth));
      setBitisTarihi(formatDateWithDayjs(endOfMonth));
    } else if (yilSecimiValue) {
      const startOfYear = dayjs(yilSecimiValue).startOf("year");
      const endOfYear = dayjs(yilSecimiValue).endOf("year");
      setBaslamaTarihi(formatDateWithDayjs(startOfYear));
      setBitisTarihi(formatDateWithDayjs(endOfYear));
    }
  }, [
    watch("baslamaTarihi"),
    watch("bitisTarihi"),
    watch("aySecimi"),
    watch("yilSecimi"),
  ]);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    reset();
  };

  useEffect(() => {
    if (isModalVisible === true) {
      reset({
        baslamaTarihi: undefined,
        bitisTarihi: undefined,
        aySecimi: undefined,
        yilSecimi: undefined,
      });
    }
  }, [isModalVisible]);

  const columns = [
    {
      title: "Lokasyon",
      dataIndex: "LOKASYON",
      width: 260,
      ellipsis: true,
    },
    {
      title: "Toplam İş Talebi",
      dataIndex: "TOPLAM_IS_TALEBI",
      // width: 100,
      ellipsis: true,
    },
    {
      title: "Toplam İş Emri",
      dataIndex: "TOPLAM_IS_EMRI",
      // width: 100,
      ellipsis: true,
    },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get(
        `GetLokasyonBazindaIsEmriTalebi?startDate=${baslamaTarihi}&endDate=${bitisTarihi}`
      );
      const formattedData = response.map((item) => {
        return {
          ...item,
          key: item.ID,
        };
      });
      setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (baslamaTarihi && bitisTarihi) {
      fetchData();
    }
  }, [baslamaTarihi, bitisTarihi]);

  const content1 = (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div onClick={() => showModal("Tarih Aralığı Seç")}>
        Tarih Aralığı Seç
      </div>
      <div onClick={() => showModal("Ay Seç")}>Ay Seç</div>
      <div onClick={() => showModal("Yıl Seç")}>Yıl Seç</div>
    </div>
  );

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Popover placement="right" content={content1} trigger="click">
        <div style={{ cursor: "pointer" }}>Zaman Seçimi</div>
      </Popover>
      <div>Content</div>
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "5px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        border: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          padding: "10px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: "500", fontSize: "17px" }}>
          Lokasyon Bazında İş talepleri / İş Emirleri Dağılımı{" "}
          {`(${
            baslamaTarihi && bitisTarihi
              ? `${formatDateWithLocale(
                  baslamaTarihi
                )} / ${formatDateWithLocale(bitisTarihi)}`
              : ""
          })`}
        </Text>
        <Popover placement="bottom" content={content} trigger="click">
          <Button
            type="text"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0px 5px",
              height: "32px",
            }}
          >
            <MoreOutlined
              style={{ cursor: "pointer", fontWeight: "500", fontSize: "16px" }}
            />
          </Button>
        </Popover>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "7px",
          overflow: "scroll",
          height: "100vh",
          padding: "0px 10px 0 10px",
        }}
      >
        <Spin spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              position: ["bottomRight"],
              showTotal: (total, range) => `Toplam ${total}`,
              showQuickJumper: true,
            }}
            scroll={{ y: "100vh" }}
          />
        </Spin>
      </div>

      <Modal
        title="Tarih Seçimi"
        centered
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        {modalContent === "Tarih Aralığı Seç" && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div>Tarih Aralığı Seç:</div>
            <Controller
              name="baslamaTarihi"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  style={{ width: "130px" }}
                  format={localeDateFormat}
                  placeholder="Tarih seçiniz"
                />
              )}
            />
            {" - "}
            <Controller
              name="bitisTarihi"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  style={{ width: "130px" }}
                  format={localeDateFormat}
                  placeholder="Tarih seçiniz"
                />
              )}
            />
          </div>
        )}
        {modalContent === "Ay Seç" && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div>Ay Seç:</div>
            <Controller
              name="aySecimi"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  picker="month"
                  style={{ width: "130px" }}
                  placeholder="Tarih seçiniz"
                />
              )}
            />
          </div>
        )}
        {modalContent === "Yıl Seç" && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div>Yıl Seç:</div>
            <Controller
              name="yilSecimi"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  picker="year"
                  style={{ width: "130px" }}
                  placeholder="Tarih seçiniz"
                />
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default LokasyonBazindaIsTalepleri;
