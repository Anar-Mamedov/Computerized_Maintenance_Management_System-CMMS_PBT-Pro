import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Space } from "antd";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { LuLayoutGrid, LuRefreshCw } from "react-icons/lu";
import DateRangeFilter from "./DateRangeFilter";
import LokasyonTablo from "../../../utils/components/LokasyonTablo";
import EkipmanFilterSelect from "./EkipmanFilterSelect";
import { useDashboard } from "./dashboardContext";
import { COLORS } from "./theme";

export default function FilterBar({ onOpenWidgetManager }) {
  const { t } = useTranslation();
  const { watch } = useFormContext();
  const { baslangicTarihi, bitisTarihi, ekipmanIds, setBaslangicTarihi, setBitisTarihi, setLokasyonIds, setEkipmanIds, refresh, sonGuncelleme } = useDashboard();

  const formBaslangic = watch("dashboardBaslangicTarihi");
  const formBitis = watch("dashboardBitisTarihi");

  // Form üzerindeki tarih seçimleri dashboard filtre state'ine aktarılır.
  // "Tümü" seçiminde tarihler boşalır; bu yüzden boş değer de aktarılmalıdır.
  useEffect(() => {
    if (formBaslangic === undefined) return;
    const ayni = formBaslangic ? dayjs(formBaslangic).isSame(baslangicTarihi, "day") : !baslangicTarihi;
    if (!ayni) setBaslangicTarihi(formBaslangic || null);
  }, [formBaslangic, baslangicTarihi, setBaslangicTarihi]);

  useEffect(() => {
    if (formBitis === undefined) return;
    const ayni = formBitis ? dayjs(formBitis).isSame(bitisTarihi, "day") : !bitisTarihi;
    if (!ayni) setBitisTarihi(formBitis || null);
  }, [formBitis, bitisTarihi, setBitisTarihi]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
      <Space wrap size={8}>
        <DateRangeFilter />
        <span style={{ display: "inline-block", width: 232 }}>
          <LokasyonTablo
            lokasyonFieldName="dashboardLokasyonTanim"
            lokasyonIdFieldName="dashboardLokasyonID"
            placeholder={t("tumLokasyonlar")}
            onSubmit={(selectedData) => setLokasyonIds([selectedData.key])}
            onClear={() => setLokasyonIds([])}
          />
        </span>
        <EkipmanFilterSelect value={ekipmanIds} onChange={setEkipmanIds} />
      </Space>

      <Space wrap size={8}>
        <span style={{ fontSize: 12.5, color: COLORS.muted }}>
          {t("sonGuncelleme")}: {dayjs(sonGuncelleme).format("HH:mm")}
        </span>
        <Button icon={<LuRefreshCw size={14} />} onClick={refresh}>
          {t("verileriYenile")}
        </Button>
        <Button icon={<LuLayoutGrid size={14} />} onClick={onOpenWidgetManager}>
          {t("widgetleriYonet")}
        </Button>
      </Space>
    </div>
  );
}

FilterBar.propTypes = {
  onOpenWidgetManager: PropTypes.func.isRequired,
};
