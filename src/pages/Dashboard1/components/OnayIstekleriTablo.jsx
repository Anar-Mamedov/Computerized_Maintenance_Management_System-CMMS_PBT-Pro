import React, { useEffect, useState, useRef } from "react";
import { Table, Typography, Spin, Button, Popover, Modal, DatePicker, ConfigProvider, Tour, Input, message, Form } from "antd";
import { DownloadOutlined, MoreOutlined, CheckOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../api/http.jsx";
import { Controller, useForm, useFormContext } from "react-hook-form";
import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";
import customFontBase64 from "./RobotoBase64.js";
import trTR from "antd/lib/locale/tr_TR";
import { FaCircleCheck } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import { CSVLink } from "react-csv";
import EditDrawer1 from "../../YardimMasasi/IsTalepleri/Update/EditDrawer.jsx";
import EditDrawer from "../../BakımVeArizaYonetimi/IsEmri/Update/EditDrawer.jsx";
import TextArea from "antd/es/input/TextArea";

const { Text } = Typography;

function LokasyonBazindaIsTalepleri(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [editDrawer1Visible, setEditDrawer1Visible] = useState(false);
  const [editDrawer1Data, setEditDrawer1Data] = useState(null);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [editDrawerData, setEditDrawerData] = useState(null);
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format
  const [isReddetModal, setIsReddetModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const ref1 = useRef(null);

  const methods = useForm({
    defaultValues: {
      reddetAciklama: "",
    },
  });

  const { setValue, reset, handleSubmit, watch, control } = methods;

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
    setLocaleDateFormat(formattedSampleDate.replace("2021", "YYYY").replace("21", "DD").replace("11", "MM"));

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

  const columns = [
    {
      title: "Kod",
      dataIndex: "ONAY_TABLO_KOD",
      width: 200,
      ellipsis: true,
      onCell: (record) => ({
        onClick: () => {
          // Burada, record objesini doğrudan kullanmak yerine,
          // bir kopyasını oluşturup `key` değerini `ISM_DURUM_KOD_ID` ile güncelliyoruz.
          const updatedRecord = { ...record, key: record.ONAY_TABLO_ID };
          // const updatedRecord = { ...record, key: 378 };

          if (record.ONAY_ONYTANIM_ID === 2) {
            setEditDrawer1Data(updatedRecord);
            setEditDrawer1Visible(true);
          } else if (record.ONAY_ONYTANIM_ID === 1) {
            setEditDrawerData(updatedRecord);
            setEditDrawerVisible(true);
          }
        },
      }),
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Onay Tipi",
      dataIndex: "ONY_TANIM",
      // width: 100,
      ellipsis: true,
    },
    {
      title: "Onay",
      dataIndex: "",
      key: "action2",
      width: 100,
      ellipsis: true,
      align: "center",
      render: (text, record) => (
        <Button
          type="link"
          icon={<FaCircleCheck style={{ fontSize: "21px", color: "#2bc770" }} />}
          onClick={async () => {
            try {
              const response = await AxiosInstance.post(`Onayla?ONAY_TABLO_ID=${record.ONAY_TABLO_ID}`);
              // Handle success (e.g., show a notification or refresh the table)
              if (response.status_code === 200 || response.status_code === 201) {
                message.success("İşlem Başarılı.");
                fetchData();
              } else if (response.status_code === 401) {
                message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
              } else {
                message.error("İşlem Başarısız.");
              }
            } catch (error) {
              console.error("API request failed:", error);
              // Handle error (e.g., show an error message)
            }
          }}
        />
      ),
    },
    {
      title: "Red",
      dataIndex: "",
      key: "action1",
      width: 100,
      ellipsis: true,
      align: "center",
      render: (text, record) => (
        <Button
          type="link"
          danger
          icon={<MdCancel style={{ fontSize: "21px" }} />}
          onClick={() => {
            setSelectedRecord(record);
            setIsReddetModal(true);
          }}
        />
      ),
    },
  ];

  const onSubmited = (data) => {
    const Body = {
      ONAY_TABLO_ID: selectedRecord.ONAY_TABLO_ID,
      ONAY_RED_ACIKLAMA: data.reddetAciklama,
    };

    AxiosInstance.post(`Reddet`, Body)
      .then((response) => {
        console.log("Data sent successfully:", response);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("İşlem Başarılı.");
          fetchData();
          setIsReddetModal(false);
          setSelectedRecord(null);
          reset();
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("İşlem Başarısız.");
        }
      })
      .catch((error) => {
        // Handle errors here, e.g.:
        console.error("Error sending data:", error);
        message.error("Başarısız Olundu.");
      });

    console.log({ Body });
  };

  const handleReddetCancle = () => {
    setIsReddetModal(false);
    setSelectedRecord(null);
    reset();
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get(`BekleyenOnaylar`);
      const formattedData = response.map((item) => {
        return {
          ...item,
          key: item.TB_ONAYLAR_ID,
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
    fetchData();
  }, []);

  return (
    <ConfigProvider locale={trTR}>
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
          <Text style={{ fontWeight: "500", fontSize: "17px" }}>Bekleyen Onaylarim</Text>
        </div>
        <div
          ref={ref1}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "7px",
            overflow: "auto",
            height: "100vh",
            padding: "0px 10px 0 10px",
          }}
        >
          <Spin spinning={isLoading}>
            <Table
              columns={columns}
              dataSource={data}
              size="small"
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                position: ["bottomRight"],
                showTotal: (total, range) => `Toplam ${total}`,
                showQuickJumper: true,
              }}
            />
            {editDrawerVisible && (
              <EditDrawer
                selectedRow={editDrawerData}
                onDrawerClose={() => setEditDrawerVisible(false)}
                drawerVisible={editDrawerVisible}
                onRefresh={() => {
                  /* Veri yenileme işlemi */
                }}
              />
            )}
            {editDrawer1Visible && (
              <EditDrawer1
                selectedRow={editDrawer1Data}
                onDrawerClose={() => setEditDrawer1Visible(false)}
                drawerVisible={editDrawer1Visible}
                onRefresh={() => {
                  /* Veri yenileme işlemi */
                }}
              />
            )}
          </Spin>
        </div>

        <Modal title="Reddetme İşlemi" open={isReddetModal} onCancel={handleReddetCancle} onOk={methods.handleSubmit(onSubmited)}>
          <form onSubmit={methods.handleSubmit(onSubmited)}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "start",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "450px",
                gap: "10px",
                rowGap: "0px",
                marginBottom: "10px",
              }}
            >
              <Text style={{ fontSize: "14px", fontWeight: "600" }}>Açıklama:</Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  maxWidth: "300px",
                  minWidth: "300px",
                  gap: "10px",
                  width: "100%",
                }}
              >
                <Controller
                  name="reddetAciklama"
                  control={control}
                  rules={{ required: "Alan Boş Bırakılamaz!" }}
                  render={({ field, fieldState: { error } }) => (
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                      <TextArea {...field} rows={4} status={error ? "error" : ""} style={{ flex: 1 }} />
                      {error && <div style={{ color: "red" }}>{error.message}</div>}
                    </div>
                  )}
                />
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </ConfigProvider>
  );
}

export default LokasyonBazindaIsTalepleri;
