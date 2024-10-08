import subprocess
import sys

import httpx


client = httpx.Client(follow_redirects=False)
main_url = "https://v.douyin.com/iktn4pDJ/"
main_headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
                      "Chrome/129.0.0.0 Safari/537.36"
}
client.headers.update(main_headers)
while True:
    main_response = client.get(main_url)
    if main_response.status_code not in [200, 302]:
        print(main_response.status_code)
        sys.exit()
    if '__ac_nonce' in main_response.cookies.keys():
        break
    main_url = main_response.headers["Location"]

ac_url = main_url[8:]
ac_nonce = main_response.cookies["__ac_nonce"]
ac_signature = subprocess.run(['node', './ac_signature.js', ac_url, ac_nonce, main_headers["user-agent"]],
                              capture_output=True)
ac_signature = ac_signature.stdout.decode('utf-8').strip()
client.cookies.update({
    "__ac_referer": "__ac_blank",
    "__ac_signature": ac_signature
})
main_response = client.get(main_url)
print(main_response.cookies)
print(client.cookies)
