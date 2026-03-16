import React from "react";
import { Input, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const { TextArea } = Input;

export default function MainTabs() {
  const { control, watch } = useFormContext();

  // Durum takibi
  const otomatikKod = watch("otomatikKod");

  return (
    <div className="space-y-8 px-4 py-6">
      {/* Tanım - Tam Genişlik ve Belirgin */}
      <div>
        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest ml-1">
          Genel Tanım
        </label>
        <Controller
          name="tanim"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              readOnly
              className="mt-2 w-full cursor-not-allowed rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold text-slate-600 shadow-sm"
            />
          )}
        />
      </div>

      {/* Üçlü Grid - Daha Büyük Inputlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="text-sm font-bold text-slate-700 uppercase tracking-widest ml-1">Ön Ek</label>
          <Controller
            name="onEk"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                placeholder="Örn: MKN"
                className="mt-2 w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-lg font-mono font-bold text-amber-600 focus:border-amber-500 shadow-sm"
              />
            )}
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700 uppercase tracking-widest ml-1">Sıra No</label>
          <Controller
            name="siraNo"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                disabled={!otomatikKod}
                className="mt-2 w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-lg font-bold disabled:bg-slate-100 shadow-sm"
              />
            )}
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700 uppercase tracking-widest ml-1">Basamak</label>
          <Controller
            name="basamak"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                min={1}
                className="mt-2 w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-lg font-bold shadow-sm"
              />
            )}
          />
        </div>
      </div>

      {/* Switch Paneli - Daha Geniş ve Belirgin Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Otomatik Kod Kartı */}
        <div className={`flex items-center justify-between rounded-2xl p-5 border-2 transition-all duration-300 shadow-md ${otomatikKod ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-white'}`}>
          <div className="pr-4">
            <div className="text-base font-bold text-slate-800">Otomatik Kod Sistemi</div>
            <div className="text-sm text-slate-500 mt-1 font-medium">Sistem sonraki numarayı otomatik atar.</div>
          </div>
          <Controller
            name="otomatikKod"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange(!field.value)}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${field.value ? "bg-emerald-500" : "bg-slate-300"}`}
              >
                <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ${field.value ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            )}
          />
        </div>

        {/* Kilitli Kartı */}
        <Controller
          name="kilitli"
          control={control}
          render={({ field }) => (
            <div className={`flex items-center justify-between rounded-2xl p-5 border-2 transition-all duration-300 shadow-md ${field.value ? 'border-amber-500 bg-amber-50/30' : 'border-slate-200 bg-white'}`}>
              <div className="pr-4">
                <div className="text-base font-bold text-slate-800">Kayıt Kilidi</div>
                <div className="text-sm text-slate-500 mt-1 font-medium">Bu kuralı düzenlemeye kapatır.</div>
              </div>
              <button
                type="button"
                onClick={() => field.onChange(!field.value)}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${field.value ? "bg-amber-500" : "bg-slate-300"}`}
              >
                <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ${field.value ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>
          )}
        />
      </div>

      {/* Açıklama - Geniş Metin Alanı */}
      <div>
        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest ml-1">Kural Açıklaması</label>
        <Controller
          name="aciklama"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              rows={5}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-amber-500 shadow-sm"
              placeholder="Sistem yöneticileri için notlar..."
            />
          )}
        />
      </div>
    </div>
  );
}