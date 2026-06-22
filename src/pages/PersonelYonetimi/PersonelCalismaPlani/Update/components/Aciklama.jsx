import React from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox, InputNumber, Radio, ColorPicker, Switch } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

const { Text, Link } = Typography;
const { TextArea } = Input;

function Aciklama() {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  return (
    <div>
      <Controller name="aciklama" control={control} render={({ field }) => <TextArea {...field} rows={4} />} />
    </div>
  );
}

export default Aciklama;
