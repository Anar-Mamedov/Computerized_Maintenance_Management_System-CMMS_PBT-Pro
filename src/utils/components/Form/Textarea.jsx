import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import TextArea from "antd/es/input/TextArea";

const Textarea = ({ name, checked, styles }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <TextArea {...field} disabled={checked} onChange={(e) => field.onChange(e.target.value)} style={{ ...styles }} />}
    />
  );
};

Textarea.propTypes = {
  name: PropTypes.string,
  checked: PropTypes.bool,
  styles: PropTypes.object,
};

export default Textarea;
