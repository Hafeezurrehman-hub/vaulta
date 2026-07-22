import { store } from '../store/state';
import { icons } from '../utils/icons';

let deferredPrompt: any = null;

export function initPWAInstallListener(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('PWA install prompt captured!');

    // Show banner if not dismissed before
    const settings = store.getSettings();
    if (!settings.pwaDismissed) {
      showPWABanner();
    }
  });

  window.addEventListener('appinstalled', () => {
    console.log('Vaulta PWA installed successfully!');
    deferredPrompt = null;
    hidePWABanner();
  });

  window.addEventListener('show-pwa-prompt', () => {
    showPWABanner();
  });
}

export function showPWABanner(): void {
  const container = document.getElementById('pwa-modal-root');
  if (!container) return;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1B2623]/60 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white dark:bg-[#253632] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#F2F1EC] dark:border-[#3E5C54]/30 relative">
        
        <!-- Close button -->
        <button id="btn-pwa-dismiss" class="absolute top-4 right-4 p-2 rounded-full text-[#7A7D73] hover:text-[#1B2623] dark:hover:text-[#E9EDC9] transition-colors cursor-pointer">
          ${icons.close}
        </button>

        <!-- Banner Header with Vaulta Logo -->
        <div class="flex items-center gap-4 mb-4">
          <img src="${import.meta.env.BASE_URL}vaulta-logo.jpg" alt="Vaulta App Icon" class="w-14 h-14 rounded-2xl shadow-md border border-[#3E5C54]/20 object-cover shrink-0 aspect-square bg-white" />
          <div>
            <span class="inline-block px-2.5 py-0.5 bg-[#3E5C54]/10 text-[#3E5C54] dark:text-[#E9EDC9] font-bold text-[10px] uppercase tracking-wider rounded-md mb-1">
              Official PWA App
            </span>
            <h3 class="font-heading font-extrabold text-xl text-[#1B2623] dark:text-[#E9EDC9]">
              Install Vaulta
            </h3>
            <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70">
              Add to Home Screen for fast offline access
            </p>
          </div>
        </div>

        <p class="text-sm text-[#1B2623] dark:text-[#E9EDC9]/90 mb-5 leading-relaxed">
          Enjoy a native app experience on your mobile device with offline tracking, instant launch, and budget notifications.
        </p>

        ${
          isIOS
            ? `
          <div class="p-3.5 bg-[#DDA15E]/15 rounded-2xl border border-[#DDA15E]/30 mb-5 text-xs text-[#1B2623] dark:text-[#E9EDC9] space-y-2">
            <p class="font-bold">iOS Installation Steps:</p>
            <ol class="list-decimal pl-4 space-y-1">
              <li>Tap the <span class="font-semibold">Share</span> button in Safari.</li>
              <li>Scroll down and tap <span class="font-semibold">'Add to Home Screen'</span>.</li>
              <li>Tap <span class="font-semibold">'Add'</span> in top right corner.</li>
            </ol>
          </div>
        `
            : ''
        }

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <button id="btn-pwa-install-action" class="flex-1 py-3 px-4 bg-[#3E5C54] hover:bg-[#2d453f] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
            ${icons.mobileInstall}
            <span>Add to Home Screen</span>
          </button>
          
          <button id="btn-pwa-dismiss-action" class="py-3 px-4 text-[#7A7D73] hover:text-[#1B2623] dark:hover:text-[#E9EDC9] text-sm font-semibold rounded-xl cursor-pointer">
            Maybe Later
          </button>
        </div>

      </div>
    </div>
  `;

  document.getElementById('btn-pwa-dismiss')?.addEventListener('click', hidePWABanner);
  document.getElementById('btn-pwa-dismiss-action')?.addEventListener('click', hidePWABanner);

  document.getElementById('btn-pwa-install-action')?.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted PWA install');
      }
      deferredPrompt = null;
      hidePWABanner();
    } else {
      // If iOS or native prompt not directly ready
      alert('To install Vaulta on your home screen:\n\n1. Tap the Share button in your browser menu.\n2. Tap "Add to Home Screen".');
      hidePWABanner();
    }
  });
}

export function hidePWABanner(): void {
  const container = document.getElementById('pwa-modal-root');
  if (container) {
    container.innerHTML = '';
  }
  // Record dismissal preference
  store.updateSettings({ pwaDismissed: true });
}
