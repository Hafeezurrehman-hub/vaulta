import { store } from '../store/state';
import { icons } from '../utils/icons';

let isSignUpMode = false;

export function renderAuthView(): string {
  return `
    <div class="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-stone-100 via-emerald-950/5 to-stone-200 dark:from-[#0a1412] dark:via-[#0c1f1a] dark:to-[#050b0a] transition-colors duration-200">
      <div class="w-full max-w-md bg-white dark:bg-[#142722] rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200/80 dark:border-stone-800 relative overflow-hidden animate-fade-in">
        
        <!-- Top Glow Accent -->
        <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#3E5C54] via-[#DDA15E] to-[#3E5C54]"></div>

        <!-- Header with Vaulta Logo -->
        <div class="text-center mb-6">
          <img src="${import.meta.env.BASE_URL}vaulta-logo.jpg" alt="Vaulta Brand Logo" class="w-20 h-20 mx-auto object-cover shrink-0 aspect-square bg-white rounded-2xl shadow-md border border-[#DDA15E]/40 mb-3" />
          <h1 class="font-heading font-extrabold text-2xl text-[#1B2623] dark:text-[#E9EDC9] tracking-tight">
            ${isSignUpMode ? 'Create Vaulta Account' : 'Welcome to Vaulta'}
          </h1>
          <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70 mt-1">
            ${isSignUpMode ? 'Start tracking & growing your savings today' : 'Log in to manage your personal finances'}
          </p>
        </div>

        <!-- Google OAuth Button -->
        <button type="button" id="btn-google-auth" class="w-full py-3 px-4 bg-white dark:bg-[#253632] hover:bg-stone-50 dark:hover:bg-[#2e423d] text-[#1B2623] dark:text-[#E9EDC9] border border-[#F2F1EC] dark:border-[#3E5C54]/40 font-bold text-sm rounded-xl shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-3 cursor-pointer mb-4">
          ${icons.google}
          <span>Continue with Google</span>
        </button>

        <div class="relative flex py-1 items-center mb-4">
          <div class="flex-grow border-t border-[#F2F1EC] dark:border-[#3E5C54]/30"></div>
          <span class="flex-shrink mx-3 text-[11px] text-[#7A7D73] dark:text-[#E9EDC9]/60 font-bold uppercase tracking-wider">OR</span>
          <div class="flex-grow border-t border-[#F2F1EC] dark:border-[#3E5C54]/30"></div>
        </div>

        <form id="form-auth" class="space-y-4">
          
          ${
            isSignUpMode
              ? `
            <div>
              <label class="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Full Name</label>
              <input 
                type="text" 
                id="auth-name" 
                required 
                value="UMME ASMIA"
                placeholder="e.g. UMME ASMIA"
                class="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#0d4234] focus:outline-none"
              />
            </div>
          `
              : ''
          }

          <div>
            <label class="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Email Address</label>
            <input 
              type="email" 
              id="auth-email" 
              required 
              value="ummeasmia191@gmail.com"
              placeholder="e.g. ummeasmia191@gmail.com"
              class="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#0d4234] focus:outline-none"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-bold text-stone-700 dark:text-stone-300">Password</label>
              ${
                !isSignUpMode
                  ? `<button type="button" id="btn-forgot-password" class="text-xs font-semibold text-[#0d4234] dark:text-emerald-400 hover:underline cursor-pointer">Forgot?</button>`
                  : ''
              }
            </div>
            <div class="relative">
              <input 
                type="password" 
                id="auth-password" 
                required 
                value="vaulta123"
                placeholder="••••••••"
                class="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#0d4234] focus:outline-none pr-10"
              />
              <button type="button" id="btn-toggle-pass" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer">
                Show
              </button>
            </div>
          </div>

          ${
            isSignUpMode
              ? `
            <div>
              <label class="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Confirm Password</label>
              <input 
                type="password" 
                id="auth-confirm-password" 
                required 
                value="vaulta123"
                placeholder="••••••••"
                class="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#0d4234] focus:outline-none"
              />
            </div>
          `
              : ''
          }

          <!-- Submit Button -->
          <button type="submit" class="w-full py-3.5 px-4 bg-[#0d4234] hover:bg-[#082e24] text-white font-bold text-sm rounded-xl shadow-lg transition-all duration-200 active:scale-95 cursor-pointer mt-2">
            ${isSignUpMode ? 'Create Account' : 'Log In to Vaulta'}
          </button>

        </form>

        <!-- Toggle Sign In / Sign Up -->
        <div class="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 text-center">
          <p class="text-xs text-stone-500 dark:text-stone-400">
            ${isSignUpMode ? 'Already have an account?' : "Don't have an account yet?"}
            <button id="btn-toggle-auth-mode" class="font-bold text-[#0d4234] dark:text-emerald-400 hover:underline ml-1 cursor-pointer">
              ${isSignUpMode ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </div>

        <!-- Security Badge & Developer Credit -->
        <div class="mt-6 flex flex-col items-center justify-center gap-1.5 text-[11px] text-stone-400 dark:text-stone-500">
          <div class="flex items-center gap-1.5">
            ${icons.shieldCheck}
            <span>Vaulta 256-bit Local Encryption</span>
          </div>
          <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70 font-semibold mt-2">
            Developed & Designed by <span class="text-[#3E5C54] dark:text-[#E9EDC9] font-bold">Umme Asmia</span>
          </p>
        </div>

      </div>
    </div>
  `;
}

export function bindAuthEvents(): void {
  const form = document.getElementById('form-auth');
  const togglePassBtn = document.getElementById('btn-toggle-pass');
  const passInput = document.getElementById('auth-password') as HTMLInputElement;

  document.getElementById('btn-google-auth')?.addEventListener('click', () => {
    store.login('ummeasmia191@gmail.com', 'UMME ASMIA');
  });

  togglePassBtn?.addEventListener('click', () => {
    if (passInput.type === 'password') {
      passInput.type = 'text';
      togglePassBtn.textContent = 'Hide';
    } else {
      passInput.type = 'password';
      togglePassBtn.textContent = 'Show';
    }
  });

  document.getElementById('btn-toggle-auth-mode')?.addEventListener('click', () => {
    isSignUpMode = !isSignUpMode;
    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.innerHTML = renderAuthView();
      bindAuthEvents();
    }
  });

  document.getElementById('btn-forgot-password')?.addEventListener('click', () => {
    alert('Password reset link sent to ummeasmia191@gmail.com! (Demo reset flow)');
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = (document.getElementById('auth-email') as HTMLInputElement).value;
    const nameEl = document.getElementById('auth-name') as HTMLInputElement;
    const name = nameEl ? nameEl.value : 'UMME ASMIA';

    if (isSignUpMode) {
      store.signup(name, email);
    } else {
      store.login(email, name);
    }
  });
}
