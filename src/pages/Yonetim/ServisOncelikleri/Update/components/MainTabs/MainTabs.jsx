import React from "react";
import { Input, Typography, Tag, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const { Text } = Typography;

export default function MainTabs() {
  const { control, watch } = useFormContext();

  // Durum takibi için watch kullanıyoruz
  const aktif = watch("aktif");
  const varsayilan = watch("varsayilan");

  return (
    <div className="space-y-6 px-2 py-4">
      {/* Üst Grup: Öncelik Kodu ve Bayrak */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Öncelik Kodu</label>
          <Controller
            name="kod"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                readOnly
                className="mt-1 h-12 w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 text-base font-bold text-slate-600 shadow-sm"
              />
            )}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Bayrak (Emoji/Simge)</label>
          <Controller
            name="bayrak"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="mt-1 h-12 w-full rounded-xl border-2 border-slate-200 px-4 text-2xl text-center shadow-sm focus:border-sky-500"
                placeholder="Örn: 🔴"
              />
            )}
          />
        </div>
      </div>

      {/* Tanım - Tam Genişlik */}
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Öncelik Tanımı</label>
        <Controller
          name="tanim"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              className="mt-1 h-12 w-full rounded-xl border-2 border-slate-200 px-4 text-base font-semibold shadow-sm focus:border-sky-500"
              placeholder="Öncelik adını buraya yazın..."
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
  {/* Aktif Durum Kartı */}<div className="pr-4">
      <div className="text-sm font-bold text-slate-800">Aktif Durum</div>
    </div>
    <Controller
      name="aktif"
      control={control}
      render={({ field }) => (
        <Checkbox
          className="scale-150 mr-2" // Daha belirgin olması için biraz büyüttüm
          checked={field.value}
          onChange={(e) => field.onChange(e.target.checked)}
        />
      )}
    />

  {/* Varsayılan Kartı */}<div className="pr-4">
      <div className="text-sm font-bold text-slate-800">Varsayılan</div>
    </div>
    <Controller
      name="varsayilan"
      control={control}
      render={({ field }) => (
        <Checkbox
          className="scale-150 mr-2"
          checked={field.value}
          onChange={(e) => field.onChange(e.target.checked)}
        />
      )}
    />
  </div>

      {/* SLA Gelişmiş Süre Ayarları Paneli */}
      <div className="rounded-2xl border-2 border-slate-100 bg-slate-50/50 p-5 space-y-5 shadow-inner">
        
        {/* Çözüm Süresi */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Çözüm Süresi Ayarı</h4>
            <Controller
                name="cozum"
                control={control}
                render={({ field }) => <Tag color="blue" className="rounded-md font-bold px-3">{field.value}</Tag>}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input placeholder="Gün" className="h-10 rounded-lg border-slate-200 text-center font-bold" />
            <Input placeholder="Saat" className="h-10 rounded-lg border-slate-200 text-center font-bold" />
            <Input placeholder="Dakika" className="h-10 rounded-lg border-slate-200 text-center font-bold" />
          </div>
        </div>

        {/* Gecikme ve Kritik Seviyeler */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-amber-600 mb-2 uppercase">Gecikme Seviyesi</h4>
            <Controller
              name="gecikme"
              control={control}
              render={({ field }) => (
                <Input {...field} className="h-10 rounded-lg border-slate-200 font-bold text-center" />
              )}
            />
          </div>

          <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-rose-600 mb-2 uppercase">Kritik Seviye</h4>
            <Controller
              name="kritik"
              control={control}
              render={({ field }) => (
                <Input {...field} className="h-10 rounded-lg border-slate-200 font-bold text-center" />
              )}
            />
          </div>
        </div>

      </div>
    </div>
  );
}