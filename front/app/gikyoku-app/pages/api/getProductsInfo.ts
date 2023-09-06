
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
/*
import { HttpRequest } from "@aws-sdk/protocol-http";
import { RequestSigner } from "@aws-sdk/s3-request-presigner";
import { Sha256 } from "@aws-crypto/sha256-js";


const ACCESS_KEY = process.env.AMAZON_ACCESSKEY || "";
const PARTNER_TAG = process.env.PARTNERTAG || "";
const SECRET_KEY = process.env.AMAZON_SECRETKEY || "";
const region = "us-west-2"; // ご使用のリージョンに合わせて変更してください
const service = "ProductAdvertisingAPI";
const endpoint = "https://webservices.amazon.co.jp/paapi5/searchitems"; // APIのエンドポイント

const amazonApiUrl = "https://webservices.amazon.co.jp/paapi5/searchitems";

const generateKey = async () => {
  // リクエスト情報をセットアップ
  const request = new HttpRequest({
    method: "POST", // リクエストのHTTPメソッド
    protocol: "https:", // プロトコル
    path: "/paapi5/searchitems", // リクエストのパス
    headers: {
      Host: "webservices.amazon.co.jp", // Hostヘッダー
      Accept: "application/json, text/javascript",
      "Accept-Language": "en-US",
      "Content-Type": "application/json; charset=UTF-8",
      "X-Amz-Date": "20230905T120618Z",
      "X-Amz-Target":
        "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems",
      "Content-Encoding": "amz-1.0",
    },
    body: JSON.stringify({
      Keywords: "野田秀樹",
      PartnerTag: PARTNER_TAG, // パートナータグを指定
      PartnerType: "Associates",
      Marketplace: "www.amazon.co.jp",
    }),
  });

  // AWS Signatureを生成するための設定
  const signer = new RequestSigner(
    {
      service: service,
      region: region,
      credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY,
      },
      sha256: Sha256,
    },
    (await request).clone() // HttpRequestオブジェクトをコピー
  );
  signer.sign(await request);
  const authorizationHeader = (await request).headers["Authorization"];
  return authorizationHeader;
};

const getAmazonData = async () => {
  const authorizationHeader = await generateKey();
  const headers = {
    Host: "webservices.amazon.co.jp",
    Accept: "application/json, text/javascript",
    "Accept-Language": "en-US",
    "Content-Type": "application/json; charset=UTF-8",
    "X-Amz-Date": "20230905T120618Z",
    "X-Amz-Target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems",
    "Content-Encoding": "amz-1.0",
    Authorization: authorizationHeader,
  };

  const requestData = {
    Keywords: "野田秀樹",
    PartnerTag: PARTNER_TAG,
    PartnerType: "Associates",
    Marketplace: "www.amazon.co.jp",
  };

  try {
    const response = await axios.post(amazonApiUrl, requestData, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const amazonApiHandler = async (_req: NextApiRequest, res: NextApiResponse) => {
  console.log(PARTNER_TAG);
  console.log("ACCESS_KEY");
  try {
    //const authorizationHeader = "aaa";
    const authorizationHeader = await generateKey();
    //const amazonData = await getAmazonData();
    res.status(200).json({
      authorizationHeader,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Amazon data" });
  }
};

export default amazonApiHandler;
*/

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({ result: "this API does not work anymore" });
}
