/*const url =require('url');


console.log(url.parse(req.url , true))

//true عشان يحول الاستعلام الي نص


const {query , pathname} = url.parse(req.url , true);

لازم الاسمين دول عشان دول امساء موجود جوا التحليل

*/

/*
ايه هو ال api
api : هو خدمه بتوفر بيانات 
باخد منها بيانات يعني
*/


const http = require('http');
const url = require('url');
const fs = require('fs');

// http ال بتدينا امكانيات الشبكه 
/*مثل انشاء خادم http */

/* احنا استدعنا الملف هنا عشان يتم قراءه الملف مرة واحده فقط عند بدايه تشغيل الكود*/
/*عشان اقدر ارجع json في الرد 

        res.writeHead(200,{
            'Content-type' :'application/json'
        })
*/


const tempOverview = fs.readFileSync('./overview.html', 'utf-8');
const tempproduct = fs.readFileSync('./product.html', 'utf-8');
const tempcard = fs.readFileSync('./card.html', 'utf-8');
const data = fs.readFileSync('./data.json', 'utf-8'); // تأكد من إضافة utf-8
const dataObj = JSON.parse(data);


const replaceTemplate = (temp,product) =>{
    let output = temp.replace(/{%PRODUCT_NAME%}/g , product.productName);
    output = output.replace(/{%IMAGE%}/g , product.image);
    output = output.replace(/{%PLACE%}/g , product.from);
    output = output.replace(/{%For_health%}/g , product.nutrients);
    output = output.replace(/{%QUANTITY%}/g , product.quantity);
    output = output.replace(/{%price%}/g , product.price);
    output = output.replace(/{%description%}/g , product.description);
    output = output.replace(/{%ID%}/g , product.id);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g , 'not-organic')
    output = output.replace(/{%PRODUCT_NAME}/g , product.productName);
    
    return output;
}

const server = http.createServer((req,res) => {
    const {query , pathname} = url.parse(req.url , true);
    console.log(url.parse(req.url , true))

    //overView Page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200,{'Content-type':'text/html'});
        const cardhtml = dataObj.map(el => replaceTemplate(tempcard,el)).join('');
        const output = tempOverview.replace(/{%PRODUCTS_CARDS%}/g,cardhtml);
        res.end(output);
    }

    //Product Page

    else if(pathname === '/product'){
        res.writeHead(200,{'Content-type':'text/html'});
        console.log(query)
        const product = dataObj[query.id];
        const output =replaceTemplate(tempproduct,product)
        res.end(output);}

    //api
    
    else if(pathname === '/api'){
        res.writeHead(200,{
            'Content-type' :'application/json'
        })
        res.end(data);
    }
    //NotFound
    
    else{

        res.writeHead(404,{
            'Content-type' :'text/html',
            'myOwnHeader' : 'Hello World'
        });

        res.end('<h1>An Error Occured</h1>')
    }


});

server.listen(8000, '127.0.0.1', () =>{
    console.log("listen to requests in port 8000");
});