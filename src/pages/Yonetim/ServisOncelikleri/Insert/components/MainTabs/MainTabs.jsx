import React from "react";
import {
  Typography,
  Input,
  Row,
  Col,
  Checkbox,
  InputNumber,
  Collapse,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";

const { Text } = Typography;
const { TextArea } = Input;

// Fotoğraftaki gri çerçeveli alt bölüm için stil
const SettingsCard = styled.div`
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
  background-color: #fafafa;
`;

const LabelText = styled(Text)`
  font-size: 12px;
  font-weight: 600;
  color: #595959;
  margin-bottom: 4px;
  display: block;
  text-transform: uppercase;
`;

export default function MainTabs() {
  const { control } = useFormContext();

  return (
    <div style={{ padding: "10px", maxWidth: "600px" }}>
      {/* Üst Kısım: Öncelik Kodu ve Bayrak */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <LabelText>Öncelik Kodu</LabelText>
          <Controller
            name="oncelikKodu"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Col>
        <Col span={12}>
          <LabelText>Bayrak (Emoji/Simge)</LabelText>
          <Controller
            name="bayrak"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Örn: 🔴" />
            )}
          />
        </Col>
      </Row>

      {/* Öncelik Tanımı */}
      <Row style={{ marginTop: "16px" }}>
        <Col span={24}>
          <LabelText>Öncelik Tanımı</LabelText>
          <Controller
            name="oncelikTanimi"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Öncelik adını buraya yazın..." />
            )}
          />
        </Col>
      </Row>

      {/* Checkbox Alanları */}
      <div style={{ marginTop: "20px" }}>
        <Row align="middle" style={{ marginBottom: "10px" }}>
          <Col span={8}>
            <Text strong>Aktif Durum</Text>
          </Col>
          <Col span={4}>
            <Controller
              name="aktifDurum"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>
            <Text strong>Varsayılan</Text>
          </Col>
          <Col span={4}>
            <Controller
              name="varsayilan"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          </Col>
        </Row>
      </div>

      {/* Çözüm Süresi Ayarı Bölümü */}
      <SettingsCard>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
          <Text strong style={{ fontSize: "12px" }}>ÇÖZÜM SÜRESİ AYARI</Text>
          <Text style={{ color: "#1890ff" }}>—</Text>
        </div>

        <Row gutter={8}>
          <Col span={8}>
            <Controller
              name="gun"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Gün" style={{ textAlign: "center" }} />}
            />
          </Col>
          <Col span={8}>
            <Controller
              name="saat"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Saat" style={{ textAlign: "center" }} />}
            />
          </Col>
          <Col span={8}>
            <Controller
              name="dakika"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Dakika" style={{ textAlign: "center" }} />}
            />
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: "16px" }}>
          <Col span={12}>
            <Text style={{ fontSize: "11px", fontWeight: "bold" }}>GECİKME SEVİYESİ</Text>
            <Controller
              name="gecikmeSeviyesi"
              control={control}
              render={({ field }) => <Input {...field} style={{ marginTop: "4px" }} />}
            />
          </Col>
          <Col span={12}>
            <Text style={{ fontSize: "11px", fontWeight: "bold" }}>KRİTİK SEVİYE</Text>
            <Controller
              name="kritikSeviye"
              control={control}
              render={({ field }) => <Input {...field} style={{ marginTop: "4px" }} />}
            />
          </Col>
        </Row>
      </SettingsCard>
    </div>
  );
}