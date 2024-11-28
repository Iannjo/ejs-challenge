//jshint esversion:6

import express from "express";

// const ejs = require("ejs");
//const _ = require("lodash");
import _ from "lodash"

let articles = [];


const homeStartingContent = "<p>Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. </p>Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "<p>It may be tough to catch every nod to a book, character, painting or song during the event, which featured a floating parade on the Seine culminating in a celebration near the Eiffel Tower.During the Opening Ceremonies, the athletes paraded past characters with enormous heads sitting on walls along the banks of the Seine. The colorful, mascot-like characters were a tribute to the French tradition of caricature. They featured the likes of Joan of Arc, Joséphine Baker, Marie Curie and the fictional Arsène Lupin, a “gentleman thief.”</p>"
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
      console.dir(newArticle)
      
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
  // console.dir(`the article name ${req.params.postName}`)
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
  
  articles.find((x)=>{
    if(_.lowerCase(x.title) === req.params.postName.toLowerCase()){
      
      res.render('pages/edit',{title:x.title,body:x.content})
    }
  })

  

});

//The delete function
app.get("/delete/:postName",function(req,res){
  
  const requestedTitle = req.params.postName;
  
  
  //Find the index of the article
  const artIndex = articles.findIndex((obj => obj.title === requestedTitle))


  //use the splice method to delete the article
  articles.splice(artIndex,1)
  res.redirect("/")
  

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
