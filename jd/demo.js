import crypto from 'crypto';
import { URL } from 'url';
import { v4 as uuidv4 } from 'uuid';

// Merchant ID
const MERCHANT_ID = "AS5525py3DAslwdfZx";

// Merchant public key serial number
const SERIAL_NO = "1";

// Merchant private key
const MERCHANT_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
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
-----END PRIVATE KEY-----`;

const PLACEHOLDER_STR = '="%s",';
const PLACEHOLDER_STR_END = '="%s"';
const PLACEHOLDER_INT = '="%d",';

const HEADER_AUTHORIZATION_MCHID = "mchid";
const HEADER_AUTHORIZATION_SERIAL_NO = "serial_no";
const HEADER_AUTHORIZATION_NONCE_STR = "nonce_str";
const HEADER_AUTHORIZATION_SIGNATURE = "signature";
const HEADER_AUTHORIZATION_TIMESTAMP = "timestamp";

// Build signer info format
function buildSignerInfoFormat(mchId, serialNo, nonceStr, timestamp, signature) {
  return `${HEADER_AUTHORIZATION_MCHID}="${mchId}",` +
         `${HEADER_AUTHORIZATION_SERIAL_NO}="${serialNo}",` +
         `${HEADER_AUTHORIZATION_NONCE_STR}="${nonceStr}",` +
         `${HEADER_AUTHORIZATION_TIMESTAMP}="${timestamp}",` +
         `${HEADER_AUTHORIZATION_SIGNATURE}="${signature}"`;
}

// Sign function
function sign(requestData, key) {
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(requestData);
  sign.end();
  const signature = sign.sign(key);
  return signature.toString('base64');
}

// Get signature info
function getSignatureInfo(method, url, body) {
  const nonceStr = uuidv4();
  const timestamp = Math.floor(Date.now() / 1000);
  const message = buildMessage(method, url, timestamp, nonceStr, body);
  console.log("Constructed message for signing:", message);
  const signature = sign(message, MERCHANT_PRIVATE_KEY);
  return buildSignerInfoFormat(MERCHANT_ID, SERIAL_NO, nonceStr, timestamp, signature);
}

// Build message for signing
function buildMessage(method, url, timestamp, nonceStr, body) {
  const parsedUrl = new URL(url);
  let canonicalUrl = parsedUrl.pathname;
  if (parsedUrl.search) {
    canonicalUrl += parsedUrl.search;
  }
  return method + '\n' +
         canonicalUrl + '\n' +
         timestamp + '\n' +
         nonceStr + '\n' +
         body + '\n';
}

// Example usage
const schema = "SHA256withRSA";
const httpUrl = "http://appleseed-uat-portal.joypaydev.com/v1/fund/money/destroy";
const body = `{
    "appleseedAccountId": "9000003010100000001111",
    "amount": "1.24",
    "currency": "USD",
    "balanceBefore": "1000",
    "balanceAfter": "1001.24",
    "remark": "tset"
}`;

console.log(schema + " " + getSignatureInfo("POST", httpUrl, body));