const blogs = require('../server/protos/blog_pb');
const blogService = require('../server/protos/blog_grpc_pb');
const grpc = require('@grpc/grpc-js');
const fs = require('fs');

const credentials = grpc.credentials.createSsl(
    fs.readFileSync('../scripts/certs/ca.crt'),
    fs.readFileSync('../scripts/certs/client.key'),
    fs.readFileSync('../scripts/certs/client.crt'),
);

const unsafeCredential = grpc.credentials.createInsecure();

function callListBlogs() {
    const client = new blogService.BlogServiceClient(
        'localhost:50051',
        // unsafeCredential,
        credentials,
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

function callCreateBlog() {
    const client = new blogService.BlogServiceClient(
        'localhost:50051',
        credentials,
    )

    const blog = new blogs.Blog();
    blog.setAuthor("Nguyen Duy");
    blog.setTitle("First blog");
    blog.setContent("This is greet!");

    const blogRequest = new blogs.CreateBlogRequest();
    blogRequest.setBlog(blog);
    client.createBlog(blogRequest, (error, response) => {
        if(!error) {
            console.log(response.toString());
        } else {
            console.error(error);
        }
    });
}

function callReadBlog() {
    const client = new blogService.BlogServiceClient(
        'localhost:50051',
        credentials,
    );

    const readBlogRequest = new blogs.ReadBlogRequest();
    readBlogRequest.setId("1");
    client.readBlog(readBlogRequest, (error, response) => {
        if(!error) {
            console.log(response.toString());
        } else {
            if(error.code === grpc.status.NOT_FOUND) {
                console.log('Not found!');
            } else {

            }
        }
    });
}

function callUpdateBlog() {
    const client = new blogService.BlogServiceClient(
        'localhost:50051',
        credentials,
    );

    const blog = new blogs.Blog();
    blog.setId("1");
    blog.setAuthor("Nguyen Duy");
    blog.setTitle("First blog");
    blog.setContent("This is greet!");

    const updateBlogRequest = new blogs.UpdateBlogRequest();
    updateBlogRequest.setBlog(blog);

    client.updateBlog(updateBlogRequest, (error, response) => {
        if(!error) {
            console.log(response.toString());
        } else {
            if(error.code === grpc.status.NOT_FOUND) {
                console.log('Not found!');
            } else {

            }
        }
    });
}

function callDeleteBlog() {
    const client = new blogService.BlogServiceClient(
        'localhost:50051',
        credentials,
    );
    const deletedBlogRequest = new blogs.DeleteBlogRequest();
    const id = "1";

    deletedBlogRequest.setId(id);
    
    client.deleteBlog(deletedBlogRequest, (error, response) => {
        if(!error) {
            console.log(response.toString());
        } else {
            if(error.code === grpc.status.NOT_FOUND) {
                console.log('Not found!');
            } else {
                console.log(`Something went wrong!`);
            }
        }
    })
}

function main() {
    // callReadBlog();
    // callListBlogs();
    // callCreateBlog();
    // callUpdateBlog();
    callDeleteBlog();
}

main();