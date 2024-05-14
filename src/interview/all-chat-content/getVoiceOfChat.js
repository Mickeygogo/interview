const audioContext = new AudioContext();
let currentSource = null;

// 鉴权签名
async function getAuthStr(date) {
  const encoder = new TextEncoder(); // 用于 HMAC 操作的文本编码器
  const secretKey = encoder.encode(config.apiSecret);
  const signatureOrigin = `host: ${config.host}\ndate: ${date}\nGET ${config.uri} HTTP/1.1`;
  const msgBuffer = encoder.encode(signatureOrigin);

  const key = await window.crypto.subtle.importKey(
    'raw',
    secretKey,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await window.crypto.subtle.sign('HMAC', key, msgBuffer);

  const signatureArray = Array.from(new Uint8Array(signature));
  const signatureBase64 = btoa(String.fromCharCode.apply(null, signatureArray));

  const authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureBase64}"`;
  const authStr = btoa(authorizationOrigin);

  return authStr;
}

function utf8ToBase64(str) {
  let utf8Bytes = new TextEncoder('utf-8').encode(str);
  let base64String = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    base64String += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(base64String);
}

async function initializeWebSocket(text, vcn, callback) {
  let date = new Date().toUTCString();
  let authStr = await getAuthStr(date);
  let wssUrl = `${config.hostUrl}?authorization=${authStr}&date=${date}&host=${config.host}`;

  const otherServerSocket = new WebSocket(wssUrl);

  let audioDataCache = [];

  otherServerSocket.onopen = () => {
    console.log('连接成功');
    send(otherServerSocket, text, vcn);
  };

  otherServerSocket.onmessage = async (event) => {
    let res = JSON.parse(event.data);

    if (res.code !== 0) {
      console.error(`${res.code}: ${res.message}`);
      otherServerSocket.close();
      return;
    }

    let audio = res.data.audio;
    // 讯飞读出来的数据
    let audioBuf = new Uint8Array(
      atob(audio)
        .split('')
        .map(function (c) {
          return c.charCodeAt(0);
        })
    );
    // 把新接收到的数据块存储到缓存数组中
    audioDataCache.push(audioBuf);

    if (res.code === 0 && res.data.status === 2) {
      let allAudioBuf = new Uint8Array(
        audioDataCache.reduce((acc, val) => acc.concat(Array.from(val)), [])
      );
      const audioBuffer = await audioContext.decodeAudioData(
        allAudioBuf.buffer
      );
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);

      // 新增 start
      if (currentSource !== null) {
        currentSource.stop();
      }
      currentSource = source;

      // 新增 end
      source.start();
      audioDataCache = [];
      setTimeout(() => {
        callback && callback();
      }, 0);
    }
  };

  otherServerSocket.onerror = (error) => {
    console.error('WebSocket Error: ', error);
  };

  otherServerSocket.onclose = (event) => {
    if (event.wasClean) {
      console.info(
        `Closed cleanly, code=${event.code}, reason=${event.reason}`
      );
    } else {
      console.error('Connection died');
    }
  };
}

// 传输数据
function send(otherServerSocket, text, vcn = 'aisjiuxu') {
  console.log(text, 'text');
  let frame = {
    // 填充common
    common: {
      app_id: config.appid,
    },
    // 填充business
    business: {
      aue: 'lame',
      sfl: 1,
      auf: 'audio/L16;rate=16000',
      // vcn: 'x3_ziling', 上海
      vcn, // 合肥
      speed: 50,
      volume: 50,
      pitch: 50,
      bgs: 0,
      tte: 'UTF8',
    },
    // 填充data
    data: {
      text: utf8ToBase64(text || config.text),
      status: 2,
    },
  };
  otherServerSocket.send(JSON.stringify(frame));
}

// 系统配置
const config = {
  // 请求地址
  hostUrl: 'wss://tts-api.xfyun.cn/v2/tts',
  host: 'tts-api.xfyun.cn',
  // 在控制台-我的应用-在线语音合成（流式版）获取
  appid: '7bf0a5da',
  // 在控制台-我的应用-在线语音合成（流式版）获取
  apiSecret: 'ZTg4MTI1MGYxOTA3MTdmNzRiNDBjYTBh',
  // 在控制台-我的应用-在线语音合成（流式版）获取
  apiKey: '94b6aaa77c517cfacad007055cd191ab',
  text: '这是兜底文案',
  uri: '/v2/tts',
};

// let wssUrl = config.hostUrl + '?authorization=' + getAuthStr(date) + '&date=' + date + '&host=' + config.host;

export const getAudioInfo = async (text, vcn, callback) => {
  initializeWebSocket(text, vcn, callback);
};
