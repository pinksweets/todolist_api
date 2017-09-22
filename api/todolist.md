FORMAT: 1A

# Group TODOリスト
 
## TODO情報 [/{userid}/]
 
### ユーザTODO取得API [GET]
 
#### 処理概要
 
* ユーザのTODO情報を全て返却する。
 
+ Parameters
    + userid: sampleuser (string, required) - ユーザID
 
+ Response 200 (application/json)
    + Attributes(array)
        + (object)
            + _id: 59bc757aadb85c2ac429af5a(string)
            + userid: sampleuser(string)
            + title: タイトル(string)
            + body: 内容(string)
 
### 登録API [POST]
 
#### 処理概要
 
* TODO情報を新しく登録する。
* 登録したTODO情報を返却する。
* 登録に必要なパラメータが不足している場合、空文字として登録する。
 
+ Parameters
    + userid: sampleuser (string, required) - ユーザID
 
+ Request (application/json)
    + Attributes
        + title: abc123 (string, optional) - タイトル(format: .{1,50})
        + body: abc123 (string, optional) - 内容(pattern: ^.{1,200}$)
 
+ Response 201 (application/json)
    + Attributes
        + _id: 59bc757aadb85c2ac429af5a(string)
        + userid: sampleuser(string)
        + title: タイトル(string)
        + body: 内容(string)
        + __v: バージョン(string)
 
### 更新API [PUT]
 
#### 処理概要
 
* TODO情報を更新する。
* 更新に成功した場合、更新後のTODO情報を返却する。
* 更新に必要なパラメータが不足している場合、空文字として登録する。
* 更新エラー時
 
+ Parameters
    + userid: sampleuser (string, required) - ユーザID
 
+ Request (application/json)
    + Attributes
        + _id: 59bc757aadb85c2ac429af5a(string, required)
        + title: 予定 (string, optional) - タイトル(format: .{1,50})
        + body: あああ (string, optional) - 内容(pattern: ^.{1,200}$)
 
+ Response 200 (application/json)
    + Attributes
        + _id: 59bc757aadb85c2ac429af5a(string)
        + userid: sampleuser(string)
        + title: タイトル(string)
        + body: 内容(string)

+ Response 422
 
## 検索 [/{userid}/{keyword}]
 
### 検索API [GET]
 
#### 処理概要
 
* タイトルと内容からTODO情報を部分一致で検索する。
* 検索条件が指定されていない場合、登録されているTODO情報を全て返却する。
* 一致するTODO情報が無い場合、空のArrayを返却する。
 
+ Parameters
    + userid: sampleuser (string, required) - ユーザID
    + keyword: abc123 (string, optional) - 検索条件
 
+ Response 200 (application/json)
    + Attributes(array)
        + (object)
            + _id: 59bc757aadb85c2ac429af5a(string)
            + userid: sampleuser(string)
            + title: タイトル(string)
            + body: 内容(string)
 
## 削除 [/{userid}/{id}]
 
### 削除API [DELETE]
 
#### 処理概要
 
* 指定したIDに該当するTODO情報を削除する。
* 削除成功時、HTTPステータスコード200を返却する。
* 削除失敗時、HTTPステータスコード422を返却する。
 
+ Parameters
    + userid: sampleuser (string, required) - ユーザID
    + id: 1(number, required) - TODOのID
 
+ Response 204
 
+ Response 422
 