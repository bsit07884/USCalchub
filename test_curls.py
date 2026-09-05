import subprocess
import time

urls = [
    # 1. www + no-slash
    "https://www.uscalchub.com/salary-calculator/texas/60k",
    "https://www.uscalchub.com/salary-calculator/florida/60k",
    "https://www.uscalchub.com/salary-calculator/california/60k",
    "https://www.uscalchub.com/salary-calculator/new-york/60k",
    "https://www.uscalchub.com/tip-calculator",
    
    # 2. www + slash
    "https://www.uscalchub.com/salary-calculator/texas/60k/",
    "https://www.uscalchub.com/salary-calculator/florida/60k/",
    "https://www.uscalchub.com/salary-calculator/california/60k/",
    "https://www.uscalchub.com/salary-calculator/new-york/60k/",
    "https://www.uscalchub.com/tip-calculator/",
    
    # 3. New Group B pages
    "https://uscalchub.com/salary-calculator/nevada/50k/",
    "https://uscalchub.com/salary-calculator/north-carolina/75k/",
    
    # 4. Static assets
    "https://uscalchub.com/logo.png",
    "https://uscalchub.com/robots.txt",
    "https://uscalchub.com/sitemap.xml",
    
    # 5. Bare domain
    "https://uscalchub.com/"
]

def check_url(url):
    print(f"Testing: {url}")
    print("-" * 40)
    try:
        # -s for silent, -I for head request
        result = subprocess.run(["curl", "-s", "-I", url], capture_output=True, text=True, check=True)
        # We only want the first few lines of the header (e.g. status code, location)
        lines = result.stdout.strip().split('\n')
        for line in lines:
            lower = line.lower()
            if line.startswith("HTTP/") or lower.startswith("location:") or lower.startswith("content-type:"):
                print(line.strip())
    except Exception as e:
        print(f"Error checking {url}: {e}")
    print("\n")

print("Waiting 10 seconds for deployment to complete...")
time.sleep(10)
for u in urls:
    check_url(u)
