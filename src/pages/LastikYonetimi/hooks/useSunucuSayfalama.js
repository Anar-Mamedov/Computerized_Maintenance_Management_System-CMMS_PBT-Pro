import { useCallback, useState } from "react";
import i18n, { t } from "i18next";
import { formatNumberWithSeparators } from "../../../utils/numberLocale";

const VARSAYILAN_SAYFA_BOYUTU = 20;
const SIRALAMA_YOK = { alan: null, yon: null };

// İş Emri listesiyle aynı sunucu tarafı sayfalama ve sıralama.
// İstek sorgusu: pagingDeger, pageSize ve sıralama seçiliyse sortField, sortOrder (ASC/DESC).
const useSunucuSayfalama = () => {
  const [sayfa, setSayfa] = useState(1);
  const [sayfaBoyutu, setSayfaBoyutu] = useState(VARSAYILAN_SAYFA_BOYUTU);
  const [siralama, setSiralama] = useState(SIRALAMA_YOK);

  const siralamaSorgusu = siralama.alan ? `&sortField=${siralama.alan}&sortOrder=${siralama.yon === "ascend" ? "ASC" : "DESC"}` : "";
  const sayfalamaSorgusu = `pagingDeger=${sayfa}&pageSize=${sayfaBoyutu}${siralamaSorgusu}`;

  // Tablonun onChange'i: sayfa, sayfa boyutu ve kolon sıralaması tek yerden güncellenir.
  const tabloDegisti = useCallback((pagination, _filters, sorter) => {
    setSayfa(pagination.current);
    setSayfaBoyutu(pagination.pageSize);
    setSiralama(sorter?.field && sorter.order ? { alan: sorter.field, yon: sorter.order } : SIRALAMA_YOK);
  }, []);

  const ilkSayfayaDon = useCallback(() => setSayfa(1), []);

  const sayfalamaAyarlari = (toplamKayit) => ({
    current: sayfa,
    total: toplamKayit,
    pageSize: sayfaBoyutu,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
    position: ["bottomRight"],
    showTotal: (toplam) => `${t("toplam")} ${formatNumberWithSeparators(toplam, i18n.language)}`,
    showQuickJumper: true,
  });

  return { sayfalamaSorgusu, tabloDegisti, ilkSayfayaDon, sayfalamaAyarlari };
};

export default useSunucuSayfalama;
