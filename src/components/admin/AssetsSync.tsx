import React, { useState } from 'react';

export default function AssetsSync({ lang }: { lang: 'zh'|'en' }) {
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string>('');

  const handleSync = async () => {
    if (!confirm(lang === 'zh' ? '确定开始从服务器的 resource/assets 同步文件到存储吗？' : 'Proceed to sync server-side resource/assets to storage?')) return;
    setRunning(true);
    setOutput('Starting sync...\n');
    try {
      const res = await fetch('/api/admin/sync-assets', { method: 'POST' });
      const j = await res.json();
      if (!res.ok) {
        setOutput((s) => s + 'Error: ' + (j.error || JSON.stringify(j)) + '\n');
      } else {
        setOutput((s) => s + `Completed. ${j.results?.length || 0} items processed.\n`);
        for (const r of j.results || []) {
          setOutput((s) => s + (r.ok ? `OK: ${r.key} -> ${r.url}\n` : `ERR: ${r.key} -> ${r.error}\n`));
        }
      }
    } catch (e: any) {
      setOutput((s) => s + 'Exception: ' + (e.message || String(e)) + '\n');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm">
      <h3 className="font-black mb-4">{lang === 'zh' ? '批量资源同步' : 'Bulk Assets Sync'}</h3>
      <p className="text-sm text-slate-600 mb-4">{lang === 'zh' ? '从后端服务器的 resource/assets 目录读取文件并上传到当前配置的存储后端（R2 或 本地）。' : 'Upload files from server-side resource/assets into the configured storage (R2 or local).'} </p>
      <div className="flex gap-3 mb-4">
        <button onClick={handleSync} disabled={running} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black">
          {running ? (lang === 'zh' ? '同步中...' : 'Syncing...') : (lang === 'zh' ? '开始同步' : 'Start Sync')}
        </button>
      </div>
      <pre className="whitespace-pre-wrap bg-slate-50 p-4 rounded-md text-xs h-64 overflow-auto">{output}</pre>
    </div>
  );
}
