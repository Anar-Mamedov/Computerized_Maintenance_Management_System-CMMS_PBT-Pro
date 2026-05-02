import React, { useState, useEffect } from "react";
import { Popover, Button, Select } from "antd";

const { Option } = Select;

const ConditionFilter = ({ onSubmit }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState([]);
  // Kanka burayı array'e çevirdim, varsayılan boş array
  const [selectedKeys, setSelectedKeys] = useState([]); 

  useEffect(() => {
    // Durum listesi
    const hardcodedOptions = [
      { key: -1, value: "Tümü" },
      { key: 1, value: "Açık" },
      { key: 2, value: "Teklif" },
      { key: 3, value: "Sipariş" },
      { key: 4, value: "Karşılanıyor" },
      { key: 5, value: "Kapalı" },
      { key: 6, value: "İptal" },
      { key: 7, value: "Onay Bekliyor" },
      { key: 8, value: "Onaylandı" },
      { key: 9, value: "Onaylanmadı" },
    ];
    setOptions(hardcodedOptions);
  }, []);

  const handleSubmit = () => {
    // Eğer hiç seçim yapılmadıysa veya boşsa [-1] (Tümü) gönderebilirsin 
    // veya backend boş array kabul ediyorsa direkt selectedKeys gönder.
    // Ben senin eski mantığına göre boşsa [-1] gönderiyorum:
    
    if (selectedKeys.length === 0) {
      onSubmit({ tabDurumID: [-1] });
    } else {
      onSubmit({ tabDurumID: selectedKeys }); // Array olarak gönderiliyor
    }

    setVisible(false);
  };

  const handleCancelClick = () => {
    setSelectedKeys([]); // Seçimleri temizle
    onSubmit({ tabDurumID: [-1] }); // Filtreyi sıfırla
    setVisible(false);
  };

  // Select değişince çalışacak fonksiyon
  const handleChange = (values) => {
    // Eğer kullanıcı "Tümü" (-1) seçerse diğerlerini temizleyip sadece -1 bırakabiliriz
    // Ya da sadece seçimleri state'e atarız. 
    // Burada standart multi-select mantığı kurdum:
    if (values.includes(-1) && values.length > 1 && values[values.length -1] === -1) {
       // Son seçilen "Tümü" ise diğerlerini sil
       setSelectedKeys([-1]);
    } else if (values.includes(-1) && values.length > 1) {
       // "Tümü" seçiliyken başka bir şey seçilirse "Tümü"nü kaldır
       setSelectedKeys(values.filter(v => v !== -1));
    } else {
       setSelectedKeys(values);
    }
  };

  const content = (
    <div style={{ width: "300px" }}>
      <div
        style={{
          borderBottom: "1px solid #ccc",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={handleCancelClick}>Temizle</Button>
        <Button type="primary" onClick={handleSubmit}>
          Uygula
        </Button>
      </div>
      <div style={{ padding: "10px" }}>
        <Select
          mode="multiple" // Kanka burası önemli, çoklu seçim açıldı
          style={{ width: "100%" }}
          placeholder="Durum Seç..."
          value={selectedKeys}
          onChange={handleChange}
          allowClear
          maxTagCount="responsive" // Çok fazla seçilirse +3 gibi gösterir input içinde
        >
          {options.map((option) => (
            <Option key={option.key} value={option.key}>
              {option.value}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );

  // Buton üzerindeki badge (sayı) mantığı
  const showBadge = selectedKeys.length > 0 && !selectedKeys.includes(-1);

  return (
    <Popover
      content={content}
      trigger="click"
      open={visible}
      onOpenChange={setVisible}
      placement="bottom"
    >
      <Button>
        Durum{" "}
        {showBadge && (
          <div
            style={{
              marginLeft: "5px",
              background: "#006cb8",
              borderRadius: "50%",
              width: "17px",
              height: "17px",
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "12px",
            }}
          >
            {selectedKeys.length} 
          </div>
        )}
      </Button>
    </Popover>
  );
};

export default ConditionFilter;