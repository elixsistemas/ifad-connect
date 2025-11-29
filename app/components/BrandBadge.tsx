import Image from "next/image";

export function BrandBadge() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-white/5 p-2 rounded-full border border-amber-400/40">
        <Image
          src="/ifad-logo.png"
          alt="IFAD"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
          IFAD CONNECT
        </p>
        <p className="text-sm text-gray-300">
          Jornada de leitura e devoção
        </p>
      </div>
    </div>
  );
}
