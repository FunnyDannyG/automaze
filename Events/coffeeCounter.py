import requests
from bs4 import BeautifulSoup
import sys

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'}
url = 'https://ko-fi.com/fungusdesu'

result = requests.get(url, headers=headers)
soup = BeautifulSoup(result.content, 'html.parser')

span_element = soup.find('span', class_='koficounter-value kfds-font-size-small kfds-left-mrgn-8')
total_amount = span_element.get_text()

sys.stdout.write(total_amount)
sys.exit(0)