/**
 * @file ProgressSteps のストーリー
 * @description ステップ表示コンポーネント。4ステップでステップ2がアクティブな例を表示
 */
import type { Meta, StoryObj } from "@storybook/react"
import { ProgressSteps } from "./progress-steps"

const meta: Meta<typeof ProgressSteps> = {
  title: "Patterns/ProgressSteps",
  component: ProgressSteps,
  argTypes: {
    currentStep: { control: { type: "number", min: 0, max: 3 } },
  },
}
export default meta

type Story = StoryObj<typeof ProgressSteps>

const defaultSteps = ["入力", "確認", "決済", "完了"]

export const Step2Active: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 1,
  },
}

export const FirstStep: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 0,
  },
}

export const ThirdStep: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 2,
  },
}

export const AllComplete: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 4,
  },
}

export const ThreeSteps: Story = {
  args: {
    steps: ["基本情報", "詳細設定", "確認"],
    currentStep: 1,
  },
}
