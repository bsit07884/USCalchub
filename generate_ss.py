import os

root = r'c:\Users\muzaf\.gemini\antigravity\scratch\uscalchub'
os.makedirs(os.path.join(root, 'social-security-calculator'), exist_ok=True)
os.makedirs(os.path.join(root, 'embed', 'social-security'), exist_ok=True)

JS_LOGIC = """
    <script>
        function calculateSSTax() {
            const status = document.getElementById('status').value;
            const ssBenefits = parseFloat(document.getElementById('ssBenefits').value) || 0;
            const agi = parseFloat(document.getElementById('agi').value) || 0;
            const nonTaxInterest = parseFloat(document.getElementById('nonTaxInterest').value) || 0;
            
            const combinedIncome = agi + nonTaxInterest + (0.5 * ssBenefits);
            let taxableAmount = 0;
            
            if (status === 'single') {
                if (combinedIncome > 34000) {
                    const tier1 = Math.min(0.5 * ssBenefits, 0.5 * (34000 - 25000));
                    const tier2 = 0.85 * (combinedIncome - 34000);
                    taxableAmount = Math.min(0.85 * ssBenefits, tier1 + tier2);
                } else if (combinedIncome > 25000) {
                    taxableAmount = Math.min(0.5 * ssBenefits, 0.5 * (combinedIncome - 25000));
                }
            } else {
                // married
                if (combinedIncome > 44000) {
                    const tier1 = Math.min(0.5 * ssBenefits, 0.5 * (44000 - 32000));
                    const tier2 = 0.85 * (combinedIncome - 44000);
                    taxableAmount = Math.min(0.85 * ssBenefits, tier1 + tier2);
                } else if (combinedIncome > 32000) {
                    taxableAmount = Math.min(0.5 * ssBenefits, 0.5 * (combinedIncome - 32000));
                }
            }
            
            document.getElementById('combinedIncome').textContent = '$' + combinedIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('taxableAmount').textContent = '$' + taxableAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            
            let taxPercent = ssBenefits > 0 ? (taxableAmount / ssBenefits) * 100 : 0;
            document.getElementById('taxPercent').textContent = taxPercent.toFixed(1) + '%';
        }
        
        document.getElementById('status').addEventListener('change', calculateSSTax);
        document.getElementById('ssBenefits').addEventListener('input', calculateSSTax);
        document.getElementById('agi').addEventListener('input', calculateSSTax);
        document.getElementById('nonTaxInterest').addEventListener('input', calculateSSTax);
        window.addEventListener('load', calculateSSTax);
    </script>
"""

CALCULATOR_HTML = """
    <div class="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200 font-sans mt-8 mb-8">
      <h2 class="text-xl font-bold text-slate-900 mb-4 text-center">Social Security Tax Calculator 2026</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Filing Status</label>
          <select id="status" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white">
            <option value="single">Single / Head of Household</option>
            <option value="married">Married Filing Jointly</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Annual Social Security Benefits ($)</label>
          <input 
            type="number" id="ssBenefits" min="0"
            class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="e.g., 20000"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Adjusted Gross Income (Other Income) ($)</label>
          <input 
            type="number" id="agi" min="0"
            class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="e.g., 15000"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Nontaxable Interest ($)</label>
          <input 
            type="number" id="nonTaxInterest" min="0"
            class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="e.g., 0"
          />
        </div>
      </div>

      <div class="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
        <h3 class="text-sm font-bold text-blue-900 uppercase tracking-wider mb-2">Estimated 2026 Results</h3>
        
        <div class="flex justify-between items-center py-2 border-b border-blue-200">
          <span class="text-slate-600 text-sm">Combined Income:</span>
          <span class="font-semibold text-slate-800" id="combinedIncome">$0.00</span>
        </div>
        
        <div class="flex justify-between items-center py-2 border-b border-blue-200">
          <span class="text-slate-600 text-sm">Portion of Benefits Taxed:</span>
          <span class="font-semibold text-slate-800" id="taxPercent">0.0%</span>
        </div>
        
        <div class="flex justify-between items-center py-2 mt-2">
          <span class="text-slate-600 text-sm font-bold">Taxable Social Security:</span>
          <span class="font-black text-red-600 text-lg" id="taxableAmount">$0.00</span>
        </div>
        
        <p class="text-xs text-slate-500 mt-2 italic text-center">*This is the amount added to your taxable income, not the exact tax you will pay.</p>
      </div>
    </div>
"""

EMBED_HTML = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Security Tax Calculator Embed</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {{
            font-family: 'Inter', sans-serif;
            background: transparent;
            margin: 0;
            padding: 10px;
        }}
    </style>
    <link rel="stylesheet" href="../../styles.css">
</head>
<body>
    {CALCULATOR_HTML}
    {JS_LOGIC}
</body>
</html>
"""

# Read a template for the main page (e.g. from overtime-calculator)
with open(os.path.join(root, 'overtime-calculator', 'index.html'), 'r', encoding='utf-8') as f:
    template = f.read()

template = template.replace(
    '<title>2026 Overtime Tax Refund Calculator | USCalcHub</title>', 
    '<title>Social Security Tax Calculator 2026 | USCalcHub</title>'
)
template = template.replace(
    'Calculate your 2026 overtime premium and estimate your tax-free deduction (up to $12,500) under the new overtime tax exemption laws.',
    'Calculate how much of your Social Security benefits will be taxable in 2026 based on your Combined Income and IRS rules.'
)

start_idx = template.find('<div class="max-w-md mx-auto bg-white')
if start_idx == -1:
    start_idx = template.find('<div class="px-4">')

end_idx = template.find('<footer')

SEO_TEXT = """
    <div class="max-w-2xl mx-auto mt-10 px-6 pb-12 text-slate-700">
        <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center">How to Calculate Taxable Social Security Benefits</h2>
        <p class="mb-4 leading-relaxed text-sm md:text-base">
            The IRS determines if your Social Security benefits are taxable based on your <strong>Combined Income</strong>. 
            Combined Income is calculated by adding your Adjusted Gross Income (AGI), Nontaxable Interest, and half (50%) of your Social Security benefits.
        </p>
        <ul class="list-disc pl-5 mb-6 text-sm md:text-base space-y-2">
            <li><strong>Single Filers:</strong> If Combined Income is between $25,000 and $34,000, up to 50% of benefits are taxable. Over $34,000, up to 85% may be taxable.</li>
            <li><strong>Married Filing Jointly:</strong> If Combined Income is between $32,000 and $44,000, up to 50% is taxable. Over $44,000, up to 85% may be taxable.</li>
        </ul>
        <p class="text-xs text-slate-500 italic">Disclaimer: This tool provides an estimate for informational purposes and should not replace professional tax advice.</p>
    </div>
"""

script_start = template.rfind('<script>', start_idx, end_idx)
if script_start != -1:
    script_end = template.find('</script>', script_start) + 9
    replacement = '<div class="px-4">\n' + CALCULATOR_HTML + '</div>\n' + SEO_TEXT + JS_LOGIC
    
    # We must find the correct boundaries. In overtime, it's inside <div class="px-4">...</div>
    if template.find('<div class="px-4">') != -1:
        start_idx = template.find('<div class="px-4">')
    
    new_page = template[:start_idx] + replacement + template[script_end:]
    
    with open(os.path.join(root, 'social-security-calculator', 'index.html'), 'w', encoding='utf-8') as f:
        f.write(new_page)

with open(os.path.join(root, 'embed', 'social-security', 'index.html'), 'w', encoding='utf-8') as f:
    f.write(EMBED_HTML)
