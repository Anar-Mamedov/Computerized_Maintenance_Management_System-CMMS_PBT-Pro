import React from "react";
import {
  Drawer,
  Typography,
  Button,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Row,
  Col,
  Checkbox,
  ColorPicker,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
import VardiyaTipi from "./components/VardiyaTipi";
import styled from "styled-components";
import LokasyonTablo from "./components/LokasyonTablo";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ProjeTablo from "./components/ProjeTablo";

const { Text, Link } = Typography;
const { TextArea } = Input;

dayjs.extend(customParseFormat);

const StyledInput = styled(Input)`
  @media (min-width: 600px) {
    max-width: 300px;
  }
  @media (max-width: 600px) {
    max-width: 300px;
  }
`;

const StyledDiv = styled.div`
  @media (min-width: 600px) {
    width: 100%;
    max-width: 300px;
  }
  @media (max-width: 600px) {
    width: 100%;
    max-width: 300px;
  }
`;

const StyledDivBottomLine = styled.div`
  @media (min-width: 600px) {
    align-items: center;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StyledDivMedia = styled.div`
  .anar {
    @media (min-width: 600px) {
      max-width: 300px;
      width: 100%;
    }
    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

export default function MainTabs() {
  const { control, watch, setValue } = useFormContext();

  const handleMinusClick = () => {
    setValue("lokasyonMasrafMerkeziTanim", "");
    setValue("lokasyonMasrafMerkeziID", "");
  };

  const handleProjeMinusClick = () => {
    setValue("vardiyaProjeTanim", "");
    setValue("vardiyaProjeID", "");
  };

  const handleDepoMinusClick = () => {
    setValue("lokasyonDepoTanim", "");
    setValue("lokasyonDepoID", "");
  };

  const handleLokasyonMinusClick = () => {
    setValue("lokasyonTanim", "");
    setValue("lokasyonID", "");
  };

  return (
    <div style={{ display: "flex", marginBottom: "15px", flexDirection: "column", gap: "10px", maxWidth: "450px" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: "10px",
          rowGap: "0px",
        }}>
        <Text style={{ fontSize: "14px" }}>Bakım Kodu:</Text>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "300px",
            minWidth: "300px",
            gap: "10px",
            width: "100%",
          }}>
          <Controller
            name="bakimKodu"
            control={control}
            render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
          />
          <Controller
            name="secilenBakimID"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ display: "none" }}
              />
            )}
          />
          <Controller
            name="bakimAktif"
            control={control}
            defaultValue={true} // or true if you want it checked by default
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Aktif
              </Checkbox>
            )}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          maxWidth: "450px",
          gap: "10px",
          width: "100%",
          justifyContent: "space-between",
        }}>
        <Text style={{ fontSize: "14px" }}>Çalışma Saatleri:</Text>
        <div style={{ display: "flex", justifyContent: "space-between", width: "300px" }}>
          <Controller
            name="vardiyaBaslangicSaati"
            control={control}
            render={({ field }) => <TimePicker {...field} style={{ width: "145px" }} format="HH:mm" />}
          />
          <Controller
            name="vardiyaBitisSaati"
            control={control}
            render={({ field }) => <TimePicker {...field} style={{ width: "145px" }} format="HH:mm" />}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          maxWidth: "450px",
          gap: "10px",
          width: "100%",
        }}>
        <VardiyaTipi />
      </div>
      <StyledDivMedia
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "450px",
        }}>
        <Text style={{ fontSize: "14px" }}>Lokasyon Bilgisi:</Text>
        <div
          className="anar"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            minWidth: "300px",
            gap: "3px",
          }}>
          <Controller
            name="lokasyonTanim"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ width: "100%", maxWidth: "630px" }}
                disabled
              />
            )}
          />
          <Controller
            name="lokasyonID"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ display: "none" }}
              />
            )}
          />
          <LokasyonTablo
            onSubmit={(selectedData) => {
              setValue("lokasyonTanim", selectedData.LOK_TANIM);
              setValue("lokasyonID", selectedData.key);
            }}
          />
          <Button onClick={handleLokasyonMinusClick}> - </Button>
        </div>
      </StyledDivMedia>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
          }}>
          <Text style={{ fontSize: "14px" }}>Proje Bilgisi:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "300px",
            }}>
            <Controller
              name="vardiyaProjeTanim"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ width: "215px" }}
                  disabled
                />
              )}
            />
            <Controller
              name="vardiyaProjeID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
            />
            <ProjeTablo
              onSubmit={(selectedData) => {
                setValue("vardiyaProjeTanim", selectedData.subject);
                setValue("vardiyaProjeID", selectedData.key);
              }}
            />
            <Button onClick={handleProjeMinusClick}> - </Button>
          </div>
        </StyledDivBottomLine>
      </div>
      <StyledDivBottomLine
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
        }}>
        <Text style={{ fontSize: "14px" }}>Varsayılan Vardiya:</Text>

        <Controller
          name="varsayilanVardiya"
          control={control}
          render={({ field }) => (
            <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}></Checkbox>
          )}
        />
      </StyledDivBottomLine>

      <StyledDivBottomLine
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
        }}>
        <Text style={{ fontSize: "14px" }}>Gösterim Rengi:</Text>
        <Controller
          name="gosterimRengi"
          control={control}
          render={({ field: { ref, ...rest } }) => (
            <ColorPicker {...rest} showText={(color) => <span>Renk Seçimi Yapın ({color.toHexString()})</span>} />
          )}
        />
      </StyledDivBottomLine>
      <StyledDivBottomLine
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: "100%",
        }}>
        <Text style={{ fontSize: "14px" }}>Açıklama:</Text>
        <StyledDiv>
          <Controller
            name="vardiyaAciklama"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                type="text" // Set the type to "text" for name input
              />
            )}
          />
        </StyledDiv>
      </StyledDivBottomLine>
    </div>
  );
}
