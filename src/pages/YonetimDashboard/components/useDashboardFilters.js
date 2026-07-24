import { useFormContext, useWatch } from "react-hook-form";

const DEFAULT_START_DATE = "2026-01-01T00:00:00";
const DEFAULT_END_DATE = "2026-06-26T23:59:59";

export default function useDashboardFilters() {
  const { control } = useFormContext();
  const baslangicTarihi = useWatch({
    control,
    name: "filtreBaslangicTarihi",
    defaultValue: DEFAULT_START_DATE,
  });
  const bitisTarihi = useWatch({
    control,
    name: "filtreBitisTarihi",
    defaultValue: DEFAULT_END_DATE,
  });
  const lokasyonIds = useWatch({
    control,
    name: "filtreLokasyonIds",
    defaultValue: [],
  });
  const giderTipi = useWatch({
    control,
    name: "filtreGiderTipi",
    defaultValue: "TÜMÜ",
  });

  return {
    baslangicTarihi: baslangicTarihi || DEFAULT_START_DATE,
    bitisTarihi: bitisTarihi || DEFAULT_END_DATE,
    lokasyonIds: Array.isArray(lokasyonIds) ? lokasyonIds : [],
    giderTipi: giderTipi || "TÜMÜ",
  };
}
