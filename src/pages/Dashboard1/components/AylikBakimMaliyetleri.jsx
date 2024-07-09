import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { Button, Popover, Spin, Typography, Modal, DatePicker } from "antd";
import AxiosInstance from "../../../api/http.jsx";
import { MoreOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import html2pdf from "html2pdf.js";

const { Text } = Typography;

const monthNames = [
  "",
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

function AylikBakimMaliyetleri(props = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpandedModalVisible, setIsExpandedModalVisible] = useState(false); // Expanded modal visibility state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [baslamaTarihi, setBaslamaTarihi] = useState();
  const [visibleSeries, setVisibleSeries] = useState({
    AYLIK_BAKIM_ISEMRI_MALIYET: true,
  });
  const {
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    const yilSecimiValue = watch("yilSecimi1");
    if (!yilSecimiValue) {
      // Eğer baslamaTarihi değeri undefined ise, sistem saatinden o senenin yıl hanesini alıp setBaslamaTarihi'ye atar
      const currentYear = dayjs().format("YYYY");
      setBaslamaTarihi(currentYear);
    } else if (yilSecimiValue) {
      // Ant Design DatePicker returns a moment object when a date is picked.
      // To extract only the year and set it as the state, use the format method of the moment object.
      const yearOnly = yilSecimiValue.format("YYYY");
      setBaslamaTarihi(yearOnly);
    }
  }, [watch("yilSecimi1")]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get(
        `GetAylikBakimIsEmriMaliyet?ID=2&year=${baslamaTarihi}`
      );

      // Sort the response by month number
      const sortedResponse = response.sort((a, b) => a.AY - b.AY);

      // Transform the data
      const transformedData = sortedResponse.map((item) => ({
        AY: monthNames[item.AY],
        AYLIK_BAKIM_ISEMRI_MALIYET: item.AYLIK_BAKIM_ISEMRI_MALIYET,
      }));

      setData(transformedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (baslamaTarihi) {
      fetchData();
    }
  }, [baslamaTarihi]);

  const downloadPDF = () => {
    const element = document.getElementById("aylik-bakim");
    const opt = {
      margin: 10,
      filename: "aylik_bakim.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleLegendClick = (dataKey) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  const CustomLegend = ({ payload }) => {
    const customNames = {
      AYLIK_BAKIM_ISEMRI_MALIYET: "İş Emri Maliyeti",
    };

    const handleToggleAll = () => {
      const allVisible = Object.values(visibleSeries).every((value) => value);
      setVisibleSeries({
        AYLIK_BAKIM_ISEMRI_MALIYET: !allVisible,
      });
    };

    return (
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          margin: 0,
        }}
      >
        <li
          style={{
            cursor: "pointer",
            color: Object.values(visibleSeries).every((value) => value)
              ? "black"
              : "gray",
          }}
          onClick={handleToggleAll}
        >
          Tümü
        </li>
        {payload.map((entry, index) => (
          <li
            key={`item-${index}`}
            style={{
              cursor: "pointer",
              color: visibleSeries[entry.dataKey] ? entry.color : "gray",
            }}
            onClick={() => handleLegendClick(entry.dataKey)}
          >
            <span
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                backgroundColor: visibleSeries[entry.dataKey]
                  ? entry.color
                  : "gray",
                marginRight: "5px",
              }}
            ></span>
            {customNames[entry.dataKey] || entry.value}
          </li>
        ))}
      </ul>
    );
  };

  const showModal = (content) => {
    setModalContent(content);
    setIsModalVisible(true);
  };

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
        yilSecimi1: undefined,
      });
    }
  }, [isModalVisible]);

  const content1 = (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ cursor: "pointer" }} onClick={() => showModal("Yıl Seç")}>
        Yıl Seç
      </div>
    </div>
  );

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => setIsExpandedModalVisible(true)}
      >
        Büyüt
      </div>
      <Popover placement="right" content={content1} trigger="click">
        <div style={{ cursor: "pointer" }}>Zaman Seçimi</div>
      </Popover>
      <div style={{ cursor: "pointer" }} onClick={downloadPDF}>
        İndir
      </div>
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
        <Text
          title={`Aylık Bakım Maliyetleri${
            baslamaTarihi ? ` (${baslamaTarihi})` : ""
          }`}
          style={{
            fontWeight: "500",
            fontSize: "17px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "calc(100% - 50px)",
          }}
        >
          Aylık Bakım Maliyetleri
          {baslamaTarihi && ` (${baslamaTarihi})`}
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
              zIndex: 3,
            }}
          >
            <MoreOutlined
              style={{ cursor: "pointer", fontWeight: "500", fontSize: "16px" }}
            />
          </Button>
        </Popover>
      </div>
      {isLoading ? (
        <Spin />
      ) : (
        <div
          id="aylik-bakim"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "7px",
            overflow: "auto",
            height: "100vh",
          }}
        >
          <div style={{ width: "100%", height: "calc(100% - 5px)" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width="100%"
                height="100%"
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="AY" />
                <YAxis />
                <Tooltip />
                <Legend content={<CustomLegend />} />
                <Bar
                  dataKey="AYLIK_BAKIM_ISEMRI_MALIYET"
                  stackId="a"
                  fill="#8884d8"
                  hide={!visibleSeries.AYLIK_BAKIM_ISEMRI_MALIYET}
                  name="İş Emri Maliyeti"
                >
                  {/*<LabelList dataKey="AYLIK_BAKIM_ISEMRI_MALIYET" position="insideTop" />*/}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      <Modal
        title="Tarih Seçimi"
        centered
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
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
              name="yilSecimi1"
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
      {/* Expanded Modal */}
      <Modal
        title={
          <Text
            title={`Aylık Bakım Maliyetleri${
              baslamaTarihi ? ` (${baslamaTarihi})` : ""
            }`}
            style={{
              fontWeight: "500",
              fontSize: "17px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "calc(100% - 50px)",
            }}
          >
            Aylık Bakım Maliyetleri
            {baslamaTarihi && ` (${baslamaTarihi})`}
          </Text>
        }
        centered
        open={isExpandedModalVisible}
        onOk={() => setIsExpandedModalVisible(false)}
        onCancel={() => setIsExpandedModalVisible(false)}
        width="90%"
        destroyOnClose
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "7px",
            overflow: "auto",
            height: "calc(100vh - 180px)",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width="100%"
              height="100%"
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="AY"
                // interval={0}
                // angle={-90}
                // textAnchor="end"
                // height={70} // X ekseni yüksekliğini artırın
                // tick={{
                //   dy: 10, // Etiketleri aşağı kaydırın
                // }}
              />
              <YAxis />
              <Tooltip />
              <Legend content={<CustomLegend />} />
              <Bar
                dataKey="AYLIK_BAKIM_ISEMRI_MALIYET"
                stackId="a"
                fill="#8884d8"
                hide={!visibleSeries.AYLIK_BAKIM_ISEMRI_MALIYET}
                name="İş Emri Maliyeti"
              >
                <LabelList
                  style={{ fill: "white" }}
                  dataKey="AYLIK_BAKIM_ISEMRI_MALIYET"
                  position="insideTop"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Modal>
    </div>
  );
}

export default AylikBakimMaliyetleri;
