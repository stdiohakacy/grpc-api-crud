const blogs = require('../server/protos/blog_pb');
const blogService = require('../server/protos/blog_grpc_pb');
const grpc = require('@grpc/grpc-js');

function callListBlogs() {
    const client = new blogService.BlogServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure()
    );

    const blogRequest = new blogs.ListBlogRequest();
    
    const call = client.listBlog(blogRequest, () => {});
    call.on('data', response => {
        console.log(response.getBlog().toString());
    });
    call.on('error', error => {});
    call.on('end', () => {
        console.log(`Ended!`);
    });
}

function main() {
    callListBlogs();
}

main();