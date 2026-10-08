import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CircleAlert, CircleCheck, FileUp, TriangleAlert, Info, X } from 'lucide-react';

// ─── Field wrapper ───────────────────────────────────────────────────────
export const Field: React.FC<{
  label: string;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  hint?: React.ReactNode;
  error?: string | null;
  right?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}> = ({ label, htmlFor, required, optional, hint, error, right, className, children }) => (
  <div className={`ee-field ${className ?? ''}`}>
    <label className="ee-label" htmlFor={htmlFor}>
      <span className="ee-label__text">
        {label}
        {required && <span className="ee-req" aria-hidden>*</span>}
        {optional && <span className="ee-optional">optional</span>}
      </span>
      {right}
    </label>
    {children}
    {error ? (
      <span className="ee-error" role="alert"><CircleAlert size={12} /> {error}</span>
    ) : hint ? (
      <span className="ee-hint">{hint}</span>
    ) : null}
  </div>
);

// ─── Code-style textarea with a terminal-like title bar ──────────────────
export const CodeArea: React.FC<{
  id: string;
  title: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  invalid?: boolean;
  disabled?: boolean;
  allowFileLoad?: boolean;
  onFileError?: (msg: string) => void;
}> = ({ id, title, value, onChange, placeholder, rows = 6, invalid, disabled, allowFileLoad, onFileError }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 100_000) {
      onFileError?.('File is larger than 100 KB.');
      return;
    }
    file.text().then(onChange).catch(() => onFileError?.('Could not read file.'));
  };

  // Allow Tab to insert spaces (handy for indented sample data).
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab' || e.shiftKey) return;
    e.preventDefault();
    const el = e.currentTarget;
    const { selectionStart: s, selectionEnd: end } = el;
    const next = value.slice(0, s) + '    ' + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 4; });
  };

  return (
    <div className={`ee-code-shell ${invalid ? 'ee-code-shell--invalid' : ''}`}>
      <div className="ee-code-shell__bar">
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span className="ee-code-shell__dots"><i /><i /><i /></span>
          {title}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
          <span className="ee-counter">{value.split('\n').length} ln · {value.length} ch</span>
          {allowFileLoad && !disabled && (
            <label className="ee-file-link" title="Load contents from a .txt / .in / .out file">
              <FileUp size={12} /> Load file
              <input type="file" accept=".txt,.in,.out,text/plain" hidden onChange={handleFile} />
            </label>
          )}
        </span>
      </div>
      <textarea
        id={id}
        className="ee-textarea ee-code"
        rows={rows}
        value={value}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        disabled={disabled}
        onKeyDown={onKeyDown}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};

// ─── Confirm dialog ──────────────────────────────────────────────────────
export interface ConfirmOptions {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  tone?: 'danger' | 'info';
  warnings?: string[];
}

export const useConfirm = () => {
  const [state, setState] = useState<(ConfirmOptions & { resolve: (ok: boolean) => void }) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) =>
    new Promise<boolean>(resolve => setState({ ...opts, resolve })), []);

  const close = (ok: boolean) => { state?.resolve(ok); setState(null); };

  const dialog = state ? (
    <div className="ee-backdrop" style={{ zIndex: 150 }} onMouseDown={e => e.target === e.currentTarget && close(false)}>
      <div className="ee-modal ee-modal--sm" role="alertdialog" aria-modal="true" aria-labelledby="ee-confirm-title">
        <div className="ee-confirm">
          <div className={`ee-confirm__icon ee-confirm__icon--${state.tone ?? 'info'}`}>
            {state.tone === 'danger' ? <TriangleAlert size={24} /> : <Info size={24} />}
          </div>
          <h3 id="ee-confirm-title" className="ee-confirm__title">{state.title}</h3>
          <div className="ee-confirm__text">{state.message}</div>
          {state.warnings && state.warnings.length > 0 && (
            <ul className="ee-confirm__list">
              {state.warnings.map(w => (
                <li key={w}><TriangleAlert size={13} style={{ flexShrink: 0, marginTop: 2 }} /> {w}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="ee-modal__foot" style={{ justifyContent: 'flex-end', background: 'transparent', borderTop: 'none', paddingBottom: 22 }}>
          <button id="ee-confirm-cancel" className="ee-btn ee-btn--ghost" onClick={() => close(false)}>Cancel</button>
          <button
            id="ee-confirm-ok"
            autoFocus
            className={`ee-btn ${state.tone === 'danger' ? 'ee-btn--danger' : 'ee-btn--publish'}`}
            onClick={() => close(true)}
          >
            {state.confirmLabel ?? 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, dialog };
};

// ─── Toasts ──────────────────────────────────────────────────────────────
type Toast = { id: number; kind: 'success' | 'error'; text: string };

export const useToasts = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);

  const push = useCallback((kind: Toast['kind'], text: string) => {
    const id = ++seq.current;
    setToasts(t => [...t, { id, kind, text }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), kind === 'error' ? 6000 : 3200);
  }, []);

  const node = (
    <div className="ee-toasts" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`ee-toast ee-toast--${t.kind}`}>
          {t.kind === 'success' ? <CircleCheck size={18} /> : <CircleAlert size={18} />}
          <span style={{ flex: 1 }}>{t.text}</span>
          <button
            aria-label="Dismiss"
            onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );

  return {
    success: useCallback((text: string) => push('success', text), [push]),
    error: useCallback((text: string) => push('error', text), [push]),
    node,
  };
};

// ─── Escape-to-close helper ──────────────────────────────────────────────
export const useEscape = (handler: () => void, active = true) => {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handler(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handler, active]);
};
