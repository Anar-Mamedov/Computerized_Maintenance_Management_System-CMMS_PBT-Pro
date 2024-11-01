import React from "react";
import Main from "./Main/Main";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";

export default function PersonelTanimlari() {
  const methods = useForm({
    defaultValues: {
      locationIds: "",
      atolyeIds: "",
      makineIds: "",
      baslangicTarihi: dayjs().startOf("week"),
      bitisTarihi: dayjs().endOf("week"),
    },
  });
  return (
    <FormProvider {...methods}>
      <div>
        <Main />
      </div>
    </FormProvider>
  );
}
