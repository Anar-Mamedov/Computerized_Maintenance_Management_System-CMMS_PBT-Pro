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
import PersonelTipi from "./components/PersonelTipi";
import styled from "styled-components";
import LokasyonTablo from "./components/LokasyonTablo";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Departman from "./components/Departman";
import Gorevi from "./components/Gorevi";
import TaseronTablo from "./components/TaseronTablo";
import AtolyeTablo from "./components/AtolyeTablo";
import IdariAmiriTablo from "./components/IdariAmiriTablo";
import MasrafMerkeziTablo from "./components/MasrafMerkeziTablo";

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

  const otonomBakimValue = watch("otonomBakim");

  const handleMinusClick = () => {
    setValue("lokasyonMasrafMerkeziTanim", "");
    setValue("lokasyonMasrafMerkeziID", "");
  };

  const handleTaseronMinusClick = () => {
    setValue("taseronTanim", "");
    setValue("taseronID", "");
  };

  const handlePersonelHesabiMinusClick = () => {
    setValue("personelHesabiTanim", "");
    setValue("personelHesabiID", "");
  };

  const handleAtolyeMinusClick = () => {
    setValue("atolyeTanim", "");
    setValue("atolyeID", "");
  };

  const handleIdariAmiriMinusClick = () => {
    setValue("idariAmiriTanim", "");
    setValue("idariAmiriID", "");
  };

  const handleMasrafMerkeziMinusClick = () => {
    setValue("masrafMerkeziTanim", "");
    setValue("masrafMerkeziID", "");
  };

  const handleLokasyonMinusClick = () => {
    setValue("lokasyonTanim", "");
    setValue("lokasyonID", "");
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        marginBottom: "15px",
        gap: "20px",
      }}>
      <div
        style={{
          display: "flex",
          marginBottom: "15px",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          maxWidth: "450px",
        }}>
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
          <Text style={{ fontSize: "14px" }}>Personel Kodu:</Text>
          <div
            style={{
              display: "flex",
              // flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}>
            <Controller
              name="personelKodu"
              control={control}
              rules={{ required: "Alan Boş Bırakılamaz!" }}
              render={({ field, fieldState: { error } }) => (
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                  <Input {...field} status={error ? "error" : ""} style={{ flex: 1 }} />
                  {error && <div style={{ color: "red" }}>{error.message}</div>}
                </div>
              )}
            />
            <Controller
              name="secilenPersonelID"
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
              name="personelAktif"
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
          <Text style={{ fontSize: "14px" }}>Personel Adı:</Text>
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
              name="personelAdi"
              control={control}
              rules={{ required: "Alan Boş Bırakılamaz!" }}
              render={({ field, fieldState: { error } }) => (
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                  <Input {...field} status={error ? "error" : ""} style={{ flex: 1 }} />
                  {error && <div style={{ color: "red" }}>{error.message}</div>}
                </div>
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
          }}>
          <PersonelTipi />
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
          <Departman />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "450px",
            }}>
            <Text style={{ fontSize: "14px" }}>Atölye:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "300px",
              }}>
              <Controller
                name="atolyeTanim"
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
                name="atolyeID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ display: "none" }}
                  />
                )}
              />
              <AtolyeTablo
                onSubmit={(selectedData) => {
                  setValue("atolyeTanim", selectedData.subject);
                  setValue("atolyeID", selectedData.key);
                }}
              />
              <Button onClick={handleAtolyeMinusClick}> - </Button>
            </div>
          </StyledDivBottomLine>
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
          <Text style={{ fontSize: "14px" }}>Lokasyon:</Text>
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
      </div>
      <div
        style={{
          display: "flex",
          marginBottom: "15px",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          maxWidth: "450px",
        }}>
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
          <Text style={{ fontSize: "14px" }}>Ünvan:</Text>
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
              name="unvan"
              control={control}
              render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
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
          <Gorevi />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "450px",
            }}>
            <Text style={{ fontSize: "14px" }}>Taşeron:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "300px",
              }}>
              <Controller
                name="taseronTanim"
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
                name="taseronID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ display: "none" }}
                  />
                )}
              />
              <TaseronTablo
                onSubmit={(selectedData) => {
                  setValue("taseronTanim", selectedData.subject);
                  setValue("taseronID", selectedData.key);
                }}
              />
              <Button onClick={handleTaseronMinusClick}> - </Button>
            </div>
          </StyledDivBottomLine>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "450px",
            }}>
            <Text style={{ fontSize: "14px" }}>İdari Amiri:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "300px",
              }}>
              <Controller
                name="idariAmiriTanim"
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
                name="idariAmiriID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ display: "none" }}
                  />
                )}
              />
              <IdariAmiriTablo
                onSubmit={(selectedData) => {
                  setValue("idariAmiriTanim", selectedData.subject);
                  setValue("idariAmiriID", selectedData.key);
                }}
              />
              <Button onClick={handleIdariAmiriMinusClick}> - </Button>
            </div>
          </StyledDivBottomLine>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "450px",
            }}>
            <Text style={{ fontSize: "14px" }}>Masraf Merkezi:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "300px",
              }}>
              <Controller
                name="masrafMerkeziTanim"
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
                name="masrafMerkeziID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ display: "none" }}
                  />
                )}
              />
              <MasrafMerkeziTablo
                onSubmit={(selectedData) => {
                  setValue("masrafMerkeziTanim", selectedData.age);
                  setValue("masrafMerkeziID", selectedData.key);
                }}
              />
              <Button onClick={handleMasrafMerkeziMinusClick}> - </Button>
            </div>
          </StyledDivBottomLine>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          // flexWrap: "wrap",
          marginBottom: "15px",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          maxWidth: "450px",
        }}>
        <div>
          <Controller
            name="teknisyen"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Teknisyen
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="operator"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Operatör
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="bakim"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Bakım
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="santiye"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Şantiye
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="surucu"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Sürücü
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="diger"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Diğer
              </Checkbox>
            )}
          />
        </div>
      </div>
    </div>
  );
}
