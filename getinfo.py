import time
import requests
from bs4 import BeautifulSoup
import re
import csv

# 1から指定した数まで繰り返す
start_id = 1
end_id = 537  # 例として1から10までのIDを指定

# CSVファイルを開く
with open('drama_data.csv', 'w', newline='', encoding='utf-8') as csvfile:
    csvwriter = csv.writer(csvfile)
    
    # ヘッダーを書き込む
    csvwriter.writerow(['Title', 'Author', 'Playtime', 'Male Count', 'Female Count'])

    # IDを指定した範囲でループ
    for id in range(start_id, end_id + 1):
        time.sleep(1)
        endpoint = 'https://playtextdigitalarchive.com/drama/detail/'
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
            info = soup.find_all("dd")
            title = soup.find_all("h1")[1].text if soup.find_all("h1") else ''
            author = info[0].find("a").string if len(info) > 0 and info[0].find("a") else ''
            playtime = info[1].find("a").string if len(info) > 1 and info[1].find("a") else ''
            input_string = info[2].find("span").string if len(info) > 2 and info[2].find("span") else ''

            # 男性と女性の人数を抽出
            def extract_male_count(input_string):
                match = re.search(r'男性(\d+)人', input_string)
                male_count = 0
                if match:
                    male_count = int(match.group(1))
                return male_count

            # 女性人数を抽出
            def extract_female_count(input_string):
                match = re.search(r'女性(\d+)人', input_string)
                female_count = 0
                if match:
                    female_count = int(match.group(1))
                return female_count

            male = extract_male_count(input_string)
            female = extract_female_count(input_string)

            # データをCSVファイルに書き込む
            csvwriter.writerow([title, author, playtime, male, female])

            print(f"ID: {id}, Title: {title}, Author: {author}, Playtime: {playtime}, Male Count: {male}, Female Count: {female}")

            time.sleep(3)  # 3秒待つ

        except Exception as e:
            print(f"ID: {id}, URL: {url} でエラーが発生しました。スキップします。エラーメッセージ: {str(e)}")

print("CSVファイルにデータを書き込みました。")