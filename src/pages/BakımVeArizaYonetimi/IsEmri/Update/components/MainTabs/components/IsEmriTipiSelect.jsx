import React, { useState, createRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Select, Typography, Divider, Spin, Button, Input, message, Space, Popconfirm } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import { useAppContext } from "../../../../../../../AppContext"; // Context hook'unu import edin
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
  const { setSelectedOption } = useAppContext(); // Context'ten gerekli fonksiyonu al
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = createRef();
  const [name, setName] = useState("");
  const [selectKey, setSelectKey] = useState(0);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingValue, setPendingValue] = useState(null);

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

  // Öncelikle, `options` state'ini ve `setValue` fonksiyonunu kullanarak `selectedOption`'ı güncelleyeceğiz.
  // Bu örnekte, `selectedOption`'ı komple yeni bir obje ile güncelleyerek, bu değişikliğin React tarafından algılanmasını sağlayacağız.

  // Select değeri değiştiğinde popconfirm göstermek için `onOptionChange` fonksiyonunu
  const onOptionChange = (value) => {
    // Show confirmation and set pending value
    setPendingValue(value);
    setConfirmVisible(true);
  };
  // Select değeri değiştiğinde popconfirm göstermek için `onOptionChange` fonksiyonunu sonu

  // Popconfirm onaylandığında yapılacak işlemler

  const handleConfirm = () => {
    // Apply the pending value change here, using the previously defined logic
    setSelectedOption(pendingValue); // Selectbox'ta seçim değiştiğinde, context'teki durumu güncelle

    // iş emrindeki zorunlu alanları dinamik olarak kontrol etmek için selectboxtaki seçenekleri seçtiğimizde o seçeneğe göre zorunlu alanların değişmesi için.

    // Seçilen değerin ID'sine göre objeyi bul
    const selectedOption = options.find((option) => option.TB_ISEMRI_TIP_ID === pendingValue) ?? null;

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

    // iş emrindeki zorunlu alanları dinamik olarak kontrol etmek için selectboxtaki seçenekleri seçtiğimizde o seçeneğe göre zorunlu alanların değişmesi için son.

    // `isEmriTipi` ve `isEmriTipiID` alanlarını da güncelle
    setValue("isEmriTipi", pendingValue ?? null);
    setValue("isEmriTipiID", pendingValue ?? null);

    setConfirmVisible(false); // Close the confirmation dialog
  };

  // Popconfirm onaylandığında yapılacak işlemler sonu

  // Popconfirm iptal edildiğinde yapılacak işlemler

  const handleCancel = () => {
    setConfirmVisible(false); // Simply hide the confirmation without changing the selection
  };

  // Popconfirm iptal edildiğinde yapılacak işlemler sonu

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
                  if (open && !confirmVisible) {
                    fetchData(); // Fetch data when the dropdown is opened
                  }
                }}
                dropdownRender={(menu) => <Spin spinning={loading}>{menu}</Spin>}
                options={options.map((item) => ({
                  value: item.TB_ISEMRI_TIP_ID, // Use the ID as the value
                  label: item.IMT_TANIM, // Display the name in the dropdown
                }))}
                onChange={(value) => {
                  onOptionChange(value); // This sets pendingValue and shows Popconfirm
                }}
                value={field.value ?? null} // Eğer `field.value` `undefined` ise, `null` kullanarak `Select` bileşenine geçir
              />
            )}
          />
          {confirmVisible && (
            <Popconfirm
              placement="bottom"
              title="DİKKAT: Onaylamadan Önce Okuyunuz!"
              description={
                <div>
                  <p style={{ width: "100%", maxWidth: "300px" }}>
                    Bu işlem Prosedür ve prosedüre bağlı olan Kontrol Listesi, Malzeme ve Duruş tablolarını silecektir.
                    BU İŞLEM GERİ ALINAMAZ!
                  </p>
                </div>
              }
              open={confirmVisible} // Replace 'visible' with 'open'
              onConfirm={() => {
                handleConfirm(); // Apply the change
              }}
              onCancel={() => {
                handleCancel(); // Revert or ignore the change
              }}>
              {/* This button or similar trigger isn't directly necessary since we're programmatically controlling Popconfirm visibility */}
            </Popconfirm>
          )}
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
