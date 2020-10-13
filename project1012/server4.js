/*----------------------------------------
mysql 연동해보기
----------------------------------------*/
var mysql = require("mysql");

//접속에 필요한 정보 
let conStr = {
    url:"localhost", 
    user:"root", 
    password:"11111111",
    database :"node",
    port:"3307"
}

//접속시도 후, 접속정보가 반환된다..
var con = mysql.createConnection(conStr);

if(!con){
  console.log("접속실패");
  //반환된 con 을 이용하여 쿼리문 수행 
  
}else{
  console.log("접속sucess");

  var sql="insert into member(firstname,lastname,local,msg) values('tiger','king','korea','seoul')";
  //console.log(sql);
  
  
  con.query(sql, function(error, results, fields){
      if(error){
          console.log("등록실패 ㅜㅜ", error);
      }else{
          console.log("등록성공");
      }
  });//쿼리실행
  
}

