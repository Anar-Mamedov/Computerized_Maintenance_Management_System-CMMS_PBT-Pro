import { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Table } from "antd";
import AxiosInstance from "../../../../../../../api/http";
// import dayjs from "dayjs";

export default function FirmaTablo({ workshopSelectedId, onSubmit }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(0); 
  const [changeSource, setChangeSource] = useState(null);

  const columns = [
    {
      title: "Firma Kodu",
      dataIndex: "code",
      key: "code",
      width: "150px",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Firma Ünvanı",
      dataIndex: "subject",
      key: "subject",
      width: "350px",

      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Firma Tipi",
      dataIndex: "workdays",
      key: "workdays",
      width: "150px",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Lokasyon",
      dataIndex: "description",
      key: "description",
      width: "150px",

      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Şehir",
      dataIndex: "fifthcolumn",
      key: "fifthcolumn",
      width: "150px",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetFirmaList?userId=24&pagingDeger=${currentPage}&search=${searchValue}`)
      .then((response) => {
        // sayfalama için
        // Set the total pages based on the pageSize from the API response
        setPageSize(response.pageSize);

        // sayfalama için son

        const fetchedData = response.Firma_Liste.map((item) => {
          return {
            key: item.TB_CARI_ID,
            code: item.CAR_KOD,
            subject: item.CAR_TANIM,
            workdays: item.CAR_TIP,
            description: item.CAR_LOKASYON,
            fifthcolumn: item.CAR_SEHIR,
          };
        });
        setData(fetchedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [searchValue, currentPage]); 

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
  };

  useEffect(() => {
    if (isModalVisible) {
      fetch(); 
    } else {
      setSearchValue("");
      setCurrentPage(1); 
      setSelectedRowKeys([]);
    }
  }, [isModalVisible]); 

  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  useEffect(() => {
    if (changeSource === "searchValue") {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      const timeout = setTimeout(() => {
        fetch();
        setChangeSource(null);
      }, 2000); 
      setSearchTimeout(timeout); 

      return () => {
        clearTimeout(timeout);
      };
    } else if (changeSource === "currentPage") {
      fetch();
      setChangeSource(null); 
    }
  }, [searchValue, currentPage, fetch]); 

  return (
    <div>
      <Button onClick={handleModalToggle}> + </Button>
      <Modal
        width="1200px"
        centered
        title="Firma Tanımları"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}>
        <Input
          placeholder="Ara..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setCurrentPage(1);
            setChangeSource("searchValue");
          }}
          style={{ marginBottom: "20px", width: "250px" }}
        />

        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          scroll={{
            // x: "auto",
            y: "100vh",
          }}
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            position: ["bottomRight"],
            current: currentPage,
            total: pageSize * 10,
            onChange: (page) => {
              setCurrentPage(page);
              setChangeSource("currentPage");
            },
          }}
        />
      </Modal>
    </div>
  );
}
