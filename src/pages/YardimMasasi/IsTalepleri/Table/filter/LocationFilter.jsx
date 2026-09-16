import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Select, Button, Popover } from "antd";
import { t } from "i18next";
import AxiosInstance from "../../../../../api/http";

/**
 * Lokasyon filtresi. Liste API'si lokasyonu ID dizisi olarak beklediği için
 * seçim `TB_LOKASYON_ID` üzerinden yapılır; etiket yalnızca görüntüleme içindir.
 */
const LocationFilter = ({ onSubmit, baslangicIds }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedValues, setSelectedValues] = useState(() => (Array.isArray(baslangicIds) ? baslangicIds : []));

  // Dashboard'dan gelindiğinde seçim dışarıdan gelir.
  useEffect(() => {
    setSelectedValues(Array.isArray(baslangicIds) ? baslangicIds : []);
  }, [baslangicIds]);

  useEffect(() => {
    if (options.length > 0) return;

    AxiosInstance.get("GetLokasyonList")
      .then((response) => {
        setOptions(
          (response || []).map((item) => ({
            value: item.TB_LOKASYON_ID,
            label: item.LOK_TANIM,
          }))
        );
      })
      .catch((error) => {
        console.error("Lokasyon listesi alınamadı:", error);
      });
  }, [options.length]);

  const handleSubmit = () => {
    onSubmit([...selectedValues]);
    setOpen(false);
  };

  const handleCancelClick = () => {
    setSelectedValues([]);
    onSubmit([]);
    setOpen(false);
  };

  const content = (
    <div style={{ width: "300px" }}>
      <div style={{ borderBottom: "1px solid #ccc", padding: "10px", display: "flex", justifyContent: "space-between" }}>
        <Button onClick={handleCancelClick}>{t("iptal")}</Button>
        <Button type="primary" onClick={handleSubmit}>
          {t("uygula")}
        </Button>
      </div>
      <div style={{ padding: "10px" }}>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder={t("aramaYap")}
          value={selectedValues}
          onChange={setSelectedValues}
          options={options}
          optionFilterProp="label"
          allowClear
          showSearch
        />
      </div>
    </div>
  );

  return (
    <Popover content={content} trigger="click" open={open} onOpenChange={setOpen} placement="bottom">
      <Button style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        {t("lokasyon")}
        <div
          style={{
            marginLeft: "5px",
            background: "#006cb8",
            borderRadius: "50%",
            width: "17px",
            height: "17px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          {selectedValues.length}
        </div>
      </Button>
    </Popover>
  );
};

LocationFilter.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  baslangicIds: PropTypes.array,
};

export default LocationFilter;
