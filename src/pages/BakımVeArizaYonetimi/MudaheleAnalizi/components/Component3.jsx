import React, { useState, useEffect } from "react";
import bg from "/images/bg-card.png";
import { Spin, Typography } from "antd";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../api/http.jsx";
import { t } from "i18next";
import dayjs from "dayjs";
import EditDrawer from "../../IsEmri/Update/EditDrawer.jsx";

const { Text } = Typography;

function ComponentSingleCard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { watch } = useFormContext();
  const [drawer, setDrawer] = useState({ visible: false, data: null });

  // Form değerlerini izle
  const lokasyonId = watch("locationValues");
  const baslangicTarihi = watch("baslangicTarihi") ? dayjs(watch("baslangicTarihi")).format("YYYY-MM-DD") : null;
  const bitisTarihi = watch("bitisTarihi") ? dayjs(watch("bitisTarihi")).format("YYYY-MM-DD") : null;
  const atolyeId = watch("atolyeIds");
  const makineId = watch("makineIds");

  const fetchData = async () => {
    setIsLoading(true);

    const body = {
      LokasyonId: lokasyonId || "",
      AtolyeId: atolyeId || "",
      MakineId: makineId || "",
      BaslangicTarih: baslangicTarihi || null,
      BitisTarih: bitisTarihi || null,
    };

    try {
      // Sadece type=1 ile tek bir istek
      const response = await AxiosInstance.post("GetMudahaleAnalizDashboard", body);
      setData(response.EnHizliMudahale);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lokasyonId, baslangicTarihi, bitisTarihi]);

  const renderCard = (value, label, backgroundColor, unit, loading, onClick) => (
    <div
      onClick={onClick}
      style={{
        width: "100%",
        height: "100%",
        background: backgroundColor || `url(${bg}), linear-gradient(rgb(27 17 92), #007eff)`,
        backgroundPosition: "inherit",
        backgroundSize: "cover",
        borderRadius: "5px",
        padding: "10px",
        marginBottom: "0px",
        filter: "drop-shadow(0 0 0.75rem rgba(0, 0, 0, 0.1))",
      }}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Spin size="large" style={{ color: "#fff" }} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Text style={{ fontWeight: "500", fontSize: "35px", color: "white" }}>
              {value !== null && value !== undefined ? (
                <>
                  {Number(value).toLocaleString("tr-TR", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                  {unit && <span style={{ fontSize: "20px" }}> ({unit})</span>}
                </>
              ) : (
                ""
              )}
            </Text>
            <Text style={{ color: "white", fontSize: "15px", fontWeight: "400" }}>{label}</Text>
          </div>
        </div>
      )}
    </div>
  );

  const handleCardClick = () => {
    if (data) {
      setDrawer({
        visible: true,
        data: {
          ...data,
          key: data?.TB_ISEMRI_ID,
        },
      });
    }
  };

  return (
    <>
      <div style={{ width: "100%", height: "100%" }}>
        {renderCard(data?.EnHizliMudahaleSuresi, t("enHizliMudahaleSuresi"), "linear-gradient(to right, #43cea2, #185a9d)", "dk.", isLoading, handleCardClick)}
      </div>
      <EditDrawer selectedRow={drawer.data} drawerVisible={drawer.visible} onDrawerClose={() => setDrawer({ visible: false, data: null })} />
    </>
  );
}

export default ComponentSingleCard;
