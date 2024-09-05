import { useState, useEffect } from "react";
import { Input, AutoComplete } from "antd";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { selectedMenuItemState } from "../../../state/menuState";
import { SearchOutlined } from "@ant-design/icons";

const SearchComponent = () => {
  const [menuPaths, setMenuPaths] = useState([
    { path: "/", label: "Dashboard", key: "Dashboard" },
    { path: "/isEmri1", label: "İş Emirleri", key: "isEmri1" },
    { path: "/User", label: "Profil Ekranı", key: "User" },
    { path: "/periyodikBakimlar", label: "Periyodik Bakımlar", key: "periyodikBakimlar" },
    { path: "/otomatikIsEmirleri", label: "Otomatik İş Emirleri", key: "otomatikIsEmirleri" },
    { path: "/raporYonetimi", label: "Rapor Yönetimi", key: "raporYonetimi" },
    { path: "/analizler", label: "Analizler", key: "analizler" },
    { path: "/planlamaTakvimi", label: "Planlama Takvimi", key: "planlamaTakvimi" },
    { path: "/makine", label: "Makine Tanım", key: "makine" },
    { path: "/ekipmanVeritabani", label: "Ekipman Veritabanı", key: "ekipmanVeritabani" },
    { path: "/sayacGuncelleme", label: "Sayaç Güncelleme", key: "sayacGuncelleme" },
    { path: "/personelIzinleri", label: "Personel İzinleri", key: "personelIzinleri" },
    { path: "/personelNobetleri", label: "Personel Nöbetleri", key: "personelNobetleri" },
    { path: "/personelCalismaPLani", label: "Personel Çalışma Planı", key: "personelCalismaPLani" },
    { path: "/isTalebiKullanicilari", label: "İş Talebi Kullanıcıları", key: "isTalebiKullanicilari" },
    { path: "/formYonetimi", label: "Form Yönetimi", key: "formYonetimi" },
    { path: "/kodYonetimi", label: "Kod Yönetimi", key: "kodYonetimi" },
    { path: "/otomatikKodlar", label: "Otomatik Kodlar", key: "otomatikKodlar" },
    { path: "/servisOncelikSeviyeleri", label: "Servis Öncelik Seviyeleri", key: "servisOncelikSeviyeleri" },
    { path: "/isEmriTipleri", label: "İş Emri Tipleri", key: "isEmriTipleri" },
    { path: "/onaylayicilar", label: "Onaylayıcılar", key: "onaylayicilar" },
    { path: "/onayTanimlari", label: "Onay Tanımları", key: "onayTanimlari" },
    { path: "/rolTanimlari", label: "Rol Tanımları", key: "rolTanimlari" },
    { path: "/projeTanimlari", label: "Proje Tanımları", key: "projeTanimlari" },
    { path: "/lokasyon", label: "Lokasyon Tanımları", key: "lokasyon" },
    { path: "/vardiyalar", label: "Vardiya Tanımları", key: "vardiyalar" },
    { path: "/bakimTanimlari", label: "Bakım Tanımları", key: "bakimTanimlari" },
    { path: "/arizaTanimlari", label: "Arıza Tanımları", key: "arizaTanimlari" },
    { path: "/atolye", label: "Atölye Tanımları", key: "atolye" },
    { path: "/personeltanimlari", label: "Personel Tanımları", key: "personeltanimlari" },
    { path: "/isTalepleri", label: "İş Talepleri", key: "isTalepleri" },
    { path: "/demo", label: "Demo", key: "demo" },
    { path: "/userid", label: "User ID Control", key: "userid" },
    { path: "/mudaheleSuresi", label: "Müdahele Süresi", key: "mudaheleSuresi" },
  ]);

  const [options, setOptions] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // Search input state
  const navigate = useNavigate();
  const setSelectedMenuItem = useSetRecoilState(selectedMenuItemState);

  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem("login"));

    if (storedPermissions) {
      const filteredMenuPaths = menuPaths.filter((item) => storedPermissions[item.key] === true);
      setMenuPaths(filteredMenuPaths);
    }
  }, []);

  const handleSearch = (value) => {
    setSearchInput(value); // Update search input state
    if (value) {
      const filteredOptions = menuPaths
        .filter((item) => item.label.toLowerCase().includes(value.toLowerCase()))
        .map((item) => ({
          value: item.path,
          label: item.label,
        }));
      setOptions(filteredOptions);
    } else {
      setOptions([]);
    }
  };

  const handleSelect = (path, option) => {
    navigate(path);
    setSearchInput(option.label); // Set the search input to the selected label
    const selectedItem = menuPaths.find((item) => item.path === path);
    if (selectedItem) {
      setSelectedMenuItem(selectedItem.path.split("/")[1]);
    }
  };

  return (
    <AutoComplete
      options={options}
      style={{ width: 200 }}
      value={searchInput} // Bind the search input value to the input field
      onSelect={handleSelect}
      onSearch={handleSearch}
    >
      <Input placeholder="Menüde ara..." prefix={<SearchOutlined style={{ color: "#0091ff" }} />} />
    </AutoComplete>
  );
};

export default SearchComponent;
