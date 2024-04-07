import { Checkbox, Tag } from "antd";
import dayjs from "dayjs";
import {
  getColor,
  getDocumentIcon,
  getDurusIcon,
  getIcon,
  getMaterialIcon,
  getNotIcon,
  getOpenIcon,
  getPersonnelIcon,
  getPictureIcon,
  getSpecialareaIcon,
} from "./utils";
import { useState } from "react";

// Define an array of default visible column keys
export const DEFAULT_VISIBLE_COLUMNS = [
  "MKN_KOD",
  "MKN_TANIM",
  "MKN_AKTIF",
  "MKN_DURUM",
  "MKN_ARAC_TIP",
  "MKN_LOKASYON",
  "MKN_TIP",
  "MKN_KATEGORI",
  "MKN_MARKA",
  "MKN_MODEL",
]; // Replace with your desired default columns

export default function useColumns(props) {
  const { handleNoteClick } = props;
  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      align: "right",
      sorter: (a, b) => a.key - b.key,
      width: 50,
      description: "Sıra",
      ellipsis: true,

      modalTitle: "#",
      // satır yüksekliğini ayarlamak için kullanılır
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
        style: {
          height: "55px", // Hücre yüksekliği
          // padding: "10px", // Varsayılan padding değerini değiştirebilirsiniz
        },
      }),
    },
    {
      title: "📎",
      className: "center-aligned",
      dataIndex: "MKN_BELGE_VAR",
      key: "MKN_BELGE_VAR",
      sorter: (a, b) => (a.MKN_BELGE_VAR === b.MKN_BELGE_VAR ? 0 : a.MKN_BELGE_VAR ? -1 : 1),
      width: 100,
      description: "Belge",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      modalTitle: "Belge",
    },
    {
      title: "🖼️",
      className: "center-aligned",
      dataIndex: "MKN_RESIM_VAR",
      key: "MKN_RESIM_VAR",
      sorter: (a, b) => (a.MKN_RESIM_VAR === b.MKN_RESIM_VAR ? 0 : a.MKN_RESIM_VAR ? -1 : 1),
      width: 100,
      description: "Resim",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      modalTitle: "Resim",
    },
    {
      title: "⚙️",
      className: "center-aligned",
      dataIndex: "MKN_PERIYODIK_BAKIM",
      key: "MKN_PERIYODIK_BAKIM",
      sorter: (a, b) => (a.MKN_PERIYODIK_BAKIM === b.MKN_PERIYODIK_BAKIM ? 0 : a.MKN_PERIYODIK_BAKIM ? -1 : 1),
      width: 100,
      description: "Peryodik Bakım",
      ellipsis: true,

      modalTitle: "Periyodik Bakım",
      // satır yüksekliğini ayarlamak için kullanılır
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
        style: {
          height: "55px", // Hücre yüksekliği
          // padding: "10px", // Varsayılan padding değerini değiştirebilirsiniz
        },
      }),
    },
    {
      title: "Makine Kodu",
      dataIndex: "MKN_KOD",
      key: "MKN_KOD",
      sorter: (a, b) => a.MKN_KOD.length - b.MKN_KOD.length,
      width: 150,
      description: "Makine Kodu",
      ellipsis: true,
      render: (text) => <a>{text}</a>,
      modalTitle: "Makine Kodu",
      // satır yüksekliğini ayarlamak için kullanılır
      onCell: () => ({
        style: {
          height: "55px", // Hücre yüksekliği
          // padding: "10px", // Varsayılan padding değerini değiştirebilirsiniz
        },
      }),
    },
    {
      title: "Makine Tanımı",
      dataIndex: "MKN_TANIM",
      key: "MKN_TANIM",
      sorter: (a, b) => a.MKN_TANIM.length - b.MKN_TANIM.length,
      width: 300,
      description: "Makine Tanımı",
      ellipsis: true,
      render: (text) => <a>{text}</a>,
      modalTitle: "Makine Tanımı",
      // satır yüksekliğini ayarlamak için kullanılır
      onCell: () => ({
        style: {
          height: "55px", // Hücre yüksekliği
          // padding: "10px", // Varsayılan padding değerini değiştirebilirsiniz
        },
      }),
    },
    {
      title: "Aktif",
      className: "center-aligned",
      dataIndex: "MKN_AKTIF",
      key: "MKN_AKTIF",
      width: 100,
      description: "Aktif",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      modalTitle: "Aktif",
      render: (status) => <input type="checkbox" checked={status} disabled />,
      sorter: (a, b) => (a.MKN_AKTIF === b.MKN_AKTIF ? 0 : a.MKN_AKTIF ? -1 : 1),
    },
    {
      title: "Makine Durumu",
      dataIndex: "MKN_DURUM",
      key: "MKN_DURUM",
      width: 100,
      description: "Makine Durumu",
      ellipsis: true,

      modalTitle: "Makine Durumu",
      sorter: (a, b) => {
        if (a.MKN_DURUM && b.MKN_DURUM) {
          return a.MKN_DURUM.localeCompare(b.MKN_DURUM);
        }
        if (!a.MKN_DURUM && !b.MKN_DURUM) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_DURUM ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      // satır yüksekliğini ayarlamak için kullanılır
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
        style: {
          height: "55px", // Hücre yüksekliği
          // padding: "10px", // Varsayılan padding değerini değiştirebilirsiniz
        },
      }),
    },
    {
      title: "Araç Tipi",
      dataIndex: "MKN_ARAC_TIP",
      key: "MKN_ARAC_TIP",
      description: "Araç Tipi",
      modalTitle: "Araç Tipi",
      ellipsis: true,

      width: 100,
      sorter: (a, b) => {
        if (a.MKN_ARAC_TIP && b.MKN_ARAC_TIP) {
          return a.MKN_ARAC_TIP.localeCompare(b.MKN_ARAC_TIP);
        }
        if (!a.MKN_ARAC_TIP && !b.MKN_ARAC_TIP) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_ARAC_TIP ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      // satır yüksekliğini ayarlamak için kullanılır
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
        style: {
          height: "55px", // Hücre yüksekliği
          // padding: "10px", // Varsayılan padding değerini değiştirebilirsiniz
        },
      }),
    },
    {
      title: "Lokasyon",
      dataIndex: "MKN_LOKASYON",
      key: "MKN_LOKASYON",
      description: "Lokasyon",
      modalTitle: "Lokasyon",
      ellipsis: true,

      width: 100,
      sorter: (a, b) => {
        if (a.MKN_LOKASYON && b.MKN_LOKASYON) {
          return a.MKN_LOKASYON.localeCompare(b.MKN_LOKASYON);
        }
        if (!a.MKN_LOKASYON && !b.MKN_LOKASYON) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_LOKASYON ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      // satır yüksekliğini ayarlamak için kullanılır
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
        style: {
          height: "55px", // Hücre yüksekliği
          // padding: "10px", // Varsayılan padding değerini değiştirebilirsiniz
        },
      }),
    },
    {
      title: "Makine Tipi",
      dataIndex: "MKN_TIP",
      key: "MKN_TIP",
      description: "Makine Tipi",
      modalTitle: "Makine Tipi",
      ellipsis: true,

      width: 100,
      sorter: (a, b) => {
        if (a.MKN_TIP && b.MKN_TIP) {
          return a.MKN_TIP.localeCompare(b.MKN_TIP);
        }
        if (!a.MKN_TIP && !b.MKN_TIP) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_TIP ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      // satır yüksekliğini ayarlamak için kullanılır
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
        style: {
          height: "55px", // Hücre yüksekliği
          // padding: "10px", // Varsayılan padding değerini değiştirebilirsiniz
        },
      }),
    },
    {
      title: "Kategori",
      dataIndex: "MKN_KATEGORI",
      key: "MKN_KATEGORI",
      description: "Kategori",
      modalTitle: "Kategori",
      ellipsis: true,

      width: 100,
      sorter: (a, b) => {
        if (a.MKN_KATEGORI && b.MKN_KATEGORI) {
          return a.MKN_KATEGORI.localeCompare(b.MKN_KATEGORI);
        }
        if (!a.MKN_KATEGORI && !b.MKN_KATEGORI) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_KATEGORI ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "Marka",
      dataIndex: "MKN_MARKA",
      key: "MKN_MARKA",
      description: "Marka",
      modalTitle: "Marka",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 100,
      sorter: (a, b) => {
        if (a.MKN_MARKA && b.MKN_MARKA) {
          return a.MKN_MARKA.localeCompare(b.MKN_MARKA);
        }
        if (!a.MKN_MARKA && !b.MKN_MARKA) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_MARKA ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "Model",
      dataIndex: "MKN_MODEL",
      key: "MKN_MODEL",
      description: "Model",
      modalTitle: "Model",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 100,
      sorter: (a, b) => {
        if (a.MKN_MODEL && b.MKN_MODEL) {
          return a.MKN_MODEL.localeCompare(b.MKN_MODEL);
        }
        if (!a.MKN_MODEL && !b.MKN_MODEL) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_MODEL ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "Master Makine Tanımı",
      dataIndex: "MKN_MASTER_MAKINE_TANIM",
      key: "MKN_MASTER_MAKINE_TANIM",
      description: "Master Makine Tanimi",
      modalTitle: "Master Makine Tanimi",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 100,
      sorter: (a, b) => {
        if (a.MKN_MASTER_MAKINE_TANIM && b.MKN_MASTER_MAKINE_TANIM) {
          return a.MKN_MASTER_MAKINE_TANIM.localeCompare(b.MKN_MASTER_MAKINE_TANIM);
        }
        if (!a.MKN_MASTER_MAKINE_TANIM && !b.MKN_MASTER_MAKINE_TANIM) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_MASTER_MAKINE_TANIM ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "Master Makine Kod",
      dataIndex: "MKN_MASTER_MAKINE_KOD",
      key: "MKN_MASTER_MAKINE_KOD",
      description: "Master Makine Kod",
      modalTitle: "Master Makine Kod",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 100,
      sorter: (a, b) => {
        if (a.MKN_MASTER_MAKINE_KOD && b.MKN_MASTER_MAKINE_KOD) {
          return a.MKN_MASTER_MAKINE_KOD.localeCompare(b.MKN_MASTER_MAKINE_KOD);
        }
        if (!a.MKN_MASTER_MAKINE_KOD && !b.MKN_MASTER_MAKINE_KOD) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_MASTER_MAKINE_KOD ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "Çalışma Takvimi",
      dataIndex: "MKN_TAKVIM",
      key: "MKN_TAKVIM",
      description: "Çalışma Takvimi",
      modalTitle: "Çalışma Takvimi",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 100,
      sorter: (a, b) => {
        if (a.MKN_TAKVIM && b.MKN_TAKVIM) {
          return a.MKN_TAKVIM.localeCompare(b.MKN_TAKVIM);
        }
        if (!a.MKN_TAKVIM && !b.MKN_TAKVIM) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_TAKVIM ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "Üretim Yılı",
      dataIndex: "MKN_URETIM_YILI",
      key: "MKN_URETIM_YILI",
      description: "Üretim Yılı",
      modalTitle: "Üretim Yılı",
      align: "right",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 100,
      sorter: (a, b) => {
        if (a.MKN_URETIM_YILI && b.MKN_URETIM_YILI) {
          return a.MKN_URETIM_YILI.localeCompare(b.MKN_URETIM_YILI);
        }
        if (!a.MKN_URETIM_YILI && !b.MKN_URETIM_YILI) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_URETIM_YILI ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "Masraf Merkezi",
      dataIndex: "MKN_MASRAF_MERKEZ",
      key: "MKN_MASRAF_MERKEZ",
      description: "Masraf Merkezi",
      modalTitle: "Masraf Merkezi",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 100,
      sorter: (a, b) => {
        if (a.MKN_MASRAF_MERKEZ && b.MKN_MASRAF_MERKEZ) {
          return a.MKN_MASRAF_MERKEZ.localeCompare(b.MKN_MASRAF_MERKEZ);
        }
        if (!a.MKN_MASRAF_MERKEZ && !b.MKN_MASRAF_MERKEZ) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_MASRAF_MERKEZ ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "Sorumlu Atölye",
      dataIndex: "MKN_ATOLYE",
      key: "MKN_ATOLYE",
      description: "Sorumlu Atölye",
      modalTitle: "Sorumlu Atölye",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 100,
      sorter: (a, b) => {
        if (a.MKN_ATOLYE && b.MKN_ATOLYE) {
          return a.MKN_ATOLYE.localeCompare(b.MKN_ATOLYE);
        }
        if (!a.MKN_ATOLYE && !b.MKN_ATOLYE) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_ATOLYE ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "Bakım Grubu",
      dataIndex: "MKN_BAKIM_GRUP",
      key: "MKN_BAKIM_GRUP",
      description: "Bakım Grubu",
      modalTitle: "Bakım Grubu",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 100,
      sorter: (a, b) => {
        if (a.MKN_BAKIM_GRUP && b.MKN_BAKIM_GRUP) {
          return a.MKN_BAKIM_GRUP.localeCompare(b.MKN_BAKIM_GRUP);
        }
        if (!a.MKN_BAKIM_GRUP && !b.MKN_BAKIM_GRUP) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_BAKIM_GRUP ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "Arıza Grubu",
      dataIndex: "MKN_ARIZA_GRUP",
      key: "MKN_ARIZA_GRUP",
      description: "Arıza Grubu",
      modalTitle: "Arıza Grubu",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 100,
      sorter: (a, b) => {
        if (a.MKN_ARIZA_GRUP && b.MKN_ARIZA_GRUP) {
          return a.MKN_ARIZA_GRUP.localeCompare(b.MKN_ARIZA_GRUP);
        }
        if (!a.MKN_ARIZA_GRUP && !b.MKN_ARIZA_GRUP) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_ARIZA_GRUP ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "Öncelik",
      dataIndex: "MKN_ONCELIK",
      key: "MKN_ONCELIK",
      description: "Öncelik",
      modalTitle: "Öncelik",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 100,
      sorter: (a, b) => {
        if (a.MKN_ONCELIK && b.MKN_ONCELIK) {
          return a.MKN_ONCELIK.localeCompare(b.MKN_ONCELIK);
        }
        if (!a.MKN_ONCELIK && !b.MKN_ONCELIK) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_ONCELIK ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "Arıza Sıklığı (Gün)",
      dataIndex: "ARIZA_SIKLIGI",
      key: "ARIZA_SIKLIGI",
      description: "Arıza Sıklığı (Gün)",
      modalTitle: "Arıza Sıklığı (Gün)",
      align: "right",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 100,
      sorter: (a, b) => {
        if (a.ARIZA_SIKLIGI && b.ARIZA_SIKLIGI) {
          return a.ARIZA_SIKLIGI.localeCompare(b.ARIZA_SIKLIGI);
        }
        if (!a.ARIZA_SIKLIGI && !b.ARIZA_SIKLIGI) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.ARIZA_SIKLIGI ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "Arıza Sayısı",
      dataIndex: "ARIZA_SAYISI",
      key: "ARIZA_SAYISI",
      description: "Arıza Sayısı",
      modalTitle: "Arıza Sayısı",
      align: "right",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 100,
      sorter: (a, b) => {
        if (a.ARIZA_SAYISI && b.ARIZA_SAYISI) {
          return a.ARIZA_SAYISI.localeCompare(b.ARIZA_SAYISI);
        }
        if (!a.ARIZA_SAYISI && !b.ARIZA_SAYISI) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.ARIZA_SAYISI ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 1",
      dataIndex: "MKN_OZEL_ALAN_1",
      key: "MKN_OZEL_ALAN_1",
      description: "ÖZEL ALAN 1",
      modalTitle: "ÖZEL ALAN 1",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_1 && b.MKN_OZEL_ALAN_1) {
          return a.MKN_OZEL_ALAN_1.localeCompare(b.MKN_OZEL_ALAN_1);
        }
        if (!a.MKN_OZEL_ALAN_1 && !b.MKN_OZEL_ALAN_1) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_1 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 2",
      dataIndex: "MKN_OZEL_ALAN_2",
      key: "MKN_OZEL_ALAN_2",
      description: "ÖZEL ALAN 2",
      modalTitle: "ÖZEL ALAN 2",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_2 && b.MKN_OZEL_ALAN_2) {
          return a.MKN_OZEL_ALAN_2.localeCompare(b.MKN_OZEL_ALAN_2);
        }
        if (!a.MKN_OZEL_ALAN_2 && !b.MKN_OZEL_ALAN_2) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_2 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 3",
      dataIndex: "MKN_OZEL_ALAN_3",
      key: "MKN_OZEL_ALAN_3",
      description: "ÖZEL ALAN 3",
      modalTitle: "ÖZEL ALAN 3",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_3 && b.MKN_OZEL_ALAN_3) {
          return a.MKN_OZEL_ALAN_3.localeCompare(b.MKN_OZEL_ALAN_3);
        }
        if (!a.MKN_OZEL_ALAN_3 && !b.MKN_OZEL_ALAN_3) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_3 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 4",
      dataIndex: "MKN_OZEL_ALAN_4",
      key: "MKN_OZEL_ALAN_4",
      description: "ÖZEL ALAN 4",
      modalTitle: "ÖZEL ALAN 4",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_4 && b.MKN_OZEL_ALAN_4) {
          return a.MKN_OZEL_ALAN_4.localeCompare(b.MKN_OZEL_ALAN_4);
        }
        if (!a.MKN_OZEL_ALAN_4 && !b.MKN_OZEL_ALAN_4) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_4 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 5",
      dataIndex: "MKN_OZEL_ALAN_5",
      key: "MKN_OZEL_ALAN_5",
      description: "ÖZEL ALAN 5",
      modalTitle: "ÖZEL ALAN 5",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_5 && b.MKN_OZEL_ALAN_5) {
          return a.MKN_OZEL_ALAN_5.localeCompare(b.MKN_OZEL_ALAN_5);
        }
        if (!a.MKN_OZEL_ALAN_5 && !b.MKN_OZEL_ALAN_5) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_5 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 6",
      dataIndex: "MKN_OZEL_ALAN_6",
      key: "MKN_OZEL_ALAN_6",
      description: "ÖZEL ALAN 6",
      modalTitle: "ÖZEL ALAN 6",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_6 && b.MKN_OZEL_ALAN_6) {
          return a.MKN_OZEL_ALAN_6.localeCompare(b.MKN_OZEL_ALAN_6);
        }
        if (!a.MKN_OZEL_ALAN_6 && !b.MKN_OZEL_ALAN_6) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_6 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 7",
      dataIndex: "MKN_OZEL_ALAN_7",
      key: "MKN_OZEL_ALAN_7",
      description: "ÖZEL ALAN 7",
      modalTitle: "ÖZEL ALAN 7",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_7 && b.MKN_OZEL_ALAN_7) {
          return a.MKN_OZEL_ALAN_7.localeCompare(b.MKN_OZEL_ALAN_7);
        }
        if (!a.MKN_OZEL_ALAN_7 && !b.MKN_OZEL_ALAN_7) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_7 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 8",
      dataIndex: "MKN_OZEL_ALAN_8",
      key: "MKN_OZEL_ALAN_8",
      description: "ÖZEL ALAN 8",
      modalTitle: "ÖZEL ALAN 8",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_8 && b.MKN_OZEL_ALAN_8) {
          return a.MKN_OZEL_ALAN_8.localeCompare(b.MKN_OZEL_ALAN_8);
        }
        if (!a.MKN_OZEL_ALAN_8 && !b.MKN_OZEL_ALAN_8) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_8 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 9",
      dataIndex: "MKN_OZEL_ALAN_9",
      key: "MKN_OZEL_ALAN_9",
      description: "ÖZEL ALAN 9",
      modalTitle: "ÖZEL ALAN 9",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_9 && b.MKN_OZEL_ALAN_9) {
          return a.MKN_OZEL_ALAN_9.localeCompare(b.MKN_OZEL_ALAN_9);
        }
        if (!a.MKN_OZEL_ALAN_9 && !b.MKN_OZEL_ALAN_9) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_9 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 10",
      dataIndex: "MKN_OZEL_ALAN_10",
      key: "MKN_OZEL_ALAN_10",
      description: "ÖZEL ALAN 10",
      modalTitle: "ÖZEL ALAN 10",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_10 && b.MKN_OZEL_ALAN_10) {
          return a.MKN_OZEL_ALAN_10.localeCompare(b.MKN_OZEL_ALAN_10);
        }
        if (!a.MKN_OZEL_ALAN_10 && !b.MKN_OZEL_ALAN_10) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_10 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 11",
      dataIndex: "MKN_OZEL_ALAN_11_KOD_ID",
      key: "MKN_OZEL_ALAN_11_KOD_ID",
      description: "ÖZEL ALAN 11",
      modalTitle: "ÖZEL ALAN 11",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_11_KOD_ID && b.MKN_OZEL_ALAN_11_KOD_ID) {
          return a.MKN_OZEL_ALAN_11_KOD_ID.localeCompare(b.MKN_OZEL_ALAN_11_KOD_ID);
        }
        if (!a.MKN_OZEL_ALAN_11_KOD_ID && !b.MKN_OZEL_ALAN_11_KOD_ID) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_11_KOD_ID ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 12",
      dataIndex: "MKN_OZEL_ALAN_12_KOD_ID",
      key: "MKN_OZEL_ALAN_12_KOD_ID",
      description: "ÖZEL ALAN 12",
      modalTitle: "ÖZEL ALAN 12",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_12_KOD_ID && b.MKN_OZEL_ALAN_12_KOD_ID) {
          return a.MKN_OZEL_ALAN_12_KOD_ID.localeCompare(b.MKN_OZEL_ALAN_12_KOD_ID);
        }
        if (!a.MKN_OZEL_ALAN_12_KOD_ID && !b.MKN_OZEL_ALAN_12_KOD_ID) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_12_KOD_ID ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 13",
      dataIndex: "MKN_OZEL_ALAN_13_KOD_ID",
      key: "MKN_OZEL_ALAN_13_KOD_ID",
      description: "ÖZEL ALAN 13",
      modalTitle: "ÖZEL ALAN 13",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_13_KOD_ID && b.MKN_OZEL_ALAN_13_KOD_ID) {
          return a.MKN_OZEL_ALAN_13_KOD_ID.localeCompare(b.MKN_OZEL_ALAN_13_KOD_ID);
        }
        if (!a.MKN_OZEL_ALAN_13_KOD_ID && !b.MKN_OZEL_ALAN_13_KOD_ID) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_13_KOD_ID ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 14",
      dataIndex: "MKN_OZEL_ALAN_14_KOD_ID",
      key: "MKN_OZEL_ALAN_14_KOD_ID",
      description: "ÖZEL ALAN 14",
      modalTitle: "ÖZEL ALAN 14",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_14_KOD_ID && b.MKN_OZEL_ALAN_14_KOD_ID) {
          return a.MKN_OZEL_ALAN_14_KOD_ID.localeCompare(b.MKN_OZEL_ALAN_14_KOD_ID);
        }
        if (!a.MKN_OZEL_ALAN_14_KOD_ID && !b.MKN_OZEL_ALAN_14_KOD_ID) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_14_KOD_ID ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 15",
      dataIndex: "MKN_OZEL_ALAN_15_KOD_ID",
      key: "MKN_OZEL_ALAN_15_KOD_ID",
      description: "ÖZEL ALAN 15",
      modalTitle: "ÖZEL ALAN 15",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_15_KOD_ID && b.MKN_OZEL_ALAN_15_KOD_ID) {
          return a.MKN_OZEL_ALAN_15_KOD_ID.localeCompare(b.MKN_OZEL_ALAN_15_KOD_ID);
        }
        if (!a.MKN_OZEL_ALAN_15_KOD_ID && !b.MKN_OZEL_ALAN_15_KOD_ID) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_15_KOD_ID ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 16",
      dataIndex: "MKN_OZEL_ALAN_16",
      key: "MKN_OZEL_ALAN_16",
      description: "ÖZEL ALAN 16",
      modalTitle: "ÖZEL ALAN 16",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_16 && b.MKN_OZEL_ALAN_16) {
          return a.MKN_OZEL_ALAN_16.localeCompare(b.MKN_OZEL_ALAN_16);
        }
        if (!a.MKN_OZEL_ALAN_16 && !b.MKN_OZEL_ALAN_16) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_16 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 17",
      dataIndex: "MKN_OZEL_ALAN_17",
      key: "MKN_OZEL_ALAN_17",
      description: "ÖZEL ALAN 17",
      modalTitle: "ÖZEL ALAN 17",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_17 && b.MKN_OZEL_ALAN_17) {
          return a.MKN_OZEL_ALAN_17.localeCompare(b.MKN_OZEL_ALAN_17);
        }
        if (!a.MKN_OZEL_ALAN_17 && !b.MKN_OZEL_ALAN_17) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_17 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 18",
      dataIndex: "MKN_OZEL_ALAN_18",
      key: "MKN_OZEL_ALAN_18",
      description: "ÖZEL ALAN 18",
      modalTitle: "ÖZEL ALAN 18",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_18 && b.MKN_OZEL_ALAN_18) {
          return a.MKN_OZEL_ALAN_18.localeCompare(b.MKN_OZEL_ALAN_18);
        }
        if (!a.MKN_OZEL_ALAN_18 && !b.MKN_OZEL_ALAN_18) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_18 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 19",
      dataIndex: "MKN_OZEL_ALAN_19",
      key: "MKN_OZEL_ALAN_19",
      description: "ÖZEL ALAN 19",
      modalTitle: "ÖZEL ALAN 19",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_19 && b.MKN_OZEL_ALAN_19) {
          return a.MKN_OZEL_ALAN_19.localeCompare(b.MKN_OZEL_ALAN_19);
        }
        if (!a.MKN_OZEL_ALAN_19 && !b.MKN_OZEL_ALAN_19) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_19 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "ÖZEL ALAN 20",
      dataIndex: "MKN_OZEL_ALAN_20",
      key: "MKN_OZEL_ALAN_20",
      description: "ÖZEL ALAN 20",
      modalTitle: "ÖZEL ALAN 20",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_20 && b.MKN_OZEL_ALAN_20) {
          return a.MKN_OZEL_ALAN_20.localeCompare(b.MKN_OZEL_ALAN_20);
        }
        if (!a.MKN_OZEL_ALAN_20 && !b.MKN_OZEL_ALAN_20) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_20 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "Tam Lokasyon",
      dataIndex: "MKN_LOKASYON_TUM_YOL",
      key: "MKN_LOKASYON_TUM_YOL",
      description: "Tam Lokasyon",
      modalTitle: "Tam Lokasyon",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 200,
      sorter: (a, b) => {
        if (a.MKN_LOKASYON_TUM_YOL && b.MKN_LOKASYON_TUM_YOL) {
          return a.MKN_LOKASYON_TUM_YOL.localeCompare(b.MKN_LOKASYON_TUM_YOL);
        }
        if (!a.MKN_LOKASYON_TUM_YOL && !b.MKN_LOKASYON_TUM_YOL) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_LOKASYON_TUM_YOL ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "Seri No",
      dataIndex: "MKN_SERI_NO",
      key: "MKN_SERI_NO",
      description: "Seri No",
      modalTitle: "Seri No",
      align: "right",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 100,
      sorter: (a, b) => {
        if (a.MKN_SERI_NO && b.MKN_SERI_NO) {
          return a.MKN_SERI_NO.localeCompare(b.MKN_SERI_NO);
        }
        if (!a.MKN_SERI_NO && !b.MKN_SERI_NO) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_SERI_NO ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
  ];

  return columns;
}
