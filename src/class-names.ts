/**
 * Server-safe class-name generators.
 *
 * このエントリは **"use client" を持たない**ため Next.js App Router の
 * Server Component から直接 import できる。Button などコンポーネント本体は
 * React フックを含むため "use client" バンドルに入るが、その className
 * 生成関数 (`buttonVariants` 等) は純粋な cva 呼び出しなので、ここから
 * 提供する。
 *
 * 使い方:
 * ```tsx
 * // app/some-rsc/page.tsx — Server Component
 * import { buttonVariants } from "ksk-design-system/class-names"
 *
 * export default function Page() {
 *   return (
 *     <Link href="/" className={buttonVariants({ variant: "tertiary" })}>
 *       戻る
 *     </Link>
 *   )
 * }
 * ```
 *
 * 既存の `import { buttonVariants } from "ksk-design-system"` も引き続き
 * 動作するが、Server Component から呼ぶ場合はこちら経由が必須。
 */
export {
  buttonVariants,
  type ButtonVariantsProps,
} from "./lib/server-variants/button-variants"
