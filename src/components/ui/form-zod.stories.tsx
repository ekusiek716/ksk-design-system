/**
 * @file react-hook-form + Zod 統合のサンプル
 * @description バリデーションスキーマを Zod で定義し、
 *              RhfFormField / FormMessage でエラーを自動表示するパターン。
 */
import type { Meta, StoryObj } from "@storybook/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "./button"
import { Input } from "./input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./form"

const meta = {
  title: "Components/Form/Zod Integration",
  tags: ["autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj

// ─── スキーマ定義 ───────────────────────────────────────────────
const registrationSchema = z.object({
  name: z.string().min(1, "お名前を入力してください").max(50, "50文字以内で入力してください"),
  email: z.string().min(1, "メールアドレスを入力してください").email("メールアドレスの形式が正しくありません"),
  age: z.coerce
    .number({ invalid_type_error: "数値を入力してください" })
    .min(18, "18歳以上のみ登録できます")
    .max(120, "正しい年齢を入力してください"),
  plan: z.enum(["free", "pro", "enterprise"], {
    required_error: "プランを選択してください",
  }),
})

type RegistrationForm = z.infer<typeof registrationSchema>

// ─── ストーリー ────────────────────────────────────────────────
export const WithZodValidation: Story = {
  name: "Zod バリデーション付きフォーム",
  render: () => {
    const form = useForm<RegistrationForm>({
      resolver: zodResolver(registrationSchema),
      defaultValues: { name: "", email: "", plan: undefined },
    })

    const onSubmit = (data: RegistrationForm) => {
      alert(JSON.stringify(data, null, 2))
    }

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 max-w-sm"
        >
          {/* お名前 */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>お名前</FormLabel>
                <FormControl>
                  <Input placeholder="山田 太郎" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* メール */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>メールアドレス</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@email.com" {...field} />
                </FormControl>
                <FormDescription>登録確認メールを送信します</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 年齢 */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>年齢</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="25"
                    endAdornment={<span className="typo-body-sm">歳</span>}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* プラン */}
          <FormField
            control={form.control}
            name="plan"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>プラン</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="プランを選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="free">Free — 無料</SelectItem>
                    <SelectItem value="pro">Pro — ¥1,980/月</SelectItem>
                    <SelectItem value="enterprise">Enterprise — 要問合せ</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">登録する</Button>
            <Button type="button" variant="secondary" onClick={() => form.reset()}>リセット</Button>
          </div>
        </form>
      </Form>
    )
  },
}
