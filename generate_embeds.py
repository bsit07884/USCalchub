import os

root = r'c:\Users\muzaf\.gemini\antigravity\scratch\uscalchub\embed'
os.makedirs(os.path.join(root, 'salary-calculator'), exist_ok=True)
os.makedirs(os.path.join(root, 'tip-splitter'), exist_ok=True)
os.makedirs(os.path.join(root, 'credit-card-payoff'), exist_ok=True)
os.makedirs(os.path.join(root, 'real-estate-commission'), exist_ok=True)

def generate_html(title, body_content):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
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
    <!-- Using optimized compiled CSS instead of CDN for performance -->
    <link rel="stylesheet" href="../../styles.css">
</head>
<body>
{body_content}
</body>
</html>
"""

# 1. Salary Calculator
salary_body = """
    <div class="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 class="text-xl font-bold text-slate-900 mb-4 text-center">Salary & Net Pay Calculator</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Gross Annual Salary ($)</label>
          <input type="number" id="salaryGross" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="75000">
        </div>
        <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1">Pay Frequency</label>
              <select id="salaryFreq" class="w-full p-3 border border-slate-300 rounded-lg bg-white outline-none">
                <option value="52">Weekly</option>
                <option value="26" selected>Bi-weekly</option>
                <option value="12">Monthly</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1">Filing Status</label>
              <select id="salaryStatus" class="w-full p-3 border border-slate-300 rounded-lg bg-white outline-none">
                <option value="single" selected>Single</option>
                <option value="joint">Joint</option>
              </select>
            </div>
        </div>
      </div>
      <div class="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div class="flex justify-between py-2 border-b border-slate-200">
          <span class="text-slate-600 text-sm">Estimated Taxes (Fed + FICA):</span>
          <span class="font-semibold text-red-500" id="salaryTax">-$0.00</span>
        </div>
        <div class="flex justify-between items-center py-2 mt-2">
          <span class="text-slate-800 font-bold">Net Take-Home Pay:</span>
          <span class="font-black text-green-600 text-xl" id="salaryNet">$0.00</span>
        </div>
        <p class="text-xs text-slate-400 mt-2 text-center">Per pay period</p>
      </div>
    </div>
    <script>
        function calcSalary() {
            const gross = parseFloat(document.getElementById('salaryGross').value) || 0;
            const freq = parseInt(document.getElementById('salaryFreq').value);
            const status = document.getElementById('salaryStatus').value;
            
            const deduction = status === 'single' ? 15000 : 30000;
            let taxable = Math.max(0, gross - deduction);
            let fedTax = 0;
            
            const b1 = status === 'single' ? 11000 : 22000;
            const b2 = status === 'single' ? 44725 : 89450;
            
            if (taxable > 0) {
                const t1 = Math.min(taxable, b1);
                fedTax += t1 * 0.10;
                taxable -= t1;
            }
            if (taxable > 0) {
                const t2 = Math.min(taxable, b2 - b1);
                fedTax += t2 * 0.12;
                taxable -= t2;
            }
            if (taxable > 0) {
                fedTax += taxable * 0.22;
            }
            
            const fica = gross * 0.0765;
            const totalTax = fedTax + fica;
            const netPay = gross - totalTax;
            
            const netPerPeriod = Math.max(0, netPay / freq);
            const taxPerPeriod = totalTax / freq;
            
            document.getElementById('salaryTax').textContent = '-$' + taxPerPeriod.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('salaryNet').textContent = '$' + netPerPeriod.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
        document.querySelectorAll('input, select').forEach(el => el.addEventListener('input', calcSalary));
        calcSalary();
    </script>
"""

# 2. Tip Splitter
tip_body = """
    <div class="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 class="text-xl font-bold text-slate-900 mb-4 text-center">Tip & Bill Splitter</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Total Bill Amount ($)</label>
          <input type="number" id="tipBill" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="100.00">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Tip Percentage (%)</label>
          <div class="grid grid-cols-4 gap-2 mb-2" id="tipButtons">
            <button class="py-2 rounded-lg border border-blue-500 bg-blue-500 text-white font-semibold" data-val="15">15%</button>
            <button class="py-2 rounded-lg border border-slate-300 text-slate-600 font-semibold" data-val="18">18%</button>
            <button class="py-2 rounded-lg border border-slate-300 text-slate-600 font-semibold" data-val="20">20%</button>
            <button class="py-2 rounded-lg border border-slate-300 text-slate-600 font-semibold" data-val="custom">Custom</button>
          </div>
          <input type="number" id="tipCustom" class="w-full p-3 border border-slate-300 rounded-lg outline-none hidden" placeholder="Enter custom %">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Number of People</label>
          <input type="number" id="tipPeople" min="1" value="1" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
        </div>
      </div>
      <div class="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div class="flex justify-between py-1 text-sm text-slate-600">
          <span>Tip Amount:</span>
          <span id="tipAmountVal" class="font-semibold text-slate-800">$0.00</span>
        </div>
        <div class="flex justify-between py-1 text-sm text-slate-600 border-b border-blue-200 pb-2 mb-2">
          <span>Total with Tip:</span>
          <span id="tipTotalVal" class="font-semibold text-slate-800">$0.00</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-slate-800 font-bold">Per Person:</span>
          <span class="font-black text-blue-600 text-2xl" id="tipPerPerson">$0.00</span>
        </div>
      </div>
    </div>
    <script>
        let currentTip = 15;
        
        document.querySelectorAll('#tipButtons button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('#tipButtons button').forEach(b => {
                    b.className = "py-2 rounded-lg border border-slate-300 text-slate-600 font-semibold";
                });
                e.target.className = "py-2 rounded-lg border border-blue-500 bg-blue-500 text-white font-semibold";
                
                const val = e.target.getAttribute('data-val');
                if (val === 'custom') {
                    document.getElementById('tipCustom').classList.remove('hidden');
                    currentTip = parseFloat(document.getElementById('tipCustom').value) || 0;
                } else {
                    document.getElementById('tipCustom').classList.add('hidden');
                    currentTip = parseFloat(val);
                }
                calcTip();
            });
        });
        
        document.getElementById('tipCustom').addEventListener('input', (e) => {
            currentTip = parseFloat(e.target.value) || 0;
            calcTip();
        });
        
        function calcTip() {
            const bill = parseFloat(document.getElementById('tipBill').value) || 0;
            const people = Math.max(1, parseInt(document.getElementById('tipPeople').value) || 1);
            
            const tipAmt = bill * (currentTip / 100);
            const total = bill + tipAmt;
            const perPerson = total / people;
            
            document.getElementById('tipAmountVal').textContent = '$' + tipAmt.toFixed(2);
            document.getElementById('tipTotalVal').textContent = '$' + total.toFixed(2);
            document.getElementById('tipPerPerson').textContent = '$' + perPerson.toFixed(2);
        }
        
        document.getElementById('tipBill').addEventListener('input', calcTip);
        document.getElementById('tipPeople').addEventListener('input', calcTip);
    </script>
"""

# 3. Credit Card Payoff
cc_body = """
    <div class="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 class="text-xl font-bold text-slate-900 mb-4 text-center">Credit Card Payoff Calculator</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Credit Card Balance ($)</label>
          <input type="number" id="ccBalance" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="5000">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Interest Rate / APR (%)</label>
          <input type="number" id="ccApr" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="19.99">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Planned Monthly Payment ($)</label>
          <input type="number" id="ccPayment" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="200">
        </div>
      </div>
      <p id="ccWarning" class="text-xs text-red-600 font-bold mt-3 hidden">Warning: Monthly payment is too low to cover the interest!</p>
      
      <div class="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div class="flex justify-between py-2 border-b border-slate-200">
          <span class="text-slate-600 text-sm">Total Interest Wasted:</span>
          <span class="font-semibold text-red-500" id="ccInterest">$0.00</span>
        </div>
        <div class="flex justify-between items-center py-2 mt-2">
          <span class="text-slate-800 font-bold">Months to Pay Off:</span>
          <span class="font-black text-blue-600 text-xl" id="ccMonths">0</span>
        </div>
      </div>
    </div>
    <script>
        function calcCC() {
            const balance = parseFloat(document.getElementById('ccBalance').value) || 0;
            const apr = parseFloat(document.getElementById('ccApr').value) || 0;
            const payment = parseFloat(document.getElementById('ccPayment').value) || 0;
            
            const warning = document.getElementById('ccWarning');
            
            if (balance <= 0 || payment <= 0) {
                document.getElementById('ccInterest').textContent = '$0.00';
                document.getElementById('ccMonths').textContent = '0';
                warning.classList.add('hidden');
                return;
            }
            
            const r = (apr / 100) / 12;
            
            if (r > 0 && payment <= balance * r) {
                warning.classList.remove('hidden');
                document.getElementById('ccInterest').textContent = 'Infinite';
                document.getElementById('ccMonths').textContent = 'Never';
                return;
            }
            warning.classList.add('hidden');
            
            let months = 0;
            let interest = 0;
            if (r === 0) {
                months = Math.ceil(balance / payment);
            } else {
                months = Math.ceil(-Math.log(1 - (balance * r) / payment) / Math.log(1 + r));
                interest = (months * payment) - balance;
            }
            
            document.getElementById('ccInterest').textContent = '$' + Math.max(0, interest).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('ccMonths').textContent = months;
        }
        document.querySelectorAll('input').forEach(el => el.addEventListener('input', calcCC));
        calcCC();
    </script>
"""

# 4. Real Estate Commission
re_body = """
    <div class="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 class="text-xl font-bold text-slate-900 mb-4 text-center">Real Estate Commission</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Home Sale Price ($)</label>
          <input type="number" id="rePrice" class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="400000">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Commission Rate (%)</label>
          <select id="reRateSelect" class="w-full p-3 border border-slate-300 rounded-lg bg-white outline-none mb-2">
            <option value="5">5%</option>
            <option value="6" selected>6%</option>
            <option value="custom">Custom</option>
          </select>
          <input type="number" id="reRateCustom" class="w-full p-3 border border-slate-300 rounded-lg outline-none hidden" placeholder="Enter custom %">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Who Pays the Commission?</label>
          <select id="reWhoPays" class="w-full p-3 border border-slate-300 rounded-lg bg-white outline-none">
            <option value="seller" selected>Seller (Standard)</option>
            <option value="split">Split (50/50)</option>
          </select>
        </div>
      </div>
      <div class="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div class="flex justify-between py-1 text-sm text-slate-600">
          <span>Buyer Agent Share:</span>
          <span id="reBuyerShare" class="font-semibold text-slate-800">$0.00</span>
        </div>
        <div class="flex justify-between py-1 text-sm text-slate-600 border-b border-slate-200 pb-2 mb-2">
          <span>Seller Agent Share:</span>
          <span id="reSellerShare" class="font-semibold text-slate-800">$0.00</span>
        </div>
        <div class="flex justify-between py-1 text-sm text-slate-600 border-b border-slate-200 pb-2 mb-2">
          <span class="font-bold text-red-500">Total Commission Fee:</span>
          <span id="reTotalFee" class="font-bold text-red-500">$0.00</span>
        </div>
        <div class="flex justify-between items-center mt-2">
          <span class="text-slate-800 font-bold">Net Proceeds (Seller):</span>
          <span class="font-black text-green-600 text-xl" id="reNet">$0.00</span>
        </div>
      </div>
    </div>
    <script>
        document.getElementById('reRateSelect').addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                document.getElementById('reRateCustom').classList.remove('hidden');
            } else {
                document.getElementById('reRateCustom').classList.add('hidden');
            }
            calcRE();
        });
        
        function calcRE() {
            const price = parseFloat(document.getElementById('rePrice').value) || 0;
            let rateStr = document.getElementById('reRateSelect').value;
            let rate = 0;
            if (rateStr === 'custom') {
                rate = parseFloat(document.getElementById('reRateCustom').value) || 0;
            } else {
                rate = parseFloat(rateStr);
            }
            const who = document.getElementById('reWhoPays').value;
            
            const totalFee = price * (rate / 100);
            const splitFee = totalFee / 2;
            
            let sellerNet = 0;
            if (who === 'seller') {
                sellerNet = price - totalFee;
            } else {
                sellerNet = price - splitFee;
            }
            
            document.getElementById('reBuyerShare').textContent = '$' + splitFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('reSellerShare').textContent = '$' + splitFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('reTotalFee').textContent = '-$' + totalFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('reNet').textContent = '$' + Math.max(0, sellerNet).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
        document.querySelectorAll('input, select').forEach(el => el.addEventListener('input', calcRE));
        calcRE();
    </script>
"""

with open(os.path.join(root, 'salary-calculator', 'index.html'), 'w', encoding='utf-8') as f:
    f.write(generate_html('Salary Calculator Embed', salary_body))

with open(os.path.join(root, 'tip-splitter', 'index.html'), 'w', encoding='utf-8') as f:
    f.write(generate_html('Tip Splitter Embed', tip_body))

with open(os.path.join(root, 'credit-card-payoff', 'index.html'), 'w', encoding='utf-8') as f:
    f.write(generate_html('Credit Card Payoff Embed', cc_body))

with open(os.path.join(root, 'real-estate-commission', 'index.html'), 'w', encoding='utf-8') as f:
    f.write(generate_html('Real Estate Commission Embed', re_body))
