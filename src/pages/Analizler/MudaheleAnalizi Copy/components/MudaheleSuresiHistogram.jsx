import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Spin, Typography, Modal } from "antd";
import AxiosInstance from "../../../../api/http.jsx";
import { useFormContext } from "react-hook-form";
import Istalebi from "./HistogramModalContents/Table.jsx";
import { t } from "i18next";
import dayjs from "dayjs";

const { Text } = Typography;

function MudaheleSuresiHistogram() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { watch, getValues } = useFormContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBarData, setSelectedBarData] = useState(null);

  const lokasyonId = watch("locationIds");
  const atolyeId = watch("atolyeIds");
  const makineId = watch("makineIds");
  const baslangicTarihi = getValues("baslangicTarihi");
  const bitisTarihi = getValues("bitisTarihi");

  const body = {
    LokasyonId: lokasyonId || "",
    AtolyeId: atolyeId || "",
    MakineId: makineId || "",
    BaslangicTarih: baslangicTarihi ? dayjs(baslangicTarihi).format("YYYY-MM-DD") : "",
    BitisTarih: bitisTarihi ? dayjs(bitisTarihi).format("YYYY-MM-DD") : "",
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.post(`GetMudahaleAnalizHistogramGraph`, body);
      setData(response);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lokasyonId, atolyeId, makineId, baslangicTarihi, bitisTarihi]);

  const handleBarClick = (e) => {
    if (e && e.activePayload && e.activePayload.length) {
      setSelectedBarData(e.activePayload[0].payload);
      setIsModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedBarData(null);
  };

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
        padding: "10px",
        filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))",
      }}
    >
      <Text style={{ fontWeight: "500", fontSize: "17px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%", marginBottom: "10px" }}>
        {t("mudaheleSuresiHistogrami")}
      </Text>
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} onClick={handleBarClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="MudaheleSuresiAraligi" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="TalepSayi" fill="#8884d8" name="Talep Sayısı" />
            </BarChart>
          </ResponsiveContainer>
          <Modal width={1400} centered destroyOnClose open={isModalVisible} onCancel={handleModalClose} footer={null}>
            {/* <p>Tıklanan çubuğun verileri:</p>
            <pre>{JSON.stringify(selectedBarData, null, 2)}</pre> */}
            <div style={{ height: "40px" }}></div>
            <Istalebi selectedBarData={selectedBarData} mudaheleBody={body} />
          </Modal>
        </>
      )}
    </div>
  );
}

export default MudaheleSuresiHistogram;
