FORMAT: 1A

# Group TODOリスト
 
## ユーザ情報 [/{userid}]
 
### ユーザTODO取得API [GET]
 
#### 処理概要
 
* ユーザのTODO情報を全て返却する。
 
+ Parameters
    + userid: sampleuser (string, required) - ユーザID
 
+ Response 200 (application/json)
    + Attributes
        + todos (array[object])
            + _id: 59bc757aadb85c2ac429af5a(string)
            + userid: sampleuser(string)
            + title: タイトル(string)
            + body: 内容(string)
 
## 検索 [/{userid}/search/{keyword}]
 
### 検索API [GET]
 
#### 処理概要
 
* タイトルと内容からTODO情報を部分一致で検索する。
* 検索条件が指定されていない場合、登録されているTODO情報を全て返却する。
 
+ Parameters
    + userid: sampleuser (string, required) - ユーザID
    + keyword: abc123 (string, optional) - 検索条件
 
+ Response 200 (application/json)
    + Attributes
        + todos (array[object])
            + _id: 59bc757aadb85c2ac429af5a(string)
            + userid: sampleuser(string)
            + title: タイトル(string)
            + body: 内容(string)
 
## 登録 [/{userid}/add]
 
### 登録API [POST]
 
#### 処理概要
 
* TODO情報を新しく登録する。
* 登録に成功した場合、登録したTODO情報を返却する。
 
+ Parameters
    + userid: sampleuser (string, required) - ユーザID
 
+ Request (application/json)
    + Attributes
        + title: abc123 (string, required) - タイトル(format: .{1,50})
        + body: abc123 (string, required) - 内容(pattern: ^.{1,200}$)
 
+ Response 200 (application/json)
    + Attributes
        + _id: 59bc757aadb85c2ac429af5a(string)
        + userid: sampleuser(string)
        + title: タイトル(string)
        + body: 内容(string)
 
## 更新 [/{userid}/update]
 
### 更新API [POST]
 
#### 処理概要
 
* TODO情報を更新する。
* 更新に成功した場合、更新後のTODO情報を返却する。
 
+ Parameters
    + userid: sampleuser (string, required) - ユーザID
 
+ Request (application/json)
    + Attributes
        + _id: 59bc757aadb85c2ac429af5a(string, required)
        + title: 予定 (string, required) - タイトル(format: .{1,50})
        + body: あああ (string, required) - 内容(pattern: ^.{1,200}$)
 
+ Response 200 (application/json)
    + Attributes
        + _id: 59bc757aadb85c2ac429af5a(string)
        + userid: sampleuser(string)
        + title: タイトル(string)
        + body: 内容(string)
 
## 削除 [/{userid}/destroy/{id}]
 
### 削除API [POST]
 
#### 処理概要
 
* 指定したIDに該当するTODO情報を削除する。
* 削除成否に関わらずHTTPステータスコード201を返却する。
 
+ Parameters
    + userid: sampleuser (string, required) - ユーザID
    + id: 1(number, required) - TODOのID
 
+ Response 200 (application/json)
 