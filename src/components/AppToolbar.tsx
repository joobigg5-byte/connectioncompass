import { useEffect, useState } from "react";

export function AppToolbar() {
  const [installEvt, setInstallEvt] = useState<any>(null);

  useEffect(() => {
    const onBIP = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  const handleInstall = async () => {
    if (installEvt) {
      installEvt.prompt();
      await installEvt.userChoice;
      setInstallEvt(null);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Connection Compass", url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied!");
      }
    } catch (e) {}
  };

  return (
    <div className="flex gap-2 pt-4">
      <a
        href="https://wittyhub.co?app=connection-compass&v=1.0"
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-2 rounded-md bg-surface-2 text-ink hover:bg-surface"
      >
        Support
      </a>
      <button
        onClick={handleShare}
        className="px-3 py-2 rounded-md bg-surface-2 text-ink hover:bg-surface"
      >
        Share
      </button>
      <button
        onClick={handleInstall}
        className="px-3 py-2 rounded-md bg-surface-2 text-ink hover:bg-surface"
      >
        Install
      </button>
    </div>
  );
}