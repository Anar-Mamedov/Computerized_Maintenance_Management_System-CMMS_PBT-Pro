import React from "react";
import { Input, Typography } from "antd";
import styled from "styled-components";
import { useFormContext, Controller } from "react-hook-form";
import { t } from "i18next";
import KodIDSelectbox from "../../../../../../../../utils/components/KodIDSelectbox";

const { TextArea } = Input;
const { Text } = Typography;

// Kök neden kod grubu ve IsEmriKapat alan adları backend'de belli olunca bağlanacak
const KOK_NEDEN_KOD_GRUBU = null;
const METIN_UZUNLUGU = 1000;

const Kart = styled.div`
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const IkiKolon = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Alan = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default function CozumKokNeden() {
  const { control } = useFormContext();

  return (
    <Kart>
      <Alan>
        <Text strong>{t("isEmriKapatma.kokNeden")}:</Text>
        <KodIDSelectbox name1="kokNeden" kodID={KOK_NEDEN_KOD_GRUBU} placeholder={t("secimYapiniz")} showDropdownAdd={false} />
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t("isEmriKapatma.kokNedenAciklama")}
        </Text>
      </Alan>
      <IkiKolon>
        <Alan>
          <Text strong>{t("isEmriKapatma.yapilanIslemCozum")}:</Text>
          <Controller
            name="yapilanIslem"
            control={control}
            render={({ field }) => (
              <TextArea {...field} rows={5} maxLength={METIN_UZUNLUGU} showCount placeholder={t("isEmriKapatma.yapilanIslemPlaceholder")} />
            )}
          />
        </Alan>
        <Alan>
          <Text strong>{t("isEmriKapatma.tekrariOnleyiciFaaliyet")}:</Text>
          <Controller
            name="tekrariOnleyiciFaaliyet"
            control={control}
            render={({ field }) => (
              <TextArea {...field} rows={5} maxLength={METIN_UZUNLUGU} showCount placeholder={t("isEmriKapatma.tekrariOnleyiciPlaceholder")} />
            )}
          />
        </Alan>
      </IkiKolon>
    </Kart>
  );
}
