import React from "react";
import { Button, DatePicker, Drawer, Space, Typography } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { t } from "i18next";
import PropTypes from "prop-types";
import MakineTablo from "../../../../../../utils/components/Machina/MakineTablo";
import LokasyonTablo from "../../../../../../utils/components/LokasyonTablo";
import AtolyeTablo from "../../../../../../utils/components/AtolyeTablo";
import KodIDSelectbox from "../../../../../../utils/components/KodIDSelectbox";
import PeriyodikBakimSelect from "./PeriyodikBakimSelect";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const DATE_DISPLAY_FORMAT = "DD.MM.YYYY";

const blockStyle = { marginBottom: 16 };
const labelStyle = { display: "block", marginBottom: 6, fontSize: 13, color: "#475467" };

// Otomatik iş emirleri listesinin tüm filtrelerini barındıran yan panel (drawer).
// Ana ekranda yer kalmadığı için filtreler bu panele taşınmıştır.
export default function FilterDrawer({ open, onClose, onApply, draftFilters, onFilterChange }) {
  return (
    <Drawer
      title={
        <span>
          <FilterOutlined style={{ marginRight: 8 }} />
          {t("filtreler", { defaultValue: "Filtreler" })}
        </span>
      }
      placement="right"
      width={380}
      onClose={onClose}
      open={open}
      extra={
        <Space>
          <Button type="primary" onClick={onApply}>
            {t("uygula", { defaultValue: "Uygula" })}
          </Button>
        </Space>
      }
    >
      <div style={blockStyle}>
        <Text style={labelStyle}>{t("ekipmanKodu", { defaultValue: "Ekipman Kodu" })}</Text>
        <MakineTablo
          hideHeader={false}
          suppressFormFields={false}
          includeAtolyeFilter={false}
          makineFieldName="filterEkipmanTanim"
          makineIdFieldName="filterEkipmanID"
          placeholder={t("ekipmanKodu", { defaultValue: "Ekipman Kodu" })}
        />
      </div>

      <div style={blockStyle}>
        <Text style={labelStyle}>{t("lokasyon", { defaultValue: "Lokasyon" })}</Text>
        <LokasyonTablo lokasyonFieldName="filterLokasyonTanim" lokasyonIdFieldName="filterLokasyonID" placeholder={t("lokasyon", { defaultValue: "Lokasyon" })} />
      </div>

      <div style={blockStyle}>
        <Text style={labelStyle}>{t("atolye", { defaultValue: "Atölye" })}</Text>
        <AtolyeTablo nameFields={{ tanim: "filterAtolyeTanim", id: "filterAtolyeID" }} placeholder={t("atolye", { defaultValue: "Atölye" })} />
      </div>

      <div style={blockStyle}>
        <Text style={labelStyle}>{t("ekipmanTipi", { defaultValue: "Ekipman Tipi" })}</Text>
        <KodIDSelectbox
          name1="filterEkipmanTipIds"
          kodID={32501}
          isRequired={false}
          mode="multiple"
          maxTagCount="responsive"
          showDropdownAdd={false}
          placeholder={t("ekipmanTipi", { defaultValue: "Ekipman Tipi" })}
          style={{ width: "100%" }}
        />
      </div>

      <div style={blockStyle}>
        <Text style={labelStyle}>{t("periyodikBakim", { defaultValue: "Periyodik Bakım" })}</Text>
        <PeriyodikBakimSelect
          value={draftFilters.PeriyodikBakimIds}
          onChange={(value) => onFilterChange("PeriyodikBakimIds", value || [])}
          style={{ width: "100%" }}
        />
      </div>

      <div style={blockStyle}>
        <Text style={labelStyle}>{t("tarihAraligi", { defaultValue: "Tarih Aralığı" })}</Text>
        <RangePicker
          allowClear
          value={draftFilters.TarihAraligi}
          format={DATE_DISPLAY_FORMAT}
          style={{ width: "100%" }}
          onChange={(value) => onFilterChange("TarihAraligi", value ?? [])}
        />
      </div>
    </Drawer>
  );
}

FilterDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onApply: PropTypes.func,
  draftFilters: PropTypes.object,
  onFilterChange: PropTypes.func,
};
