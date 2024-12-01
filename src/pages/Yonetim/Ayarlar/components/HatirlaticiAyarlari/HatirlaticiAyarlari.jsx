import React, { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Spin, Button, message } from "antd";
import AxiosInstance from "../../../../../api/http";
import dayjs from "dayjs";
import { t } from "i18next";
import HatirlaticiTablosu from "./components/HatirlaticiTablosu";

function HatirlaticiAyarlari() {
  const [loading, setLoading] = useState(true);

  const methods = useForm({
    defaultValues: {},
  });

  const { setValue, reset, watch } = methods;

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  return (
    <FormProvider {...methods}>
      <Spin spinning={loading}>
        <div style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
          <form>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", paddingBottom: "10px" }}>
              <HatirlaticiTablosu setLoading={setLoading} />
            </div>
          </form>
        </div>
      </Spin>
    </FormProvider>
  );
}

export default HatirlaticiAyarlari;
