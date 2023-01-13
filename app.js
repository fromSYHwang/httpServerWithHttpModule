
// 테스트용 샘플 데이터 users, posts
const users = [
  {
    id: 1,
    name: "Rebekah Johnson",
    email: "Glover12345@gmail.com",
    password: "123qwe",
  },
  {
    id: 2,
    name: "Fabian Predovic",
    email: "Connell29@gmail.com",
    password: "password",
  },
];

const posts = [
  {
    id: 1,
    title: "간단한 HTTP API 개발 시작!",
    content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
    userId: 1,
  },
  {
    id: 2,
    title: "HTTP의 특성",
    content: "Request/Response와 Stateless!!",
    userId: 1,
  },
  {
    id: 3,
    title: "테스트 포스트 3",
    content: "테스트 포스트 3 입니다!",
    userId: 2,
  },
];

//빌트인 모듈 호출
const http = require('http');
const server = http.createServer();


const httpRequestListner = function(request, response) {
  //클라이언트의 url, method 받아옴
  const { url, method } = request;

  if (method === 'POST') {
    //회원가입 기능 엔드포인트 구현
    if (url === '/user/signup') {

      let body = '';

      request.on('data', (data) => {
        body += data; 
      });

      request.on('end', () => {
        const user = JSON.parse(body);

        users.push({
          "id": parseInt(user.id),
          "name": user.name, 
          "email": user.email,
          "password": user.password
        });

        response.writeHead(201, { "Content-Type" : "application/json" });
        response.end(JSON.stringify( { "message" : "userCreated" }	));
      })
    } 
    
  }
}

server.on('request', httpRequestListner);

server.listen(8000, '127.0.0.1', function() {
  console.log('서버 연결');
});
