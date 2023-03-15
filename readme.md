# Aki

- The Programming Language aki

## What is this?
　
　　プログラミング言語（笑）のコア。

　　メインファイル一つとなっております！

　　なんてヘルシー！

## 概要
  
   「あき」は静的型付け言語です。

   一応実行時にコンパイルをします。

## Methods

    

### Core - Set

Setメゾットは変数を宣言します。

```aki
Set 変数名 v>変数のvalue 型
```

### Core - say

Sayメゾットではコンソールに出力をします。

    Say Str+"hello World!" >変数

### Core - if OLD-
  
比較をします。

このIF文を使う際には文頭に`@COMPOLD`を挿入してください。

例文

```aki
    Set Impotant v>HI str
    Set VeryStrong v>HI str
    Set Other v>Bye str

    Set Number v>10 num
    Set IsNumber v> str

    if >Impotant === >VeryStrong return { say Str+"一致！" }
    # ifで変数を出すときは、必ず変数の前に > を付けるのがルールです。
    if >Impotant === >Number return { say Str+"コンパイルエラーになるよ"}
    if >Impotant !== >Other return { say Str+"不一致！" }
    if >Impotant == >VeryStrong return { say Str+"ほぼJavaScriptってこと！？"}

　　IsNumber toInt
    VeryStrong toInt 
    #↑ これは変換できないので Maybe numになる

    if >Number Istype >VeryStrong return { say Str+"一緒にならないし、コンパイルエラーになるよ！" }
    if >Number Istype >IsNumber return { say Str+"型一緒！" } 
```

### Core - if

比較をします。文章の比較もします。

例文

```aki
    
     Set Impotant v>NubejsonNubeNube str

     #文字列の比較
     if >Impotant === Str+"Nube" return { say Str+"一緒の文章だね！" }

     Set Num v>10 num
     Set StringNum v>10 str

     #型が違う（strとnum）ので、コンパイルエラーになります。
     if >Num === >StringNum return { say Str+"一緒じゃない！？" }

     # numに変換できます。
     StringNum toInt

     #これならＯＫです。
     if >Num === >StringNum return { say Str+"一緒じゃない！？" }

     #文字列を数字に変換しようとすると str -> Maybe numになり、そのままではnum型として使用することはできません。
     Impotant toInt

     #コンパイルエラー
     if >Num === >Impotant return { say Str+"だめだね～" }

     # ほかにも
     # == <- これなに？
     # !== <- 値が違うか
     # Istype <- 型一緒？
     # があります。使ってみてね！
```

### Core - toInt

Str型の物をNumber型に変換します。

```aki
   Set Ten v>10 str

   say Whattype=Ten 
   # Output str

   Ten toInt

   say Whattype=Ten
   # Output num
```

しかし、この場合はMaybe numに変換され、普通のNumber型とは区別されます。

```aki
   Set MaybeTen v>ten str

   say Whattype=MaybeTen
   # Output str

   MaybeTen toInt
   # Warning

   say Whattype=MaybeTen
   # Output Maybe num
```

### (内部処理) Core - execute

ifコンパイルに成功した物を実行するための関数。

必要引数はArray (if時渡された型)とbooleanです。


### (内部処理) Core - func

のちのち追加する関数を登録する関数です。

これは動きます。

必要引数はArray(func)です。

処理すると内部配列にAkiLanguage_Function型の配列を追加します。


### Core - runFunc

後々追加する関数のやつ。

めんどい。そのうち書きます。