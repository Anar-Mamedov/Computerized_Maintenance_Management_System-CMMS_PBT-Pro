import React from "react";
import PropTypes from "prop-types";
import MainTable from "./Table/Table";
import { FormProvider, useForm } from "react-hook-form";

export default function PersonelTanimlari({ hatirlaticiGrupId, hatirlaticiSiraId }) {
  const formMethods = useForm();
  return (
    <FormProvider {...formMethods}>
      <div>
        <MainTable hatirlaticiGrupId={hatirlaticiGrupId} hatirlaticiSiraId={hatirlaticiSiraId} />
      </div>
    </FormProvider>
  );
}

PersonelTanimlari.propTypes = {
  hatirlaticiGrupId: PropTypes.number,
  hatirlaticiSiraId: PropTypes.number,
};
