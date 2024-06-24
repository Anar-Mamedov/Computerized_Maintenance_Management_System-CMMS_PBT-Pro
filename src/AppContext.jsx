import React, { createContext, useContext, useState } from "react";

// Context'i oluştur
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // Yeni durum
  const [userData1, setUserData1] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  // Paylaşılacak değerler
  const value = {
    isModalVisible,
    setIsModalVisible,
    isLoading,
    setIsLoading,
    selectedOption, // Eklenen yeni durum
    setSelectedOption, // Yeni durumu güncelleyecek fonksiyon
    userData1,
    setUserData1,
    isButtonClicked,
    setIsButtonClicked,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
