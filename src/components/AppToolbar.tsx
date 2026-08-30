export function AppToolbar() {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Connection Compass", url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied!");
      }
    } catch (e) {
      // user cancelled
    }
  };

  const handleInstall = async () => {
    const evt = (window as any).deferredPrompt;
    if (evt) {
      evt.prompt();
      await evt.userChoice;
      (window as any).deferredPrompt = null;
    } else {
      alert("Use your browser menu to install.");
    }
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