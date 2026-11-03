import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { t } from "i18next";
import AxiosInstance from "../../api/http";

/**
 * Model filtresi. Liste API'leri modeli ID dizisi olarak beklediği için
 * seçim `TB_MODEL_ID` üzerinden tutulur. `markaId=0` tüm markaların modellerini döndürür.
 * `markaIds` verilirse yalnızca o markaların modelleri listelenir (boşsa `markaId=0`).
 */
export default function ModelFilterSelectbox({ value, onChange, markaIds }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  // Seçenekleri yüklenmiş marka seçimi; seçimden düşen modeller ancak yeni liste gelince ayıklanır.
  const [yuklenenMarkalar, setYuklenenMarkalar] = useState(null);
  const markayaBagli = markaIds !== undefined;
  // Dizi her render'da yeni gelebilir; istek yalnızca seçili markalar değişince atılır.
  const markaAnahtari = (markaIds || []).join(",");

  useEffect(() => {
    let cancelled = false;

    const fetchModeller = async () => {
      setLoading(true);
      try {
        const idler = markaAnahtari ? markaAnahtari.split(",") : ["0"];
        const responses = await Promise.all(idler.map((markaId) => AxiosInstance.get(`GetMakineModelByMarkaId?markaId=${markaId}`)));
        if (cancelled) return;

        setOptions(
          responses
            .flatMap((response) => response?.Makine_Model_List || [])
            .filter((item) => item?.TB_MODEL_ID !== undefined && item?.TB_MODEL_ID !== null)
            .map((item) => ({ value: item.TB_MODEL_ID, label: item.MDL_MODEL }))
        );
        setYuklenenMarkalar(markaAnahtari);
      } catch (error) {
        console.error("Model listesi alınamadı:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchModeller();

    return () => {
      cancelled = true;
    };
  }, [markaAnahtari]);

  // Marka seçimi değişince, seçili markalara ait olmayan modeller seçimden çıkarılır.
  useEffect(() => {
    if (!markayaBagli || yuklenenMarkalar !== markaAnahtari) return;

    const secili = value || [];
    const gecerli = secili.filter((id) => options.some((option) => option.value === id));
    if (gecerli.length !== secili.length) onChange(gecerli);
  }, [markayaBagli, yuklenenMarkalar, markaAnahtari, options, value, onChange]);

  return (
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder={t("model")}
      value={value || []}
      onChange={onChange}
      options={options}
      loading={loading}
      optionFilterProp="label"
      allowClear
      showSearch
      maxTagCount="responsive"
    />
  );
}

ModelFilterSelectbox.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  markaIds: PropTypes.array,
};
