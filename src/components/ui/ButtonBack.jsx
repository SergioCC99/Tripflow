import arrowLeftIcon from '../../assets/icons/arrow-left.svg';

export function ButtonBack({ label = 'Volver', ...props }) {
  return (
    <button
      type="button"
      className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full px-1 py-3 text-ink hover:opacity-70"
      {...props}
    >
      <img src={arrowLeftIcon} alt="" className="h-[19px] w-[11px]" />
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}
