const fs = require('fs')
const _Code = fs.readFileSync(__dirname+'/langs.Aki').toString()

const mainCode = _Code.replaceAll('\n',":").replaceAll('\r',"").split(":")

const CORE_Hensuu = []

class ErrorMessage  {
    constructor(title,message) {                                                                                    
        console.log(`\n\n [Aki ${title} Error]\n\n ${message}\n`)
    }
}
const STARTMIN = new Date().getSeconds()
const STARTTHESYSTEM = new Date().getMilliseconds()
console.log(`処理を開始 ${STARTTHESYSTEM}`)

class Core {

    set(code) {    
        const _saveCode = code.replaceAll(' ',",").split(',')
        if(code.match(/#/)) return;
        if(_saveCode[3] === "num"){
            if(isNaN(Number(_saveCode[2].replace('v>',""))) ){ 
            throw new ErrorMessage('[AK008] 非数', "非数をnum型に当てはめることはできません。")
            }
        }
            if(!code.match(/str|num/)) throw new ErrorMessage('[AK001] コンパイル','変数の型が不明です。 String or Number  で指定できます。\n\n 例: Set Any v>0 num \n Set Nube "a" str')
            //if(!code.match(/,/)) throw new ErrorMessage('[AK002] コンパイル','変数の宣言方法が不正です。')
            if(!code.match(/v>/)) throw new ErrorMessage('[AK003] コンパイル','変数の宣言が不明です。v>で指定してください。')
            CORE_Hensuu.push(_saveCode)
    }

    toInt(value){
        let HensuuLine = 0
        const _toIntFunction = value.replaceAll(' ',",").split(",")
        //console.log(_toIntFunction)
        CORE_Hensuu.forEach((l) => {
            if(l[1] === _toIntFunction[0]){
                if(isNaN(Number(l[2].replace('v>',"")))){
                   new ErrorMessage('[AK010] MayBe Warning',`変数 ${l[1]} は数字ではありませんが、Number型に変換されてしまいました。\n\n コンパイラーは、この変数をMaybe numとし、通常のnumとは区別されます。`)
                   l[3] = "Maybe num"
                } else {
                   l[2] = Number(l[2].replace("v>",""))
                   l[2] = "v>"+l[2]
                   l[3] = "num"
                }
                CORE_Hensuu[HensuuLine] = []
                CORE_Hensuu.push(l)
            } else {
                HensuuLine++
            }
        })
    }

    ifCompile(value){
       const _codeArray = value.replaceAll(' ',",").split(',')
       let HikakuArray_1 = []
       let HikakuArray_2 = []
       CORE_Hensuu.forEach((v) => {
          if(v[1] === _codeArray[1].replace(">","")){
             HikakuArray_1 = String(v).split(',')
          }
          if(v[1] === _codeArray[3].replace(">","")){
             HikakuArray_2 = String(v).split(',')
          }
       })
       if(_codeArray[4] !== "return") throw new ErrorMessage('[AK007]', "Returnは必須です。")

       if(!(HikakuArray_1[3] === HikakuArray_2[3])) throw new ErrorMessage('[AK004] IF文',"IF文の型の比較はいつでもfalseとなってしまいます。比較の際は同じ型を参照してください！")

       switch(_codeArray[2]){
         case "==": {
            HikakuArray_1[2].replace('v>',"") == HikakuArray_2[2].replace('v>',"") ? this.execute(_codeArray, true) : this.execute(_codeArray, false)
            break;
         }
         case "===": {
            HikakuArray_1[2].replace('v>',"") === HikakuArray_2[2].replace('v>',"") ? this.execute(_codeArray, true) : this.execute(_codeArray, false)
            break;
         }
         case "!==": {
            HikakuArray_1[2].replace('v>',"") !== HikakuArray_2[2].replace('v>',"") ? this.execute(_codeArray, true) : this.execute(_codeArray, false)
            break;
         }
         case "Istype": {
            HikakuArray_1[3] === HikakuArray_2[3] ? this.execute(_codeArray, true) : this.execute(_codeArray, false)
            break;
         }
         default : {
            throw new ErrorMessage('[AK005] IF処理コンパイル',`IF処理の条件が当てはまりませんでした。\n${(HikakuArray_1[3] === "str" && HikakuArray_2[3] === "num") ? "貴方が使用するべき比較演算子は Istype ではありませんか？": ""}\n現在使用できる比較演算子は以下の通りです。\n\n == \n === \n !== \nIstype`)
         }
       }
    }

    execute(Array, boolean){

        const _OLDIFDATA = String(Array).split(',')

        const Bool = boolean


        if(_OLDIFDATA[6] === "say" ){
            if(Bool !== true) return;
            this.sayCompile(`${_OLDIFDATA[6]} ${_OLDIFDATA[7]}`)

        } else
        if(_OLDIFDATA[6] === "Set" ){
            if(Bool !== true) return;

            if(_OLDIFDATA[12] !== "return") throw new ErrorMessage('[AK007]', "Returnは必須です。")
            this.set(`${_OLDIFDATA[6]} ${_OLDIFDATA[7]} ${_OLDIFDATA[8]} ${_OLDIFDATA[9]}`)

        } else {

            throw new ErrorMessage('[AK006-0] IF処理 True-条件',"IF条件True後の処理に不明なコマンドが選択されました。")

        }
    }

    sayCompile(code){
      const complieOld = code.replaceAll(' ',"-").replaceAll('say',"").split('-')
      let Kekka = ""
      complieOld.forEach((text) => {
         if(text.match(/>/)){
           //console.log(text.replace('>',""))
            CORE_Hensuu.forEach((v) => {
                if(v[1] === text.replace('>',"")){
                    Kekka += v[2].replace('v>',"")
                }
            })          
         }
         if(text.match(/Str\+\"/)){
           // console.log(`Hikaku MAe + ${text}`)
            if(!text.match(/Str\+\"[^\"]+\"/)) throw new ErrorMessage('[AK009] String宣言ミス',"String宣言は Str+\"Text\" のようにしなければなりません。 ")
            Kekka += String(text).replace('Str+"',"").replace('"',"")
         }
         if(text.match(/Space</)){
            Kekka += " "
         }
         //console.log(text)
         if(text.match(/WhatType=/)){
            const _NewCompiledCode = text.split('=');
            //console.log(_NewCompiledCode[1])
            if(!_NewCompiledCode[1]) throw new ErrorMessage('[AK011] WhatTypeError',"WhatType変換に失敗しました。変数はしっかりと記入済みですか？")

            CORE_Hensuu.forEach((l) => {
                if(l[1] === _NewCompiledCode[1]){
                   Kekka += l[3]
                }
            })
        }
      })
      this.say(Kekka)
    }

    

    say(message) {
        console.log(message)
    }
}
mainCode.forEach((code) => {
    if(code.match(/#/)) return;
    if(String(code).match(/Set/)){
         new Core().set(code)
    }
    if(String(code).match(/say/)){
      //if(String(code).match(/if/)) return;
         new Core().sayCompile(code)
    }
    if(String(code).match(/if/)){
        new Core().ifCompile(code)
    }
    if(String(code).match(/toInt/)){
        new Core().toInt(code)
    }
    if(String(code).match(/end/)){
        //console.log(`Aki LOG : 処理が終了しました。`)
       process.exit()
    } 

})
console.log(`処理を終了 \n${new Date().getSeconds()} DiFF ${new Date().getSeconds() - STARTMIN} ${new Date().getMilliseconds()} DIFF ${new Date().getMilliseconds() - STARTTHESYSTEM}`)


