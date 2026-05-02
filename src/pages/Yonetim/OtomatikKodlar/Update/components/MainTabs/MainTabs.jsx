import React from "react";
import { Typography, Input, Switch, Row, Col, InputNumber } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";

const { Text } = Typography;
const { TextArea } = Input;

// Kart tasarımı (Görseldeki Otomatik Kod Sistemi ve Kayıt Kilidi için)
const SwitchCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  height: 100%;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  width: 100%;
`;

export default function MainTabs() {
  const { control } = useFormContext();

  return (
    <div style={{ padding: "10px" }}>
      {/* GENEL TANIM */}
      <FormItem>
        <Text strong style={{ fontSize: "12px", color: "#4b5563", textTransform: "uppercase" }}>
          Genel Tanım
        </Text>
        <Controller
          name="Tanim"
          control={control}
          render={({ field }) => <Input {...field} placeholder="" style={{ height: "40px", borderRadius: "8px" }} />}
        />
      </FormItem>

      {/* ÖN EK - SIRA NO - BASAMAK */}
      <Row gutter={16}>
        <Col span={8}>
          <FormItem>
            <Text strong style={{ fontSize: "12px", color: "#4b5563", textTransform: "uppercase" }}>
              Ön Ek
            </Text>
            <Controller
              name="OnEk"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Örn: MKN" style={{ height: "40px", borderRadius: "8px" }} />}
            />
          </FormItem>
        </Col>
        <Col span={8}>
    <FormItem>
      <Text strong style={{ fontSize: "12px", color: "#4b5563", textTransform: "uppercase" }}>
        Sıra No
      </Text>
      <Controller
        name="Numara"
        control={control}
        render={({ field }) => (
          <InputNumber
            {...field}
            readOnly
            style={{
              width: "100%", // Kolonu tam kaplaması için
              height: "40px",
              borderRadius: "8px",
              backgroundColor: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              cursor: "not-allowed"
            }}
          />
        )}
      />
    </FormItem>
  </Col>

  <Col span={8}>
    <FormItem>
      <Text strong style={{ fontSize: "12px", color: "#4b5563", textTransform: "uppercase" }}>
        Basamak
      </Text>
      <Controller
        name="HaneSayisi"
        control={control}
        render={({ field }) => (
          <InputNumber
            {...field}
            min={1} // Negatif basamak olmasın diye
            max={20}
            style={{
              width: "100%",
              height: "40px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center"
            }}
          />
        )}
      />
    </FormItem>
  </Col>
</Row>

      {/* SWITCH CARDS */}
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={12}>
          <SwitchCard>
            <LabelContainer>
              <Text strong style={{ fontSize: "14px" }}>Otomatik Kod Sistemi</Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>Sistem sonraki numarayı otomatik atar.</Text>
            </LabelContainer>
            <Controller
              name="Aktif" // Veya ilgili boolean alan
              control={control}
              render={({ field }) => <Switch checked={field.value} onChange={field.onChange} />}
            />
          </SwitchCard>
        </Col>
        <Col span={12}>
          <SwitchCard>
            <LabelContainer>
              <Text strong style={{ fontSize: "14px" }}>Kayıt Kilidi</Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>Bu kuralı düzenlemeye kapatır.</Text>
            </LabelContainer>
            <Controller
              name="AlanKilit"
              control={control}
              render={({ field }) => <Switch checked={field.value} onChange={field.onChange} />}
            />
          </SwitchCard>
        </Col>
      </Row>

      {/* KURAL AÇIKLAMASI */}
      <FormItem>
        <Text strong style={{ fontSize: "12px", color: "#4b5563", textTransform: "uppercase" }}>
          Açıklama
        </Text>
        <Controller
          name="Aciklama"
          control={control}
          render={({ field }) => (
            <TextArea 
              {...field} 
              rows={4} 
              placeholder="Sistem yöneticileri için notlar..." 
              style={{ borderRadius: "8px" }} 
            />
          )}
        />
      </FormItem>
    </div>
  );
}