'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Camera, FileText, Shield, CheckCircle } from 'lucide-react';

type SettingsState = {
  includePhoto: boolean;
  photoStyle: string;
  language: string;
  emailNotifications: boolean;
  publicProfile: boolean;
};

const defaultSettings: SettingsState = {
  includePhoto: true,
  photoStyle: 'professional',
  language: 'pt-BR',
  emailNotifications: true,
  publicProfile: true,
};

const PHOTO_STYLES = [
  { id: 'professional', label: 'LinkedIn Pro', desc: 'Fundo limpo, iluminação de estúdio' },
  { id: 'executive',   label: 'Executivo',    desc: 'Terno formal, expressão confiante' },
  { id: 'creative',    label: 'Criativo',     desc: 'Moderno, bokeh colorido' },
  { id: 'casual',      label: 'Casual Pro',   desc: 'Amigável, luz natural' },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${checked ? 'pitch-gradient' : 'bg-slate-200'}`}
    >
      <motion.div
        animate={{ x: checked ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
      />
    </button>
  );
}

function SectionHeader({ icon: Icon, iconClass, title, subtitle }: { icon: React.ElementType; iconClass: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 p-5 border-b border-slate-100">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconClass}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="font-bold text-slate-900 text-sm">{title}</p>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pitchfolio_settings');
      if (stored) setSettings({ ...defaultSettings, ...JSON.parse(stored) });
    } catch {}
  }, []);

  function update<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem('pitchfolio_settings', JSON.stringify(next)); } catch {}
      return next;
    });
    setSaved(false);
  }

  function save() {
    try { localStorage.setItem('pitchfolio_settings', JSON.stringify(settings)); } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
            <Settings className="w-4 h-4 text-slate-500" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-outfit">Configurações</h1>
        </div>
        <p className="text-slate-400 ml-[52px] text-sm">Personalize como seu portfólio é gerado e apresentado.</p>
      </motion.div>

      {/* Foto */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <SectionHeader icon={Camera} iconClass="bg-amber-50 text-amber-500" title="Foto Profissional" subtitle="Configurações de foto no currículo" />

        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <div>
            <p className="font-semibold text-slate-800 text-sm">Incluir foto no currículo</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {settings.includePhoto ? 'Sua foto aparece no topo do currículo' : 'Sem foto — foco total no conteúdo'}
            </p>
          </div>
          <Toggle checked={settings.includePhoto} onChange={v => update('includePhoto', v)} />
        </div>

        <motion.div
          animate={{ height: settings.includePhoto ? 'auto' : 0, opacity: settings.includePhoto ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="p-5">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Estilo padrão da foto</p>
            <div className="grid grid-cols-2 gap-2">
              {PHOTO_STYLES.map(s => (
                <button
                  key={s.id}
                  onClick={() => update('photoStyle', s.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    settings.photoStyle === s.id
                      ? 'border-cyan-400 bg-cyan-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <p className="font-bold text-sm text-slate-900">{s.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
                  {settings.photoStyle === s.id && (
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-500 mt-1.5" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Você pode alterar o estilo individualmente em{' '}
              <a href="/photo" className="text-cyan-600 hover:underline">Foto Profissional</a>.
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Currículo */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <SectionHeader icon={FileText} iconClass="bg-blue-50 text-blue-500" title="Portfólio" subtitle="Idioma e formato padrão" />

        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-800 text-sm">Idioma do conteúdo</p>
            <p className="text-xs text-slate-400 mt-0.5">Idioma gerado pela IA</p>
          </div>
          <select
            value={settings.language}
            onChange={e => update('language', e.target.value)}
            className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 outline-none focus:border-cyan-400 transition-colors"
          >
            <option value="pt-BR">Português (BR)</option>
            <option value="en-US">English (US)</option>
            <option value="es">Español</option>
          </select>
        </div>
      </motion.section>

      {/* Privacidade */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <SectionHeader icon={Shield} iconClass="bg-green-50 text-green-500" title="Privacidade" subtitle="Visibilidade do seu portfólio" />

        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <div>
            <p className="font-semibold text-slate-800 text-sm">Perfil público</p>
            <p className="text-xs text-slate-400 mt-0.5">Qualquer pessoa com o link pode visualizar</p>
          </div>
          <Toggle checked={settings.publicProfile} onChange={v => update('publicProfile', v)} />
        </div>

        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-800 text-sm">Notificações por e-mail</p>
            <p className="text-xs text-slate-400 mt-0.5">Alertas quando alguém visualiza seu portfólio</p>
          </div>
          <Toggle checked={settings.emailNotifications} onChange={v => update('emailNotifications', v)} />
        </div>
      </motion.section>

      {/* Save */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="flex items-center justify-between">
        <p className="text-xs text-slate-400">Preferências salvas automaticamente no seu navegador.</p>
        <motion.button
          onClick={save}
          whileTap={{ scale: 0.97 }}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            saved
              ? 'bg-green-50 border border-green-200 text-green-600'
              : 'pitch-gradient text-white shadow-md shadow-cyan-200 hover:opacity-90'
          }`}
        >
          {saved ? <><CheckCircle className="w-4 h-4" /> Salvo!</> : 'Salvar preferências'}
        </motion.button>
      </motion.div>
    </div>
  );
}
