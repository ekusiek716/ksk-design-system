import type { Meta, StoryObj } from "@storybook/react"
import { useForm } from "react-hook-form"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { Button } from "./button"
import { Input } from "./input"
import { Textarea } from "./textarea"
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
  title: "Components/Form",
  tags: ["autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj

export const BasicForm: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        name: "",
        email: "",
        message: "",
      },
    })

    const onSubmit = (data: unknown) => {
      alert(JSON.stringify(data, null, 2))
    }

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 max-w-sm"
        >
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "お名前を入力してください" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>お名前</FormLabel>
                <FormControl>
                  <Input placeholder="山田 太郎" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "メールアドレスを入力してください",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "メールアドレスの形式が正しくありません",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@email.com" {...field} />
                </FormControl>
                <FormDescription>注文確認メールを送信します</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メッセージ（任意）</FormLabel>
                <FormControl>
                  <Textarea placeholder="ご要望があればご記入ください" rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">送信する</Button>
        </form>
      </Form>
    )
  },
}

export const WithSelect: Story = {
  render: () => {
    const form = useForm({
      defaultValues: { size: "", flavor: "" },
    })

    return (
      <Form {...form}>
        <form className="flex flex-col gap-6 max-w-sm">
          <FormField
            control={form.control}
            name="size"
            rules={{ required: "サイズを選択してください" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>サイズ</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="サイズを選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="s">S</SelectItem>
                    <SelectItem value="m">M</SelectItem>
                    <SelectItem value="l">L</SelectItem>
                    <SelectItem value="xl">XL</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    )
  },
}

// ─────────────────────────────────────────────────────────────
// interaction 回帰テスト（issue #256 / `npm run test:interaction`）
// ─────────────────────────────────────────────────────────────

/**
 * FormField + Input の入力・バリデーションエラー表示の回帰テスト。
 * エラー時に aria-invalid とエラーメッセージが正しく紐づくこと（a11y）まで見る。
 */
export const ShowsValidationErrorAndClearsOnInput: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => {
    const form = useForm({ defaultValues: { email: "" }, mode: "onSubmit" })
    return (
      <Form {...form}>
        <form
          className="flex max-w-sm flex-col gap-6 p-6"
          onSubmit={form.handleSubmit(() => {})}
        >
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "メールアドレスを入力してください",
              pattern: { value: /.+@.+\..+/, message: "メールアドレスの形式が正しくありません" },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormDescription>連絡先として使用します</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">送信する</Button>
        </form>
      </Form>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText("メールアドレス")
    const submit = canvas.getByRole("button", { name: "送信する" })

    // 初期状態ではエラーなし
    await expect(input).toHaveAttribute("aria-invalid", "false")

    // 空のまま送信 → required エラー
    await userEvent.click(submit)
    const required = await canvas.findByText("メールアドレスを入力してください")
    await expect(input).toHaveAttribute("aria-invalid", "true")
    // エラーメッセージが aria-describedby で input に紐づいていること
    await expect(input.getAttribute("aria-describedby") ?? "").toContain(required.id)

    // 不正な形式 → pattern エラー
    await userEvent.type(input, "not-an-email")
    await userEvent.click(submit)
    await canvas.findByText("メールアドレスの形式が正しくありません")

    // 正しい値を入れるとエラーが消える
    await userEvent.clear(input)
    await userEvent.type(input, "keisuke@example.com")
    await userEvent.click(submit)
    await waitFor(async () => {
      await expect(canvas.queryByText("メールアドレスの形式が正しくありません")).toBeNull()
      await expect(input).toHaveAttribute("aria-invalid", "false")
    })
    await expect(input).toHaveValue("keisuke@example.com")
  },
}
