import { ReceiptText } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "아직 거래 내역이 없어요",
  description = "첫 거래를 기록하고 내 소비를 한눈에 관리해 보세요.",
}: Props) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">
        <ReceiptText size={27} />
      </span>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}
