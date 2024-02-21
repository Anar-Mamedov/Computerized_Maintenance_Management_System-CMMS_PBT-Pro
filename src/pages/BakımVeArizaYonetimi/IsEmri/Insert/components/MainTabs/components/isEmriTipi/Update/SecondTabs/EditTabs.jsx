import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

export default function EditTabs() {
  const { setValue } = useFormContext();

  return (
    <div>
      <Controller name="secilenID" render={({ field }) => <input {...field} />} />
    </div>
  );
}
