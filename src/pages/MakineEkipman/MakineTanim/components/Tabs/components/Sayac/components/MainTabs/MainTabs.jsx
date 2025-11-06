import React, { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { Typography } from "antd";

import { t } from "i18next";
import TextInput from "../../../../../../../../../utils/components/Form/TextInput";
import KodIDSelectbox from "../../../../../../../../../utils/components/KodIDSelectbox";
import LokasyonTablo from "../../../../../../../../../utils/components/LokasyonTablo";
import MarkaEkleSelect from "../../../../../../../../../utils/components/MarkaEkleSelect";
import ModelEkleSelect from "../../../../../../../../../utils/components/ModelEkleSelect";
import OperatorSelectBox from "../../../../../../../../../utils/components/OperatorSelectBox";
import MakineTakvimTablo from "../../../../../../../../../utils/components/MakineTakvimTablo";
import FullDatePicker from "../../../../../../../../../utils/components/FullDatePicker";
import NumberInput from "../../../../../../../../../utils/components/NumberInput";
import MakineTablo from "../../../../../../../../../utils/components/Machina/MakineTablo";
import StatusButtons from "./components/StatusButtons.jsx";

const { Text } = Typography;

export default function MainTabs() {
  const [isLokasyonModalOpen, setIsLokasyonModalOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-[10px] mb-[10px] box-border">
      <div className="bg-white p-[10px] border border-[#80808068] rounded-[5px] flex flex-col items-start shadow-[0_2px_8px_rgba(0,0,0,0.08)] w-full  box-border">
        <div className="pb-[10px] inline-flex flex-col items-start">
          <Text className="text-base font-semibold">{t("temelBilgiler")}</Text>
          <Text type="secondary">{t("sayacBilgileri")}</Text>
        </div>
        <div className="flex flex-row flex-wrap w-full gap-[10px]">
          <div className="flex flex-col items-start w-full max-w-[300px]">
            <Text type="secondary">
              {t("sayacTanimi")}
              <span className="text-[#c90000]">*</span>
            </Text>
            <TextInput name="sayacTanim" required={true} />
          </div>

          <div className="flex flex-col items-start w-full max-w-[300px]">
            <Text type="secondary">
              {t("sayacTipi")}
              <span className="text-[#c90000]">*</span>
            </Text>
            <KodIDSelectbox name1="sayacTipi" kodID={32702} isRequired={true} />
          </div>
          <div className="flex flex-col items-start w-full max-w-[300px]">
            <Text type="secondary">{t("durum")}</Text>
            <StatusButtons />
          </div>
          <div className="flex flex-col items-start w-full max-w-[300px]">
            <Text type="secondary">
              {t("sayacBirimi")}
              <span className="text-[#c90000]">*</span>
            </Text>
            <KodIDSelectbox name1="sayacBirimi" kodID={32701} isRequired={true} />
          </div>
          <div className="flex flex-col items-start w-full max-w-[300px]">
            <Text type="secondary">{t("sayacDegeri")}</Text>
            <NumberInput name1="sayacDegeri" required={false} minNumber={0} />
          </div>
        </div>
      </div>
    </div>
  );
}
