import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Empty, Segmented, Spin, Table } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import KodIDSelectbox from "../../../../utils/components/KodIDSelectbox";
import { DegerBirim } from "./Hucreler";
import { GRUPLAMALAR, SAYAC_TIP_KOD_GRUBU } from "../sabitler";
import { sayiMetni } from "../yardimcilar";

/**
 * 3. sekme: secilen gruba (ekipman tipi / marka / lokasyon) gore ekipman basina ortalama sayac artisi.
 * Cubuk genisligi backend'in `percentage` degeridir (en yuksek ortalama %100). Gruplar farkli birimde olabildigi icin
 * (saat, m3...) birim her satirin `unit` alanindan okunur. Sag ustteki sayac tipi secilmezse backend ust filtredeki sayac
 * tiplerini kullanir.
 */
export default function Karsilastirma({ satirlar, yukleniyor, grupla, onGruplaDegistir, onSayacTipiDegistir }) {
  const { t, i18n } = useTranslation();
  // Global KodIDSelectbox form alanina yazar; secim yalnizca bu kartta kullanildigi icin yerel form yeterli.
  const sayacTipiFormu = useForm({ defaultValues: { karsilastirmaSayacTipi: null, karsilastirmaSayacTipiID: null } });

  const kolonlar = useMemo(() => {
    const baslik = (anahtar) => t(anahtar).toLocaleUpperCase(i18n.language);
    return [
      { key: "grup", title: baslik(`sayacHareketleri.grup.${grupla}`), dataIndex: "groupName", render: (deger) => <span className="sh-kalin">{deger}</span> },
      { key: "sayi", title: baslik("sayacHareketleri.kolon.ekipmanSayisi"), width: 160, align: "right", render: (_, satir) => sayiMetni(satir.equipmentCount, i18n.language) },
      { key: "toplam", title: baslik("sayacHareketleri.kolon.toplamArtis"), width: 180, align: "right", render: (_, satir) => <DegerBirim deger={satir.totalIncrement} birim={satir.unit} /> },
      {
        key: "ortalama",
        title: baslik("sayacHareketleri.kolon.ekipmanBasinaOrtalama"),
        width: 220,
        align: "right",
        render: (_, satir) => <DegerBirim deger={satir.averagePerEquipment} birim={satir.unit} ondalik={1} />,
      },
    ];
  }, [grupla, i18n.language, t]);

  return (
    <Spin spinning={yukleniyor}>
      <div className="sh-karsilastirma">
        <div className="sh-kart sh-bolum">
          <div className="sh-bolum-ust">
            <div>
              <h3 className="sh-bolum-baslik">{t("sayacHareketleri.karsilastirmaBaslik")}</h3>
              <p className="sh-soluk sh-kucuk">{t("sayacHareketleri.karsilastirmaAciklama")}</p>
            </div>
            <div className="sh-karsilastirma-sayac">
              <FormProvider {...sayacTipiFormu}>
                <KodIDSelectbox
                  name1="karsilastirmaSayacTipi"
                  kodID={SAYAC_TIP_KOD_GRUBU}
                  showDropdownAdd={false}
                  placeholder={t("sayacHareketleri.sayacTipiSecin")}
                  onChange={(deger) => onSayacTipiDegistir(deger ?? null)}
                />
              </FormProvider>
            </div>
          </div>
          <Segmented value={grupla} onChange={onGruplaDegistir} options={GRUPLAMALAR.map((grup) => ({ value: grup.key, label: t(grup.labelKey) }))} />

          {satirlar.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("sayacHareketleri.kayitBulunamadi")} />
          ) : (
            <div className="sh-cubuklar">
              {satirlar.map((satir) => (
                <div key={satir.clientKey} className="sh-cubuk-satiri">
                  <div className="sh-cubuk-etiketi">
                    <span className="sh-kalin" title={satir.groupName}>
                      {satir.groupName}
                    </span>
                    <span className="sh-soluk sh-kucuk">{t("sayacHareketleri.ekipmanSayili", { sayi: sayiMetni(satir.equipmentCount, i18n.language) })}</span>
                  </div>
                  <div className="sh-cubuk-zemini">
                    <div className="sh-cubuk" style={{ width: `${Math.min(Math.max(Number(satir.percentage) || 0, 0), 100)}%` }} />
                  </div>
                  <div className="sh-cubuk-degeri">
                    <DegerBirim deger={satir.averagePerEquipment} birim={satir.unit} ondalik={1} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sh-kart">
          <h3 className="sh-bolum-baslik sh-tablo-basligi">{t("sayacHareketleri.grupOzetiBaslik")}</h3>
          <Table className="sh-tablo" rowKey="clientKey" columns={kolonlar} dataSource={satirlar} pagination={false} scroll={{ x: 640 }} />
        </div>
      </div>
    </Spin>
  );
}

Karsilastirma.propTypes = {
  satirlar: PropTypes.arrayOf(PropTypes.object).isRequired,
  yukleniyor: PropTypes.bool.isRequired,
  grupla: PropTypes.string.isRequired,
  onGruplaDegistir: PropTypes.func.isRequired,
  onSayacTipiDegistir: PropTypes.func.isRequired,
};
