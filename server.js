/*Сервер*/
/*Підключаємо бібліотеки*/
var bodyParser = require('body-parser'),
    formidable = require('formidable'),
    fs = require('fs-extra'),
    f  = require('fs'),
    async = require('async'),
    express = require('express')
  , app = express()
  , port = process.env.PORT || 3000

/*Додаткові налаштування*/
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

/*Пишемо в консоль,що все працює*/
app.listen(port, function () {
  console.log('Listening on port ', port)
})
/*Чекаємо на пост-запит по цій адресі,рахуємо резульат (Шахматна дошка)*/
app.post('/first_task',function (req,res,next){
  var n=parseFloat(req.body.n),
      m=parseFloat(req.body.m);
  var result=parseInt((n*m+1)/2);   /*Якщо Парна -  то +1*/
  res.render('first',{ black : result});    /*Рендериться результат,усі шаблони лежать у паблік*/
});

app.post('/upload',  function (req, res, next) {    /*Обробка загрузки файла*/
    var form = new formidable.IncomingForm();
    form.parse(req, function (error, fields, files) {
        if (!error) {
            var file = files["uploaded_file"];
            async.series([function (callback) {
                    
                    fs.copy(file.path, './public/data/array.txt', function (error) { /*Зберігаємо в арай.тхт*/
                        callback(error);
                    });
                },function (callback) {
                    fs.remove(file.path, function (error, removed) {
                        callback(error, removed);
                    });
                }],function (error, results) {
                    if (!error) {
                        res.redirect('/second');/*І переходимо на наступну сторінку*/ 
                      }
                    else {
                        res.redirect('/second.html');   /*Якщо файл не прочитався,на стартову*/
                    }
            });
        }
    });
});
function sort(arr){/*Функція сортування обміном*/ 
    for(var i = 0; i < arr.length - 1; i++){
        for(var j = 0; j < arr.length - i - 1; j++){
            if(arr[j] > arr[j + 1]){
                var b = arr[j]; /*Міняємо елементи*/
                 arr[j] = arr[j+1];
                 arr[j+1] = b;
            }
            
        }
        
    }

    return arr;
}

/*Сортуємо масив,в стоку,рендериться відповідна сторінка в /Public*/
app.get('/second',function (req,res,next){
    fs.readFile(__dirname+'/public/data/array.txt','utf8',function (err,contents){
        var data=contents.toString();
        var array=data.split(' ');
        for (var i=0;i<array.length;i++){
            array[i]=parseFloat(array[i]);
        }
        var result=sort(array).toString();
        res.render('second',{ arr : result});
    
    });
    
});