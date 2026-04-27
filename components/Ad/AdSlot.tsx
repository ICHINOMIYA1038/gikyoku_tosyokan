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
const AdSlot = ({ slot, format = "auto", className }: AdSlotProps) => {
  return (
    <div className={`my-6 ${className || ""}`}>
      <DisplayAd slot={slot} format={format} />
    </div>
  );
};

export default AdSlot;
