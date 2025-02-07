import React, { useEffect, useState } from "react";
import { Typography, Input, Spin, message, Divider, Pagination, Tag, Button, Switch } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http.jsx";
import { t } from "i18next";

const { Text } = Typography;

function MenuVeEkranYetkileri() {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 10; // Items per page
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [permissions, setPermissions] = useState({});
  const [buttonsLoading, setButtonsLoading] = useState(false);

  const userID = watch("siraNo");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get(`GetSayfaYetki?TB_KULLANICI_ID=${userID}`);
      if (response && response.length > 0) {
        setPermissions(response[0]);
        setData(response);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in API request:", error);
      setLoading(false);
      if (navigator.onLine) {
        message.error("Hata Mesajı: " + error.message);
      } else {
        message.error("Internet Bağlantısı Mevcut Değil.");
      }
    }
  };

  useEffect(() => {
    if (userID) {
      fetchData();
    }
  }, [userID]);

  // Reset current page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter data based on search term
  const filteredPermissions = Object.entries(permissions).filter(([key]) => key.toLowerCase().includes(searchTerm.toLowerCase()));

  // Calculate items for current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPermissions = filteredPermissions.slice(indexOfFirstItem, indexOfLastItem);

  // Compute whether all permissions are granted or removed
  const allPermissionsGranted = Object.values(permissions).every((value) => value === true);
  const allPermissionsRemoved = Object.values(permissions).every((value) => value === false);

  const handleToggle = async (key, value) => {
    try {
      const updatedPermissions = {
        ...permissions,
        [key]: !value,
      };

      setPermissions(updatedPermissions);

      const response = await AxiosInstance.post(`UpdateSingleSayfaYetki?TB_KULLANICI_ID=${userID}&fieldName=${key}`);

      if (response) {
        message.success(t("izinBasariylaGuncellendi"));
      }
    } catch (error) {
      message.error(t("izinGuncellenirkenBirHataOlustu"));
      // Revert the change on error
      setPermissions(permissions);
    }
  };

  // Function to grant all permissions
  const handleGrantAllPermissions = async () => {
    try {
      setButtonsLoading(true);
      const updatedPermissions = { ...permissions };

      // Get only the keys that are currently false
      const keysToUpdate = Object.entries(permissions)
        .filter(([_, value]) => value === false)
        .map(([key]) => key);

      // Update only false permissions sequentially
      for (const key of keysToUpdate) {
        updatedPermissions[key] = true;
        await AxiosInstance.post(`UpdateSingleSayfaYetki?TB_KULLANICI_ID=${userID}&fieldName=${key}`);
      }

      setPermissions(updatedPermissions);
      if (keysToUpdate.length > 0) {
        message.success(t("tumIzinlerVerildi"));
      }
    } catch (error) {
      console.error(error);
      message.error(t("izinGuncellenirkenBirHataOlustu"));
      // Revert on error
      setPermissions(permissions);
    } finally {
      setButtonsLoading(false);
    }
  };

  // Function to remove all permissions
  const handleRemoveAllPermissions = async () => {
    try {
      setButtonsLoading(true);
      const updatedPermissions = { ...permissions };

      // Get only the keys that are currently true
      const keysToUpdate = Object.entries(permissions)
        .filter(([_, value]) => value === true)
        .map(([key]) => key);

      // Update only true permissions sequentially
      for (const key of keysToUpdate) {
        updatedPermissions[key] = false;
        await AxiosInstance.post(`UpdateSingleSayfaYetki?TB_KULLANICI_ID=${userID}&fieldName=${key}`);
      }

      setPermissions(updatedPermissions);
      if (keysToUpdate.length > 0) {
        message.success(t("tumIzinlerKaldirildi"));
      }
    } catch (error) {
      console.error(error);
      message.error(t("izinGuncellenirkenBirHataOlustu"));
      // Revert on error
      setPermissions(permissions);
    } finally {
      setButtonsLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div style={{ minHeight: "50px" }}>
          <Spin style={{ marginTop: "40px" }} />
        </div>
      ) : (
        <>
          {/* Search Input and Buttons */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", justifyContent: "space-between" }}>
            <Input placeholder={t("aramaYap")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: "200px" }} />
            <div>
              <Button
                color="primary"
                variant="solid"
                onClick={handleGrantAllPermissions}
                disabled={allPermissionsGranted || buttonsLoading}
                loading={buttonsLoading}
                style={{ marginLeft: "10px" }}
              >
                {t("tumIzinleriVer")}
              </Button>
              <Button
                color="danger"
                variant="solid"
                onClick={handleRemoveAllPermissions}
                disabled={allPermissionsRemoved || buttonsLoading}
                loading={buttonsLoading}
                style={{ marginLeft: "10px" }}
              >
                {t("tumIzinleriKaldir")}
              </Button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {currentPermissions.map(([key, value]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t(key)}</Text>
                <Switch checked={value} onChange={() => handleToggle(key, value)} />
              </div>
            ))}
          </div>
          <Pagination
            current={currentPage}
            align="end"
            total={filteredPermissions.length}
            pageSize={itemsPerPage}
            onChange={(page) => setCurrentPage(page)}
            style={{ marginTop: "20px" }}
          />
        </>
      )}
    </div>
  );
}

export default MenuVeEkranYetkileri;
