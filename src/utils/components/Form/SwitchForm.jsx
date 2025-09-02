import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import { Switch } from "antd";

const SwitchForm = ({ name, checked }) => {
  const { control } = useFormContext();

  return (
    <Controller name={name} control={control} render={({ field }) => <Switch {...field} disabled={checked} checked={field.value} onChange={(value) => field.onChange(value)} />} />
  );
};

SwitchForm.propTypes = {
  name: PropTypes.string,
  checked: PropTypes.bool,
};

export default SwitchForm;
