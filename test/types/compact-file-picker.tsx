import { ImageAttachmentPicker } from "../../src/components/patterns/compact-file-picker"

// ImageAttachmentPickerProps は CompactFilePickerProps の loadingLabel を継承する（issue #539）
const inheritsLoadingLabel = <ImageAttachmentPicker loadingLabel="アップロード中…" />
// @ts-expect-error ImageAttachmentPickerProps は Omit<CompactFilePickerProps, "accept" | "icon"> のため icon を受け付けない
const excludesIcon = <ImageAttachmentPicker icon={<span />} />

void [inheritsLoadingLabel, excludesIcon]
