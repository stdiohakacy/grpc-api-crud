const fs = require('fs');
// Knex config
const environment = process.env.ENVIRONMENT || "development";
const config = require('./knexfile')[environment];
const knex = require('knex')(config);
// gRPC config
const grpc = require('@grpc/grpc-js');
const blogs = require('../server/protos/blog_pb');
const service = require('../server/protos/blog_grpc_pb');

const credentials = grpc.ServerCredentials.createSsl(
    fs.readFileSync('../scripts/certs/ca.crt'),
    [{
        cert_chain: fs.readFileSync('../scripts/certs/server.crt'),
        private_key: fs.readFileSync('../scripts/certs/server.key'),
    }],
    true,
)

const unsafeCredential = grpc.ServerCredentials.createInsecure();

function listBlog(call, callback) {
    console.log(`Received list blog request`);
    knex("blogs").then(blog => {
        blog.forEach(b => {
            const blog = new blogs.Blog();
            blog.setId(b.id);
            blog.setAuthor(b.author);
            blog.setTitle(b.title);
            blog.setContent(b.content);

            const blogResponse = new blogs.ListBlogResponse();
            blogResponse.setBlog(blog);
            call.write(blogResponse);
        });
        call.end();
    });
}

function main() {
    const server = new grpc.Server();
    server.addService(service.BlogServiceService, { listBlog });
    server.bindAsync('localhost:50051', 
    // grpc.ServerCredentials.createInsecure(),
    // unsafeCredential,
    credentials,
    () => {
        console.log("Server start on localhost:50051");
        server.start();
    });
}

main();