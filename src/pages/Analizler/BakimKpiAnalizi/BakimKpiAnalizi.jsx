import React from "react";
import MainDashboard from "./MainDashboard.jsx";
import { FormProvider, useForm } from "react-hook-form";
import PropTypes from "prop-types";

export default function Dashboard({ embedded = false }) {
  const formMethods = useForm();
  return (
    <FormProvider {...formMethods}>
      <div>
        <MainDashboard embedded={embedded} />
      </div>
    </FormProvider>
  );
}

Dashboard.propTypes = {
  embedded: PropTypes.bool,
};
