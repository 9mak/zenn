import crypto from 'crypto';
import https from 'https';
import fs from 'fs';

const apiKey = process.env.X_API_KEY;
const apiSecret = process.env.X_API_SECRET;
const accessToken = process.env.X_ACCESS_TOKEN;
const accessTokenSecret = process.env.X_ACCESS_TOKEN_SECRET;
const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: node post-to-x.mjs <article-file>');
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');

// frontmatterから各フィールドを取得
const titleMatch = content.match(/^title:\s*["']?(.+?)["']?\s*$/m);
const emojiMatch = content.match(/^emoji:\s*["']?(.+?)["']?\s*$/m);
const publishedMatch = content.match(/^published:\s*(.+?)\s*$/m);
const publishedAtMatch = content.match(/^published_at:\s*(.+?)\s*$/m);
const topicsMatch = content.match(/^topics:\s*\[(.+?)\]\s*$/m);

const title = titleMatch?.[1] ?? '';
const emoji = emojiMatch?.[1] ?? '';
const published = publishedMatch?.[1] === 'true';
// published_at はJST（UTC+9）として解釈する
const publishedAt = publishedAtMatch?.[1]
  ? new Date(publishedAtMatch[1].trim() + '+09:00')
  : null;

// topicsをハッシュタグに変換（例: "servicenow" → #ServiceNow）
const hashtags = topicsMatch?.[1]
  ? topicsMatch[1]
      .split(',')
      .map(t => t.trim().replace(/['"]/g, ''))
      .map(t => '#' + t.charAt(0).toUpperCase() + t.slice(1))
      .join(' ')
  : '#Zenn';

if (!published) {
  console.log(`Skipping ${filePath} (published: false)`);
  process.exit(0);
}

const slug = filePath.replace(/^articles\//, '').replace(/\.md$/, '');
const url = `https://zenn.dev/9mak/articles/${slug}`;

// 予約投稿かどうかで文面を分岐
const isScheduled = publishedAt && publishedAt > new Date();
let tweetText;

if (isScheduled) {
  const dateStr = publishedAt.toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  tweetText = `${emoji} ${title}

${dateStr} に公開予定です！

${url}

${hashtags}`;
} else {
  tweetText = `${emoji} ${title}

${url}

${hashtags}`;
}

console.log('Posting tweet:\n', tweetText);

function percentEncode(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

function generateOAuthHeader(method, endpointUrl) {
  const oauthParams = {
    oauth_consumer_key: apiKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: '1.0',
  };

  const sortedParams = Object.keys(oauthParams).sort()
    .map(k => `${percentEncode(k)}=${percentEncode(oauthParams[k])}`)
    .join('&');

  const sigBase = `${method}&${percentEncode(endpointUrl)}&${percentEncode(sortedParams)}`;
  const sigKey = `${percentEncode(apiSecret)}&${percentEncode(accessTokenSecret)}`;
  oauthParams.oauth_signature = crypto.createHmac('sha1', sigKey).update(sigBase).digest('base64');

  return 'OAuth ' + Object.keys(oauthParams).sort()
    .map(k => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
    .join(', ');
}

const endpoint = 'https://api.twitter.com/2/tweets';
const body = JSON.stringify({ text: tweetText });
const authHeader = generateOAuthHeader('POST', endpoint);

const req = https.request(endpoint, {
  method: 'POST',
  headers: {
    'Authorization': authHeader,
    'Content-Type': 'application/json',
  },
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    if (res.statusCode !== 201) process.exit(1);
  });
});

req.on('error', (e) => { console.error(e); process.exit(1); });
req.write(body);
req.end();
