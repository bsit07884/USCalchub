import os

pinterest_tag = '<meta name="p:domain_verify" content="b7f7817685a0fa71251d2be14cf9758e"/>\n'

cookie_banner_html = """
    <!-- Cookie Consent Banner -->
    <div id="cookie-consent-banner" class="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 text-slate-300 p-4 z-50 transform translate-y-full transition-transform duration-300 hidden">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-sm text-center md:text-left">
                We use cookies to ensure you get the best experience on our website. By continuing to use this site, you consent to our use of cookies in accordance with our 
                <a href="/privacy-policy/" class="text-blue-400 hover:text-blue-300 underline font-medium">Privacy Policy</a>.
            </p>
            <div class="flex gap-3 flex-shrink-0">
                <button id="accept-cookies" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition">Accept All</button>
            </div>
        </div>
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            if (!localStorage.getItem("cookiesAccepted")) {
                const banner = document.getElementById("cookie-consent-banner");
                banner.classList.remove("hidden");
                // Small delay to allow CSS transition to work after removing hidden
                setTimeout(() => {
                    banner.classList.remove("translate-y-full");
                }, 50);
            }
            
            document.getElementById("accept-cookies")?.addEventListener("click", function() {
                localStorage.setItem("cookiesAccepted", "true");
                const banner = document.getElementById("cookie-consent-banner");
                banner.classList.add("translate-y-full");
                setTimeout(() => {
                    banner.classList.add("hidden");
                }, 300);
            });
        });
    </script>
"""

files_changed = 0

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            modified = False

            # Add Pinterest Tag if not exists
            if 'p:domain_verify' not in content and '</head>' in content:
                content = content.replace('</head>', f'    {pinterest_tag}</head>', 1)
                modified = True

            # Add Cookie Banner if not exists
            if 'cookie-consent-banner' not in content and '</body>' in content:
                content = content.replace('</body>', f'{cookie_banner_html}</body>', 1)
                modified = True
            
            if modified:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                files_changed += 1

print(f"Applied SEO fixes to {files_changed} HTML files.")
