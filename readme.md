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

```
Set 変数名 v>変数のvalue 型
```

### Core - say

Sayメゾットではコンソールに出力をします。

    Say Str+"hello World!" >変数

### Core - if
  
比較をします。

例文

```
    Set Impotant v>HI str
    Set VeryStrong v>HI str
    Set Other v>Bye str

    Set Number v>10 num
    Set IsNumber v> str

    if Impotant === VeryStrong return { say Str+"一致！" }
    if Impotant === Number return { say Str+"コンパイルエラーになるよ"}
    if Impotant !== Other return { say Str+"不一致！" }
    if Impotant == VeryStrong return { say Str+"ほぼJavaScriptってこと！？"}

　　IsNumber toInt
    VeryStrong toInt 
    #↑ これは変換できないので Maybe numになる

    if Number Istype VeryStrong return { say Str+"一緒にならないし、コンパイルエラーになるよ！" }
    if Number Istype IsNumber return { say Str+"型一緒！" } 
```

### Core - toInt

Str型の物をNumber型に変換します。

```
   Set Ten v>10 str

   say Whattype=Ten 
   # Output str

   Ten toInt

   say Whattype=Ten
   # Output num
```

しかし、この場合はMaybe numに変換され、普通のNumber型とは区別されます。

```
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

必要引数はArray（関数型）

