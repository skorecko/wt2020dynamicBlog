/*
 * Created by Stefan Korecko, 2020
 */

import { render } from "mustache";

//--------------------------------------------------------------------------------------------------------------
//Dropdown menu functionality

function displayOrHideMenu() {
  document.getElementById("menuIts").classList.toggle("mnShow");
}

function hideMenu() {
  let menuClElmCList = document.getElementById("menuIts").classList;
  if (menuClElmCList.contains("mnShow")) menuClElmCList.remove("mnShow");
}

document.addEventListener(
  "click", //radsej takto ako do document.onclick, lebo to by vyradilo inÃ© listenery
  function(event) {
    if (!event.target.matches("#menuCl, #menuTitle")) hideMenu();
  }
);

//--------------------------------------------------------------------------------------------------------------
//functions for transforming opinion(s) to Html code

function opinion2html(opinion) {
  //in the case of Mustache, we must prepare data beforehand:
  opinion.createdDate = new Date(opinion.created).toDateString();

  //get the template:
  const template = document.getElementById("mTmplOneOpinion").innerHTML;
  //use the Mustache:
  //const htmlWOp = Mustache.render(template,opinion);
  const htmlWOp = render(template, opinion);

  //delete the createdDate item as we created it only for the template rendering:
  delete opinion.createdDate;

  //return the rendered HTML:
  return htmlWOp;
}

/*
//an alternate version of the above function. Uses a separate object (opinionView) for HTML rendering
function opinion2html(opinion){

    //in the case of Mustache, we must prepare data beforehand:
    const opinionView ={
        name: opinion.name,
        comment: opinion.comment,
        createdDate: (new Date(opinion.created)).toDateString()

    };

    //get the template:
    const template = document.getElementById("mTmplOneOpinion").innerHTML;
    //use the Mustache and return the rendered HTML:
    return htmlWOp = Mustache.render(template,opinionView);


}*/

function opinionArray2html(sourceData) {
  return sourceData.reduce(
    (htmlWithOpinions, opn) => htmlWithOpinions + opinion2html(opn),
    ""
  ); //"" is the initial value of htmlWithOpinions in reduce. If we do not use it, the first member of sourceData will not be processed correctly
}

/*
//an alternate version of the above function. Uses for ... of instead of reduce
function opinionArray2html(sourceData){

    let htmlWithOpinions="";

    for(const opn of sourceData){
        htmlWithOpinions += opinion2html(opn);
    }

    return htmlWithOpinions;
}
*/

//--------------------------------------------------------------------------------------------------------------
//data and localStorage handling and redering opinions to the page at startup

let opinions = [];
const opinionsElm = document.getElementById("opinionsContainer");

if (localStorage.myTreesComments) {
  opinions = JSON.parse(localStorage.myTreesComments);
}

console.log(opinions);
opinionsElm.innerHTML = opinionArray2html(opinions);

//--------------------------------------------------------------------------------------------------------------
//Form processing functionality

/*
 * Note:
 * For the sake of simplicity, here we use window.alert to display messages to the user
 * However, if possible, avoid them in the production versions of your web applications
 *
 */

const commFrmElm = document.getElementById("opnFrm");

commFrmElm.addEventListener("submit", processOpnFrmData);

function processOpnFrmData(event) {
  //1.prevent normal event (form sending) processing
  event.preventDefault();

  //2. Read and adjust data from the form (here we remove white spaces before and after the strings)
  const nopName = document.getElementById("nameElm").value.trim();
  const nopOpn = document.getElementById("opnElm").value.trim();

  //3. Verify the data
  if (nopName === "" || nopOpn === "") {
    window.alert("Please, enter both your name and opinion");
    return;
  }

  //3. Add the data to the array opinions and local storage
  const newOpinion = {
    name: nopName,
    comment: nopOpn,
    created: new Date()
  };

  console.log("New opinion:\n " + JSON.stringify(newOpinion));

  opinions.push(newOpinion);

  localStorage.myTreesComments = JSON.stringify(opinions);

  //4. Update HTML
  opinionsElm.innerHTML += opinion2html(newOpinion);

  //5. Reset the form
  commFrmElm.reset(); //resets the form
}
