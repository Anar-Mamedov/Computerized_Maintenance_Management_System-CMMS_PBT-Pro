import {
  Typography,
  Button,
  Input,
  Checkbox,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import OncelikTablo from "./components/OncelikTablo";
import TalimatTablo from "./components/TalimatTablo";
import AtolyeTablo from "./components/AtolyeTablo";
import FirmaTablo from "./components/FirmaTablo";
import LokasyonTablo from "./components/LokasyonTablo";
import TakvimTablo from "./components/TakvimTablo";
import BakimGrubu from "./components/BakimGrubu";

const { Text } = Typography;

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

  const handleOncelikMinusClick = () => {
    setValue("oncelikTanim", "");
    setValue("oncelikID", "");
  };

  const handleTalimatMinusClick = () => {
    setValue("talimatTanim", "");
    setValue("talimatID", "");
  };

  const handleAtolyeMinusClick = () => {
    setValue("atolyeTanim", "");
    setValue("atolyeID", "");
  };

  const handleFirmaMinusClick = () => {
    setValue("firmaTanim", "");
    setValue("firmaID", "");
  };

  const handleCalismaTakvimiMinusClick = () => {
    setValue("calismaTakvimi", "");
    setValue("calismaTakvimiId", "");
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
        gap: "10px",
      }}>
      <div
        style={{
          display: "flex",
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
              name="secilenID"
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
              name="atolyeAktif"
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
          <Text style={{ fontSize: "14px" }}>Bakım Tanımı:</Text>
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
              name="bakimTanimi"
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
            justifyContent: "space-between",
          }}>
          <Text style={{ fontSize: "14px" }}>Bakım Tipi:</Text>
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
              name="bakimTanimi"
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
          <BakimGrubu />
        </div>
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
          <Text style={{ fontSize: "14px" }}>Öncelik:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "300px",
            }}>
            <Controller
              name="oncelikTanim"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  style={{ width: "215px" }}
                  disabled
                />
              )}
            />
            <Controller
              name="oncelikID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  style={{ display: "none" }}
                />
              )}
            />
            <OncelikTablo
              onSubmit={(selectedData) => {
                setValue("oncelikTanim", selectedData.subject);
                setValue("oncelikID", selectedData.key);
              }}
            />
            <Button onClick={handleOncelikMinusClick}> - </Button>
          </div>
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
            <Text style={{ fontSize: "14px" }}>Talimat:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "300px",
              }}>
              <Controller
                name="talimatTanim"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    style={{ width: "215px" }}
                    disabled
                  />
                )}
              />
              <Controller
                name="talimatID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    style={{ display: "none" }}
                  />
                )}
              />
              <TalimatTablo
                onSubmit={(selectedData) => {
                  setValue("talimatTanim", selectedData.subject);
                  setValue("talimatID", selectedData.key);
                }}
              />
              <Button onClick={handleTalimatMinusClick}> - </Button>
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
                    type="text"
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
                    type="text"
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "450px",
            }}>
            <Text style={{ fontSize: "14px" }}>Firma:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "300px",
              }}>
              <Controller
                name="firmaTanim"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    style={{ width: "215px" }}
                    disabled
                  />
                )}
              />
              <Controller
                name="firmaID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    style={{ display: "none" }}
                  />
                )}
              />
              <FirmaTablo
                onSubmit={(selectedData) => {
                  setValue("firmaTanim", selectedData.subject);
                  setValue("firmaID", selectedData.key);
                }}
              />
              <Button onClick={handleFirmaMinusClick}> - </Button>
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
            <Text style={{ fontSize: "14px" }}>Çalışma Takvimi:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "300px",
              }}>
              <Controller
                name="calismaTakvim"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    style={{ width: "215px" }}
                    disabled
                  />
                )}
              />
              <Controller
                name="calismaTakvimID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    style={{ display: "none" }}
                  />
                )}
              />
              <TakvimTablo
                onSubmit={(selectedData) => {
                  setValue("calismaTakvim", selectedData.subject);
                  setValue("calismaTakvimID", selectedData.key);
                }}
              />
              <Button onClick={handleCalismaTakvimiMinusClick}> - </Button>
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
                  type="text"
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
                  type="text"
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
          <Text style={{ fontSize: "14px" }}>Çalışma Süresi (dk.):</Text>
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
              name="calismaSuresi"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  style={{ flex: 1 }}
                  onKeyPress={(e) => {
                    const value = field.value;
                    if (!/[0-9]/.test(e.key) && (e.key !== "," || value.includes(","))) {
                      e.preventDefault();
                    }
                  }}
                />
              )}
            />
          </div>
        </div>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Duruş Süresi (dk.):</Text>
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
              name="durusSuresi"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  style={{ flex: 1 }}
                  onKeyPress={(e) => {
                    const value = field.value;
                    if (!/[0-9]/.test(e.key) && (e.key !== "," || value.includes(","))) {
                      e.preventDefault();
                    }
                  }}
                />
              )}
            />
          </div>
        </StyledDivBottomLine>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Personel (kişi):</Text>
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
              name="personelSayisi"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  style={{ flex: 1 }}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              )}
            />
          </div>
        </StyledDivBottomLine>
      </div>
    </div>
  );
}
