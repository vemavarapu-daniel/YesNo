
/**
 * VALENTINE'S PROPOSAL MAKER
 * Unified Entry Point
 */

// Added to make this file a module and avoid global scope collisions with other files
export {};

// --- UTILITIES ---

// Fix for error: Cannot redeclare block-scoped variable 'encodeData'
const encodeData = (data: { message: string, sender: string }) => {
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
};

// Fix for error: Cannot redeclare block-scoped variable 'decodeData'
const decodeData = (encoded: string) => {
    try {
        return JSON.parse(decodeURIComponent(escape(atob(encoded))));
    } catch (e) {
        return null;
    }
};

// Fix for error: Cannot redeclare block-scoped variable 'getBaseUrl'
const getBaseUrl = () => {
    return window.location.origin + window.location.pathname;
};

// Declare confetti from the global script loaded in HTML
declare const confetti: any;

// --- CORE APP LOGIC ---

// Fix for error: Cannot redeclare block-scoped variable 'App'
const App = {
    state: 'CREATOR', // 'CREATOR', 'VIEWER', 'SUCCESS'
    proposalData: null as any,
    
    init() {
        this.renderBackground();
        this.checkHash();
        window.addEventListener('hashchange', () => this.checkHash());
    },

    checkHash() {
        const hash = window.location.hash;
        if (hash.startsWith('#p=')) {
            const encoded = hash.split('#p=')[1];
            const decoded = decodeData(encoded);
            if (decoded) {
                this.proposalData = decoded;
                this.state = 'VIEWER';
                this.render();
                return;
            }
        }
        this.state = 'CREATOR';
        this.render();
    },

    // --- RENDERERS ---

    render() {
        const root = document.getElementById('root');
        if (!root) return;

        if (this.state === 'CREATOR') {
            root.innerHTML = this.getCreatorTemplate();
            this.attachCreatorEvents();
        } else if (this.state === 'VIEWER') {
            root.innerHTML = this.getViewerTemplate();
            this.attachViewerEvents();
        } else if (this.state === 'SUCCESS') {
            root.innerHTML = this.getSuccessTemplate();
        }
    },

    renderBackground() {
        const container = document.getElementById('bg-animation-container');
        if (!container) return;
        const items = ['💖', '❤️', '🌸', '✨', '💕', '🌷', '🌹'];
        
        setInterval(() => {
            const el = document.createElement('div');
            el.className = 'floating-element';
            el.innerHTML = items[Math.floor(Math.random() * items.length)];
            el.style.left = Math.random() * 100 + '%';
            el.style.fontSize = (Math.random() * 20 + 15) + 'px';
            el.style.animationDuration = (Math.random() * 7 + 5) + 's';
            
            container.appendChild(el);
            setTimeout(() => el.remove(), 12000);
        }, 600);
    },

    // --- TEMPLATES ---

    getCreatorTemplate() {
        return `
        <div class="glass p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-pink-100 fade-in max-w-md mx-auto">
            <div class="text-center mb-8">
                <div class="text-5xl mb-4">💌</div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Proposal Maker</h1>
                <p class="text-gray-500 text-sm">Create a secret link for your special someone.</p>
            </div>
            <div class="space-y-6">
                <div>
                    <label class="block text-[10px] font-bold text-pink-500 uppercase tracking-widest mb-2 ml-1">Your Message</label>
                    <textarea id="msgInput" class="w-full p-4 rounded-2xl border border-pink-100 bg-pink-50/30 focus:bg-white focus:ring-2 focus:ring-pink-400 outline-none transition-all h-28 resize-none text-gray-700" placeholder="e.g. Will you be my Valentine?"></textarea>
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-pink-500 uppercase tracking-widest mb-2 ml-1">From (Optional)</label>
                    <input id="senderInput" type="text" class="w-full p-4 rounded-2xl border border-pink-100 bg-pink-50/30 focus:bg-white focus:ring-2 focus:ring-pink-400 outline-none transition-all text-gray-700" placeholder="Your Name">
                </div>
                <button id="genBtn" class="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-rose-200 transition-all transform active:scale-95">
                    Generate Romantic Link ✨
                </button>
                <div id="resultArea" class="hidden animate-fadeIn">
                    <div class="p-4 bg-rose-50 rounded-2xl border border-pink-100">
                        <p class="text-[10px] font-bold text-pink-600 uppercase mb-2">Your Link:</p>
                        <div class="flex gap-2">
                            <input id="linkOutput" readonly class="flex-1 bg-white p-2 text-xs rounded-lg border border-pink-100 text-gray-400 font-mono">
                            <button id="copyBtn" class="bg-pink-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-pink-600">Copy</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    },

    getViewerTemplate() {
        return `
        <div class="glass p-10 md:p-16 rounded-[3rem] shadow-2xl border border-white text-center fade-in relative mx-auto">
            <div class="mb-8 inline-block p-4 bg-pink-100 rounded-full animate-bounce">
                <span class="text-4xl">🌹</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-romantic text-rose-600 mb-8 leading-tight">
                I have something to ask you...
            </h1>
            <div class="mb-12 text-gray-700 italic text-xl md:text-2xl font-light leading-relaxed">
                "${this.proposalData.message}"
                ${this.proposalData.sender ? `<div class="mt-4 not-italic font-bold text-rose-400 text-lg">— ${this.proposalData.sender}</div>` : ''}
            </div>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button id="yesBtn" class="px-12 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-bold text-xl shadow-xl hover:scale-110 transition-all active:scale-95 z-10 w-full sm:w-auto">
                    YES! ❤️
                </button>
                <button id="noBtn" class="px-8 py-3 bg-gray-200 text-gray-500 rounded-full font-semibold transition-all z-20 w-full sm:w-auto no-btn-transition">
                    No 😈
                </button>
            </div>
            <p id="hintText" class="mt-8 text-rose-300 text-xs animate-pulse">Click YES to see a surprise...</p>
        </div>`;
    },

    getSuccessTemplate() {
        return `
        <div class="glass p-12 md:p-20 rounded-[4rem] shadow-2xl text-center bounce-in border-4 border-rose-300 mx-auto">
            <div class="text-8xl mb-8">💖</div>
            <h1 class="text-5xl md:text-6xl font-romantic text-rose-600 mb-6">YAYYYY!</h1>
            <p class="text-2xl text-gray-700 font-light mb-10">
                I knew you'd say yes! You've made me the happiest person ever. 🌹
            </p>
            <div class="inline-block px-10 py-4 bg-rose-500 text-white rounded-full font-bold shadow-2xl animate-pulse cursor-pointer" onclick="window.location.hash = ''">
                Forever Starts Now ✨
            </div>
        </div>`;
    },

    // --- EVENT ATTACHMENTS ---

    attachCreatorEvents() {
        const genBtn = document.getElementById('genBtn');
        const copyBtn = document.getElementById('copyBtn');
        const msgInput = document.getElementById('msgInput') as HTMLTextAreaElement;
        const senderInput = document.getElementById('senderInput') as HTMLInputElement;

        if (!genBtn || !copyBtn) return;

        genBtn.onclick = () => {
            if (!msgInput.value) return;
            const encoded = encodeData({ message: msgInput.value, sender: senderInput.value });
            const fullLink = getBaseUrl() + '#p=' + encoded;
            
            const linkOutput = document.getElementById('linkOutput') as HTMLInputElement;
            linkOutput.value = fullLink;
            document.getElementById('resultArea')?.classList.remove('hidden');
        };

        copyBtn.onclick = () => {
            const output = document.getElementById('linkOutput') as HTMLInputElement;
            output.select();
            document.execCommand('copy');
            copyBtn.innerText = 'Copied!';
            setTimeout(() => copyBtn.innerText = 'Copy', 2000);
        };
    },

    attachViewerEvents() {
        const yesBtn = document.getElementById('yesBtn');
        const noBtn = document.getElementById('noBtn');
        const hintText = document.getElementById('hintText');

        if (!yesBtn || !noBtn || !hintText) return;

        yesBtn.onclick = () => {
            this.state = 'SUCCESS';
            this.render();
            this.triggerConfetti();
        };

        const moveNo = () => {
            const x = Math.random() * (window.innerWidth - 150) - (window.innerWidth / 2) + 75;
            const y = Math.random() * (window.innerHeight - 150) - (window.innerHeight / 2) + 75;
            
            noBtn.style.position = 'fixed';
            noBtn.style.top = '50%';
            noBtn.style.left = '50%';
            noBtn.style.transform = `translate(${x}px, ${y}px)`;
            hintText.innerText = "Try to catch me! ✨";
        };

        noBtn.onmouseover = moveNo;
        noBtn.onclick = moveNo;
    },

    triggerConfetti() {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }
};

// Initialize on DOM ready or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
