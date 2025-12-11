import React, { useCallback, useEffect, useState } from "react";
import { Input, Table } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";

const normalizeText = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "G")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "U")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "S")
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "O")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C");
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export default function PersonelTablo({ onSelectedIdsChange }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm1, setSearchTerm1] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const columns = [
    {
      title: "Ekipman No",
      dataIndex: "EKP_KOD",
      key: "EKP_KOD",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.EKP_KOD === null) return -1;
        if (b.EKP_KOD === null) return 1;
        return a.EKP_KOD.localeCompare(b.EKP_KOD);
      },
    },

    {
      title: "Tanım",
      dataIndex: "EKP_TANIM",
      key: "EKP_TANIM",
      width: 250,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.EKP_TANIM === null) return -1;
        if (b.EKP_TANIM === null) return 1;
        return a.EKP_TANIM.localeCompare(b.EKP_TANIM);
      },
      visible: true, // Varsayılan olarak açık
    },

    {
      title: "Seri No",
      dataIndex: "EKP_SERI_NO",
      key: "EKP_SERI_NO",
      width: 100,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.EKP_SERI_NO === null) return -1;
        if (b.EKP_SERI_NO === null) return 1;
        return a.EKP_SERI_NO.localeCompare(b.EKP_SERI_NO);
      },
      visible: true, // Varsayılan olarak açık
    },

    {
      title: "Ekipman",
      dataIndex: "MKN_TANIM",
      key: "MKN_TANIM",
      width: 200,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.MKN_TANIM === null) return -1;
        if (b.MKN_TANIM === null) return 1;
        return a.MKN_TANIM.localeCompare(b.MKN_TANIM);
      },
      visible: true, // Varsayılan olarak açık
    },

    {
      title: "Tipi",
      dataIndex: "EKP_TIP",
      key: "EKP_TIP",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.EKP_TIP === null) return -1;
        if (b.EKP_TIP === null) return 1;
        return a.EKP_TIP.localeCompare(b.EKP_TIP);
      },
      visible: true, // Varsayılan olarak açık
    },

    {
      title: "Durum",
      dataIndex: "EKP_DURUM",
      key: "EKP_DURUM",
      width: 150,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.EKP_DURUM === null && b.EKP_DURUM === null) return 0;
        if (a.EKP_DURUM === null) return 1;
        if (b.EKP_DURUM === null) return -1;
        return a.EKP_DURUM.localeCompare(b.EKP_DURUM);
      },
    },

    {
      title: "Marka",
      dataIndex: "EKP_MARKA",
      key: "EKP_MARKA",
      width: 150,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.EKP_MARKA === null && b.EKP_MARKA === null) return 0;
        if (a.EKP_MARKA === null) return 1;
        if (b.EKP_MARKA === null) return -1;
        return a.EKP_MARKA.localeCompare(b.EKP_MARKA);
      },
    },

    {
      title: "Model",
      dataIndex: "EKP_MODEL",
      key: "EKP_MODEL",
      width: 150,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.EKP_MODEL === null && b.EKP_MODEL === null) return 0;
        if (a.EKP_MODEL === null) return 1;
        if (b.EKP_MODEL === null) return -1;
        return a.EKP_MODEL.localeCompare(b.EKP_MODEL);
      },
    },

    {
      title: "Revizyon Tarih",
      dataIndex: "EKP_REVIZYON_TARIH",
      key: "EKP_REVIZYON_TARIH",
      width: 110,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.EKP_REVIZYON_TARIH === null) return -1;
        if (b.EKP_REVIZYON_TARIH === null) return 1;
        return a.EKP_REVIZYON_TARIH.localeCompare(b.EKP_REVIZYON_TARIH);
      },

      visible: true, // Varsayılan olarak açık
      render: (text) => formatDate(text),
    },

    {
      title: "Garanti Tarih",
      dataIndex: "EKP_GARANTI_BITIS_TARIH",
      key: "EKP_GARANTI_BITIS_TARIH",
      width: 110,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.EKP_GARANTI_BITIS_TARIH === null) return -1;
        if (b.EKP_GARANTI_BITIS_TARIH === null) return 1;
        return a.EKP_GARANTI_BITIS_TARIH.localeCompare(b.EKP_GARANTI_BITIS_TARIH);
      },

      visible: true, // Varsayılan olarak açık
      render: (text) => formatDate(text),
    },

    {
      title: "Depo",
      dataIndex: "EKP_DEPO",
      key: "EKP_DEPO",
      width: 150,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.EKP_DEPO === null && b.EKP_DEPO === null) return 0;
        if (a.EKP_DEPO === null) return 1;
        if (b.EKP_DEPO === null) return -1;
        return a.EKP_DEPO.localeCompare(b.EKP_DEPO);
      },
    },
  ];

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için

  // Intl.DateTimeFormat kullanarak tarih formatlama
  const formatDate = (date) => {
    if (!date) return "";

    // Örnek bir tarih formatla ve ay formatını belirle
    const sampleDate = new Date(2021, 0, 21); // Ocak ayı için örnek bir tarih
    const sampleFormatted = new Intl.DateTimeFormat(navigator.language).format(sampleDate);

    let monthFormat;
    if (sampleFormatted.includes("January")) {
      monthFormat = "long"; // Tam ad ("January")
    } else if (sampleFormatted.includes("Jan")) {
      monthFormat = "short"; // Üç harfli kısaltma ("Jan")
    } else {
      monthFormat = "2-digit"; // Sayısal gösterim ("01")
    }

    // Kullanıcı için tarihi formatla
    const formatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: monthFormat,
      day: "2-digit",
    });
    return formatter.format(new Date(date));
  };

  const formatTime = (time) => {
    if (!time || time.trim() === "") return ""; // `trim` metodu ile baştaki ve sondaki boşlukları temizle

    try {
      // Saati ve dakikayı parçalara ayır, boşlukları temizle
      const [hours, minutes] = time
        .trim()
        .split(":")
        .map((part) => part.trim());

      // Saat ve dakika değerlerinin geçerliliğini kontrol et
      const hoursInt = parseInt(hours, 10);
      const minutesInt = parseInt(minutes, 10);
      if (isNaN(hoursInt) || isNaN(minutesInt) || hoursInt < 0 || hoursInt > 23 || minutesInt < 0 || minutesInt > 59) {
        // throw new Error("Invalid time format"); // hata fırlatır ve uygulamanın çalışmasını durdurur
        console.error("Invalid time format:", time);
        // return time; // Hatalı formatı olduğu gibi döndür
        return ""; // Hata durumunda boş bir string döndür
      }

      // Geçerli tarih ile birlikte bir Date nesnesi oluştur ve sadece saat ve dakika bilgilerini ayarla
      const date = new Date();
      date.setHours(hoursInt, minutesInt, 0);

      // Kullanıcının lokal ayarlarına uygun olarak saat ve dakikayı formatla
      // `hour12` seçeneğini belirtmeyerek Intl.DateTimeFormat'ın kullanıcının yerel ayarlarına göre otomatik seçim yapmasına izin ver
      const formatter = new Intl.DateTimeFormat(navigator.language, {
        hour: "numeric",
        minute: "2-digit",
        // hour12 seçeneği burada belirtilmiyor; böylece otomatik olarak kullanıcının sistem ayarlarına göre belirleniyor
      });

      // Formatlanmış saati döndür
      return formatter.format(date);
    } catch (error) {
      console.error("Error formatting time:", error);
      return ""; // Hata durumunda boş bir string döndür
      // return time; // Hatalı formatı olduğu gibi döndür
    }
  };

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

  const fetch = useCallback((page = 1, pageSize = 10, searchTerm = "") => {
    setLoading(true);
    AxiosInstance.get(`GetEkipmanListBosta?parametre=${searchTerm}&pagingDeger=${page}&pageSize=${pageSize}`)
      .then((response) => {
        const fetchedData = response.list.map((item) => ({
          ...item,
          key: item.TB_EKIPMAN_ID,
        }));
        setData(fetchedData);
        setPagination({ current: page, pageSize, total: response.kayit_sayisi });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch();
  }, []);

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
    onSelectedIdsChange(selectedKeys);
  };

  const debouncedFetch = useCallback(
    debounce((value) => {
      fetch(1, pagination.pageSize, value);
    }, 2000),
    [pagination.pageSize]
  );

  const handleSearch1 = (e) => {
    const value = e.target.value;
    setSearchTerm1(value);
    debouncedFetch(value);
  };

  const handleTableChange = (pagination) => {
    fetch(pagination.current, pagination.pageSize, searchTerm1);
  };

  return (
    <div>
      <Input placeholder="Arama..." value={searchTerm1} onChange={handleSearch1} style={{ width: "300px", marginBottom: "15px" }} />
      <Table
        rowSelection={{
          type: "checkbox",
          selectedRowKeys,
          onChange: onRowSelectChange,
        }}
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{
          y: "calc(100vh - 360px)",
        }}
      />
    </div>
  );
}
