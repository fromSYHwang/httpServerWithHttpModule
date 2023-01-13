
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
    
      //게시물 생성 엔드포인트 구현
    else if (url === '/post/postwrite') {   

      let body = '';

      request.on('data', (data) => {
        body += data; 
      });

      request.on('end', () => {
        const post = JSON.parse(body);

        posts.push({
          "id": parseInt(post.id),
          "title": post.title, 
          "content": post.content,
          "userId": parseInt(post.userId),
          "imageUrl": post.imageUrl,
        });
        response.writeHead(201, { "Content-Type" : "application/json" });
        response.end(JSON.stringify( { "message" : "postCreated" }	))
      })

    }  
  }
  
  else if (method === "GET") {
    if ( url === '/post/postlist') {
 
       const data = [];
 
       posts.forEach( (post) =>  {
         users.some( (user) => {
           if (post.userId === user.id) {
             const postlist = { 
               "userId" : user.id,
               "userName" : user.name,
               "postingId" : post.id,
               "postingTilte" : post.title,
               "postingImageUrl" : post.imageUrl,
               "postingContent" : post.content,
             }
             data.push(postlist);
             return true;
           }
         })
       });
       response.writeHead(200, { "Content-Type" : "application/json" });
       response.end(JSON.stringify( { "data" : data }	))
     }


  // 유저와 게시글 조회 엔드포인트 구현
  else if (url.startsWith("/user/user_posting")) {
    const userId = parseInt(url.split("/")[3]);
    const user = users.find((user) => user.id === userId);
    const userInfo = {
      userID : user.id,
      userName: user.name,
    }

    const userPosts = posts.filter ( post => post.userId ===userId );
    // console.log(userId)
    // console.log(userPosts)
    const postInfo = [];
    userPosts.forEach( post => {
      const userInfo ={
        postingId: post.id,
        postingName: post.title,
        postingContent: post.content,
      }
      postInfo.push(userInfo)
    })

    // console.log(postInfo)
    userInfo.postings = postInfo;

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ data: userInfo }));
   
  }   
 } 

  //게시글 정보 수정 엔드포인트 구현
  else if (method === 'PATCH') {
    if (url === '/post/edit') {

      let body = '';

      request.on('data', (data) => {
        body += data; 
      });

      request.on('end', () => {
        const post = JSON.parse(body);
        post.id = parseInt(post.id);

        posts.some( (el) => {
            if( post.id === el.id ) {
              Object.keys(post).forEach ( (key) => {
                if ( key === ('' || undefined || null || NaN )) {
                  // 수정할 key 값이 없다면 해당 키는 값을 수정하지 않는다
                } else { 
                  // key가 userId 이면 userId 값을 int화 한다
                  if( key === 'userId' ) { 
                     post[key] = parseInt(post[key])
                    }

                  // 수정할 key 값이 존재하면 해당 요소를 새로운 값으로 수정한다
                    el[key] = post[key];
                    console.log(post)
                }
              })
              return true;
            }

          response.writeHead(200, { "Content-Type" : "application/json" });
          response.end(JSON.stringify( { "data" : post }	))
        });

      });
    }
  }

  //게시글 삭제 엔드포인트 구현
  else if (method === 'DELETE') {
    if (url === '/post/delete') {
      let body = '';

      request.on('data', (data) => {
        body += data; 
      });

      request.on('end', () => {
        const deletePost = JSON.parse(body);
        deletePost.id = parseInt(deletePost.id);

        //게시글 id를 받아서 해당 게시글을 삭제한다
        posts.some((post, index) => {
          if(post.id === deletePost.id) {
            posts.splice(index, 1);
            return true;
          }
        })

        response.writeHead(200, { "Content-Type" : "application/json" });
        response.end(JSON.stringify( { "message" : "postingDeleted" }	));

      })

    }
  }
}

server.on('request', httpRequestListner);

server.listen(8000, '127.0.0.1', function() {
  console.log('서버 연결');
});

