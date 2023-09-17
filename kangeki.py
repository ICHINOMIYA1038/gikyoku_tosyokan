import time
import requests
from bs4 import BeautifulSoup
import csv

# 1から指定した数まで繰り返す
start_id = 1
end_id = 2641  # 例として1から10までのIDを指定

# CSVファイルを開く
with open('kangeki_data.csv', 'w', newline='', encoding='utf-8') as csvfile:
    csvwriter = csv.writer(csvfile)
    
    # ヘッダーを書き込む
    csvwriter.writerow(['Title','group' 'url', 'category','pay_labels'])

    # IDを指定した範囲でループ
    for id in range(start_id, end_id + 1):
        time.sleep(1)
        endpoint = 'https://kan-geki.com/streaming/play/'
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
            target_element = soup.find('div', id='col-info').find_all('p')

            # テキストを取得します
            cat = target_element[0].get_text()
            group = target_element[1].get_text()
            category = cat.replace(" ", "").replace("\n", "")
            groupname = group.replace(" ", "").replace("\n", "")
            title = soup.find('meta', attrs={'property': 'og:title', 'content': True})["content"]
            #title = soup.cssselect('meta[property="og:title"]')[0].get('content')
            pay_labels = soup.find('span', class_='payLabel').get_text()
           
            # データをCSVファイルに書き込む
            csvwriter.writerow([title, groupname ,url,category,pay_labels])

            time.sleep(3)  # 3秒待つ

        except Exception as e:
            print(f"ID: {id}, URL: {url} でエラーが発生しました。スキップします。エラーメッセージ: {str(e)}")

print("CSVファイルにデータを書き込みました。")