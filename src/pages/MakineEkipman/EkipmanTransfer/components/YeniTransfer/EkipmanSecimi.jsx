import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Input, Select, message } from "antd";
import { useTranslation } from "react-i18next";
import { LuSearch } from "react-icons/lu";
import EkipmanTablosu from "../EkipmanTablosu";
import useDebounce from "../../../../../hooks/useDebounce";
import { getUygunEkipmanlar, hataMesaji } from "../../transferService";
import { ekipmanSatirlariniHazirla } from "../../useTransferDetayi";
import { EKIPMAN_DURUMLARI } from "../../sabitler";
import { formatNumberWithSeparators } from "../../../../../utils/numberLocale";

const TUMU = "All";

/**
 * 2. adim: kaynak santiyedeki ekipmanlar (GetAvailableEquipments) listelenir ve isaretlenir.
 * Secim backend ID'leriyle tutulur; arama / durum filtresi degisince gorunmeyen secimler korunur.
 */
export default function EkipmanSecimi({ kaynakLokasyonID, kaynakLokasyonAdi, secilenIdler, onSecimDegistir, onKaydet, kaydediliyor }) {
  const { t, i18n } = useTranslation();
  const [arama, setArama] = useState("");
  const [durum, setDurum] = useState(TUMU);
  const [satirlar, setSatirlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const gecikmeliArama = useDebounce(arama, 400);

  useEffect(() => {
    if (!kaynakLokasyonID) return undefined;

    let iptal = false;
    setYukleniyor(true);
    getUygunEkipmanlar({ sourceLocationId: kaynakLokasyonID, search: gecikmeliArama.trim(), status: durum })
      .then((yanit) => {
        if (!iptal) setSatirlar(ekipmanSatirlariniHazirla(yanit.items));
      })
      .catch((hata) => {
        if (iptal) return;
        console.error("Uygun ekipmanlar alınamadı:", hata);
        setSatirlar([]);
        message.error(hataMesaji(hata));
      })
      .finally(() => {
        if (!iptal) setYukleniyor(false);
      });

    return () => {
      iptal = true;
    };
  }, [kaynakLokasyonID, gecikmeliArama, durum]);

  const gorunenIdler = satirlar.map((satir) => satir.equipmentId);
  const rowSelection = {
    selectedRowKeys: satirlar.filter((satir) => secilenIdler.includes(satir.equipmentId)).map((satir) => satir.clientKey),
    onChange: (_anahtarlar, secilenSatirlar) =>
      onSecimDegistir([...secilenIdler.filter((id) => !gorunenIdler.includes(id)), ...secilenSatirlar.map((satir) => satir.equipmentId)]),
  };

  return (
    <div className="et-modal-govde">
      <div className="et-bolum-satiri">
        <div className="et-dugme-grubu">
          <Input
            className="et-ekipman-arama"
            allowClear
            prefix={<LuSearch size={14} className="et-soluk" />}
            placeholder={t("ekipmanTransfer.kodTipAra")}
            value={arama}
            onChange={(event) => setArama(event.target.value)}
          />
          <Select
            className="et-ekipman-durum"
            value={durum}
            onChange={setDurum}
            options={[
              { value: TUMU, label: t("ekipmanTransfer.tumDurumlar") },
              ...EKIPMAN_DURUMLARI.map((oge) => ({ value: oge.key, label: t(`ekipmanTransfer.ekipmanDurumu.${oge.key}`) })),
            ]}
          />
        </div>
        <div className="et-dugme-grubu">
          <span className="et-soluk">{t("ekipmanTransfer.seciliEkipman", { sayi: formatNumberWithSeparators(secilenIdler.length, i18n.language) })}</span>
          <Button type="primary" loading={kaydediliyor} disabled={secilenIdler.length === 0} onClick={onKaydet}>
            {t("kaydet")}
          </Button>
        </div>
      </div>
      <p className="et-soluk et-aciklama">{t("ekipmanTransfer.lokasyonEkipmanlari", { lokasyon: kaynakLokasyonAdi })}</p>
      <EkipmanTablosu satirlar={satirlar} yukleniyor={yukleniyor} rowSelection={rowSelection} scrollY={360} />
    </div>
  );
}

EkipmanSecimi.propTypes = {
  kaynakLokasyonID: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  kaynakLokasyonAdi: PropTypes.string,
  secilenIdler: PropTypes.arrayOf(PropTypes.number).isRequired,
  onSecimDegistir: PropTypes.func.isRequired,
  onKaydet: PropTypes.func.isRequired,
  kaydediliyor: PropTypes.bool.isRequired,
};
