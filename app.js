//jshint esversion:6

import express from "express";

// const ejs = require("ejs");
//const _ = require("lodash");
import _ from "lodash"

let articles = [];


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('views','./views');
app.set('view engine', 'ejs');

app.use('/compose', (req, res, next) => {
  if (req.method === "POST"){
    console.log('in the compose POST route, Request Type:', req.method)
    //let newcontent = req.body.newContent;
  
  const title = req.body.postTitle
  const content = req.body.postBody;

  

// Function to check if a title is unique
function isTitleUnique(title) {
    return !articles.some(article => article.title === title);

}

// Function to save or edit an article

  
  // Check if the title is unique
  if (isTitleUnique(title)) {
    // Check if the article already exists for editing
    const existingArticle = articles.find(article => article.title === title);
    console.log(existingArticle);

    if (existingArticle) {
      // Edit existing article
      // existingArticle.content = content;
      console.log(`Article "${title}" edited successfully.`);
    } else {
      // Save new article
      const newArticle = { title, content };
      articles.push(newArticle);
      
      console.log(`Article "${title}${content}" saved successfully.`);
      res.redirect("/")
    }
  } else {

    console.error(`Article with title "${title}" already exists. Please choose a unique title.`);
    const userNote = `Article with title "${title}" already exists. Please choose a unique title.`;
    
    res.render('pages/compose',{title:title,body:content, msg:userNote})
  }
  }
  
  next()
})





app.get("/about", function(req, res) {
  res.render('pages/about', {Content: aboutContent});
});

app.get("/", function(req, res) {
  res.render('pages/home', {startingContent:homeStartingContent,
    articles: articles});
    
});

app.get("/contact", function(req, res) {
  res.render('pages/contact');
});

app.get("/compose/", function(req, res) {
  
  res.render('pages/compose',{title:"",body:""});
})


app.post("/contact", function(req, res){
  res.redirect("/")

});

//Dynamically making a url
app.get("/posts/:postName",function(req,res){
  console.dir(`the article name ${req.params.postName}`)
  //const requestedTitle = (req.params.postName).toLowerCase();
  //console.log(`requestedTitle ${requestedTitle}`)

  //Use the array find method
  articles.find((x)=>{
    if(_.lowerCase(x.title) === req.params.postName.toLowerCase()){
      
      res.render('pages/post',{title:x.title,body:x.content})
    }
  })
});

app.get("/edit/:postName",function(req,res){
  console.dir(`the article name ${req.params.postName}`)
  const requestedTitle = (req.params.postName).toLowerCase();

  articles.forEach(function(article){
    const storedTitle = _.lowerCase(article.title);
    
    if(storedTitle === requestedTitle){
      console.dir("Match found");
      console.dir(`Ẁe are in the edit ${article.content}`)
      res.render('pages/edit',{title:article.title,body:article.content})
      
    } else {
      console.dir("no cigar")
    }
  });

});

//The delete function
app.get("/delete/:postName",function(req,res){
  console.dir(`the article name ${req.params.postName}`)
  const requestedTitle = (req.params.postName).toLowerCase();
  const requestedTitle2 = (req.params.postName);
  
  
  
  const index1 = articles.findIndex((obj => obj.title === requestedTitle2))
  console.log(index1,requestedTitle,requestedTitle2);

  articles.forEach(function(article){
    const storedTitle = _.lowerCase(article.title);
    
    if(storedTitle === requestedTitle){
      console.dir("Match found");
      console.dir(`Ẁe are in the delete ${article.content}`)
      
      const length = articles.length;
      objIndex = articles.findIndex((obj => obj.title == requestedTitle));
      console.log(objIndex,length);
      delete articles[objIndex];
      console.log(`Try again: ${length}`);
      res.redirect("/")
      
    } else {
      console.dir("no cigar")
    }
  });

});


//The posted content from the compose form is stored in the posts array

app.post("/compose", function(req, res) {
  


// Example usage

// saveOrEditArticle("Duplicate Title", "Article Content 2");
// saveOrEditArticle("Unique Title", "Updated Article Content");



  

})

app.post("/edit",(req,res)=>{
  
  let objIndex = articles.findIndex((obj => obj.title == req.body.postTitle));
  console.log(objIndex)
  

  
  articles[objIndex].content = req.body.postBody;

  console.log("Edited");


  res.redirect("/")

})



  // objIndex = myArray.findIndex((obj => obj.id == 1));
  

/*
//To prevent duplicate objects of the form {Title:Article} from being added to an array, you can use a Set data structure.
const myArray = [];
const uniqueArticles = new Set();

const newArticle = { Title: 'The Start', Article: 'All in the...' };

if (!uniqueArticles.has(newArticle)) {
  myArray.push(newArticle);
  uniqueArticles.add(newArticle);
}

console.log(myArray); // Output: [{ Title: "The Start", Article: "All in the..." }]
*/







app.listen(3000, function() {
  console.log("Server started on port 3000");
});
