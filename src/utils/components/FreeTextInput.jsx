import React, { useEffect, useState } from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox, InputNumber, Radio, ColorPicker, Switch } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

export default function FreeTextInput({ name1, isRequired }) {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Controller
        name={name1}
        control={control}
        rules={{ required: isRequired ? t("alanBosBirakilamaz") : false }}
        render={({ field }) => <Input {...field} status={errors[name1] ? "error" : ""} style={{ flex: 1 }} />}
      />
      {errors[name1] && <div style={{ color: "red", marginTop: "5px" }}>{errors[name1].message}</div>}
    </>
  );
}
