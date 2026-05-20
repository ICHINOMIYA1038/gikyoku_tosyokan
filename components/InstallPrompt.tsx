import { useEffect, useState } from "react";

const DISMISS_KEY = "gt_install_dismissed_v1";
const VISIT_KEY = "gt_visit_count_v1";

const InstallPrompt = () => {
  const [deferred, setDeferred] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(display-mode: standalone)").matches) return;
    if (localStorage.getItem(DISMISS_KEY)) return;

    const visits = Number(localStorage.getItem(VISIT_KEY) || "0") + 1;
    localStorage.setItem(VISIT_KEY, String(visits));

    const onBefore = (e: Event) => {
      e.preventDefault();
      setDeferred(e);
      if (visits >= 2) setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBefore as any);
    return () => window.removeEventListener("beforeinstallprompt", onBefore as any);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setShow(false);
  };

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    try {
      await deferred.userChoice;
    } catch {}
    dismiss();
  };

  if (!show) return null;
  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-3 flex items-center gap-3">
      <img src="/logo.png" alt="" width={40} height={40} className="rounded" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800">ホーム画面に追加</p>
        <p className="text-[11px] text-gray-500">アプリのように1タップで起動</p>
      </div>
      <button onClick={install} className="text-xs font-bold px-3 py-2 bg-theater-primary-500 text-white rounded-md min-h-[40px]">追加</button>
      <button onClick={dismiss} aria-label="閉じる" className="text-gray-400 text-xs px-2 min-h-[40px]">閉じる</button>
    </div>
  );
};

export default InstallPrompt;
