import { Controller } from "react-hook-form";
import { Input } from "antd";

const { TextArea } = Input;

const Aciklama = ({ control }) => {
  return (
    <Controller
      name="aciklama"
      control={control}
      render={({ field }) => (
        <TextArea
          {...field}
          rows={4}
          placeholder="Açıklama"
          style={{ width: "100%", minHeight: "160px" }}
        />
      )}
    />
  );
};

export default Aciklama;