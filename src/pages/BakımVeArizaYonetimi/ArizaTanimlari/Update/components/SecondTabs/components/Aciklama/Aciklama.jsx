import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";

const { Text, Link } = Typography;
const { TextArea } = Input;

export default function Aciklama() {
  const { control, watch, setValue } = useFormContext();

  return (
    <div>
      <Controller
        name="aciklama"
        control={control}
        render={({ field }) => (
          <TextArea {...field} rows={4} placeholder="Açıklama giriniz" style={{ width: "100%" }} />
        )}
      />
    </div>
  );
}
