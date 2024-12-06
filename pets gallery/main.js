addButton.onclick = function(){
    addNewPet();

};

let removeButton = document.createElement ('section')
function validateInput(inputELT){
    if (inputELT.value.trim === ''){
        return false;
    }else{
        inputELT.style.borderColor="black";
        return true;
    }
}




function addNewPet(){
    petsGalleryMain.innerHTML = `
    <section>
    <h2>${nameInput.value}</h2>
    <img src = "${pictureOnput.value}" alt ="${nameInput.value}'s picture"/>
    <p>${nameInput.value} is ${ageInput.value} years old</p>
    <button>delete</button>
    </section>
    `
    ;
}



