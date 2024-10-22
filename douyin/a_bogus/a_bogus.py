from pathlib import Path

import httpx
from urllib.parse import urlencode
import subprocess

from douyin.ac_signature.ac_signature import get_ttwid

client = httpx.Client(follow_redirects=False)
main_headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/129.0.0.0 Safari/537.36"
}
client.headers.update(main_headers)
comment_url = "https://www.douyin.com/aweme/v1/web/comment/list/"
comment_params = {
    "aweme_id": "7418051171211840806",
    "cursor": 0,
    "count": 5,
    "item_type": 0
}
file_path = Path(__file__).parent / "a_bogus.js"
a_bogus = subprocess.run(['node', file_path, urlencode(comment_params), "dhzx", main_headers.get("user-agent"),
                          "6241", "6383"], capture_output=True)
a_bogus = a_bogus.stdout.decode('utf-8').strip()
comment_params["a_bogus"] = a_bogus
client.cookies.update({
    "ttwid": get_ttwid()[0].cookies["ttwid"],
})
main_url = "https://www.douyin.com/video/7418051171211840806"
client.headers.update({"referer": main_url})
comment_response = client.get(comment_url, params=comment_params)
print(comment_response.text)
