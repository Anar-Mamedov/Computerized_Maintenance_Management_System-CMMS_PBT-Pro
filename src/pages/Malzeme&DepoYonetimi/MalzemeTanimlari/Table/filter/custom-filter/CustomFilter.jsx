import { Select, Space } from "antd";
import React, { useCallback, useRef, useState } from "react";
import AxiosInstance from "../../../../../../api/http";
import { t } from "i18next";

const createEmptyFilters = () => ({
  stkTipIds: [],
  stkDepoIds: [],
  stkGrupIds: [],
});

export default function CustomFilter({ onSubmit }) {
  const [filters, setFilters] = useState(createEmptyFilters());

  const [tipLoading, setTipLoading] = useState(false);
  const [depoLoading, setDepoLoading] = useState(false);
  const [grupLoading, setGrupLoading] = useState(false);

  const tipLoadingRef = useRef(false);
  const depoLoadingRef = useRef(false);
  const grupLoadingRef = useRef(false);

  const [tipOptions, setTipOptions] = useState([]);
  const [depoOptions, setDepoOptions] = useState([]);
  const [grupOptions, setGrupOptions] = useState([]);

  const fetchTipOptions = useCallback(async () => {
    if (tipLoadingRef.current) return;

    try {
      tipLoadingRef.current = true;
      setTipLoading(true);
      const response = await AxiosInstance.get("KodList?grup=13005");
      setTipOptions((response || []).map((item) => ({ value: item.TB_KOD_ID, label: item.KOD_TANIM })));
    } catch (error) {
      console.error("Tip filtre verileri yüklenirken hata oluştu:", error);
    } finally {
      tipLoadingRef.current = false;
      setTipLoading(false);
    }
  }, []);

  const fetchDepoOptions = useCallback(async () => {
    if (depoLoadingRef.current) return;

    try {
      depoLoadingRef.current = true;
      setDepoLoading(true);
      const response = await AxiosInstance.get("GetDepo?DEP_MODUL_NO=1");
      setDepoOptions(
        (response || []).map((item) => ({
          value: item.TB_DEPO_ID,
          label: [item.DEP_KOD, item.DEP_TANIM].filter(Boolean).join(" - ") || item.DEP_TANIM || item.DEP_KOD || `${item.TB_DEPO_ID}`,
        }))
      );
    } catch (error) {
      console.error("Depo filtre verileri yüklenirken hata oluştu:", error);
    } finally {
      depoLoadingRef.current = false;
      setDepoLoading(false);
    }
  }, []);

  const fetchGrupOptions = useCallback(async () => {
    if (grupLoadingRef.current) return;

    try {
      grupLoadingRef.current = true;
      setGrupLoading(true);
      const response = await AxiosInstance.get("KodList?grup=13004");
      setGrupOptions((response || []).map((item) => ({ value: item.TB_KOD_ID, label: item.KOD_TANIM })));
    } catch (error) {
      console.error("Grup filtre verileri yüklenirken hata oluştu:", error);
    } finally {
      grupLoadingRef.current = false;
      setGrupLoading(false);
    }
  }, []);

  const handleFilterChange = (field, values) => {
    const nextFilters = {
      ...filters,
      [field]: values || [],
    };
    setFilters(nextFilters);
    onSubmit(nextFilters);
  };

  return (
    <Space size={10} wrap>
      <Select
        mode="multiple"
        allowClear
        showSearch
        loading={tipLoading}
        style={{ width: 170 }}
        placeholder={t("malzemeTipi")}
        value={filters.stkTipIds}
        options={tipOptions}
        maxTagCount="responsive"
        maxTagTextLength={16}
        maxTagPlaceholder={() => "..."}
        optionFilterProp="label"
        onOpenChange={(open) => {
          if (open) {
            fetchTipOptions();
          }
        }}
        onFocus={fetchTipOptions}
        onChange={(values) => handleFilterChange("stkTipIds", values)}
      />

      <Select
        mode="multiple"
        allowClear
        showSearch
        loading={depoLoading}
        style={{ width: 220 }}
        placeholder={t("bulunduguDepo")}
        value={filters.stkDepoIds}
        options={depoOptions}
        maxTagCount="responsive"
        maxTagTextLength={16}
        maxTagPlaceholder={() => "..."}
        optionFilterProp="label"
        onOpenChange={(open) => {
          if (open) {
            fetchDepoOptions();
          }
        }}
        onFocus={fetchDepoOptions}
        onChange={(values) => handleFilterChange("stkDepoIds", values)}
      />

      <Select
        mode="multiple"
        allowClear
        showSearch
        loading={grupLoading}
        style={{ width: 170 }}
        placeholder={t("malzemeGrubu")}
        value={filters.stkGrupIds}
        options={grupOptions}
        maxTagCount="responsive"
        maxTagTextLength={16}
        maxTagPlaceholder={() => "..."}
        optionFilterProp="label"
        onOpenChange={(open) => {
          if (open) {
            fetchGrupOptions();
          }
        }}
        onFocus={fetchGrupOptions}
        onChange={(values) => handleFilterChange("stkGrupIds", values)}
      />
    </Space>
  );
}
