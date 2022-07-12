const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterSlider = document.querySelector(".slider input"),
filterValue = document.querySelector(".filter-info .value"),
previewImg = document.querySelector(".editor-panels img"),
rotateImg = document.querySelectorAll(".rotate button"),
resetImg = document.querySelector(".reset-filter"),
saveImg = document.querySelector(".save-img"),
choiceFile = document.querySelector(".choice-img");

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const applyFilters = () =>{
    rotateImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}) scale(${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    
};

const loadImage = () =>{
    let file = fileInput.files[0]; // getting user selected file
    if(!file) return; // if user selected none
    previewImg.src = URL.createObjectURL(file); //passing file url as preview img src
    previewImg.addEventListener("load", () => {
        document.querySelector(".container").classList.remove("disable");
        resetFilter.click();
    });
};

filterOptions.forEach(option => {
    option.addEventListener("click", () => { // adding click event listener to all filter button
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if(option.id === "brightness"){
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        }else if(option.id === "saturation"){
            filterSlider.max = "200";
            filterSlider.value = `${saturation}%`;
            filterValue.innerText = `${saturation}%`;
        }else if(option.id === "inversion"){
            filterSlider.max = "100";
            filterSlider.value = `${inversion}%`;
            filterValue.innerText = `${inversion}%`;
        }else {
            filterSlider.max = "100";
            filterSlider.value = `${grayscale}%`;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

const updaterFitlter = ()=>{
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active"); //getting selected filter btn
    // assign new value to filter
    if(selectedFilter.id === "brightness"){
        brightness = filterSlider.value;
    }else if(selectedFilter.id === "saturation"){
        saturation = filterSlider.value;
    }else if(selectedFilter.id === "inversion"){
        inversion = filterSlider.value;
    }else {
        grayscale = filterSlider.value;
    }
    applyFilters();
}

rotateImg.forEach(option =>{
    option.addEventListener("click", () =>{ // adding click event listener to all rotate/flip buttons
        if(option.id === "left"){
            rotate -=90; // if clicked btn is left rotate, decrement rotate value by -90
        }else if(option.id === "right"){
            rotate +=90; // if clicked btn is right rotate, increment rotate value by +90
        }else if(option.id === "horizontal"){
            // flip horisontal where value is 1 set to negative 1 else 1
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        }else{
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilters();
    });
});

const resetFilter = () =>{
    brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
    rotate = 0, flipHorizontal = 1, flipVertical = 1;
    filterOptions[0].click(); // clicking brightness btn, so the brightness selected by default
    applyFilters();
}

const downloadImg = () =>{
    const canvas = document.createElement("canvas"); // creating canvas element
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    ctx.filter = `brightness(${brightness}%) invert(${inversion}%) saturate(${saturation}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if(rotate !== 0){
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    //document.body.appendChild(canvas);
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

saveImg.addEventListener("click", downloadImg);
fileInput.addEventListener("change", loadImage);
resetImg.addEventListener("input", resetFilter);
filterSlider.addEventListener("click", updaterFitlter);
choiceFile.addEventListener("click", () => fileInput.click());