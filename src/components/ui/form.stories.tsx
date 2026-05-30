import type { Meta, StoryObj } from "@storybook/react"
import { useForm } from "react-hook-form"
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
