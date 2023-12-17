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
      sorter: (a, b) => a.key - b.key,
      width: 50,
      description: "Sıra",
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "#",
    },
    {
      title: "🚩",
      className: "center-aligned",
      dataIndex: "open",
      sorter: (a, b) => a.open - b.open,
      render: (open) => getOpenIcon(open),
      width: "50px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Açık/Kapalı",
    },
    {
      title: "🏴",
      className: "center-aligned",
      dataIndex: "priorityIcon",
      sorter: (a, b) => a.priorityIcon - b.priorityIcon,
      render: (priorityIcon) => getIcon(priorityIcon),
      width: "50px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Öncelik",
    },
    {
      title: "📝",
      className: "center-aligned",
      dataIndex: "document",
      sorter: (a, b) => a.document - b.document,
      render: (document) => getDocumentIcon(document),
      width: "50px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Belge",
    },
    {
      title: "🌄",
      className: "center-aligned",
      dataIndex: "picture",
      sorter: (a, b) => a.picture - b.picture,
      render: (picture) => getPictureIcon(picture),
      width: "50px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Resim",
    },
    {
      title: "⚙️",
      className: "center-aligned",
      dataIndex: "material",
      sorter: (a, b) => a.material - b.material,
      render: (material) => getMaterialIcon(material),
      width: "50px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Malzeme",
    },
    {
      title: "🤵‍♂️",
      className: "center-aligned",
      dataIndex: "personnel",
      sorter: (a, b) => a.personnel - b.personnel,
      render: (personnel) => getPersonnelIcon(personnel),
      width: "50px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Personel",
    },
    {
      title: "⏰",
      className: "center-aligned",
      dataIndex: "durus",
      sorter: (a, b) => a.durus - b.durus,
      render: (durus) => getDurusIcon(durus),
      width: "50px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Duruş",
    },
    {
      title: "Not",
      className: "center-aligned note",
      dataIndex: "not",
      sorter: (a, b) => a.not - b.not,
      render: (note) => {
        if (note) {
          return (
            <div
              style={{ width: "100%", display: "flex", justifyContent: "center", cursor: "pointer" }}
              onClick={() => handleNoteClick(note)}>
              <div className="note-emoji" style={{ width: "16px", height: "16px", borderRadius: "50%" }}>
                🗒️
              </div>
            </div>
          );
        } else {
          return null;
        }
      },
      width: "70px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Not",
    },
    {
      title: "İş Emri No",
      className: "center-aligned",
      dataIndex: "number",
      sorter: (a, b) => {
        if (a.number && b.number) {
          return a.number.localeCompare(b.number);
        }
        if (!a.number && !b.number) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.number ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      // filterMode: "tree",
      // filterSearch: true,
      // onFilter: ([min, max], record) => record.number >= min && record.number <= max,
      // filters: [
      //   {
      //     text: "1-1000",
      //     value: [1, 1000],
      //   },
      //   {
      //     text: "1001-2000",
      //     value: [1001, 2000],
      //   },
      // ],

      width: 120, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "İş Emri No",
    },

    {
      title: "Tarih",
      className: "center-aligned",
      dataIndex: "editDate",
      sorter: (a, b) => {
        if (a.editDate && b.editDate) {
          return a.editDate.localeCompare(b.editDate);
        }
        if (!a.editDate && !b.editDate) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.editDate ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      render: (text) => {
        return text || "";
      },
      align: "center",
      width: 100, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Tarih",
    },
    {
      title: "Saat",
      className: "center-aligned",
      dataIndex: "editTime",
      sorter: (a, b) => {
        if (a.editTime && b.editTime) {
          return a.editTime.localeCompare(b.editTime);
        }
        if (!a.editTime && !b.editTime) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.editTime ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      render: (editTime) => {
        return editTime || "";
      },
      align: "center",
      width: 70, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Saat",
    },
    {
      title: "Konu",
      className: "left-aligned",
      dataIndex: "subject",
      sorter: (a, b) => {
        if (a.subject && b.subject) {
          return a.subject.localeCompare(b.subject);
        }
        if (!a.subject && !b.subject) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.subject ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "300px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Konu",
    },
    {
      title: (
        <div style={{ height: "40px" }}>
          İş Emri
          <br />
          Tipi
        </div>
      ),
      className: "center-aligned",
      dataIndex: "type",
      sorter: (a, b) => {
        if (a.type && b.type) {
          return a.type.localeCompare(b.type);
        }
        if (!a.type && !b.type) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.type ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      render: (_, { type }) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Tag color={getColor(type)}>{type}</Tag>
        </div>
      ),
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "İş Emri Tipi",
    },
    {
      title: "Durum",
      className: "center-aligned",
      dataIndex: "status",
      sorter: (a, b) => {
        if (a.status && b.status) {
          return a.status.localeCompare(b.status);
        }
        if (!a.status && !b.status) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.status ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "190px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Durum",
    },
    {
      title: "Lokasyon",
      className: "center-aligned",
      dataIndex: "location",
      sorter: (a, b) => {
        if (a.location && b.location) {
          return a.location.localeCompare(b.location);
        }
        if (!a.location && !b.location) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.location ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Lokasyon",
    },
    {
      title: "Makine Kodu",
      className: "center-aligned",
      dataIndex: "machine",
      sorter: (a, b) => {
        if (a.machine && b.machine) {
          return a.machine.localeCompare(b.machine);
        }
        if (!a.machine && !b.machine) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.machine ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: 120, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Makine Kodu",
    },
    {
      title: "Makine Tanımı",
      className: "left-aligned",
      dataIndex: "machineDescription",
      sorter: (a, b) => {
        if (a.machineDescription && b.machineDescription) {
          return a.machineDescription.localeCompare(b.machineDescription);
        }
        if (!a.machineDescription && !b.machineDescription) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.machineDescription ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "300px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Makine Tanımı",
    },
    {
      title: (
        <div style={{ height: "40px" }}>
          Planlanan
          <br />
          Başlama Tarihi,
        </div>
      ),
      className: "center-aligned",
      dataIndex: "plannedStartDate",
      sorter: (a, b) => {
        if (a.plannedStartDate && b.plannedStartDate) {
          return a.plannedStartDate.localeCompare(b.plannedStartDate);
        }
        if (!a.plannedStartDate && !b.plannedStartDate) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.plannedStartDate ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      render: (text) => {
        return text || "";
      },
      align: "center",
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Planlanan Başlama Tarihi",
    },
    {
      title: (
        <div style={{ height: "40px" }}>
          Planlanan
          <br />
          Başlama Saati
        </div>
      ),
      className: "center-aligned",
      dataIndex: "plannedStartTime",
      sorter: (a, b) => {
        if (a.plannedStartTime && b.plannedStartTime) {
          return a.plannedStartTime.localeCompare(b.plannedStartTime);
        }
        if (!a.plannedStartTime && !b.plannedStartTime) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.plannedStartTime ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      render: (text) => {
        return text || "";
      },
      align: "center",
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Planlanan Başlama Saati",
    },
    {
      title: (
        <div style={{ height: "40px" }}>
          Planlanan
          <br />
          Bitiş Tarihi
        </div>
      ),
      className: "center-aligned",
      dataIndex: "plannedEndDate",
      sorter: (a, b) => {
        if (a.plannedEndDate && b.plannedEndDate) {
          return a.plannedEndDate.localeCompare(b.plannedEndDate);
        }
        if (!a.plannedEndDate && !b.plannedEndDate) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.plannedEndDate ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      render: (text) => {
        return text || "";
      },
      align: "center",
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Planlanan Bitiş Tarihi",
    },
    {
      title: (
        <div style={{ height: "40px" }}>
          Planlanan
          <br />
          Bitiş Saati
        </div>
      ),
      className: "center-aligned",
      dataIndex: "plannedEndTime",
      sorter: (a, b) => {
        if (a.plannedEndTime && b.plannedEndTime) {
          return a.plannedEndTime.localeCompare(b.plannedEndTime);
        }
        if (!a.plannedEndTime && !b.plannedEndTime) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.plannedEndTime ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      render: (text) => {
        return text || "";
      },
      align: "center",
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Planlanan Bitiş Saati",
    },
    {
      title: (
        <div style={{ height: "40px" }}>
          Planlanan
          <br />
          İş Süresi (dk.)
        </div>
      ),
      className: "center-aligned",
      dataIndex: "startdate",
      sorter: (a, b) => {
        if (a.startdate && b.startdate) {
          return a.startdate.localeCompare(b.startdate);
        }
        if (!a.startdate && !b.startdate) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.startdate ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      render: (text) => {
        return text || "";
      },
      align: "center",
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Başlama Tarihi",
    },
    {
      title: "Başlama Saati",
      className: "center-aligned",
      dataIndex: "startTime",
      sorter: (a, b) => {
        if (a.startTime && b.startTime) {
          return a.startTime.localeCompare(b.startTime);
        }
        if (!a.startTime && !b.startTime) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.startTime ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      render: (text) => {
        return text || "";
      },
      align: "center",
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Başlama Saati",
    },
    {
      title: "Bitiş Tarihi",
      className: "center-aligned",
      dataIndex: "enddate",
      sorter: (a, b) => {
        if (a.enddate && b.enddate) {
          return a.enddate.localeCompare(b.enddate);
        }
        if (!a.enddate && !b.enddate) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.enddate ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      render: (text) => {
        return text || "";
      },
      align: "center",
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Bitiş Tarihi",
    },
    {
      title: "Bitiş Saati",
      className: "center-aligned",
      dataIndex: "endTime",
      sorter: (a, b) => {
        if (a.endTime && b.endTime) {
          return a.endTime.localeCompare(b.endTime);
        }
        if (!a.endTime && !b.endTime) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.endTime ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      render: (text) => {
        return text || "";
      },
      align: "center",
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Bitiş Saati",
    },
    {
      title: "İş Süresi (dk.)",
      className: "right-aligned",
      dataIndex: "jobTime",
      sorter: (a, b) => a.jobTime - b.jobTime,
      render: (text) => (
        <div
          style={{
            textAlign: "right",
          }}>
          {text}
        </div>
      ),
      width: 130, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "İş Süresi (dk.)",
    },
    {
      title: "Tamamlanma(%)",
      className: "right-aligned",
      dataIndex: "completion",
      sorter: (a, b) => a.completion - b.completion,
      render: (text) => (
        <div
          style={{
            textAlign: "right",
          }}>
          {text}
        </div>
      ),
      width: 150, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Tamamlama(%)",
    },
    {
      title: "Garanti",
      align: "center",
      className: "center-aligned",
      dataIndex: "warranty",
      sorter: (a, b) => (a.warranty === b.warranty ? 0 : a.warranty ? -1 : 1),
      render: (warranty) => (
        <Checkbox style={{ display: "flex", justifyContent: "center" }} checked={warranty} disabled={!warranty} />
      ),
      width: 80, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Garanti",
    },

    {
      title: "Makine Durumu",
      className: "center-aligned",
      dataIndex: "machineStatus",
      sorter: (a, b) => {
        if (a.machineStatus && b.machineStatus) {
          return a.machineStatus.localeCompare(b.machineStatus);
        }
        if (!a.machineStatus && !b.machineStatus) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.machineStatus ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: 140, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Makine Durumu",
    },
    {
      title: "Plaka",
      className: "center-aligned",
      dataIndex: "machinePlate",
      sorter: (a, b) => a.machinePlate - b.machinePlate,
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Plaka",
    },
    {
      title: "Makine Tipi",
      className: "left-aligned",
      dataIndex: "machineType",
      sorter: (a, b) => {
        if (a.machineType && b.machineType) {
          return a.machineType.localeCompare(b.machineType);
        }
        if (!a.machineType && !b.machineType) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.machineType ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Makine Tipi",
    },
    {
      title: "Ekipman",
      className: "center-aligned",
      dataIndex: "equipment",
      sorter: (a, b) => {
        if (a.equipment && b.equipment) {
          return a.equipment.localeCompare(b.equipment);
        }
        if (!a.equipment && !b.equipment) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.equipment ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: 300, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Ekipman",
    },
    {
      title: "İş Tipi",
      className: "center-aligned",
      dataIndex: "jobType",
      sorter: (a, b) => {
        if (a.jobType && b.jobType) {
          return a.jobType.localeCompare(b.jobType);
        }
        if (!a.jobType && !b.jobType) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.jobType ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: 120, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "İş Tipi",
    },
    {
      title: "İş Nedeni",
      className: "left-aligned",
      dataIndex: "jobReason",
      sorter: (a, b) => {
        if (a.jobReason && b.jobReason) {
          return a.jobReason.localeCompare(b.jobReason);
        }
        if (!a.jobReason && !b.jobReason) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.jobReason ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "300px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "İş Nedeni",
    },
    {
      title: "Atölye",
      className: "center-aligned",
      dataIndex: "workshop",
      sorter: (a, b) => {
        if (a.workshop && b.workshop) {
          return a.workshop.localeCompare(b.workshop);
        }
        if (!a.workshop && !b.workshop) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.workshop ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "100px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Atölye",
    },
    {
      title: "Talimat",
      className: "center-aligned",
      dataIndex: "instruction",
      sorter: (a, b) => {
        if (a.instruction && b.instruction) {
          return a.instruction.localeCompare(b.instruction);
        }
        if (!a.instruction && !b.instruction) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.instruction ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "100px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Talimat",
    },
    {
      title: "Öncelik",
      className: "center-aligned",
      dataIndex: "priority",
      sorter: (a, b) => {
        if (a.priority && b.priority) {
          return a.priority.localeCompare(b.priority);
        }
        if (!a.priority && !b.priority) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.priority ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Öncelik",
    },
    {
      title: (
        <div style={{ height: "40px" }}>
          Kapanış
          <br />
          Tarihi
        </div>
      ),
      className: "center-aligned",
      dataIndex: "closingDate",
      sorter: (a, b) => {
        if (a.closingDate && b.closingDate) {
          return a.closingDate.localeCompare(b.closingDate);
        }
        if (!a.closingDate && !b.closingDate) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.closingDate ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      render: (text) => {
        return text || "";
      },
      align: "center",
      width: "100px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Kapanış Tarihi",
    },
    {
      title: (
        <div style={{ height: "40px" }}>
          Kapanış
          <br />
          Saati
        </div>
      ),
      className: "center-aligned",
      dataIndex: "closingTime",
      sorter: (a, b) => {
        if (a.closingTime && b.closingTime) {
          return a.closingTime.localeCompare(b.closingTime);
        }
        if (!a.closingTime && !b.closingTime) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.closingTime ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      render: (text) => {
        return text || "";
      },
      align: "center",
      width: "90px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Kapanış Saati",
    },
    {
      title: "Takvim",
      className: "center-aligned",
      dataIndex: "calendar",
      sorter: (a, b) => {
        if (a.calendar && b.calendar) {
          return a.calendar.localeCompare(b.calendar);
        }
        if (!a.calendar && !b.calendar) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.calendar ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Takvim",
    },
    {
      title: (
        <div style={{ height: "40px" }}>
          Masraf
          <br />
          Merkezi
        </div>
      ),
      className: "center-aligned",
      dataIndex: "spending",
      sorter: (a, b) => {
        if (a.spending && b.spending) {
          return a.spending.localeCompare(b.spending);
        }
        if (!a.spending && !b.spending) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.spending ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Masraf Merkezi",
    },
    {
      title: "Firma",
      className: "center-aligned",
      dataIndex: "company",
      sorter: (a, b) => {
        if (a.company && b.company) {
          return a.company.localeCompare(b.company);
        }
        if (!a.company && !b.company) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.company ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Firma",
    },
    {
      title: (
        <div style={{ height: "40px" }}>
          İş Talep
          <br />
          Kodu
        </div>
      ),
      className: "center-aligned",
      dataIndex: "jobDemandCode",
      sorter: (a, b) => {
        if (a.jobDemandCode && b.jobDemandCode) {
          return a.jobDemandCode.localeCompare(b.jobDemandCode);
        }
        if (!a.jobDemandCode && !b.jobDemandCode) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.jobDemandCode ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "120px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "İş Talep Kodu",
    },
    {
      title: "İş Talep Eden",
      className: "center-aligned",
      dataIndex: "jobDemanding",
      sorter: (a, b) => {
        if (a.jobDemanding && b.jobDemanding) {
          return a.jobDemanding.localeCompare(b.jobDemanding);
        }
        if (!a.jobDemanding && !b.jobDemanding) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.jobDemanding ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "İş Talep Eden",
    },
    {
      title: (
        <div style={{ height: "40px" }}>
          İş Talep
          <br />
          Tarihi
        </div>
      ),
      className: "center-aligned",
      dataIndex: "jobDemandDate",
      sorter: (a, b) => {
        if (a.jobDemandDate && b.jobDemandDate) {
          return a.jobDemandDate.localeCompare(b.jobDemandDate);
        }
        if (!a.jobDemandDate && !b.jobDemandDate) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.jobDemandDate ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      render: (text) => {
        return text || "";
      },
      align: "center",
      width: "100px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "İş Talep Tarihi",
    },
    {
      title: "Özel Alan 1",
      className: "center-aligned",
      dataIndex: "temperature",
      sorter: (a, b) => {
        if (a.temperature && b.temperature) {
          return a.temperature.localeCompare(b.temperature);
        }
        if (!a.temperature && !b.temperature) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.temperature ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 1",
    },
    {
      title: "Özel Alan 2",
      className: "center-aligned",
      dataIndex: "weight",
      sorter: (a, b) => {
        if (a.weight && b.weight) {
          return a.weight.localeCompare(b.weight);
        }
        if (!a.weight && !b.weight) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.weight ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 2",
    },
    {
      title: "Özel Alan 3",
      className: "center-aligned",
      dataIndex: "invoiceStatus1",
      sorter: (a, b) => {
        if (a.invoiceStatus1 && b.invoiceStatus1) {
          return a.invoiceStatus1.localeCompare(b.invoiceStatus1);
        }
        if (!a.invoiceStatus1 && !b.invoiceStatus1) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.invoiceStatus1 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 3",
    },
    {
      title: "Özel Alan 4",
      className: "center-aligned",
      dataIndex: "specialArea4",
      sorter: (a, b) => {
        if (a.specialArea4 && b.specialArea4) {
          return a.specialArea4.localeCompare(b.specialArea4);
        }
        if (!a.specialArea4 && !b.specialArea4) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.specialArea4 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 4",
    },
    {
      title: "Özel Alan 5",
      className: "center-aligned",
      dataIndex: "specialArea5",
      sorter: (a, b) => {
        if (a.specialArea5 && b.specialArea5) {
          return a.specialArea5.localeCompare(b.specialArea5);
        }
        if (!a.specialArea5 && !b.specialArea5) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.specialArea5 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 5",
    },
    {
      title: "Özel Alan 6",
      className: "center-aligned",
      dataIndex: "specialArea6",
      sorter: (a, b) => {
        if (a.specialArea6 && b.specialArea6) {
          return a.specialArea6.localeCompare(b.specialArea6);
        }
        if (!a.specialArea6 && !b.specialArea6) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.specialArea6 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 6",
    },
    {
      title: "Özel Alan 7",
      className: "center-aligned",
      dataIndex: "specialArea7",
      sorter: (a, b) => {
        if (a.specialArea7 && b.specialArea7) {
          return a.specialArea7.localeCompare(b.specialArea7);
        }
        if (!a.specialArea7 && !b.specialArea7) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.specialArea7 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 7",
    },
    {
      title: "Özel Alan 8",
      className: "center-aligned",
      dataIndex: "specialArea8",
      sorter: (a, b) => {
        if (a.specialArea8 && b.specialArea8) {
          return a.specialArea8.localeCompare(b.specialArea8);
        }
        if (!a.specialArea8 && !b.specialArea8) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.specialArea8 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 8",
    },
    {
      title: "Özel Alan 9",
      className: "center-aligned",
      dataIndex: "specialArea9",
      sorter: (a, b) => {
        if (a.specialArea9 && b.specialArea9) {
          return a.specialArea9.localeCompare(b.specialArea9);
        }
        if (!a.specialArea9 && !b.specialArea9) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.specialArea9 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 9",
    },
    {
      title: "Özel Alan 10",
      className: "center-aligned",
      dataIndex: "specialArea10",
      sorter: (a, b) => {
        if (a.specialArea10 && b.specialArea10) {
          return a.specialArea10.localeCompare(b.specialArea10);
        }
        if (!a.specialArea10 && !b.specialArea10) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.specialArea10 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 10",
    },
    {
      title: "Özel Alan 11",
      className: "center-aligned",
      dataIndex: "invoiceStatus2",
      sorter: (a, b) => {
        if (a.invoiceStatus2 && b.invoiceStatus2) {
          return a.invoiceStatus2.localeCompare(b.invoiceStatus2);
        }
        if (!a.invoiceStatus2 && !b.invoiceStatus2) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.invoiceStatus2 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 11",
    },
    {
      title: "Özel Alan 12",
      className: "center-aligned",
      dataIndex: "specialArea12",
      sorter: (a, b) => {
        if (a.specialArea12 && b.specialArea12) {
          return a.specialArea12.localeCompare(b.specialArea12);
        }
        if (!a.specialArea12 && !b.specialArea12) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.specialArea12 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 12",
    },
    {
      title: "Özel Alan 13",
      className: "center-aligned",
      dataIndex: "specialArea13",
      sorter: (a, b) => {
        if (a.specialArea13 && b.specialArea13) {
          return a.specialArea13.localeCompare(b.specialArea13);
        }
        if (!a.specialArea13 && !b.specialArea13) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.specialArea13 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 13",
    },
    {
      title: "Özel Alan 14",
      className: "center-aligned",
      dataIndex: "specialArea14",
      sorter: (a, b) => {
        if (a.specialArea14 && b.specialArea14) {
          return a.specialArea14.localeCompare(b.specialArea14);
        }
        if (!a.specialArea14 && !b.specialArea14) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.specialArea14 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 14",
    },
    {
      title: "Özel Alan 15",
      className: "center-aligned",
      dataIndex: "specialArea15",
      sorter: (a, b) => {
        if (a.specialArea15 && b.specialArea15) {
          return a.specialArea15.localeCompare(b.specialArea15);
        }
        if (!a.specialArea15 && !b.specialArea15) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.specialArea15 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 15",
    },
    {
      title: "Özel Alan 16",
      dataIndex: "specialArea16",
      className: "center-aligned",
      modalTitle: "Özel Alan 16",
      sorter: (a, b) => {
        const aValue = a.specialArea16 ? a.specialArea16.toString() : "";
        const bValue = b.specialArea16 ? b.specialArea16.toString() : "";

        return aValue.localeCompare(bValue);
      },
      width: 200,
      render: (text) => (
        <div
          style={{
            textAlign: "right",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Özel Alan 17",
      dataIndex: "specialArea17",
      className: "center-aligned",
      modalTitle: "Özel Alan 17",
      sorter: (a, b) => {
        if (a.specialArea17 && b.specialArea17) {
          return a.specialArea17.localeCompare(b.specialArea17);
        }
        if (!a.specialArea17 && !b.specialArea17) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.specialArea17 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: 200,
      render: (text) => (
        <div
          style={{
            textAlign: "right",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Özel Alan 18",
      dataIndex: "specialArea18",
      className: "center-aligned",
      modalTitle: "Özel Alan 18",
      sorter: (a, b) => {
        if (a.specialArea18 && b.specialArea18) {
          return a.specialArea18.localeCompare(b.specialArea18);
        }
        if (!a.specialArea18 && !b.specialArea18) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.specialArea18 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: 200,
      render: (text) => (
        <div
          style={{
            textAlign: "right",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Özel Alan 19",
      dataIndex: "specialArea19",
      className: "center-aligned",
      modalTitle: "Özel Alan 19",
      sorter: (a, b) => {
        const aValue = a.specialArea19 ? a.specialArea19.toString() : "";
        const bValue = b.specialArea19 ? b.specialArea19.toString() : "";

        return aValue.localeCompare(bValue);
      },
      width: 200,
      render: (text) => (
        <div
          style={{
            textAlign: "right",
          }}>
          {text}
        </div>
      ),
    },

    {
      title: "Özel Alan 20",
      dataIndex: "specialArea20",
      className: "center-aligned",
      modalTitle: "Özel Alan 20",
      sorter: (a, b) => {
        const aValue = a.specialArea20 ? a.specialArea20.toString() : "";
        const bValue = b.specialArea20 ? b.specialArea20.toString() : "";

        return aValue.localeCompare(bValue);
      },
      width: 200,
      render: (text) => (
        <div
          style={{
            textAlign: "right",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Personel Adı",
      className: "left-aligned",
      dataIndex: "personelName",
      sorter: (a, b) => {
        const aValue = a.personelName ? a.personelName.toString() : "";
        const bValue = b.personelName ? b.personelName.toString() : "";

        return aValue.localeCompare(bValue);
      },
      width: "170px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Personel Adı",
    },
    {
      title: "Tam Lokasyon",
      className: "left-aligned",
      dataIndex: "fullLocation",
      sorter: (a, b) => {
        const aValue = a.fullLocation ? a.fullLocation.toString() : "";
        const bValue = b.fullLocation ? b.fullLocation.toString() : "";

        return aValue.localeCompare(bValue);
      },
      width: "600px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Tam Lokasyon",
    },
    {
      title: "Bildirilen Kat",
      className: "center-aligned",
      dataIndex: "reportedFloor",
      sorter: (a, b) => {
        const aValue = a.reportedFloor ? a.reportedFloor.toString() : "";
        const bValue = b.reportedFloor ? b.reportedFloor.toString() : "";

        return aValue.localeCompare(bValue);
      },
      render: (text) => (
        <div
          style={{
            textAlign: "right",
          }}>
          {text}
        </div>
      ),
      // sorter: (a, b) => a.reportedFloor.localeCompare(b.reportedFloor),
      width: "150px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Bildirilen Kat",
    },
    {
      title: "Bildirilen Bina",
      className: "center-aligned",
      dataIndex: "reportedBuilding",
      sorter: (a, b) => {
        const aValue = a.reportedBuilding ? a.reportedBuilding.toString() : "";
        const bValue = b.reportedBuilding ? b.reportedBuilding.toString() : "";

        return aValue.localeCompare(bValue);
      },
      render: (text) => (
        <div
          style={{
            textAlign: "right",
          }}>
          {text}
        </div>
      ),
      // sorter: (a, b) => a.reportedBuilding.localeCompare(b.reportedBuilding),
      width: "150px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Bildirilen Bina",
    },
    {
      title: (
        <div style={{ height: "40px" }}>
          Sayaç <br /> Değeri
        </div>
      ),
      className: "right-aligned",
      dataIndex: "currentCounterValue",
      sorter: (a, b) => {
        const aValue = a.currentCounterValue ? a.currentCounterValue.toString() : "";
        const bValue = b.currentCounterValue ? b.currentCounterValue.toString() : "";

        return aValue.localeCompare(bValue);
      },
      render: (text) => (
        <div
          style={{
            textAlign: "right",
          }}>
          {text}
        </div>
      ),
      width: "110px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Sayaç Değer",
    },
    {
      title: "Notlar",
      className: "center-aligned",
      dataIndex: "note",
      sorter: (a, b) => {
        const aValue = a.note ? a.note.toString() : "";
        const bValue = b.note ? b.note.toString() : "";

        return aValue.localeCompare(bValue);
      },
      // sorter: (a, b) => a.note.localeCompare(b.note),
      width: "300px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Notlar",
    },
  ];

  return columns;
}
