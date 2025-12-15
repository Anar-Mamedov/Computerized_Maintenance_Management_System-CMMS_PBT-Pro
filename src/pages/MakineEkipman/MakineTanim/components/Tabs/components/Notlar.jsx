import React from "react";
import { Typography } from "antd";
import { t } from "i18next";
import Textarea from "../../../../../../utils/components/Form/Textarea";

const { Text } = Typography;

const containerClasses = "flex flex-wrap gap-[10px] mb-[10px] box-border";
const cardBaseClasses = "bg-white p-[10px] border border-[#80808068] rounded-[5px] flex flex-col items-start shadow-[0_2px_8px_rgba(0,0,0,0.08)] w-full box-border min-w-0";
const noteCardClasses = "lg:flex-[1_1_calc((100%-10px)/2)] lg:min-w-[360px] lg:max-w-[720px]";

function Notlar() {
  return (
    <div className={containerClasses}>
      <div className={`${cardBaseClasses} ${noteCardClasses}`}>
        <div className="pb-[10px] inline-flex flex-col items-start">
          <Text style={{ fontSize: "16px", fontWeight: "600" }}>{t("genelNot")}</Text>
          <Text type="secondary">{t("ekipmanHakkindaGenelNotlar")}</Text>
        </div>
        <div className="flex flex-col items-start w-full">
          <Textarea name="makineGenelNot" required={true} styles={{ minHeight: "200px" }} />
        </div>
      </div>
      <div className={`${cardBaseClasses} ${noteCardClasses}`}>
        <div className="pb-[10px] inline-flex flex-col items-start">
          <Text style={{ fontSize: "16px", fontWeight: "600" }}>{t("guvenlikNotu")}</Text>
          <Text type="secondary">{t("ekipmanHakkindaGüvenlikNotları")}</Text>
        </div>
        <div className="flex flex-col items-start w-full">
          <Textarea name="makineGuvenlikNotu" required={true} styles={{ minHeight: "200px" }} />
        </div>
      </div>
    </div>
  );
}

export default Notlar;
