/*
GET
-뉴스기사 파라미터 전달(링크)
POST 
-로그인, 회원가입
-영상, 이미지업로드(데이터량이 많기떄문에 BODY)
*/ 

var http = require('http');
var url = require('url');
var fs = require('fs');
var mysql = require("mysql");
var ejs = require('ejs');
var qs = require('querystring');

let con;
var urlJson;

var server = http.createServer(function(req,res){
  //요청 구분
  //console.log(req.url);
  urlJson = url.parse(req.url,true);
  //console.log("urlJson: ", urlJson);
  if(urlJson.pathname =="/"){ //메인을 요청하면
    fs.readFile('./index.html',"utf-8",function(error,data){
      if(error){
        console.log("index.html 읽기 실패",error);
      }else{
        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
        res.end(data);
      }
    });
  }else if(urlJson.pathname =="/member/registForm"){ //가입폼을 요청하면
    registForm(req,res);
  }else if(urlJson.pathname =="/member/regist"){ //가입을 요청하면
    regist(req,res);
  }else if(urlJson.pathname =="/member/loginForm"){//로그인폼을 요청하면
    fs.readFile('./loginForm.html',"utf-8",function(error,data){
      if(error){
        console.log("loginForm.html 읽기 실패",error);
      }else{
        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
        res.end(data);
      }
    });
  }else if(urlJson.pathname =="/member/list"){//회원 목록을 요청하면
    getList(req,res);
  }else if(urlJson.pathname =="/member/detail"){//회원 정보보기를 요청하면
    getDetail(req,res);
  }else if(urlJson.pathname =="/member/del"){//회원 탈퇴를 요청하면
    del(req,res);
  }
});

//데이터베이스 연동인 경우엔 함수로 별도로 정의
function registForm(req,res){
  //회원가입폼은 디자인을 표현하기 위한 파일이므로, 기존에는 html로 충분했으나 
  //보유기술은 DB의 데이터를 가져와서 반영해야하므로, ejs 로 처리해야한다.
  var sql = "select * from skill";
  con.query(sql,function(error,record,fields){
    if(error){
      console.log("Skill 조회실패",error);
    }else{
      console.log("Skill record : ", record);
      //registForm.ejs에서 json배열을 전달하자
      fs.readFile("./registForm.ejs","utf-8", function(error,data){
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.end(ejs.render(data, {
          skillArray:record
        }));
      });
    }
  });
}

//회원 등록 처리
function regist(req,res){
  //post방식으로 전송된, 파라미터받기!
  req.on("data", function(param){
    //url모듈에게 파싱을 처리하게 하지말고, queryString모듈로 처리한다
    //console.log("post param:", new String(param).toString());
    var postParam = qs.parse(new String(param).toString());
    console.log("post param : ", postParam);

    var sql = "insert into member2(uid,password,uname,phone,email,receive,addr,memo)";
    sql+=" values(?,?,?,?,?,?,?,?)"; //물음표를 바인드 변수라한다.

    con.query(sql,[
        postParam.uid,
        postParam.password,
        postParam.uname,
        postParam.phone,
        postParam.email,
        postParam.receive,
        postParam.addr,
        postParam.memo,
      ], function(error,fields){
        if(error){
          console.log("등록실패",error);
        }else{
          //목록페이지 보여주기
          //등록되었음을 alert()으로 알려주고, /member/list로 재접속
          res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
          var tag="<script>";
          tag+="alert('등록성공');";
          tag+="location.href='/member/list';"; //<a> 태그와 동일한 효과
          tag+="</script>";
          res.end(tag);
        }
    });
  });
}

//회원목록 처리함수
function getList(req,res){
  //회원 목록 가져오기 
  var sql="select * from member2";
  con.query(sql, function(error,record, fields){
    if(error){
      console.log("조회 실패",error);
    }else{
      fs.readFile("./list.ejs","utf-8",function(error,data){
        if(error){
          console.log("list.ejs 읽기 실패", error);
        }else{
          res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
          res.end(ejs.render(data,{
            memberArray:record
          }));
        }
      });
    }
  });
}

//회원 상세보기 처리 함수
function getList(req, res){
  // 회원 목록 가져오기
  var sql = "select * from member2";
  con.query(sql, function(error, record, fields){
      if(error){
          console.log("조회 실패", error);
      } else {
          fs.readFile("./list.ejs", "utf-8", function(error, data){
              if(error){
                  console.log("list.ejs 읽기실패", error);
              }else{
                  res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                  res.end(ejs.render(data,{
                      memberArray: record
                  }));            
              }
          });
      }
  });
}
function getDetail(req,res){
  // console.log("urlJson : ", urlJson.query);
  var member2_id = urlJson.query.member2_id;
  var sql = "select * from member2 where member2_id =" + member2_id;
  con.query(sql, function(error, record, fields){
    fs.readFile("./detail.ejs", "utf-8", function(error, data){
      if(error){
        console.log("detail.ejs 읽기 실패", error);
      }else{
        res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"})
        res.end(ejs.render(data,{
            member: record[0]
        }));
      }
    });
  });
}

//회원 1명 삭제
function del(req,res){
  //get 방식으로 전달된 파라미터 받기
  var member2_id = urlJson.query.member2_id;

  var sql = "delete from member2 where member2_id="+member2_id;

  //error, fields : 반환되는 결과가 없을때  DML(insert, update, delete :조작)
  //error, record, fields : select
  con.query(sql,function(error, fields){
    if(error){
      console.log("삭제 실패",error);
    }else{
      //alert 띄우고, 회원 목록 보여주기
      res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"})
      var tag = "<script>";
      tag+="alert('탈퇴처리되었습니다');"
      tag+="location.href='/member/list';";
      tag+="</script>";  
      res.end(tag);
    }
  });
};

//회원정보 수정처리
function update(req,res){
  //post로 전송된 파라미터들을 받자!
  req.on("data", function(param){
    var postParam = qs.parse(new String(param).toString());
    
    var sql ="update member 2 set phone='"+postParam.phone+"', email='"+postParam.email+"', addr='"+postParam.addr+"', memo=?";
    sql +=", password=?, receive=? where member2_id=?";
    
    res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    res.end(sql);
  });

  //var sql ="update member 2 set phone=?, email=?, addr=?, memo=?";
  //sql +=", password=?, receive=? where member2_id=?";

  //res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
  //res.end(sql);
}

//mysql 접속함수
function connect(){
  con = mysql.createConnection({
    url: "localhost",
    port:"3307",
    user: "root",
    password: "11111111",
    database: "node"
  });
}

server.listen(7788, function(){
  console.log("Server is running at 7788 port");
  connect();
});