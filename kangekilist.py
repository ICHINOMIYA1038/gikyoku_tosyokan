import time
import requests
from bs4 import BeautifulSoup
import re
import csv

# 1から指定した数まで繰り返す
start_id = 1
end_id = 537  # 例として1から10までのIDを指定

# CSVファイルを開く
with open('kangeki_data.csv', 'w', newline='', encoding='utf-8') as csvfile:
    csvwriter = csv.writer(csvfile)
    
    # ヘッダーを書き込む
    csvwriter.writerow(['Title', 'url', 'category', 'time'])

    # IDを指定した範囲でループ
    for id in range(start_id, end_id + 1):
        time.sleep(1)
        endpoint = 'https://kan-geki.com/streaming?page='
        url = endpoint + str(id)
        
        try:
            response = requests.get(url)
            if response.status_code != 200:
                print(f"ID: {id}, URL: {url} にアクセスできませんでした。スキップします。")
                time.sleep(3)  # 3秒待つ
                response.close()
                continue
            response.close()
            soup = BeautifulSoup(response.text, 'html.parser')

            # DOMが見つからない場合は空白に設定
            info = soup.find_all("col-info")
            title = soup.cssselect('meta[property="og:title"]')[0].get('content')
            category = soup.find('span', class_='badge').text

           
            # データをCSVファイルに書き込む
            csvwriter.writerow([title, url,category,playtime])

            print(f"ID: {id}, Title: {title}, Author: {author}, Playtime: {playtime}, Male Count: {male}, Female Count: {female}")

            time.sleep(3)  # 3秒待つ

        except Exception as e:
            print(f"ID: {id}, URL: {url} でエラーが発生しました。スキップします。エラーメッセージ: {str(e)}")

print("CSVファイルにデータを書き込みました。")