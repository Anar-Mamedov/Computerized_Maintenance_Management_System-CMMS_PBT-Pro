import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Table, message, Popconfirm } from "antd";
import { CheckOutlined, CloseOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import CreateModal from "./Insert/CreateModal";
import EditModal from "./Update/EditModal";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { formatNumberWithSeparators } from "../../../../../../../../utils/numberLocale";

const DowntimeListWrapper = styled.div`
  margin-bottom: 25px;
  padding: 20px;
  border: 1px solid #dbe4f0;
  border-radius: 14px;
  background: #fbfdff;

  .downtime-list-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
  }

  .downtime-list-title {
    margin: 0 0 6px;
    color: #1464ff;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.3;
  }

  .downtime-list-description {
    margin: 0;
    color: #5f7190;
    font-size: 12px;
    line-height: 1.4;
  }

  .downtime-list-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .downtime-list-create-trigger {
    margin: 0 !important;
    width: auto !important;
    justify-content: flex-start !important;
  }

  .downtime-list-add-button {
    height: 36px;
    border-color: #d8e2ef;
    border-radius: 10px;
    color: #30445f;
    font-weight: 500;
    box-shadow: 0 2px 5px rgba(18, 38, 63, 0.12);
  }

  .downtime-list-delete-button {
    height: 36px;
    border-radius: 10px;
  }

  .downtime-list-table {
    overflow: hidden;
    border: 1px solid #dbe4f0;
    border-radius: 14px;
    background: #fff;
  }

  .ant-table {
    background: transparent;
  }

  .ant-table-thead > tr > th {
    border-bottom: 1px solid #e2eaf4;
    background: #f8fbff !important;
    color: #8ca0ba;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #edf2f7;
    color: #30445f;
    font-size: 14px;
  }

  .ant-table-tbody > tr:last-child > td {
    border-bottom: 0;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f8fbff !important;
  }

  .downtime-list-reason {
    font-weight: 600;
    color: #30445f;
    cursor: pointer;
  }

  .downtime-list-field {
    min-height: 33px;
    padding: 7px 12px;
    border: 1px solid #dbe4f0;
    border-radius: 8px;
    background: #f9fbfe;
    color: #405574;
    line-height: 1.35;
    box-shadow: 0 2px 5px rgba(18, 38, 63, 0.08);
  }

  .downtime-list-checkbox-field {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
  }

  .downtime-list-cost {
    color: #006fbd;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    padding: 14px;

    .downtime-list-header {
      flex-direction: column;
    }

    .downtime-list-actions {
      width: 100%;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
  }
`;

export default function DuruslarListesiTablo({ isActive }) {
  const [loading, setLoading] = useState(false);
  const { watch } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { t } = useTranslation();
  const currentLang = localStorage.getItem("i18nextLng") || "en";
  const calismaSaat = Number(watch("calismaSaat") || 0);
  const calismaDakika = Number(watch("calismaDakika") || 0);
  const defaultCalismaSuresiDakika = calismaSaat * 60 + calismaDakika;

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için

  // Intl.DateTimeFormat kullanarak tarih formatlama
  const formatDate = (date) => {
    if (!date) return "";

    // Örnek bir tarih formatla ve ay formatını belirle
    const sampleDate = new Date(2021, 0, 21); // Ocak ayı için örnek bir tarih
    const sampleFormatted = new Intl.DateTimeFormat(navigator.language).format(sampleDate);

    let monthFormat;
    if (sampleFormatted.includes("January")) {
      monthFormat = "long"; // Tam ad ("January")
    } else if (sampleFormatted.includes("Jan")) {
      monthFormat = "short"; // Üç harfli kısaltma ("Jan")
    } else {
      monthFormat = "2-digit"; // Sayısal gösterim ("01")
    }

    // Kullanıcı için tarihi formatla
    const formatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: monthFormat,
      day: "2-digit",
    });
    return formatter.format(new Date(date));
  };

  const formatTime = (time) => {
    if (!time || time.trim() === "") return ""; // `trim` metodu ile baştaki ve sondaki boşlukları temizle

    try {
      // Saati ve dakikayı parçalara ayır, boşlukları temizle
      const [hours, minutes] = time
        .trim()
        .split(":")
        .map((part) => part.trim());

      // Saat ve dakika değerlerinin geçerliliğini kontrol et
      const hoursInt = parseInt(hours, 10);
      const minutesInt = parseInt(minutes, 10);
      if (isNaN(hoursInt) || isNaN(minutesInt) || hoursInt < 0 || hoursInt > 23 || minutesInt < 0 || minutesInt > 59) {
        throw new Error("Invalid time format");
      }

      // Geçerli tarih ile birlikte bir Date nesnesi oluştur ve sadece saat ve dakika bilgilerini ayarla
      const date = new Date();
      date.setHours(hoursInt, minutesInt, 0);

      // Kullanıcının lokal ayarlarına uygun olarak saat ve dakikayı formatla
      // `hour12` seçeneğini belirtmeyerek Intl.DateTimeFormat'ın kullanıcının yerel ayarlarına göre otomatik seçim yapmasına izin ver
      const formatter = new Intl.DateTimeFormat(navigator.language, {
        hour: "numeric",
        minute: "2-digit",
        // hour12 seçeneği burada belirtilmiyor; böylece otomatik olarak kullanıcının sistem ayarlarına göre belirleniyor
      });

      // Formatlanmış saati döndür
      return formatter.format(date);
    } catch (error) {
      console.error("Error formatting time:", error);
      return ""; // Hata durumunda boş bir string döndür
    }
  };

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

  const columns = [
    {
      title: t("workOrder.downtimeList.no"),
      dataIndex: "rowNo",
      key: "rowNo",
      width: 60,
      ellipsis: true,
    },
    {
      title: t("workOrder.downtimeList.reason"),
      dataIndex: "MKD_NEDEN",
      key: "MKD_NEDEN",
      width: 220,
      ellipsis: true,
      render: (text, record) => (
        <span className="downtime-list-reason" onClick={() => onRowClick(record)}>
          {text || "-"}
        </span>
      ),
    },
    {
      title: t("workOrder.downtimeList.planned"),
      dataIndex: "MKD_PLANLI",
      key: "MKD_PLANLI",
      width: 100,
      ellipsis: true,
      render: (text, record) => (
        <div className="downtime-list-field downtime-list-checkbox-field">
          {record.MKD_PLANLI ? <CheckOutlined style={{ color: "#52c41a" }} /> : <CloseOutlined style={{ color: "#ff4d4f" }} />}
        </div>
      ),
    },
    {
      title: t("workOrder.downtimeList.startDate"),
      dataIndex: "MKD_BASLAMA_TARIH",
      key: "MKD_BASLAMA_TARIH",
      width: 170,
      ellipsis: true,
      render: (text) => <div className="downtime-list-field">{formatDate(text) || "-"}</div>,
    },
    {
      title: t("workOrder.downtimeList.startTime"),
      dataIndex: "MKD_BASLAMA_SAAT",
      key: "MKD_BASLAMA_SAAT",
      width: 170,
      ellipsis: true,
      render: (text) => <div className="downtime-list-field">{formatTime(text) || "-"}</div>,
    },
    {
      title: t("workOrder.downtimeList.endDate"),
      dataIndex: "MKD_BITIS_TARIH",
      key: "MKD_BITIS_TARIH",
      width: 170,
      ellipsis: true,
      render: (text) => <div className="downtime-list-field">{formatDate(text) || "-"}</div>,
    },
    {
      title: t("workOrder.downtimeList.endTime"),
      dataIndex: "MKD_BITIS_SAAT",
      key: "MKD_BITIS_SAAT",
      width: 170,
      ellipsis: true,
      render: (text) => <div className="downtime-list-field">{formatTime(text) || "-"}</div>,
    },
    {
      title: t("workOrder.downtimeList.duration"),
      dataIndex: "MKD_SURE",
      key: "MKD_SURE",
      width: 120,
      ellipsis: true,
      render: (text) => <div className="downtime-list-field">{`${text || 0} ${t("workOrder.controlList.minuteShort")}`}</div>,
    },
    {
      title: t("workOrder.downtimeList.totalCost"),
      dataIndex: "MKD_TOPLAM_MALIYET",
      key: "MKD_TOPLAM_MALIYET",
      width: 170,
      ellipsis: true,
      render: (text) => (
        <div className="downtime-list-field downtime-list-cost">{`${formatNumberWithSeparators(text || 0, currentLang)} TL`}</div>
      ),
    },
  ];

  const secilenIsEmriID = watch("secilenIsEmriID");

  const fetch = useCallback(() => {
    if (isActive) {
      setLoading(true);
      AxiosInstance.get(`FetchIsEmriDurusList?isemriID=${secilenIsEmriID}&durusID=0`)
        .then((response) => {
          const fetchedData = response.map((item, index) => ({
            ...item,
            key: item.TB_MAKINE_DURUS_ID,
            rowNo: index + 1,
          }));
          setData(fetchedData);
        })
        .catch((error) => {
          // Hata işleme
          console.error("API isteği sırasında hata oluştu:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [secilenIsEmriID, isActive]); // secilenIsEmriID değiştiğinde fetch fonksiyonunu güncelle

  useEffect(() => {
    if (secilenIsEmriID) {
      // secilenIsEmriID'nin varlığını ve geçerliliğini kontrol edin
      fetch(); // fetch fonksiyonunu çağırın
    }
  }, [secilenIsEmriID, fetch]); // secilenIsEmriID veya fetch fonksiyonu değiştiğinde useEffect'i tetikle

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  const onRowClick = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const refreshTable = useCallback(() => {
    fetch(); // fetch fonksiyonu tabloyu yeniler
  }, [fetch]);

  const lokasyon = watch("lokasyonTanim");
  const lokasyonID = watch("lokasyonID");
  const makineTanim = watch("makineTanim");
  const makineID = watch("makineID");
  const baslamaZamani = watch("baslamaZamani");
  const baslamaZamaniSaati = watch("baslamaZamaniSaati");
  const bitisZamani = watch("bitisZamani");
  const bitisZamaniSaati = watch("bitisZamaniSaati");

  const handleDelete = async () => {
    if (!selectedRowKeys.length) return;
    const durusId = selectedRowKeys[0];
    try {
      setLoading(true);
      const response = await AxiosInstance.post(`DeleteMakineDurusBy?durusId=${durusId}&isemri=true`);
      if (response?.status_code === 200 || response?.status_code === 201) {
        message.success(t("islemBasarili", "İşlem Başarılı."));
      } else if (response?.status_code === 401) {
        message.error(t("yetkiHatasi", "Bu işlemi yapmaya yetkiniz bulunmamaktadır."));
      } else {
        message.error(t("islemBasarisiz", "İşlem Başarısız."));
      }
      refreshTable();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Silme işlemi sırasında hata oluştu:", error);
      message.error(t("islemBasarisiz", "İşlem Başarısız."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DowntimeListWrapper>
      <div className="downtime-list-header">
        <div>
          <h3 className="downtime-list-title">{t("workOrder.downtimeList.title")}</h3>
          <p className="downtime-list-description">{t("workOrder.downtimeList.description")}</p>
        </div>
        <div className="downtime-list-actions">
          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title={t("silmeIslemi", "Silme İşlemi")}
              description={t("silmeOnayi", "Bu öğeyi silmek istediğinize emin misiniz?")}
              onConfirm={handleDelete}
              okText={t("evet", "Evet")}
              cancelText={t("hayir", "Hayır")}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Button danger icon={<DeleteOutlined />} className="downtime-list-delete-button">
                {t("sil", "Sil")}
              </Button>
            </Popconfirm>
          )}
          <CreateModal
            kapali={watch("kapali")}
            onRefresh={refreshTable}
            secilenIsEmriID={secilenIsEmriID}
            lokasyon={lokasyon}
            makineTanim={makineTanim}
            lokasyonID={lokasyonID}
            makineID={makineID}
            defaultCalismaSuresiDakika={defaultCalismaSuresiDakika}
            baslamaZamani={baslamaZamani}
            baslamaZamaniSaati={baslamaZamaniSaati}
            bitisZamani={bitisZamani}
            bitisZamaniSaati={bitisZamaniSaati}
            triggerButtonText={t("workOrder.downtimeList.addRecord")}
            triggerButtonType="default"
            triggerButtonClassName="downtime-list-add-button"
            triggerContainerClassName="downtime-list-create-trigger"
          />
        </div>
      </div>

      <div className="downtime-list-table">
        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          onRow={(record) => ({
            onClick: () => onRowClick(record),
          })}
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
          scroll={{
            x: 1280,
            y: "calc(100vh - 420px)",
          }}
        />
      </div>
      {isModalVisible && (
        <EditModal
          selectedRow={selectedRow}
          isModalVisible={isModalVisible}
          onModalClose={() => {
            setIsModalVisible(false);
            setSelectedRow(null);
          }}
          onRefresh={refreshTable}
          secilenIsEmriID={secilenIsEmriID}
        />
      )}
    </DowntimeListWrapper>
  );
}

DuruslarListesiTablo.propTypes = {
  isActive: PropTypes.bool,
};
