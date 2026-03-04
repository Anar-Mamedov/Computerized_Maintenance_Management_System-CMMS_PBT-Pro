import { Space } from "antd";
import React, { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DepoTablo from "../../../../../../utils/components/DepoTablo";
import KodIDSelectbox from "../../../../../../utils/components/KodIDSelectbox";
import { t } from "i18next";

export default function CustomFilter({ onSubmit }) {
  const methods = useForm({
    defaultValues: {
      stkTip: [],
      stkTipID: [],
      stkDepo: "",
      stkDepoID: [],
      stkGrup: [],
      stkGrupID: [],
    },
  });

  const stkTip = methods.watch("stkTip");
  const stkDepoID = methods.watch("stkDepoID");
  const stkGrup = methods.watch("stkGrup");
  const onSubmitRef = useRef(onSubmit);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  useEffect(() => {
    const normalizeIds = (value) => {
      if (Array.isArray(value)) {
        return value.filter((item) => item !== null && item !== undefined && item !== "");
      }
      if (value === null || value === undefined || value === "") {
        return [];
      }
      return [value];
    };

    onSubmitRef.current({
      stkTipIds: normalizeIds(stkTip),
      stkDepoIds: normalizeIds(stkDepoID),
      stkGrupIds: normalizeIds(stkGrup),
    });
  }, [stkTip, stkDepoID, stkGrup]);

  return (
    <FormProvider {...methods}>
      <Space size={10} wrap style={{ alignItems: "center" }}>
        <div style={{ width: 170 }}>
          <KodIDSelectbox
            name1="stkTip"
            kodID={13005}
            isRequired={false}
            placeholder={t("malzemeTipi")}
            mode="multiple"
            maxTagCount="responsive"
            maxTagTextLength={16}
            maxTagPlaceholder={() => "..."}
            showDropdownAdd={false}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ width: 220 }}>
          <DepoTablo name1="stkDepo" isRequired={false} placeholder={t("bulunduguDepo")} style={{ width: "100%" }} inputStyle={{ maxWidth: "none" }} multiSelect={true} />
        </div>

        <div style={{ width: 170 }}>
          <KodIDSelectbox
            name1="stkGrup"
            kodID={13004}
            isRequired={false}
            placeholder={t("malzemeGrubu")}
            mode="multiple"
            maxTagCount="responsive"
            maxTagTextLength={16}
            maxTagPlaceholder={() => "..."}
            showDropdownAdd={false}
            style={{ width: "100%" }}
          />
        </div>
      </Space>
    </FormProvider>
  );
}
