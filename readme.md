# Aki

- The Programming Language aki

## What is this?
　
　　プログラミング言語（笑）のコア。
　　メインファイル一つとなっております！
　　なんてヘルシー！

## 概要
  
   「あき」は静的型付け言語です。
   　ユーザーが変数を宣言する際に型を宣言する感じです。

## Methods

### Core - Set
   
   　Setメゾットは変数を宣言します。

     Set 変数名 変数のvalue 型

### Core - say
 
    Sayメゾットではコンソールに出力をします。

    Say Str+"hello World!" >変数

### Core - if
  
    比較をします。
    詳しくはメインメゾットを見てください。（めんどい）

### Core - toInt
 
    Str型の物をNumber型に変換します。


### (内部処理) Core - execute

    ifコンパイルに成功した物を実行するための関数。
    必要引数はArray（関数型）

