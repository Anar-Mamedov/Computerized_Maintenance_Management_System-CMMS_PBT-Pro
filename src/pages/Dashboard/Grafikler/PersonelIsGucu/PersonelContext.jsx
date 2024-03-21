import { createContext, useContext, useState } from "react";

const PersonelContext = createContext()

export const PersonelProvider = ({ children }) => {
    const [personels, setPersonels] = useState([])
    const [checkedList, setCheckedList] = useState(personels);

    return (
        <PersonelContext.Provider value={{ personels, setPersonels, checkedList, setCheckedList }}>
            {children}
        </PersonelContext.Provider>
    )
}

export const usePersonel = () => {
    const context = useContext(PersonelContext);
    if (!context) {
        throw new Error('usePersonel must be used within a PersonelProvider');
    }
    return context;
};