FORMAT: 1A

# TODOリスト
 
## 登録 [/{userid}/add]
 
### 登録API [POST]
 
#### 処理概要
 
* TODO情報を新しく登録する。
* 登録に成功した場合、TODOを管理するidを返す。
 
+ Parameters
    + userid: sampleuser (string, required) - ユーザID
 
+ Request (application/json)
    + Attributes
        + title: abc123 (string, required) - タイトル(format: .{1,50})
        + body: abc123 (string, required) - 内容(pattern: ^.{1,200}$)
 
+ Response 200 (application/json)
    + Attributes
        + id: 1 (number, required) - TODOのID
 
## 検索 [/{userid}/search{?keyword}]
 
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
            + userid: sampleuser(number)
            + title: 'タイトル'(string)
            + body: '内容'(string)
 
## 更新 [/{userid}/update]
 
### 更新API [POST]
 
#### 処理概要
 
* TODO情報を新しく登録する。
* 登録に成功した場合、TODOを管理するidを返す。
 
+ Parameters
    + userid: sampleuser (string, required) - ユーザID
 
+ Request (application/json)
    + Attributes
        + id: 1(number, required) - TODOのID
        + title: 予定 (string, required) - タイトル(format: .{1,50})
        + body: あああ (string, required) - 内容(pattern: ^.{1,200}$)
 
+ Response 200 (application/json)
    + Attributes
        + id: todo0001 (string, required) - TODOのID
 
## 削除 [/{userid}/destroy/{id}]
 
### 削除API [POST]
 
#### 処理概要
 
* 指定したIDに該当するTODO情報を削除する。
* 削除成否に関わらずHTTPステータスコード201を返却する。
 
+ Parameters
    + userid: sampleuser (string, required) - ユーザID
    + id: 1(number, required) - TODOのID
 
+ Response 200 (application/json)
 