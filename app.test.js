const request = require('supertest');
const app = require('./app2');



 describe('POST /users', () => {
       test('should register a new user', async()=> {
            const response = await request(app)
            .post('/users/')
            .send({
                name: 'test',
                email: 'test@example.com',
                password: 'password123'
            });

            expect(response.statusCode).toBe(200);
           
             });

             test("should specify json in the content type header", async() =>{
                const response = await request(app)
            .post('/users/')
            .send({
                name: 'test',
                email: 'test@example.com',
                password: 'password123'
            });

            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
           
             });

             test("response has userId", async() =>{
                const response = await request(app)
            .post('/users/')
            .send({
                name: 'test',
                email: 'test@example.com',
                password: 'password123'
            });

            expect(response.body.userId).toBeDefined()
            
           
             });


             describe('when the email and password is missing', () => {
                test('should respond with a status code of 400', async () => {
            
                    const bodyData = [
                        {email:"test@example.com" },
                        {password: "password123"},
                        {}
                    ]
                 
                  for (const body of bodyData){
                    const response = await request(app)
                    .post("/users/")
                    .send(body)
                    expect(response.statusCode).toBe(400);
                }
                    
                  
            });      
    });

 
});
     
    
describe('POST /tasks/', () => {
    test('should create a new task', async()=> {
         const response = await request(app)
         .post('/tasks/addtask')
         .send({
             title: 'myTitle',
             description: 'myDescription',
             deadline: '2025/1/25',
             priority: 'high',
             completed: 'true',
             owner: 'userId(1)'

         });

         expect(response.statusCode).toBe(200);
        
          });



        });

    