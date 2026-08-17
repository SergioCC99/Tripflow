import { Avatar } from '../ui/Avatar';
import logoArrow1 from '../../assets/icons/logo-arrow-1.svg';
import logoArrow2 from '../../assets/icons/logo-arrow-2.svg';

export function AppHeader({ userName, actions }) {
  return (
    <header className="relative overflow-hidden bg-brand">
      <div
        aria-hidden
        className="absolute top-1/2 left-[-20px] h-[84px] w-[108px] -translate-y-1/2 opacity-20 lg:left-[-24px] lg:h-[91px] lg:w-[116px]"
      >
        <img src={logoArrow1} alt="" className="absolute top-0 left-[18.09%] h-[94.33%] w-[81.91%]" />
        <img src={logoArrow2} alt="" className="absolute top-[29.95%] right-[39.18%] h-[70.05%] w-[60.82%]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1200px] items-center gap-4 p-4 lg:px-6 lg:py-6">
        <div className="flex flex-1 items-center gap-4">
          <Avatar name={userName} className="size-14 lg:size-[59px]" />
          <div className="flex flex-1 flex-col gap-1 text-ink">
            <h1 className="text-2xl font-bold">¡Hola, {userName}!</h1>
            <p className="text-sm lg:text-base">Bienvenida a Tripflow</p>
          </div>
        </div>

        {actions && <div className="hidden shrink-0 lg:block">{actions}</div>}
      </div>
    </header>
  );
}
