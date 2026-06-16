// 美容サロンの予約フォーム。
// 入力系 DS: FormField / Input / DatePicker / RadioGroup / ChipSelector / AutoGrowTextarea / Checkbox。
// バリデーション + 送信成功状態を useState で実装。SP1列 / PC は中央 max-width。
import { useState } from "react"
import { TickCircle } from "iconsax-reactjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/patterns/form-field"
import { DatePicker } from "@/components/ui/date-picker"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChipSelector } from "@/components/patterns/chip-selector"
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea"
import { Checkbox } from "@/components/ui/checkbox"

export const meta = {
  title: "予約フォーム：美容サロン",
  device: "SP/PC" as const,
  createdAt: "2026/06/16",
  description: "メニュー複数選択 / 日付 / 時間帯 / 連絡先 / 規約同意 + バリデーション + 送信完了。",
}

const menuOptions = [
  { label: "カット", value: "cut" },
  { label: "カラー", value: "color" },
  { label: "トリートメント", value: "treatment" },
  { label: "パーマ", value: "perm" },
  { label: "ヘッドスパ", value: "spa" },
]
const timeSlots = ["10:00", "12:00", "14:00", "16:00", "18:00"]

export default function SalonReservationForm() {
  const [menus, setMenus] = useState<string[]>([])
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState("")
  const [name, setName] = useState("")
  const [tel, setTel] = useState("")
  const [email, setEmail] = useState("")
  const [memo, setMemo] = useState("")
  const [agree, setAgree] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [done, setDone] = useState(false)

  const errors = {
    menus: menus.length === 0 ? "メニューを1つ以上選択してください" : "",
    date: !date ? "希望日を選択してください" : "",
    time: !time ? "時間帯を選択してください" : "",
    name: !name.trim() ? "お名前を入力してください" : "",
    tel: !tel.trim() ? "電話番号を入力してください" : "",
    email: !email.trim()
      ? "メールアドレスを入力してください"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "メールアドレスの形式が正しくありません"
        : "",
    agree: !agree ? "利用規約への同意が必要です" : "",
  }
  const hasError = Object.values(errors).some(Boolean)
  const err = (k: keyof typeof errors) => (submitted ? errors[k] : "")

  const handleSubmit = () => {
    setSubmitted(true)
    if (!hasError) setDone(true)
  }

  if (done) {
    return (
      <div className="@container min-h-dvh bg-[var(--Surface-Secondary)]">
        <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
          <TickCircle size={56} variant="Bold" className="text-[var(--Object-Success)]" />
          <h1 className="typo-heading-md text-[var(--Text-High-Emphasis)] mt-4">ご予約を受け付けました</h1>
          <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] mt-2">
            確認メールを {email} に送信しました。当日お会いできるのを楽しみにしております。
          </p>
          <Button variant="tertiary" className="mt-6" onClick={() => { setDone(false); setSubmitted(false) }}>
            フォームに戻る
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="@container min-h-dvh bg-[var(--Surface-Secondary)] pb-10">
      <div className="@xl:mx-auto @xl:max-w-xl @xl:py-8">
        <header className="bg-[var(--Surface-Primary)] px-5 pt-6 pb-4 @xl:rounded-t-2xl">
          <h1 className="typo-heading-md text-[var(--Text-High-Emphasis)]">ご予約フォーム</h1>
          <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-1">
            ご希望のメニュー・日時・連絡先をご入力ください。
          </p>
        </header>

        <div className="flex flex-col gap-5 bg-[var(--Surface-Primary)] px-5 py-6 @xl:rounded-b-2xl">
          <FormField label="メニュー（複数選択可）" required error={err("menus")}>
            <ChipSelector options={menuOptions} value={menus} onChange={setMenus} multiple size="md" />
          </FormField>

          <FormField label="希望日" required error={err("date")}>
            <DatePicker value={date} onChange={setDate} placeholder="日付を選択" />
          </FormField>

          <FormField label="時間帯" required error={err("time")}>
            <RadioGroup value={time} onValueChange={setTime} className="grid grid-cols-2 gap-2 @md:grid-cols-3">
              {timeSlots.map((t) => (
                <RadioGroupItem key={t} value={t}>{t}</RadioGroupItem>
              ))}
            </RadioGroup>
          </FormField>

          <FormField label="お名前" required error={err("name")} htmlFor="name">
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="山田 花子" />
          </FormField>

          <FormField label="電話番号" required error={err("tel")} htmlFor="tel">
            <Input id="tel" type="tel" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="09012345678" />
          </FormField>

          <FormField label="メールアドレス" required error={err("email")} htmlFor="email">
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" />
          </FormField>

          <FormField label="ご要望・備考" error="">
            <AutoGrowTextarea value={memo} onChange={setMemo} placeholder="髪の悩みやご希望のスタイルなど" maxLength={200} />
          </FormField>

          <div>
            <label className="flex items-start gap-2.5">
              <Checkbox checked={agree} onCheckedChange={(c) => setAgree(c === true)} />
              <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
                <span className="text-[var(--Text-Accent-Primary)]">利用規約・キャンセルポリシー</span>に同意します
              </span>
            </label>
            {err("agree") && (
              <p className="typo-body-xs text-[var(--Text-Caution)] mt-1">{err("agree")}</p>
            )}
          </div>

          {submitted && hasError && (
            <p className="typo-body-sm text-[var(--Text-Caution)]">未入力の項目があります。ご確認ください。</p>
          )}

          <Button variant="default" size="lg" className="w-full" haptic="medium" onClick={handleSubmit}>
            予約を確定する
          </Button>
        </div>
      </div>
    </div>
  )
}
