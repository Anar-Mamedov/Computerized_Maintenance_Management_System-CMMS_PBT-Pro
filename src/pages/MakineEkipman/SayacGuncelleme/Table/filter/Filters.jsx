import React, { useEffect } from "react";
import { Button, Input, Space } from "antd";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import LokasyonSelectbox from "../../../../../utils/components/LokasyonSelectbox.jsx";
import MakineTipSelectbox from "../../../../../utils/components/MakineTipSelectbox.jsx";
import SayacTipSelectbox from "../../../../../utils/components/SayacTipSelectbox.jsx";

const DEFAULT_VALUES = {
  Kelime: "",
  LokasyonIds: [],
  MakineTipIds: [],
  SayacTipIds: [],
};

export default function Filters({ onApply, initialValues = DEFAULT_VALUES }) {
  const { t } = useTranslation();
  const methods = useForm({
    defaultValues: initialValues,
  });

  useEffect(() => {
    methods.reset(initialValues);
  }, [initialValues, methods]);

  return (
    <FormProvider {...methods}>
      <Space wrap size="middle">
        <Controller
          name="Kelime"
          control={methods.control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder={t("aramaYap", { defaultValue: "Arama Yap" })}
              allowClear
              style={{ width: 220 }}
            />
          )}
        />
        <LokasyonSelectbox fieldName="LokasyonIds" />
        <MakineTipSelectbox fieldName="MakineTipIds" />
        <SayacTipSelectbox fieldName="SayacTipIds" />
        <Button type="primary" onClick={methods.handleSubmit(onApply)}>
          {t("filtreyiUygula", { defaultValue: "Filtreyi Uygula" })}
        </Button>
      </Space>
    </FormProvider>
  );
}
