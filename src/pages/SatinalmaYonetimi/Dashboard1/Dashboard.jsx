import React from "react";
import MainDashboard from "./MainDashboard.jsx";
import { FormProvider, useForm } from "react-hook-form";
import PropTypes from "prop-types";

export default function Dashboard({ embedded = false, toolbarContainerId }) {
  const formMethods = useForm();
  return (
    <FormProvider {...formMethods}>
      <div>
        <MainDashboard embedded={embedded} toolbarContainerId={toolbarContainerId} />
      </div>
    </FormProvider>
  );
}

Dashboard.propTypes = {
  embedded: PropTypes.bool,
  toolbarContainerId: PropTypes.string,
};
