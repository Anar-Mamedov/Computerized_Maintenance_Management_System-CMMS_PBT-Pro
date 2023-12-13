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
  "open",
  "number",
  "editDate",
  "subject",
  "type",
  "status",
  "location",
  "machine",
  "machineDescription",
  "jobTime",
  "completion",
  "jobType",
  "jobReason",
  "workshop",
  "closingDate",
  "closingTime",
  "personelName",
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
  ];

  return columns;
}
