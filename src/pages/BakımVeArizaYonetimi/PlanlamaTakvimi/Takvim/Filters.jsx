import {
    Typography,
    Button,
    Input,
    Checkbox,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
import LokasyonTablo from "./components/LokasyonTablo";
import AtolyeTablo from "./components/AtolyeTablo";
import MakineTablo from "./components/MakineTablo";
import BakimTipi from "./components/BakimTipi";
import BakimGrubu from "./components/BakimGrubu";
import { useCallback, useState } from "react";
import Filtereler from "./components/filter/Filters";

const { Text } = Typography;

const Filters = () => {
    const { control, watch, setValue } = useFormContext();
    const [currentPage, setCurrentPage] = useState(1);


    const handleLokasyonMinusClick = () => {
        setValue("lokasyonTanim", "");
        setValue("lokasyonID", "");
    };

    const [body, setBody] = useState({
        keyword: "",
        filters: {},
    });

    const handleBodyChange = useCallback((type, newBody) => {
        setBody((state) => ({
            ...state,
            [type]: newBody,
        }));
        setCurrentPage(1); // Filtreleme yapıldığında sayfa numarasını 1'e ayarla
    }, []);

    return (

        <div style={{
            display: "flex",
            marginBottom: "15px",
            flexWrap: "wrap",
            gap: "10px",
        }}>
            {/* lokasyon */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    width: "calc(100% / 3 -  2 * 10px / 3)",
                }}
            >
                {/* <Text style={{ fontSize: "14px" }}>Lokasyon:</Text> */}
                <div
                    className="anar"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        // minWidth: "300px",
                        gap: "3px",
                        width: "100%"
                    }}>
                    <Controller
                        name="lokasyonTanim"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="text" // Set the type to "text" for name input
                                style={{ width: "100%" }}
                                disabled
                                placeholder="Lokasyon"
                            />
                        )}
                    />
                    <Controller
                        name="lokasyonID"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="text" // Set the type to "text" for name input
                                style={{ display: "none" }}
                            />
                        )}
                    />
                    <LokasyonTablo
                        onSubmit={(selectedData) => {
                            setValue("lokasyonTanim", selectedData.LOK_TANIM);
                            setValue("lokasyonID", selectedData.key);
                        }}
                    />
                    <Button onClick={handleLokasyonMinusClick}> - </Button>
                </div>
            </div>

            {/* makine */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    width: "calc(100% / 3 -  2 * 10px / 3)",
                }}
            >
                {/* <Text style={{ fontSize: "14px" }}>Lokasyon:</Text> */}
                <div
                    className="anar"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        // minWidth: "300px",
                        gap: "3px",
                        width: "100%"
                    }}>
                    <Controller
                        name="makine"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="text" // Set the type to "text" for name input
                                style={{ width: "100%" }}
                                disabled
                                placeholder="Makine"
                            />
                        )}
                    />
                    <Controller
                        name="makineID"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="text" // Set the type to "text" for name input
                                style={{ display: "none" }}
                            />
                        )}
                    />
                    {/* deyismeli */}
                    <MakineTablo
                        onSubmit={(selectedData) => {
                            setValue("makine", selectedData.LOK_TANIM);
                            setValue("makineID", selectedData.key);
                        }}
                    />
                    <Button onClick={handleLokasyonMinusClick}> - </Button>
                </div>
            </div>

            {/* Diger Filtreler */}
            <Filtereler onChange={handleBodyChange}/>
        </div>


    )
}

export default Filters
