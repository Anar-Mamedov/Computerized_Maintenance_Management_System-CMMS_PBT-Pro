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
      className: "center-aligned",
      dataIndex: "key",
      key: "key",
      sorter: (a, b) => a.key - b.key,
      width: 50,
      description: "Sıra",

      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "#",
    },
    {
      title: "📎",
      className: "center-aligned",
      dataIndex: "MKN_BELGE_VAR",
      key: "MKN_BELGE_VAR",
      sorter: (a, b) => (a.MKN_BELGE_VAR === b.MKN_BELGE_VAR ? 0 : a.MKN_BELGE_VAR ? -1 : 1),
      width: 100,
      description: "Belge",
      ellipsis: true, // Enable ellipsis for overflowed content
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
      ellipsis: true, // Enable ellipsis for overflowed content
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
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Periyodik Bakım",
    },
    {
      title: "Makine Kodu",
      className: "center-aligned",
      dataIndex: "MKN_KOD",
      key: "MKN_KOD",
      sorter: (a, b) => a.MKN_KOD.length - b.MKN_KOD.length,
      width: 100,
      description: "Makine Kodu",
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Makine Kodu",
    },
    {
      title: "Makine Tanımı",
      className: "center-aligned",
      dataIndex: "MKN_TANIM",
      key: "MKN_TANIM",
      sorter: (a, b) => a.MKN_TANIM.length - b.MKN_TANIM.length,
      width: 100,
      description: "Makine Tanımı",
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Makine Tanımı",
    },
    {
      title: "Aktif",
      className: "center-aligned",
      dataIndex: "MKN_AKTIF",
      key: "MKN_AKTIF",
      width: 100,
      description: "Aktif",
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Aktif",
      render: (status) => <input type="checkbox" checked={status} disabled />,
      sorter: (a, b) => (a.MKN_AKTIF === b.MKN_AKTIF ? 0 : a.MKN_AKTIF ? -1 : 1),
    },
    {
      title: "Makine Durumu",
      className: "center-aligned",
      dataIndex: "MKN_DURUM",
      key: "MKN_DURUM",
      width: 100,
      description: "Makine Durumu",
      ellipsis: true, // Enable ellipsis for overflowed content
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
    },
    {
      title: "Araç Tipi",
      dataIndex: "MKN_ARAC_TIP",
      key: "MKN_ARAC_TIP",
      description: "Araç Tipi",
      modalTitle: "Araç Tipi",
      className: "center-aligned",
      ellipsis: true, // Enable ellipsis for overflowed content
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
    },
    {
      title: "Lokasyon",
      dataIndex: "MKN_LOKASYON",
      key: "MKN_LOKASYON",
      description: "Lokasyon",
      modalTitle: "Lokasyon",
      className: "center-aligned",
      ellipsis: true, // Enable ellipsis for overflowed content
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
    },
    {
      title: "Makine Tipi",
      dataIndex: "MKN_TIP",
      key: "MKN_TIP",
      description: "Makine Tipi",
      modalTitle: "Makine Tipi",
      className: "center-aligned",
      ellipsis: true, // Enable ellipsis for overflowed content
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
    },
    {
      title: "Kategori",
      dataIndex: "MKN_KATEGORI",
      key: "MKN_KATEGORI",
      description: "Kategori",
      modalTitle: "Kategori",
      className: "center-aligned",
      ellipsis: true, // Enable ellipsis for overflowed content
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
      className: "center-aligned",
      ellipsis: true, // Enable ellipsis for overflowed content
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
      className: "center-aligned",
      ellipsis: true, // Enable ellipsis for overflowed content
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
  ];

  return columns;
}
