import React from "react";
import { Typography, Input, Divider, Tag, Progress, Card, Row, Col } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import { EnvironmentOutlined, HomeOutlined, PaperClipOutlined } from "@ant-design/icons";
import PersonelTablo from "../../../../../../utils/components/PersonelTablo";

const { Text, Title } = Typography;

export default function MainTabs() {
  const { control, watch } = useFormContext();

  // Kart içi başlık stili
  const labelHeaderStyle = {
    color: "#8c8c8c",
    fontSize: "12px",
    textTransform: "uppercase",
    marginBottom: "4px",
    display: "block"
  };

  const itemBoxStyle = {
    background: "#fff",
    border: "1px solid #f0f0f0",
    borderRadius: "8px",
    padding: "12px 16px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  };

  return (
    <div style={{ padding: "24px", background: "#f9fafb", borderRadius: "12px" }}>
      
      {/* ÜST KISIM: Profil ve Lokasyon Bilgisi */}
      <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#fff", border: "1px solid #e8e8e8", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px", fontWeight: "600", color: "#595959" }}>
          MD
        </div>
        <div>
          <Title level={4} style={{ margin: 0 }}>Murat Demir</Title>
          <Text type="secondary">PRS 00008 • Mekanik Bakım • Teknisyen</Text>
          <div style={{ marginTop: "8px", display: "flex", gap: "24px" }}>
            <Text type="secondary"><EnvironmentOutlined /> Dalaman Havalimanı</Text>
            <Text type="secondary"><HomeOutlined /> Ana Terminal</Text>
          </div>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {/* SOL KOLON: İzin Bilgileri */}
        <Col span={15}>
          <Row gutter={[12, 12]}>
            {/* İzin Türü */}
            <Col span={12}>
              <div style={itemBoxStyle}>
                <Text style={labelHeaderStyle}>{t("İZİN TÜRÜ")}</Text>
                <Text strong style={{ fontSize: "16px" }}>Evlilik İzni</Text>
              </div>
            </Col>
            {/* İzin Süresi */}
            <Col span={12}>
              <div style={itemBoxStyle}>
                <Text style={labelHeaderStyle}>{t("İZİN SÜRESİ")}</Text>
                <Text strong style={{ fontSize: "16px" }}>8 gün</Text>
              </div>
            </Col>
            {/* Başlangıç Tarihi */}
            <Col span={12}>
              <div style={itemBoxStyle}>
                <Text style={labelHeaderStyle}>{t("BAŞLANGIÇ TARİHİ")}</Text>
                <Text strong style={{ fontSize: "16px" }}>2026-03-17</Text>
              </div>
            </Col>
            {/* Bitiş Tarihi */}
            <Col span={12}>
              <div style={itemBoxStyle}>
                <Text style={labelHeaderStyle}>{t("BİTİŞ TARİHİ")}</Text>
                <Text strong style={{ fontSize: "16px" }}>2026-03-24</Text>
              </div>
            </Col>
            {/* Vekil Personel */}
            <Col span={24}>
              <div style={itemBoxStyle}>
                <Text style={labelHeaderStyle}>{t("VEKİL PERSONEL")}</Text>
                <PersonelTablo
                  name1="vekilPersonel"
                  workshopSelectedId={watch("vekilPersonelId")}
                  isRequired={false}
                />
              </div>
            </Col>
            {/* Açıklama */}
            <Col span={24}>
              <div style={itemBoxStyle}>
                <Text style={labelHeaderStyle}>{t("AÇIKLAMA")}</Text>
                <Controller
                  name="aciklama"
                  control={control}
                  render={({ field }) => (
                    <Input.TextArea {...field} variant="borderless" style={{ padding: 0, fontWeight: 500 }} autoSize />
                  )}
                />
              </div>
            </Col>
          </Row>
        </Col>

        {/* SAĞ KOLON: İstatistikler ve Belgeler */}
        <Col span={9}>
          <Card size="small" title={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{t("Önceki İzin Özeti")}</span>
            <Tag color="default">Kalan 10 gün</Tag>
          </div>} style={{ borderRadius: "12px", marginBottom: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">Son İzin Tarihi</Text>
                <Text strong>2025-09-12</Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">Son İzin Türü</Text>
                <Text strong>Yıllık İzin</Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">Son İzin Süresi</Text>
                <Text strong>5 gün</Text>
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <div style={{ marginBottom: "4px" }}>
                <Text type="secondary" style={{ fontSize: "12px" }}>Yıllık kullanım oranı</Text>
                <span style={{ float: "right", fontWeight: "bold" }}>%29</span>
              </div>
              <Progress percent={29} showInfo={false} strokeColor="#1d39c4" size="small" />
            </div>
          </Card>

          <Card size="small" style={{ borderRadius: "12px", borderStyle: "dashed", background: "#fafafa" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <PaperClipOutlined style={{ fontSize: "20px", color: "#8c8c8c" }} />
              <div>
                <Text strong style={{ display: "block" }}>Belge Durumu</Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>Bu kayda ait ek belge yüklenmiş.</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}