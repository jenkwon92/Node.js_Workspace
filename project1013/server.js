/*
일반js  
노드js -Dom이 지원되지 않음 
        왜? Node.js는 동적 제어가 목적이 아니므로. 서버측 기술 구현이 목적
HTTP (Hyper Text Transfer Protocol) : 전자 문서를 주고받을 때, 정해진 약속 
      즉, 어떤 방식으로 전자문서를 주고 받아야하는지에 대한 통신 약속
      우편물 주고 받는 방식과 흡사함 
      
npm install (node.js Package Manager)
  node.js에서 필요한 외부 모듈을 설치할때 사용하는 명령어
  내가 개발하지 않아도 이미, 전세계 개발자들에 의해 기능이 라이브러리
  즉, 모듈 형태로 구현되어있으므로 무료로 가져다 쓰면된다

node.js언어의 구성요소
  -js문법(변수,연산자,제어문,함수,배열,객체)
  -내장객체(string,array,date,math..)
  -DOM대신 전역변수, 전역객체, 내장모듈로 이뤄져있음
    전역변수: __dirname, __filename
    전역객체: console. process
    내장모듈: OS,http, FileSystem(fs)

    [ 프론트 개발 ]         [Java : 다음주 19일]     jsp/spring       android
js -> Node.js(아두이노) ->        발표          ->    발표      ->  웹+앱 발표

*/

//HTTP 웹서버 구축하기
var http = require("http"); //필요한 모듈가져오기
var fs = require("fs"); //파일을 읽거나,쓸수있는 모듈
var url = require("url"); //url정보를 해석해주는 모듈

var mysql= require("mysql");//외부모듈이기 때문에 npm install 설치 해야함
var con; //접속정보를 가진 객체(이 객체를 이용하여 쿼리문을 수행할 수 있다)

//서버객체 생성
//request response는 이미 node.js 자체적으로 존재하는 객체
var server  = http.createServer(function(request, response){
  response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
  //클라이언트의 요청에 대한 응답 처리(html문서를 주고받음)

  //클라이언트의 요청 내용이 다양하므로, 각 요청을 처리할 조건문이 있어야한다.
  //따라서, 클라이언트가 원하는것이 무엇인지부터 파악
  //console.log("클라이언트의 요청 url",request.url);

  //parsing시 true 옵션을 주면, 파라미터의 매개변수를 접근할 수 있는 json을 추가해준다.
  var result = url.parse(request.url, true); //url모듈을 이용하여 전체 주소를 대상으로 해석시작
  //parsing한 결과인 result를 확인해보자
  //console.log("파싱결과 보고서 :",result);
  var paramObj = result.query; //파라미터를 담고있는 json객체반환
  //console.log("ID: ", paramObj.m_name ,"Pass: ",paramObj.m_pass);

  if(result.pathname=="/login"){
    //console.log("mysql 연동하여 회원 존재여부 확인할께요");
    //response.end("mysql연동할게요");

    //mysql연동하여 select~~문
    var sql="select * from hclass where id='"+paramObj.m_name+"' and pass='"+paramObj.m_pass+"'";
    console.log("sql:", sql);

    con.query(sql, function(error, record, fields){
      if(error){
        console.log("쿼리실행 실패",error);
      }else{
        console.log("record: ",record);

        if(record.length>0){
          //레코드가 있을 때는(배열의 길이가 1), 토그인 성공 메시지
          //console.log("인증성공");
          response.end("<script>alert('인증성공');</script>"); //클라이언트 브라우저로 보내야한다.
        }else{
          //레코드가 없을때는 (배열의 길이가 0), 로그인 실패 메시지
          //console.log("인증실패");
          response.end("<script>alert('인증실패');history.back();</script>"); //클라이언트 브라우저로 보내야한다.
        }
      }

    }); //쿼리 실행

  }else if(result.pathname =="/apple"){
    console.log("사과를 드릴께요");
    response.end("사과를 드릴께요");
  }else if(result.pathname=="/loginForm"){
    //우리가 제작한 loginForm.html은 로컬 파일로 열면 안되고,
    //모든 클라이언트가 인터넷 강의 주소로 접근하게 하기 위해서
    //서버가 html내용을 읽고, 그 내용을 클라이언트에게 응답정보로 보내야 한다.
    fs.readFile("./loginForm.html","utf-8", function(error,data){
      if(error){
        console.log("읽기 실패입니다.",error);
      }else{
        //읽기 성공이므로, 클라이언트의 응답정보로 보내자
        //HTTP 프로토콜로 데이터를 주고받을때는 이미 정해진 규약이 있으므로 
        //눈에 보이지않는 수많은 설정 정보값들을 서버와 클라이언트간 교환한다.
        
        response.end(data);
      }
    });
  }

  //전체 url에서도 uri만을 추출해보자
  //따라서 전체 url을 해석해야한다... 해석은 parsing한다고 한다
  request.url.toUpperCase();

});

//mysql접속
function connectDB(){
  con = mysql.createConnection({
    url:"localhost",
    port:"3307",
    user:"root",
    password:"11111111",
    database:"node",
  });
}

//서버가동
server.listen(8888,function(){
  console.log("Server is running at 8888 port...");
  connectDB(); //웹서버가 가동되면  mysql을 접속해놓자
})



























