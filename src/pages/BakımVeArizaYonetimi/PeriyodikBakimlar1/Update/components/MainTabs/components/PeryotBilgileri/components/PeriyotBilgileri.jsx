import React from "react";
import { Input, Radio, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import TarihVeYASayac from "./TarihVeYaSayac/TarihVeYaSayac.jsx";
import TarihVeSayac from "./TarihVeSayac/TarihVeSayac.jsx";

const { Text, Link } = Typography;
const { TextArea } = Input;

function PeriyotBilgileri(props) {
  const { control, watch, setValue } = useFormContext();

  const tarihSayacBakim = watch("tarihSayacBakim");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        marginBottom: "10px",
      }}
    >
      <Text
        style={{
          writingMode: "vertical-lr",
          transform: "rotate(180deg)",
          backgroundColor: "rgba(230,230,230,0.84)",
          textAlign: "center",
        }}
      >
        Periyot Bilgileri
      </Text>
      <div>
        <Controller
          name="tarihSayacBakim"
          control={control}
          render={({ field }) => (
            <Radio.Group {...field}>
              <Radio.Button value="a">Tarih {'"veya"'} sayaç bazlı bakım</Radio.Button>
              <Radio.Button value="b">Tarih {'"ve"'} sayaç bazlı bakım</Radio.Button>
            </Radio.Group>
          )}
        />
        {tarihSayacBakim === "a" && <TarihVeYASayac />}
        {tarihSayacBakim === "b" && <TarihVeSayac />}
      </div>
    </div>
  );
}

export default PeriyotBilgileri;
