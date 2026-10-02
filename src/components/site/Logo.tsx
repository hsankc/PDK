import { PawIcon } from "@/components/pets/PawIcon";

export function LogoMark({ logoUrl, className = "size-11" }: { logoUrl?: string; className?: string }) {
  if (logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logoUrl} alt="" className={`${className} shrink-0 rounded-full object-contain`} />;
  }
  return (
    <span
      className={`${className} border-ink bg-brand shadow-hard-sm grid shrink-0 place-items-center rounded-full border-2`}
    >
      <PawIcon className="fill-paper size-[60%]" />
    </span>
  );
}
