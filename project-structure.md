# Proje Yapısı ve Teknolojiler

## Kullanılan Teknolojiler

- **Frontend Framework**: React 18
- **UI Library**: Ant Design (antd)
- **Styling**: Styled Components
- **Icons**: React Icons, Ant Design Icons
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Custom HTTP utility (src/api/http.jsx)
- **Internationalization**: i18next (src/utils/i18n.js)
- **Build Tool**: Vite

## Proje Mimarisi

### Ana Dizin Yapısı

```
src/
├── api/                    # API işlemleri
├── assets/                 # Statik dosyalar (resimler, fontlar)
├── hooks/                  # Custom React hooks
├── locales/                # Çoklu dil desteği
├── pages/                  # Sayfa bileşenleri
├── state/                  # Global state yönetimi
├── utils/                  # Yardımcı fonksiyonlar
└── App.jsx                 # Ana uygulama bileşeni
```

### Bileşen Yapısı

Her sayfa modülü şu yapıyı takip eder:

```
pages/[ModuleName]/
├── components/             # Modül özel bileşenleri
├── Table/                  # Tablo bileşenleri
├── Insert/                 # Ekleme formları
├── Update/                 # Güncelleme formları
├── Filters/                # Filtre bileşenleri
└── [ModuleName].jsx        # Ana modül bileşeni
```

### Örnek Bileşen Yapısı

```jsx
// Örnek: Hatirlatici.jsx
import React, { useEffect, useState } from "react";
import { Card, Badge, Spin, Modal } from "antd";
import styled from "styled-components";

// Styled Components
const StyledCard = styled(Card)`
  // Styling
`;

// Ana Bileşen
export default function HatirlaticiPopover({ hatirlaticiData, loading, open, setOpen }) {
  // State management
  const [state, setState] = useState();

  // Effects
  useEffect(() => {
    // Side effects
  }, []);

  // Event handlers
  const handleEvent = () => {
    // Event logic
  };

  // Render
  return (
    // JSX
  );
}
```

### API Yanıt Formatı

```json
{
  "status_code": 200,
  "data": [
    {
      "GrupId": 1,
      "GrupAdi": "Grup Adı",
      "ToplamKayit": 10,
      "Hatirlaticilar": [
        {
          "SiraId": 1,
          "Baslik": "Başlık",
          "Aciklama": "Açıklama",
          "Deger": 5,
          "Aciklama2": "Kısa Açıklama",
          "IconId": 1,
          "Kritik": 0
        }
      ]
    }
  ],
  "toplam_hatirlatici": 23,
  "toplam_kayit": 377
}
```

### Styling Yaklaşımı

- **Styled Components** kullanılarak CSS-in-JS yaklaşımı
- **Ant Design** bileşenleri temel alınarak özelleştirme
- **Responsive design** için flexbox ve grid kullanımı
- **Color coding**: Kritik (kırmızı), Uyarı (sarı), Normal (mavi)

### Kod Standartları

- **ESLint** kurallarına uygun kod yazımı
- **Functional Components** ve **Hooks** kullanımı
- **Prop Types** ve **Default Props** tanımlama
- **Error handling** ve **Loading states** yönetimi
- **Performance** optimizasyonu için **useMemo** ve **useCallback** kullanımı

### Çoklu Dil Desteği

```jsx
// Translation kullanımı
import { useTranslation } from "react-i18next";

const { t } = useTranslation();
t("key"); // Çeviri anahtarı
```

### Error Handling

- **Try-catch** blokları ile hata yakalama
- **Loading states** ile kullanıcı deneyimi
- **Error boundaries** ile hata sınırları
- **Fallback UI** ile hata durumlarında alternatif görünüm
