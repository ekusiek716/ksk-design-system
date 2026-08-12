import * as React from "react"

interface InfoCircleIconProps extends React.ComponentProps<"svg"> {
  /** iconsax と同じ API。既定 24。 */
  size?: number | string
}

/**
 * 「i」の情報アイコン。
 *
 * **なぜ DS 自前なのか**: iconsax には "i" のグリフが 1 つも無い。`InfoCircle`
 * `Information` `Danger` `Warning2` はすべて **感嘆符「!」** を器（円 / 波形 /
 * 三角 / 六角）だけ変えて描いたもので、名前が Info でも絵は警告記号になる。
 * そのまま使うと Alert の info と warning が「!」同士になり、色と器の形しか
 * 差が無くなる（DS は色だけで意味を伝えない方針。rules.json の a11y 要件）。
 *
 * 形は iconsax の `InfoCircle` の座標をそのまま流用し、軸（8→13）と点（16）の
 * 上下を入れ替えただけ。円・線幅・線端は iconsax と同一なので、他のアイコンと
 * 並べても太さと比率が揃う。
 *
 * iconsax と同じ `size` prop を受けるので、呼び出し側は差し替えるだけで済む。
 */
function InfoCircleIcon({ size = 24, ...props }: InfoCircleIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      {/* 円 + 軸（iconsax InfoCircle の円をそのまま。軸だけ下側 11→16 へ） */}
      <path
        d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10ZM12 16v-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 点（iconsax は 16 に置いて「!」にしている。こちらは 8 に置いて「i」にする） */}
      <path
        d="M11.995 8h.009"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export { InfoCircleIcon }
export type { InfoCircleIconProps }
