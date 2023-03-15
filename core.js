const fs = require('fs')
const Init = require('./run')
const AkiHttp = require('./aki-http/http')

function __sleep__(sec) {
    return new Promise(function(resolve) {
       setTimeout(function() {resolve()}, sec * 1000);
    })
}

var NotFunction = undefined

class ErrorMessage  {
    constructor(title,message) {                                                                                    
        console.log(`\n\n [Aki ${title} Error]\n\n ${message}\n`)
    }
}

class WarningMessage {
    constructor(title,message) {
        console.log(`\n\n [\u001b[33m${title ? title : "？"}\u001b[0m]\n\n ${message} \n`)
    }
}

module.exports = WarningMessage
module.exports = ErrorMessage

let ProcessingLine = 0

const path = process.argv[2]

const _Code = fs.readFileSync(__dirname +"\\"+ path).toString()
if(!_Code) {
    throw new ErrorMessage(`[RN001] 実行`,"実行する.Akiファイルが存在しませんでした。")
}


const mainCode = _Code.replaceAll('\n',",").replaceAll('\r',"").split(",")
 
const CORE_Hensuu = []
const TEMP_Hensuu = []
/**
 * @type {Array<import('./types/type').AkiLanguage_Function>}
 * 型宣言は重要だよね
 */
const CORE_Functions = []
const RunningFunction = false;
let FunctionAdding = false;
let AkiResponseFunctioning = false

const STARTMIN = new Date().getSeconds()
const STARTTHESYSTEM = new Date().getMilliseconds()
console.log(`Akilang : 処理を開始 ms ${STARTTHESYSTEM}\n\n\n`)

class Core {

    set(code) {    
        if(!String(code).match(/Set\s[A-Z,a-z,0-9]+\s(v>)[A-Z,a-z,0-9]+\s(str|num|any|Func)/)) return;
        const _saveCode = code.replaceAll(' ',",").split(',')
        if(code.match(/#/)) return;
        if(_saveCode[3] === "num"){
            if(isNaN(Number(_saveCode[2].replace('v>',""))) ){ 
            throw new ErrorMessage('[AK008] 非数', "非数をnum型に当てはめることはできません。"+`\n ${ProcessingLine}行目 - Method`)
            }
        }
            if(!code.match(/str|num|Func/)) throw new ErrorMessage('[AK001] コンパイル','変数の型が不明です。 String , Number or Func で指定できます。\n\n 例: Set Any v>0 num \n Set Nube "a" str'+`\n ${ProcessingLine}行目 - Method`)
            //if(!code.match(/,/)) throw new ErrorMessage('[AK002] コンパイル','変数の宣言方法が不正です。')
            if(!code.match(/v>/)) {
               if(!code.match(/Func/))  throw new ErrorMessage('[AK003] コンパイル','変数の宣言が不明です。v>で指定してください。'+`\n ${ProcessingLine}行目 - Method`)
            } 
            CORE_Hensuu.push(_saveCode)
        
    }

    toInt(value){
        if(FunctionAdding === true) return;
        let HensuuLine = 0
        const _toIntFunction = value.replaceAll(' ',",").split(",")
        //console.log(_toIntFunction)
        CORE_Hensuu.forEach((l) => {
            if(l[1] === _toIntFunction[0]){
                if(isNaN(Number(l[2].replace('v>',"")))){
                   new ErrorMessage('[AK010] MayBe Warning',`変数 ${l[1]} は数字ではありませんが、Number型に変換されてしまいました。\n\n コンパイラーは、この変数をMaybe numとし、通常のnumとは区別されます。\n ${ProcessingLine}行目 - Method`)
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
        if(AkiResponseFunctioning) {
            throw new ErrorMessage('[AKFUNC013]',"申し訳ございませんが、現段階ではHTTPRESPONCEFUNCTION中にtoInt関数を実行することができません。")
        }
    }

    // Todo 実装する -> CoreClassではなくUtilClassに変更
    MathSum(value) {
        const _toChangeValue = String(value).replaceAll(' ',",").split(',')
    }

    /**
     * @param {String} hensuu 
     * @returns {boolean[]}
     */
    CheckHennsuu(hensuu) {
        //console.log(TEMP_Hensuu.map((t) => t[1] === hensuu.replace(">","") ? true : false))
        if(AkiResponseFunctioning) return 
        (
            CORE_Hensuu.map((v) => v[1] === hensuu.replace('>',"") ? true : false).includes(true) ? 
            [true] : 
            TEMP_Hensuu.map((t) => t[1] === hensuu.replace(">","") ? true : false).includes(true) ? 
            [true] : 
            [false]
        )
        return CORE_Hensuu.map((v) => v[1] === hensuu.replace('>',"") ? true : false)
    }

    runFunc(func) {
        //tf(NubeJSON)
        //が対象だから.... たぶんReplaceしてSplitすればいいや]
       const funcCall = String(String(func).match(/[A-Z,a-z,0-9]+\([A-Z,a-z,0-9]+\)/)).replace('(',",").replace(')',"").split(',')
       console.log(funcCall)
    }

    exefunc(code) {

    }

    func (code) {
       FunctionAdding = true;
       const oldfunc = String(code).split(" ")
       const funcName = oldfunc[1] ? oldfunc[1] : NotFunction
       const funcVal = oldfunc[2] ? oldfunc[2] : NotFunction
       const ArrowFunction = oldfunc[3] === "=>"
       
       if(!funcName || !funcVal) throw new ErrorMessage('[AK014] Functon Name Not Found',"関数の名前が不明です。関数の構造が把握できません。")
       if(!ArrowFunction) throw new ErrorMessage('[AK015] Not Function Rules',"関数の開始地点は必ず=>が必要です。")
       if(!String(funcName).match(/[A-Z,a-z,0-9]+/)) throw new ErrorMessage('[AK017] Function name',"関数の名前は半角英語、数字のみです。")

       const name = oldfunc[1]
       const OLDvalue = oldfunc[2].split('::')
       const value = OLDvalue[0]
       const ArgmentsType = OLDvalue[1]
       if(!ArgmentsType.match(/str|num/)) throw new ErrorMessage('[AK016] Function type','関数の型が不明です。 str (String) or num(Number)  で指定できます。 '+`\n ${ProcessingLine}行目 - Method`)
       
       const ReturnFunctions = oldfunc.slice(4).join(',').replaceAll(';',",").split(',')
       ReturnFunctions.map((v) => v === "" ? ReturnFunctions.splice(ReturnFunctions.indexOf(v), 1) : void 0) //無駄を消す
       console.log(ReturnFunctions)
       
       /**
        * @type {import('./types/type').AkiLanguage_Function}
        */
       const SaveFunc = {
          name : name,
          value : value,
          valueType : ArgmentsType,
          ReturnFunctions : ReturnFunctions 
       }
       CORE_Functions.push(SaveFunc)
       FunctionAdding = false;
    }

    ifCompile(v){
        if(FunctionAdding === true) return;
       const value = String(v).match(/if\s(>[A-Z,a-z,0-9]+|Str\+\"[A-Z,a-z,0-9]+\")+\s(===|!==|Istype|==)\s(\>[A-Z,a-z,0-9]+|Str\+\"[A-Z,a-z,0-9]+\")\sreturn\s{[^~]+}/)[0]
       const _codeArray = value.replaceAll(' ',",").split(',')
       //* 新しい方 - Vのみが変数、TYPEV がVの型 VNがVに付けられている名前
       let V1;
       let V2;
       let TYPEV1;
       let TYPEV2;
       let VN1; // 不使用
       let VN2; //- 不使用
       //* Version 1.0.2 移行
       CORE_Hensuu.map((v) => {
        if(!(Array(v).join(' ').replaceAll(","," ").match(/Set\s[A-Z,a-z,0-9]+\sv\>[A-Z,a-z,0-9]+\s(str|num|any)/))) throw new ErrorMessage('[AC001] 内部エラー',"不明なSetArrayです。この変数は使用できません : "+v)

        if(String(_codeArray[1]).match(/Str\+\"[A-Z,a-z,0-9]+\"/)) {
             V1 = _codeArray[1].replace('Str+',"").replaceAll('"',"") 
             TYPEV1 = "str"
        }
        if(v[1] === _codeArray[1].replace('>',"") && !(String(_codeArray[1]).match(/Str\+\"[A-Z,a-z,0-9]+\"/))){
             V1 = v[2].replace('v>',"") 
             TYPEV1 = v[3]
        }

        if(String(_codeArray[3]).match(/Str\+\"[A-Z,a-z,0-9]+\"/)) {
             V2 = _codeArray[3].replace('Str+',"").replaceAll('"',"")
             TYPEV2 = "str"
        }
        if(v[1] === _codeArray[3].replace('>',"") && !(String(_codeArray[3]).match(/Str\+\"[A-Z,a-z,0-9]+\"/))) {
             V2 = v[2].replace('v>',"") 
             TYPEV2 = v[3]
        }
        })
        console.log(`${V1} : ${V2} = ${TYPEV1} : ${TYPEV2}`)

        if(_codeArray[4] !== "return") throw new ErrorMessage('[AK007]', "Returnは必須です。"+`\n ${ProcessingLine}行目 - Method`)
        if(TYPEV1 !== TYPEV2) throw new ErrorMessage('[AK004] IF文',"IF文での型の比較はいつでもfalseとなってしまいます。比較の際は同じ型を参照してください！"+`\n ${ProcessingLine}行目 - Method`)
        if(!V1 || !V2) throw new ErrorMessage("[AK012] 不明","比較先の変数が存在しません。"+`\n ${ProcessingLine}行目 - Method`)

        switch(_codeArray[2]){
            case "==": {
               V1 == V2 ? this.execute(_codeArray, true) : this.execute(_codeArray, false)
               break;
            }
            case "===": {
               V1 === V2 ? this.execute(_codeArray, true) : this.execute(_codeArray, false)
               break;
            }
            case "!==": {
              V1 !== V2 ? this.execute(_codeArray, true) : this.execute(_codeArray, false)
               break;
            }
            case "Istype": {
               TYPEV1 === TYPEV2 ? this.execute(_codeArray, true) : this.execute(_codeArray, false)
               break;
            }
            default : {
               throw new ErrorMessage('[AK005] IF処理コンパイル',`IF処理の条件が当てはまりませんでした。\n${(TYPEV1 === "str" && TYPEV2 === "num") ? "貴方が使用するべき比較演算子は Istype ではありませんか？": ""}\n現在使用できる比較演算子は以下の通りです。\n\n == \n === \n !== \nIstype\n ${ProcessingLine}行目 - Method`)
            }
          }
       

       
    }

    OLDIF(v) {
        if(complieVersion !== "OLD") return;
        //! Version 1.0.0 1.0.1 のみ使用可能です。CompileOption.Aki を参照してください。
        if(FunctionAdding === true) return;
        const value = String(v).match(/if\s>[A-Z,a-z,0-9]+\s(===|!==|Istype|==)\s(>[A-Z,a-z,0-9]+|[A-Z,a-z,0-9]+)\sreturn\s{[^~]+}/)[0]
        const _codeArray = value.replaceAll(' ',",").split(',')
        //! 非推奨 - Version 1.0.2 で変更予定
        let HikakuArray_1 = []
        let HikakuArray_2 = []
        CORE_Hensuu.forEach((v) => {
            // if(!(Array(v).join(' ').match(/Set\s[A-Z,a-z,0-9]+\sv\>[A-Z,a-z,0-9]+\s(str|num|any)/))) throw new ErrorMessage('[AC001] 内部エラー',"不明なSetArrayです。この変数は使用できません : "+v)
               if(v[1] === _codeArray[1].replace(">","")){
                  HikakuArray_1 = String(v).split(',')
               }
               if(v[1] === _codeArray[3].replace(">","")){
                  HikakuArray_2 = String(v).split(',')
               }
            })
           /* if(AkiResponseFunctioning) {
               TEMP_Hensuu.forEach((v) => {
                 if(v[1] === _codeArray[1].replace(">","")){
                     HikakuArray_1 = String(v).split(',')
                  }
                  if(v[1] === _codeArray[3].replace(">","")){
                     HikakuArray_2 = String(v).split(',')
                  }
             })
            }*/
            //console.log(this.CheckHennsuu(HikakuArray_1[1]).includes(true) ? "haitteru" : "nai")
            //console.log(this.CheckHennsuu(HikakuArray_2[1]).includes(true) ? "haitteru" : "nai")
     
            if(_codeArray[4] !== "return") throw new ErrorMessage('[AK007]', "Returnは必須です。"+`\n ${ProcessingLine}行目 - Method`)
     
            if(!(HikakuArray_1[3] === HikakuArray_2[3])) throw new ErrorMessage('[AK004] IF文',"IF文の型の比較はいつでもfalseとなってしまいます。比較の際は同じ型を参照してください！"+`\n ${ProcessingLine}行目 - Method`)
     
            if(!HikakuArray_1 || !HikakuArray_2) throw new ErrorMessage("[AK012] 不明","比較先の変数が存在しません。"+`\n ${ProcessingLine}行目 - Method`)
     
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
                 throw new ErrorMessage('[AK005] IF処理コンパイル',`IF処理の条件が当てはまりませんでした。\n${(HikakuArray_1[3] === "str" && HikakuArray_2[3] === "num") ? "貴方が使用するべき比較演算子は Istype ではありませんか？": ""}\n現在使用できる比較演算子は以下の通りです。\n\n == \n === \n !== \nIstype\n ${ProcessingLine}行目 - Method`)
              }
            }
    }

    execute(Array, boolean){
        const _OLDIFDATA = String(Array).split(',')

        const Bool = boolean


        if(_OLDIFDATA[6] === "say"){
            if(Bool !== true) return;
            this.sayCompile(`${_OLDIFDATA[6]} ${_OLDIFDATA[7]}`)

        } else
        if(_OLDIFDATA[6] === "Set" ){
            if(Bool !== true) return;

            if(_OLDIFDATA[12] !== "return") throw new ErrorMessage('[AK007]', `Returnは必須です。\n ${ProcessingLine}行目 - Method`)
            this.set(`${_OLDIFDATA[6]} ${_OLDIFDATA[7]} ${_OLDIFDATA[8]} ${_OLDIFDATA[9]}`)

        } else {
            throw new ErrorMessage('[AK006-0] IF処理 True-条件',`IF条件True後の処理に不明なコマンドが選択されました。\n ${ProcessingLine}行目 - Method`)
        }
    }
    
    async http(code) {

    }

    sayCompile(code){
        if(FunctionAdding === true) return;
      const complieOld = code.replaceAll(' ',"-").replaceAll('say',"").split('-')
      let Kekka = ""
      complieOld.forEach((text) => {
         if(text.match(/>/)){
           //console.log(text.replace('>',""))
           //console.log(this.CheckHennsuu(text))
        if(!this.CheckHennsuu(text).includes(true)){
            throw new ErrorMessage("[AK012] 不明",`比較先の変数が存在しません。\n\n 変数 ${text} は存在しない変数です。\n ${ProcessingLine}行目 - Method say`)
        }

        CORE_Hensuu.forEach((v) => {
                if(v[1] === text.replace('>',"")){
                    Kekka += v[2].replace('v>',"")
                }
            })          
         }
         if(text.match(/Str\+\"/)){
           // console.log(`Hikaku MAe + ${text}`)
            if(!text.match(/Str\+\"[^\"]+\"/)) throw new ErrorMessage('[AK009] String宣言ミス',"String宣言は Str+\"Text\" のようにしなければなりません。 "+`\n ${ProcessingLine}行目 - Method`)
            Kekka += String(text).replace('Str+"',"").replace('"',"")
         }
         if(text.match(/Space</)){
            Kekka += " "
         }
         //console.log(text)
         if(text.match(/WhatType=/)){
            const _NewCompiledCode = text.split('=');
            //console.log(_NewCompiledCode[1])
            if(!_NewCompiledCode[1]) throw new ErrorMessage('[AK011] WhatTypeError',"WhatType変換に失敗しました。変数はしっかりと記入済みですか？"+`\n ${ProcessingLine}行目 - Method`)

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
    let IF = "NEW"
    ProcessingLine++
    if(code.match(/#/)) return;
    if(String(code).match(/@COMPOLD/)){
        IF = "OLD"
        new WarningMessage('Warning : 古い比較式の使用',"古い比較式は、いろいろな要因で非推奨とされています。\nこの式はStrの比較が出来ません。")
    }
    if(String(code).match(/Set/)){
         new Core().set(code)
    }
    if(String(code).match(/say\s(>[A-Z,a-z,0-9]+\s|Space<\s|Str\+"[^~]+")+/) && !(String(code).match(/if\s(>[A-Z,a-z,0-9]+|Str\+\"[A-Z,a-z,0-9]+\")+\s(===|!==|Istype|==)\s(\>[A-Z,a-z,0-9]+|Str\+\"[A-Z,a-z,0-9]+\")\sreturn\s{[^~]+}/))){
         new Core().sayCompile(code)
    }
    if(String(code).match(/if\s(>[A-Z,a-z,0-9]+|Str\+\"[A-Z,a-z,0-9]+\")+\s(===|!==|Istype|==)\s(\>[A-Z,a-z,0-9]+|Str\+\"[A-Z,a-z,0-9]+\")\sreturn\s{[^~]+}/)){
        if(IF === "NEW") new Core().ifCompile(code)
        else new Core().OLDIF(code)
    }
    if(String(code).match(/toInt/)){
        new Core().toInt(code)
    }
    if(String(code).match(/[A-Z,a-z,0-9]+\([A-Z,a-z,0-9]+\)/)){
        new Core().runFunc(code)
    }
    if(String(code).match(/Aki>>http/)){
        AkiResponseFunctioning = true
        new ErrorMessage("[AKHTTP] Beta Errorではありません。","このHttpはJSONデータのみに対応しているはずです。")
        const func = String(code).replaceAll(">>",",").split(',')
        //if(!(.match(/URL=\"https?:\/\/[\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+]|URL=\"http?:\/\/[\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+]/))) throw new ErrorMessage('[AKHTTP001] Class Aki.Http RequestURI',"URLに誤りがあります。")
        const url = func[2].replace('URL="',"").replace('"',"")
        const tempHensuuName = func[3].replace('ResponseFunction=',"") 
            if(!url) throw new ErrorMessage('[AKHTTP0001] URIERROR',"URLを入力してください。")
            if(!tempHensuuName) throw new ErrorMessage('[AKHTTP0002]', "Callback変数の名称が不明です。")
        fetch(url).then((res) => { return res.json()}).then((ResponseData) => {
          console.log(`["TEMP",${tempHensuuName},${ResponseData},"JSON"]`)
        TEMP_Hensuu.push(["TEMP",tempHensuuName,ResponseData,"JSON"])
          console.log(TEMP_Hensuu)
       })
    }
    if(String(code).match(/ENDResponseFunction/)){
        TEMP_Hensuu.splice(0)
        AkiResponseFunctioning = false
    }
    if(String(code).match(/end/)){
        //console.log(`Aki LOG : 処理が終了しました。`)
       process.exit()
    } 
    if(String(code).match(/func/)){
        FunctionAdding = true
        new Core().func(code)
    }
    //(AkiResponseFunctioning ? console.log(AkiResponseFunctioning) : void 0)
})
console.log(`\n\nLangAki : 処理を終了 \n Sec ${new Date().getSeconds()} 差 ${new Date().getSeconds() - STARTMIN} Ms ${new Date().getMilliseconds()} 差 ${new Date().getMilliseconds() - STARTTHESYSTEM}`)



