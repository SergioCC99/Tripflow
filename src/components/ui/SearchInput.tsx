import type { InputHTMLAttributes } from 'react';
import searchIcon from '../../assets/icons/search.svg';

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>;

export function SearchInput(props: SearchInputProps) {
  return (
    <label className="flex w-full items-center gap-1 rounded-xl bg-surface-muted p-3">
      <img src={searchIcon} alt="" className="size-[22px] shrink-0" />
      <input
        type="search"
        placeholder="Buscar"
        className="w-full min-w-0 bg-transparent text-base text-ink placeholder:text-muted focus:outline-none"
        {...props}
      />
    </label>
  );
}
