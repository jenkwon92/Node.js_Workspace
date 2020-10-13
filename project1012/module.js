/*
  Node.js가 전세계적으로 열품을 일으킨 이유는?
  가장 큰 이유가 바로 모듈때문이다.

  모듈이란? 우리가 지금까지 자바스크립트 라이브러리를 파일로 저장해놓은 단위

  node.js모듈의 특징: 전세계 많은 개발자들이 각자 자신이 개발한 모듈을 공유하고 있다.
                    따라서, 지금 이순간에도 새로운 모듈이 계속 추가되고있다

  [모듈의 유형]
  1) 내장 모듈
      -os 모듈
      -url모듈
      -file system모듈 (★★★)
  2) 사용자 정의 모듈
*/
//자바스크립트와는 달리, 모듈을 가져올 떄에는 require() 함수를 이용해야한다.
// var os = require("os"); //이미 내장된 모듈 중 os모듈을 가져오기
// console.log(os.hostname()); //컴퓨터 이름
// console.log(os.cpus()); //cpu

//url모듈 : url의 정보를 분석해주는 모듈
// var url = require("url");

// //url을 분석하여 그결과를 result변수에 담아보자
// var result = url.parse("https://terms.naver.com/search.nhn?query=car");
// console.log("검색어는",result.query);

//로컬상의 파일을 읽어 오거나, 쓸수있는 모듈
var fs = require("fs");
//지정한 경로의 파일을 읽어서, 다 읽혀지면, 주번째 인수인 익명함수를 호출한다
//이렇게 특정이벤트가 발생할 때 시스템에 의해 역으로 호출되는 유형의 함수는
//callback함수라한다.
//콜백함수의 첫번쨰 매개변수(error):에러 정보를 담고있는 객체반환
//콜백함수의 두번째 매개변수(data): 실제 읽어들인 파일의 내용을 담고있다.
fs.readFile("./data/memo.txt","utf-8", function(error, data){
  console.log("파일을 모두 읽기 완료했어요!!");
  console.log(data);
});
