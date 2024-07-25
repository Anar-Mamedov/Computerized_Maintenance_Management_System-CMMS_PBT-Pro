import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, DatePicker, TimePicker, Slider, InputNumber, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import dayjs from "dayjs";
import { useAppContext } from "../../../../../../../../AppContext"; // Context hook'unu import edin

const { Text, Link } = Typography;
const { TextArea } = Input;

const StyledDivBottomLine = styled.div`
  @media (min-width: 600px) {
    align-items: center !important;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

// iş emri selectboxu sayfa ilk defa render olduğunda prosedür ve sonraki 3 fieldin değerlerini sıfırlamasın diye ilk renderdeki durumu tutması için

// Önceki değeri tutmak için bir hook
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]); // value değiştiğinde çalış
  return ref.current;
}

// iş emri selectboxu sayfa ilk defa render olduğunda prosedür ve sonraki 3 fieldin değerlerini sıfırlamasın diye ilk renderdeki durumu tutması için son

export default function Aciklama({ fieldRequirements }) {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const { selectedOption } = useAppContext(); // Context'ten seçilen opsiyonu al iş emri tipi selectboxu değiştiğinde prosedürü sıfırlaması için
  const previousSelectedOption = usePrevious(selectedOption); // Önceki seçilen opsiyonu al iş emri tipi selectboxu değiştiğinde prosedürü sıfırlaması için
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format

  // date picker için tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın

  useEffect(() => {
    // Format the date based on the user's locale
    const dateFormatter = new Intl.DateTimeFormat(navigator.language);
    const sampleDate = new Date(2021, 10, 21);
    const formattedSampleDate = dateFormatter.format(sampleDate);
    setLocaleDateFormat(formattedSampleDate.replace("2021", "YYYY").replace("21", "DD").replace("11", "MM"));

    // Format the time based on the user's locale
    const timeFormatter = new Intl.DateTimeFormat(navigator.language, { hour: "numeric", minute: "numeric" });
    const sampleTime = new Date(2021, 10, 21, 13, 45); // Use a sample time, e.g., 13:45
    const formattedSampleTime = timeFormatter.format(sampleTime);

    // Check if the formatted time contains AM/PM, which implies a 12-hour format
    const is12HourFormat = /AM|PM/.test(formattedSampleTime);
    setLocaleTimeFormat(is12HourFormat ? "hh:mm A" : "HH:mm");
  }, []);

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın sonu

  return (
    <div style={{ paddingBottom: "35px" }}>
      {/* number input okları kaldırma */}
      <style>
        {`
      input[type='number']::-webkit-inner-spin-button,
      input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input[type='number'] {
        -moz-appearance: textfield;
      }
    `}
      </style>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <Controller
          name="isEmriAciklama"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              rows={4}
              value={`${field.value || ""}\n${getValues("isTalebiAciklama") ? `Talep: ${getValues("isTalebiAciklama")}` : ""}`}
              onChange={(e) => {
                const value = e.target.value.split("\n")[0];
                setValue("isEmriAciklama", value);
              }}
            />
          )}
        />
      </div>
    </div>
  );
}
