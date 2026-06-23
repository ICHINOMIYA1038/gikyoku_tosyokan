import DisplayAd from "./google/displayAd";

type AdFormat = "horizontal" | "vertical" | "rectangle" | "auto";

type AdSlotProps = {
  slot: string;
  format?: AdFormat;
  className?: string;
};

/**
 * 手動広告枠コンポーネント
 * AdSense管理画面で作成した広告ユニットのslot IDを指定して使う。
 *
 * 使い方:
 *   <AdSlot slot="1234567890" format="horizontal" />
 *
 * slot IDはAdSense管理画面 > 広告ユニット > コード取得 で確認。
 */
const minHeightByFormat: Record<AdFormat, string> = {
  horizontal: "min-h-[100px] md:min-h-[280px]",
  vertical: "min-h-[600px]",
  rectangle: "min-h-[260px]",
  auto: "min-h-[100px]",
};

const AdSlot = ({ slot, format = "auto", className }: AdSlotProps) => {
  return (
    <div className={`my-6 ${minHeightByFormat[format]} ${className || ""}`}>
      <div className="text-[10px] text-gray-400 text-right mb-0.5 leading-none">広告</div>
      <DisplayAd slot={slot} format={format} />
    </div>
  );
};

export default AdSlot;
