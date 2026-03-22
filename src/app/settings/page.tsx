'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Camera, FileText, Palette, Bell, Shield, ChevronRight, CheckCircle } from 'lucide-react';

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
  { id: 'executive', label: 'Executivo', desc: 'Terno formal, expressão confiante' },
  { id: 'creative', label: 'Criativo', desc: 'Moderno, bokeh colorido' },
  { id: 'casual', label: 'Casual Pro', desc: 'Amigável, luz natural' },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-purple-600' : 'bg-white/10'}`}
    >
      <motion.div
        animate={{ x: checked ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
      />
    </button>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('elite_cv_settings');
      if (stored) setSettings({ ...defaultSettings, ...JSON.parse(stored) });
    } catch {}
  }, []);

  function update<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem('elite_cv_settings', JSON.stringify(next)); } catch {}
      return next;
    });
    setSaved(false);
  }

  function save() {
    try { localStorage.setItem('elite_cv_settings', JSON.stringify(settings)); } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-zinc-300" />
          </div>
          <h1 className="text-2xl font-black text-white">Configurações</h1>
        </div>
        <p className="text-zinc-500 ml-[52px] text-sm">Personalize como seu currículo é gerado e apresentado.</p>
      </motion.div>

      {/* SECTION: Foto Profissional */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-zinc-900/50 border border-white/5 overflow-hidden"
      >
        <div className="flex items-center gap-3 p-5 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
            <Camera className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Foto Profissional</p>
            <p className="text-xs text-zinc-500">Configurações de foto no currículo</p>
          </div>
        </div>

        {/* Toggle principal */}
        <div className="p-5 flex items-center justify-between border-b border-white/5">
          <div>
            <p className="font-semibold text-white text-sm">Incluir foto no currículo</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {settings.includePhoto
                ? 'Sua foto profissional aparece no topo do currículo'
                : 'Currículo sem foto — foco total no conteúdo'}
            </p>
          </div>
          <Toggle checked={settings.includePhoto} onChange={v => update('includePhoto', v)} />
        </div>

        {/* Estilo da foto — só aparece se includePhoto = true */}
        <motion.div
          animate={{ height: settings.includePhoto ? 'auto' : 0, opacity: settings.includePhoto ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="p-5">
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">Estilo padrão da foto</p>
            <div className="grid grid-cols-2 gap-2">
              {PHOTO_STYLES.map(s => (
                <button
                  key={s.id}
                  onClick={() => update('photoStyle', s.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    settings.photoStyle === s.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/8 bg-white/3 hover:border-white/15'
                  }`}
                >
                  <p className="font-bold text-sm text-white">{s.label}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{s.desc}</p>
                  {settings.photoStyle === s.id && (
                    <CheckCircle className="w-3.5 h-3.5 text-purple-400 mt-1.5" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-600 mt-3">
              Você pode alterar o estilo individualmente ao gerar cada foto em{' '}
              <a href="/photo" className="text-amber-400 hover:underline">Foto Profissional</a>.
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* SECTION: Currículo */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-zinc-900/50 border border-white/5 overflow-hidden"
      >
        <div className="flex items-center gap-3 p-5 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Currículo</p>
            <p className="text-xs text-zinc-500">Idioma e formato padrão</p>
          </div>
        </div>

        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-white text-sm">Idioma do conteúdo</p>
            <p className="text-xs text-zinc-500 mt-0.5">Idioma gerado pela IA</p>
          </div>
          <select
            value={settings.language}
            onChange={e => update('language', e.target.value)}
            className="bg-zinc-800 border border-white/10 text-white text-sm rounded-xl px-3 py-2 outline-none focus:border-purple-500 transition-colors"
          >
            <option value="pt-BR">Português (BR)</option>
            <option value="en-US">English (US)</option>
            <option value="es">Español</option>
          </select>
        </div>
      </motion.section>

      {/* SECTION: Privacidade */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-zinc-900/50 border border-white/5 overflow-hidden"
      >
        <div className="flex items-center gap-3 p-5 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Privacidade</p>
            <p className="text-xs text-zinc-500">Visibilidade do seu currículo</p>
          </div>
        </div>

        <div className="p-5 flex items-center justify-between border-b border-white/5">
          <div>
            <p className="font-semibold text-white text-sm">Perfil público</p>
            <p className="text-xs text-zinc-500 mt-0.5">Qualquer pessoa com o link pode visualizar</p>
          </div>
          <Toggle checked={settings.publicProfile} onChange={v => update('publicProfile', v)} />
        </div>

        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-white text-sm">Notificações por e-mail</p>
            <p className="text-xs text-zinc-500 mt-0.5">Alertas quando alguém visualiza seu currículo</p>
          </div>
          <Toggle checked={settings.emailNotifications} onChange={v => update('emailNotifications', v)} />
        </div>
      </motion.section>

      {/* Save button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between"
      >
        <p className="text-xs text-zinc-600">As preferências são salvas automaticamente no seu navegador.</p>
        <motion.button
          onClick={save}
          whileTap={{ scale: 0.97 }}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
            saved
              ? 'bg-green-500/20 border border-green-500/30 text-green-400'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {saved ? (
            <><CheckCircle className="w-4 h-4" /> Salvo!</>
          ) : (
            'Salvar preferências'
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
