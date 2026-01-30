import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Typography } from "antd";

import { t } from "i18next";
import TextInput from "../../../../../utils/components/Form/TextInput";
import KodIDSelectbox from "../../../../../utils/components/KodIDSelectbox";
import LokasyonTablo from "../../../../../utils/components/LokasyonTablo";
import MarkaEkleSelect from "../../../../../utils/components/MarkaEkleSelect";
import ModelEkleSelect from "../../../../../utils/components/ModelEkleSelect";
import OperatorSelectBox from "../../../../../utils/components/OperatorSelectBox";
import MakineTakvimTablo from "../../../../../utils/components/MakineTakvimTablo";
import FullDatePicker from "../../../../../utils/components/FullDatePicker";
import NumberInput from "../../../../../utils/components/NumberInput";
import MakineTablo from "../../../../../utils/components/Machina/MakineTablo";
import StatusButtons from "./components/StatusButtons.jsx";

const { Text } = Typography;

const cardBaseClasses = "bg-white p-[10px] border border-[#80808068] rounded-[5px] flex flex-col items-start shadow-[0_2px_8px_rgba(0,0,0,0.08)] w-full box-border min-w-0";
const wideCardClasses = "lg:w-auto lg:flex-1 lg:min-w-[700px]";
const narrowCardClasses = "lg:w-auto lg:flex-[0_0_325px] lg:max-w-[325px]";

import ResimCarousel from "../../../../../utils/components/Resim/ResimCarousel";

export default function MainTabs({ refreshKey }) {
  const { setValue, watch } = useFormContext();
  const secilenMakineID = watch("secilenMakineID");
  const [isLokasyonModalOpen, setIsLokasyonModalOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-[10px] mb-[10px] box-border">
      <div className={`${cardBaseClasses} ${wideCardClasses}`}>
        <div className="pb-[10px] inline-flex flex-col items-start">
          <Text className="text-base font-semibold">{t("temelBilgiler")}</Text>
          <Text type="secondary">{t("ekipmanKimlikVeKonumBilgileri")}</Text>
        </div>
        <div className="flex flex-row flex-wrap w-full gap-[10px]">
          <div className="flex flex-col items-start w-[calc(50%-5px)]">
            <Text type="secondary">
              {t("ekipmanKodu")}
              <span className="text-[#c90000]">*</span>
            </Text>
            <TextInput name="makineKodu" required={true} />
          </div>
          <div className="flex flex-col items-start w-[calc(50%-5px)]">
            <Text type="secondary">
              {t("ekipmanTanimi")}
              <span className="text-[#c90000]">*</span>
            </Text>
            <TextInput name="makineTanimi" required={true} />
          </div>
          <div className="flex flex-col items-start w-[calc(50%-5px)]">
            <Text type="secondary">
              {t("lokasyon")}
              <span className="text-[#c90000]">*</span>
            </Text>
            <LokasyonTablo
              lokasyonFieldName="lokasyon"
              lokasyonIdFieldName="lokasyonID"
              isModalVisible={isLokasyonModalOpen}
              setIsModalVisible={setIsLokasyonModalOpen}
              isRequired={true}
            />
          </div>
          <div className="flex flex-col items-start w-[calc(50%-5px)]">
            <Text type="secondary">
              {t("ekipmanTipi")}
              <span className="text-[#c90000]">*</span>
            </Text>
            <KodIDSelectbox name1="makineTipi" kodID={32501} isRequired={true} placeholder="" />
          </div>
          <div className="flex flex-col items-start w-[calc(50%-5px)]">
            <Text type="secondary">{t("kategori")}</Text>
            <KodIDSelectbox name1="kategori" kodID={32502} isRequired={false} placeholder="" />
          </div>

          <div className="flex flex-col items-start w-[calc(50%-5px)]">
            <Text type="secondary">{t("operator")}</Text>
            <OperatorSelectBox name1="operator" isRequired={false} placeholder="" />
          </div>

          <div className="flex flex-col items-start w-[calc(50%-5px)]">
            <Text type="secondary">{t("marka")}</Text>
            <MarkaEkleSelect markaFieldName="marka" markaIdFieldName="markaID" placeholder="" />
          </div>

          <div className="flex flex-col items-start w-[calc(50%-5px)]">
            <Text type="secondary">{t("model")}</Text>
            <ModelEkleSelect modelFieldName="model" modelIdFieldName="modelID" markaIdFieldName="markaID" placeholder="" />
          </div>
        </div>
      </div>

      <div className={`${cardBaseClasses} ${narrowCardClasses}`}>
        <div className="pb-[10px] inline-flex flex-col items-start">
          <Text className="text-base font-semibold">{t("ekipmanGorseli")}</Text>
          <Text type="secondary">{t("buEkipmanaOzelFotograflariInceleyin")}</Text>
        </div>
        <div className="flex flex-row flex-wrap w-full gap-[10px]">
          <div className="w-full min-h-[180px] rounded-[6px] flex items-center justify-center bg-[#fafafa]">
            <ResimCarousel makineID={secilenMakineID} refreshKey={refreshKey} />
          </div>
        </div>
      </div>
      <div className={`${cardBaseClasses} ${wideCardClasses}`}>
        <div className="pb-[10px] inline-flex flex-col items-start">
          <Text className="text-base font-semibold">{t("operasyon&Maliyet")}</Text>
          <Text type="secondary">{t("durumSeriNoVeMaliyetParametreleri")}</Text>
        </div>
        <div className="flex flex-row flex-wrap w-full gap-[10px]">
          <div className="flex flex-col items-start w-[calc(50%-5px)]">
            <Text type="secondary">{t("durum")}</Text>
            <KodIDSelectbox name1="operasyonDurumu" kodID={32505} isRequired={false} placeholder="" onLabelChange={(label) => setValue("operasyonDurumuText", label ?? null)} />
          </div>
          <div className="flex flex-col items-start w-[calc(50%-5px)]">
            <Text type="secondary">{t("seriNo")}</Text>
            <TextInput name="seriNo" required={false} />
          </div>
          <div className="flex flex-col items-start w-[calc(50%-5px)]">
            <Text type="secondary">{t("masterEkipman")}</Text>
            <MakineTablo makineFieldName="masterMakine" makineIdFieldName="masterMakineID" />
          </div>
          <div className="flex flex-col items-start w-[calc(50%-5px)]">
            <Text type="secondary">{t("takvim")}</Text>
            <MakineTakvimTablo fieldName="takvim" fieldNameID="takvimID" />
          </div>
          <div className="flex flex-col items-start w-[calc(50%-5px)]">
            <Text type="secondary">{t("uretici")}</Text>
            <TextInput name="uretici" required={false} />
          </div>
          <div className="flex flex-col items-start w-[calc(50%-5px)]">
            <Text type="secondary">{t("uretimYili")}</Text>
            <FullDatePicker name1="uretimYili" isRequired={false} pickType="year" placeholder="" />
          </div>
          <div className="flex flex-col items-start w-[calc(50%-5px)]">
            <Text type="secondary">{t("garantiBitisTarihi")}</Text>
            <FullDatePicker name1="garantiBitisTarihi" isRequired={false} placeholder="" />
          </div>
          <div className="flex flex-col items-start w-[calc(50%-5px)]">
            <Text type="secondary">{t("durusBirimMaliyeti(ucret/saat)")}</Text>
            <NumberInput name1="durusBirimMaliyeti" required={false} minNumber={0} />
          </div>
          <div className="flex flex-col items-start w-[calc(50%-5px)]">
            <Text type="secondary">{t("planCalismaSuresi(saat/gun)")}</Text>
            <NumberInput name1="planCalismaSuresi" required={false} minNumber={0} maxNumber={24} />
          </div>
        </div>
      </div>

      <div className={`${cardBaseClasses} ${narrowCardClasses}`}>
        <div className="pb-[10px] inline-flex flex-col items-start">
          <Text className="text-base font-semibold">{t("durum&Ozellikler")}</Text>
          <Text type="secondary">{t("isaretlenebilirNitelikler")}</Text>
        </div>
        <div className="flex flex-row flex-wrap w-full gap-[10px]">
          <StatusButtons />
        </div>
      </div>
    </div>
  );
}
