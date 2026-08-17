import { useRef } from 'react';
import { Button } from './Button';

export function PhotoUploadField({ label = 'Foto de portada (Opcional)', value, onChange }) {
  const inputRef = useRef(null);

  const openPicker = () => inputRef.current?.click();

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex w-full flex-col items-start gap-1">
      <span className="text-base text-ink">{label}</span>

      <div className="relative h-[120px] w-full overflow-hidden rounded-xl">
        {value ? (
          <>
            <img src={value} alt="" className="absolute inset-0 size-full object-cover" />
            <div className="absolute right-3 bottom-3 flex gap-2">
              <Button variant="white" size="sm" onClick={openPicker}>
                Cambiar
              </Button>
              <Button variant="solid" size="sm" onClick={handleRemove}>
                Quitar
              </Button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={openPicker}
            className="flex size-full flex-col items-center justify-center gap-1 border border-dashed border-ink-secondary bg-surface-muted p-3 text-center text-muted transition-transform duration-150 active:scale-[0.98]"
          >
            <span className="text-base">Adjunta una foto</span>
            <span className="text-xs">Si no eliges se agregará una por defecto</span>
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
}
