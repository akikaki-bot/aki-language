const ErrorMessage = require('../core')

const AkiHttp = {
    get: async function (url) {
       try { 
          const res = await fetch(url)
          const data = await res.json()
          return data
       } catch(err) {
           throw new ErrorMessage("[AHP001] Request","サーバーとの接続に失敗しました。以下エラー文\n\n" + err ? err.message ? err.message : err : "不明エラー")
       }
    }
}

module.exports = AkiHttp