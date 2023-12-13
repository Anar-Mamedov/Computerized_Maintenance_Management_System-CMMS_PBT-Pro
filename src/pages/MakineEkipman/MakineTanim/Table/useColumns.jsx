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
      sorter: (a, b) => a.material.localeCompare(b.material),
      render: (material) => getMaterialIcon(material),
      width: "50px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Malzeme",
    },
    {
      title: "🤵‍♂️",
      className: "center-aligned",
      dataIndex: "personnel",
      sorter: (a, b) => a.personnel.localeCompare(b.personnel),
      render: (personnel) => getPersonnelIcon(personnel),
      width: "50px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Personel",
    },
    {
      title: "⏰",
      className: "center-aligned",
      dataIndex: "durus",
      sorter: (a, b) => a.durus.localeCompare(b.durus),
      render: (durus) => getDurusIcon(durus),
      width: "50px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Duruş",
    },
    {
      title: "Not",
      className: "center-aligned note",
      dataIndex: "not",
      sorter: (a, b) => a.not.localeCompare(b.not),
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
      sorter: (a, b) => a.number - b.number,
      filterMode: "tree",
      filterSearch: true,
      onFilter: ([min, max], record) => record.number >= min && record.number <= max,
      filters: [
        {
          text: "1-1000",
          value: [1, 1000],
        },
        {
          text: "1001-2000",
          value: [1001, 2000],
        },
      ],
      width: 120, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "İş Emri No",
    },

    {
      title: "Tarih",
      className: "center-aligned",
      dataIndex: "editDate",
      sorter: (a, b) => a.editDate.localeCompare(b.editDate),
      render: (text) => {
        const date = dayjs(text);
        return date.isValid() ? date.format("DD-MM-YYYY") : "";
      },

      width: 100, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Tarih",
    },
    {
      title: "Saat",
      className: "center-aligned",
      dataIndex: "editTime",
      sorter: (a, b) => a.editTime.localeCompare(b.editTime),
      render: (editTime) => {
        // Check if editTime is not null and is a valid time
        return editTime && dayjs(editTime, "HH:mm:ss").isValid()
          ? dayjs(editTime, "HH:mm:ss").format("HH:mm") // Format the time
          : null;
      },
      width: 70, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Saat",
    },
    {
      title: "Konu",
      className: "left-aligned",
      dataIndex: "subject",
      sorter: (a, b) => {
        const isANumber = !isNaN(a.subject);
        const isBNumber = !isNaN(b.subject);

        if (isANumber && isBNumber) {
          // Her ikisi de sayıysa, sayısal olarak karşılaştır
          return a.subject - b.subject;
        } else if (isANumber) {
          // Sadece a sayıysa, a'yı önce sırala
          return -1;
        } else if (isBNumber) {
          // Sadece b sayıysa, b'yi önce sırala
          return 1;
        } else {
          // Her ikisi de harf ise, alfabetik olarak sırala
          return a.subject.localeCompare(b.subject, "tr");
        }
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
      sorter: (a, b) => a.type.localeCompare(b.type),
      render: (_, { type }) => <Tag color={getColor(type)}>{type}</Tag>,
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "İş Emri Tipi",
    },
    {
      title: "Durum",
      className: "center-aligned",
      dataIndex: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      width: "190px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Durum",
    },
    {
      title: "Lokasyon",
      className: "center-aligned",
      dataIndex: "location",
      sorter: (a, b) => a.location.localeCompare(b.location),
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Lokasyon",
    },
    {
      title: "Makine Kodu",
      className: "center-aligned",
      dataIndex: "machine",
      sorter: (a, b) => a.machine.localeCompare(b.machine),
      width: 120, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Makine Kodu",
    },
    {
      title: "Makine Tanımı",
      className: "left-aligned",
      dataIndex: "machineDescription",
      sorter: (a, b) => a.machineDescription.localeCompare(b.machineDescription),
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
      sorter: (a, b) => new Date(a.plannedStartDate) - new Date(b.plannedStartDate),
      render: (text) => {
        const date = dayjs(text);
        return date.isValid() ? date.format("DD-MM-YYYY") : "";
      },

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
      sorter: (a, b) => new Date(a.plannedStartTime) - new Date(b.plannedStartTime),
      render: (editTime) => {
        // Check if editTime is not null and is a valid time
        return editTime && dayjs(editTime, "HH:mm:ss").isValid()
          ? dayjs(editTime, "HH:mm:ss").format("HH:mm") // Format the time
          : null;
      },
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
      sorter: (a, b) => new Date(a.plannedEndDate) - new Date(b.plannedEndDate),
      render: (text) => {
        const date = dayjs(text);
        return date.isValid() ? date.format("DD-MM-YYYY") : "";
      },
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
      sorter: (a, b) => new Date(a.plannedEndTime) - new Date(b.plannedEndTime),
      render: (editTime) => {
        // Check if editTime is not null and is a valid time
        return editTime && dayjs(editTime, "HH:mm:ss").isValid()
          ? dayjs(editTime, "HH:mm:ss").format("HH:mm") // Format the time
          : null;
      },
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
      sorter: (a, b) => new Date(a.startdate) - new Date(b.startdate),
      render: (text) => {
        const date = dayjs(text);
        return date.isValid() ? date.format("DD-MM-YYYY") : "";
      },
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Başlama Tarihi",
    },
    {
      title: "Başlama Saati",
      className: "center-aligned",
      dataIndex: "startTime",
      sorter: (a, b) => new Date(a.startTime) - new Date(b.startTime),
      render: (editTime) => {
        // Check if editTime is not null and is a valid time
        return editTime && dayjs(editTime, "HH:mm:ss").isValid()
          ? dayjs(editTime, "HH:mm:ss").format("HH:mm") // Format the time
          : null;
      },
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Başlama Saati",
    },
    {
      title: "Bitiş Tarihi",
      className: "center-aligned",
      dataIndex: "enddate",
      sorter: (a, b) => new Date(a.enddate) - new Date(b.enddate),
      render: (text) => {
        const date = dayjs(text);
        return date.isValid() ? date.format("DD-MM-YYYY") : "";
      },
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Bitiş Tarihi",
    },
    {
      title: "Bitiş Saati",
      className: "center-aligned",
      dataIndex: "endTime",
      sorter: (a, b) => new Date(a.endTime) - new Date(b.endTime),
      render: (editTime) => {
        // Check if editTime is not null and is a valid time
        return editTime && dayjs(editTime, "HH:mm:ss").isValid()
          ? dayjs(editTime, "HH:mm:ss").format("HH:mm") // Format the time
          : null;
      },
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Bitiş Saati",
    },
    {
      title: "İş Süresi (dk.)",
      className: "right-aligned",
      dataIndex: "jobTime",
      sorter: (a, b) => a.jobTime - b.jobTime,
      width: 130, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "İş Süresi (dk.)",
    },
    {
      title: "Tamamlanma(%)",
      className: "right-aligned",
      dataIndex: "completion",
      sorter: (a, b) => a.completion - b.completion,
      width: 150, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Tamamlama(%)",
    },
    {
      title: "Garanti",
      align: "center",
      className: "center-aligned",
      dataIndex: "warranty",
      render: (warranty) => <Checkbox checked={warranty} disabled={!warranty} />,
      width: 80, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Garanti",
    },

    {
      title: "Makine Durumu",
      className: "center-aligned",
      dataIndex: "machineStatus",
      sorter: (a, b) => a.machineStatus.localeCompare(b.machineStatus),
      width: 140, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Makine Durumu",
    },
    {
      title: "Plaka",
      className: "center-aligned",
      dataIndex: "machinePlate",
      sorter: (a, b) => a.machinePlate.localeCompare(b.machinePlate),
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Plaka",
    },
    {
      title: "Makine Tipi",
      className: "left-aligned",
      dataIndex: "machineType",
      sorter: (a, b) => a.machineType.localeCompare(b.machineType),
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Makine Tipi",
    },
    {
      title: "Ekipman",
      className: "center-aligned",
      dataIndex: "equipment",
      sorter: (a, b) => a.equipment.localeCompare(b.equipment),
      width: 300, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Ekipman",
    },
    {
      title: "İş Tipi",
      className: "center-aligned",
      dataIndex: "jobType",
      sorter: (a, b) => a.jobType.localeCompare(b.jobType),
      width: 120, // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "İş Tipi",
    },
    {
      title: "İş Nedeni",
      className: "left-aligned",
      dataIndex: "jobReason",
      sorter: (a, b) => a.jobReason.localeCompare(b.jobReason),
      width: "300px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "İş Nedeni",
    },
    {
      title: "Atölye",
      className: "center-aligned",
      dataIndex: "workshop",
      sorter: (a, b) => a.workshop.localeCompare(b.workshop),
      width: "100px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Atölye",
    },
    {
      title: "Talimat",
      className: "center-aligned",
      dataIndex: "instruction",
      sorter: (a, b) => a.instruction.localeCompare(b.instruction),
      width: "100px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Talimat",
    },
    {
      title: "Öncelik",
      className: "center-aligned",
      dataIndex: "priority",
      sorter: (a, b) => a.priority.localeCompare(b.priority),
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
      sorter: (a, b) => new Date(a.closingDate) - new Date(b.closingDate),
      render: (text) => {
        const date = dayjs(text);
        return date.isValid() ? date.format("DD-MM-YYYY") : "";
      },
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
      sorter: (a, b) => new Date(a.closingTime) - new Date(b.closingTime),
      render: (editTime) => {
        // Check if editTime is not null and is a valid time
        return editTime && dayjs(editTime, "HH:mm:ss").isValid()
          ? dayjs(editTime, "HH:mm:ss").format("HH:mm") // Format the time
          : null;
      },
      width: "70px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Kapanış Saati",
    },
    {
      title: "Takvim",
      className: "center-aligned",
      dataIndex: "calendar",
      sorter: (a, b) => a.calendar.localeCompare(b.calendar),
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
      sorter: (a, b) => a.spending.localeCompare(b.spending),
      width: "130px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Masraf Merkezi",
    },
    {
      title: "Firma",
      className: "center-aligned",
      dataIndex: "company",
      sorter: (a, b) => a.company.localeCompare(b.company),
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
      sorter: (a, b) => a.jobDemandCode.localeCompare(b.jobDemandCode),
      width: "120px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "İş Talep Kodu",
    },
    {
      title: "İş Talep Eden",
      className: "center-aligned",
      dataIndex: "jobDemanding",
      sorter: (a, b) => a.jobDemanding.localeCompare(b.jobDemanding),
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
      sorter: (a, b) => new Date(a.jobDemandDate) - new Date(b.jobDemandDate),
      render: (text) => {
        const date = dayjs(text);
        return date.isValid() ? date.format("DD-MM-YYYY") : "";
      },
      width: "100px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "İş Talep Tarihi",
    },
    {
      title: "Sıcaklık",
      className: "center-aligned",
      dataIndex: "temperature",
      sorter: (a, b) => a.temperature - b.temperature,
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Sıcaklık",
    },
    {
      title: "Ağırlık",
      className: "center-aligned",
      dataIndex: "weight",
      sorter: (a, b) => a.weight - b.weight,
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Ağırlık",
    },
    {
      title: "Fatura Durumu",
      className: "center-aligned",
      dataIndex: "invoiceStatus1",
      sorter: (a, b) => a.invoiceStatus1.localeCompare(b.invoiceStatus1),
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Fatura Durumu",
    },
    {
      title: "Özel Alan 4",
      className: "center-aligned",
      dataIndex: "specialArea4",
      sorter: (a, b) => a.specialArea4.localeCompare(b.specialArea4),
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 4",
    },
    {
      title: "Özel Alan 5",
      className: "center-aligned",
      dataIndex: "specialArea5",
      sorter: (a, b) => a.specialArea5.localeCompare(b.specialArea5),
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 5",
    },
    {
      title: "Özel Alan 6",
      className: "center-aligned",
      dataIndex: "specialArea6",
      sorter: (a, b) => a.specialArea6.localeCompare(b.specialArea6),
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 6",
    },
    {
      title: "Özel Alan 7",
      className: "center-aligned",
      dataIndex: "specialArea7",
      sorter: (a, b) => a.specialArea7.localeCompare(b.specialArea7),
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 7",
    },
    {
      title: "Özel Alan 8",
      className: "center-aligned",
      dataIndex: "specialArea8",
      sorter: (a, b) => a.specialArea8.localeCompare(b.specialArea8),
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 8",
    },
    {
      title: "Özel Alan 9",
      className: "center-aligned",
      dataIndex: "specialArea9",
      sorter: (a, b) => a.specialArea9.localeCompare(b.specialArea9),
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 9",
    },
    {
      title: "Özel Alan 10",
      className: "center-aligned",
      dataIndex: "specialArea10",
      sorter: (a, b) => a.specialArea10.localeCompare(b.specialArea10),
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 10",
    },
    {
      title: "Fatura Durumu",
      className: "center-aligned",
      dataIndex: "invoiceStatus2",
      sorter: (a, b) => a.invoiceStatus2.localeCompare(b.invoiceStatus2),
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Fatura Durumu",
    },
    {
      title: "Özel Alan 12",
      className: "center-aligned",
      dataIndex: "specialArea12",
      sorter: (a, b) => a.specialArea12.localeCompare(b.specialArea12),
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 12",
    },
    {
      title: "Özel Alan 13",
      className: "center-aligned",
      dataIndex: "specialArea13",
      sorter: (a, b) => a.specialArea13.localeCompare(b.specialArea13),
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 13",
    },
    {
      title: "Özel Alan 14",
      className: "center-aligned",
      dataIndex: "specialArea14",
      sorter: (a, b) => a.specialArea14.localeCompare(b.specialArea14),
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 14",
    },
    {
      title: "Özel Alan 15",
      className: "center-aligned",
      dataIndex: "specialArea15",
      sorter: (a, b) => a.specialArea15.localeCompare(b.specialArea15),
      width: "260px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Özel Alan 15",
    },
    {
      title: "Özel Alan 16",
      dataIndex: "specialArea16",
      className: "center-aligned",
      modalTitle: "Özel Alan 16",
      width: 200,
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
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
      width: 200,
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
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
      width: 200,
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
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
      width: 200,
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
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
      width: 200,
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Personel Adı",
      className: "left-aligned",
      dataIndex: "personelName",
      sorter: (a, b) => a.personelName.localeCompare(b.personelName),
      width: "170px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Personel Adı",
    },
    {
      title: "Tam Lokasyon",
      className: "left-aligned",
      dataIndex: "fullLocation",
      sorter: (a, b) => a.fullLocation.localeCompare(b.fullLocation),
      width: "600px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Tam Lokasyon",
    },
    {
      title: "Bildirilen Kat",
      className: "center-aligned",
      dataIndex: "reportedFloor",
      sorter: (a, b) => a.jobTime - b.jobTime,

      // sorter: (a, b) => a.reportedFloor.localeCompare(b.reportedFloor),
      width: "150px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Bildirilen Kat",
    },
    {
      title: "Bildirilen Bina",
      className: "center-aligned",
      dataIndex: "reportedBuilding",
      sorter: (a, b) => a.jobTime - b.jobTime,

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
      sorter: (a, b) => a.jobTime - b.jobTime,

      width: "110px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Sayaç Değer",
    },
    {
      title: "Notlar",
      className: "center-aligned",
      dataIndex: "note",
      // sorter: (a, b) => a.note.localeCompare(b.note),
      width: "300px", // Set the width to 'auto' for automatic adjustment
      ellipsis: true, // Enable ellipsis for overflowed content
      modalTitle: "Notlar",
    },
  ];

  return columns;
}
