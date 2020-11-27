/*웹서버 구축하기 */
//모듈이란 ? 기능을 모아놓은 자바스크립트 파일 ..js

var http =require('http'); //http 내부 모듈 가져오기 
var url= require('url');
var fs = require("fs"); //file system 모듈(파일읽기, 쓰기)
var mysql = require("mysql"); //mysql 외부모듈

//mysql 접속 문자열
let conStr={
  url:"localhost",
  port:"3307",
  user:"root",
  password:"11111111",
  database:"node"
}
var con; //mysql접속 정보를 가진 객체, 이 객채로 sql문을 수행할 수 있다.

//서버 갱신
var server = http.createServer(function(request,response){
  //클라이언트가 원하는 요청을 처리하려면, URL을 분석하여 URI추출해서 조건을 따져보자
  var urljson = url.parse(request.url); //분석결과를 json으로 반환해줌
  console.log("URL분석결과는",urljson);

  if(urljson.pathname=="/"){
    fs.readFile("./index.html","utf-8",function(error,data){
      if(error){
        console.log("index.html 읽기 실패",error);
      }else{
        //200이란?? 처리 성공 http 상태코드 , 404 존재안하는 자원, 500 서버의 심각한 에러
        response.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
        response.end(data);
      }
    });
  }else if(urljson.pathname =="/member/registForm"){
    fs.readFile("./registForm.html","utf-8",function(error,data){
      if(error){
        console.log("registForm 읽기 실패",error);
      }else{
        //200이란?? 처리 성공 http 상태코드 , 404 존재안하는 자원, 500 서버의 심각한 에러
        response.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
        response.end(data);
      }
    });
  }else if(urljson.pathname =="/member/loginForm"){
    fs.readFile("./loginForm.html","utf-8",function(error,data){
      if(error){
        console.log("loginForm 읽기 실패",error);
      }else{
        //200이란?? 처리 성공 http 상태코드 , 404 존재안하는 자원, 500 서버의 심각한 에러
        response.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
        response.end(data);
      }
    });
  }else if(urljson.pathname =="/member/regist"){
    //브라우저에서 전송된 파라미터를 먼저 받아야 한다.
    //get 방식의 파라미터 받기
    //회원정보는 member2 테이블에 넣고
    var sql = "insert into member2(uid,password,uname,phone,email,receive,addr,memo)";
    sql+=" values(?,?,?,?,?,?,?,?)";
    var param = urljson.query;
    con.query(sql, [param.uid,param.password,param.uname,param.phone,param.email,param.receive,param.addr,param.memo
    ],function(error,result,fields){
      if(error){
        console.log("회원정보 insert 실패",error);
      }else{
        //방금 insert된 회원의 pk를 조회해보자
        sql="select last_insert_id() as member2_id";

        con.query(sql, function(error, record, fields){
          if(error){
            console.log("pk가져오기 실패",error);
          }else{
            console.log("record: ",record);
            var member2_id= record[0].member2_id;
            for(var i=0; i<param.skill_id.length;i++){
              sql="insert into member_skill(member2_id, skill_id) values("+member2_id+","+param.skill_id[i]+")";
              console.log("스킬 등록 쿼리: ",sql);
              //쿼리 실행
              con.query(sql,function(err){
                if(err){
                  alert("회원정보 등록 실패");
                }else{
                  response.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
                  response.end("회원정보 등록완료");
                }
              });
            }
          }
        }); //쿼리문 수행

        //성공하면 회원이 보유한 스킬정보도 넣어주자
        //스킬정보는 member_skill에 넣자 (배열의 길이만큼)
      }
    });
    
    //mysql에 insert

  }
});
//mysql 접속
function getConnection(){
  con = mysql.createConnection(conStr); //json을 매개변수로 넣어주면 됨
}

//서버가동
server.listen(7878,function(){
  console.log("My Server is running at port 7878");
  getConnection();
})
