import React, { useState } from 'react';
import { User, Calendar, Building2, FileBadge, Hash, Stethoscope, Edit3, Check, Sparkles } from 'lucide-react';

export function PatientDetailsCard({ patient, onUpdatePatient, t }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...patient });

  const handleSave = () => {
    onUpdatePatient(formData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-clinical-900 via-slate-900 to-clinical-900 p-5 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-clinical-500/20 border border-clinical-400/30 flex items-center justify-center text-clinical-300 shadow-inner">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-clinical-300">
                {t.patientDetailsTitle}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Verified Record
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5">
              {patient.name}
            </h2>
          </div>
        </div>

        <button
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setFormData({ ...patient });
              setIsEditing(true);
            }
          }}
          className="no-print inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
        >
          {isEditing ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Save Details</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5 text-slate-300" />
              <span>Edit Details</span>
            </>
          )}
        </button>
      </div>

      {/* Details Grid */}
      <div className="p-5 sm:p-6 bg-slate-50/50">
        {isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{t.patientName}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{t.patientAge}</label>
              <input
                type="text"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{t.patientGender}</label>
              <input
                type="text"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{t.patientId}</label>
              <input
                type="text"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{t.labName}</label>
              <input
                type="text"
                value={formData.labName}
                onChange={(e) => setFormData({ ...formData, labName: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{t.reportDate}</label>
              <input
                type="text"
                value={formData.reportDate}
                onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{t.testPanel}</label>
              <input
                type="text"
                value={formData.testPanel}
                onChange={(e) => setFormData({ ...formData, testPanel: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{t.referringDoctor}</label>
              <input
                type="text"
                value={formData.referringDoctor}
                onChange={(e) => setFormData({ ...formData, referringDoctor: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 font-semibold text-slate-800"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <div className="text-slate-400 flex items-center space-x-1.5 mb-1 font-semibold text-[11px] uppercase tracking-wider">
                <User className="w-3.5 h-3.5 text-clinical-600" />
                <span>{t.patientAge} & {t.patientGender}</span>
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {patient.age} • {patient.gender}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <div className="text-slate-400 flex items-center space-x-1.5 mb-1 font-semibold text-[11px] uppercase tracking-wider">
                <Hash className="w-3.5 h-3.5 text-clinical-600" />
                <span>{t.patientId}</span>
              </div>
              <div className="font-mono font-bold text-slate-900 text-sm truncate">
                {patient.patientId}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <div className="text-slate-400 flex items-center space-x-1.5 mb-1 font-semibold text-[11px] uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-clinical-600" />
                <span>{t.reportDate}</span>
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {patient.reportDate}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <div className="text-slate-400 flex items-center space-x-1.5 mb-1 font-semibold text-[11px] uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-clinical-600" />
                <span>{t.labName}</span>
              </div>
              <div className="font-bold text-slate-900 text-sm truncate" title={patient.labName}>
                {patient.labName}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 col-span-2">
              <div className="text-slate-400 flex items-center space-x-1.5 mb-1 font-semibold text-[11px] uppercase tracking-wider">
                <FileBadge className="w-3.5 h-3.5 text-clinical-600" />
                <span>{t.testPanel}</span>
              </div>
              <div className="font-bold text-slate-900 text-sm truncate" title={patient.testPanel}>
                {patient.testPanel}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 col-span-2">
              <div className="text-slate-400 flex items-center space-x-1.5 mb-1 font-semibold text-[11px] uppercase tracking-wider">
                <Stethoscope className="w-3.5 h-3.5 text-clinical-600" />
                <span>{t.referringDoctor}</span>
              </div>
              <div className="font-bold text-slate-900 text-sm truncate" title={patient.referringDoctor}>
                {patient.referringDoctor}
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
