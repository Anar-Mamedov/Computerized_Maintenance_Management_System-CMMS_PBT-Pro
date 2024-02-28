import React, { useState, createRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Select, Typography, Divider, Spin, Button, Input, message, Space } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import { PlusOutlined } from "@ant-design/icons";
import CreateModal from "./isEmriTipi/Update/CreateModal";

const { Text, Link } = Typography;
const { Option } = Select;

export default function IsEmriTipiSelect({ disabled, fieldRequirements }) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = createRef();
  const [name, setName] = useState("");
  const [selectKey, setSelectKey] = useState(0);

  // message
  const [messageApi, contextHolder] = message.useMessage();

  // message end

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get("IsEmriTip");
      if (response && response) {
        setOptions(response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onNameChange = (e) => {
    setName(e.target.value);
  };

  // iş emrindeki zorunlu alanları dinamik olarak kontrol etmek için selectboxtaki seçenekleri seçtiğimizde o seçeneğe göre zorunlu alanların değişmesi için.

  // Öncelikle, `options` state'ini ve `setValue` fonksiyonunu kullanarak `selectedOption`'ı güncelleyeceğiz.
  // Bu örnekte, `selectedOption`'ı komple yeni bir obje ile güncelleyerek, bu değişikliğin React tarafından algılanmasını sağlayacağız.

  const onOptionChange = (value) => {
    // Seçilen değerin ID'sine göre objeyi bul
    const selectedOption = options.find((option) => option.TB_ISEMRI_TIP_ID === value) ?? null;

    if (selectedOption) {
      // selectedOption için komple yeni bir obje oluştur
      const updatedSelectedOption = {
        ...selectedOption,
        IMT_LOKASYON: selectedOption.IMT_LOKASYON,
        IMT_MAKINE: selectedOption.IMT_MAKINE,
        IMT_EKIPMAN: selectedOption.IMT_EKIPMAN,
        IMT_MAKINE_DURUM: selectedOption.IMT_MAKINE_DURUM,
        IMT_SAYAC_DEGERI: selectedOption.IMT_SAYAC_DEGERI,
        IMT_CAGRILACAK_PROSEDUR: selectedOption.IMT_CAGRILACAK_PROSEDUR,
        IMT_PROSEDUR: selectedOption.IMT_PROSEDUR,

        // Diğer gerekli alanlar da benzer şekilde eklenmeli
      };

      // `selectedOption`'ı tek bir işlemde güncelle
      setValue("selectedOption", updatedSelectedOption, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } else {
      // Eğer bir seçim yapılmazsa veya seçim kaldırılırsa, `selectedOption`'ı temizle
      setValue("selectedOption", null, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    // `isEmriTipi` ve `isEmriTipiID` alanlarını da güncelle
    setValue("isEmriTipi", value ?? null);
    setValue("isEmriTipiID", value ?? null);
  };

  // iş emrindeki zorunlu alanları dinamik olarak kontrol etmek için selectboxtaki seçenekleri seçtiğimizde o seçeneğe göre zorunlu alanların değişmesi için son.

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
      {contextHolder}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", width: "300px" }}>
          <Controller
            name="isEmriTipi"
            control={control}
            rules={{ required: "Alan Boş Bırakılamaz!" }}
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                status={error ? "error" : ""}
                disabled={disabled}
                key={selectKey}
                style={{ width: "265px" }}
                showSearch
                allowClear
                placeholder="Seçim Yapınız"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.label ? option.label.toLowerCase().includes(input.toLowerCase()) : false
                }
                onDropdownVisibleChange={(open) => {
                  if (open) {
                    fetchData(); // Fetch data when the dropdown is opened
                  }
                }}
                dropdownRender={(menu) => <Spin spinning={loading}>{menu}</Spin>}
                options={options.map((item) => ({
                  value: item.TB_ISEMRI_TIP_ID, // Use the ID as the value
                  label: item.IMT_TANIM, // Display the name in the dropdown
                }))}
                onChange={onOptionChange}
                value={field.value ?? null} // Eğer `field.value` `undefined` ise, `null` kullanarak `Select` bileşenine geçir
              />
            )}
          />
          <Controller
            name="isEmriTipiID"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ display: "none" }}
              />
            )}
          />
          <CreateModal />
        </div>

        {errors.isEmriTipi && <div style={{ color: "red", marginTop: "5px" }}>{errors.isEmriTipi.message}</div>}
      </div>
    </div>
  );
}
