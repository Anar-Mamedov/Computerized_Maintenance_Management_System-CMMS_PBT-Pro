import { FormProvider, useForm } from "react-hook-form";
import PlanlamaTakvimiCalendar from "./Takvim/PlanlamaTakvimiCalendar";
import Filters from "./Takvim/Filters";

const PlanlamaTakvimi = () => {
    const formMethods = useForm();

    return (
        <FormProvider {...formMethods}>
            <div>
                <Filters />
                <PlanlamaTakvimiCalendar />
            </div>
        </FormProvider>
    )
}

export default PlanlamaTakvimi
