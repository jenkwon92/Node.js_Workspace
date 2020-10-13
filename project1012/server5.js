/* 웹서버를 구축하여 , 클라이언트가 전송한 파라미터 값들을
mysql에 넣어보자 */

var http = require("http"); //http 모듈 가져오기
var fs = require("fs"); // file system 모듈 가져오기

//http 모듈로 부터 server객체 생성하기 
var server = http.createServer(function(requset, response){

  //서버에 존재하는 회원가입양식 폼파일을 읽어서 클라이언트의 브라우저에 보내주자
  fs.readFile("./회원폼유효성체크.html","utf-8",function(error, data){
    if(error){
      console.log("파일을 읽지 못했습니다.",error);
    }else{
      // http 프로토콜 상, 약속을 지켜서, 즉 형식을 지켜서 보내자
      response.writeHead(200,{"Content-Type":"text/html'charset=utf-8"});
      response.end(data); //클라이언트에게 컨텐츠 전송
    }
  });
});

//서버 가동하기 
server.listen(7979,function(){
  console.log("Server is running at 7979 port..");
});