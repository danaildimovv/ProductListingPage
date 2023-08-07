// a variable for the displayed items
let itemsDisplayed = 0;
// a variable for the number of selected products
let selectedProductsCount = 0;
// a variable for the selector of the products counter
let productsCounter = document.querySelector(".number-of-items");
let categoryAndDescription = document.querySelector(".category-and-description");
// a variable for the currently selected products
let selectedProducts;
let filteredProducts;
let allProducts;
let maxPriceProduct;
let minPriceProduct;

function filterProducts(category){

   // let currentProductGrid = document.querySelector(".product-grid");
   // currentProductGrid.innerHTML = "";
   // allProducts.forEach(product => {
   //    currentProductGrid.appendChild(product); 
   // })

   refreshProductGrid(allProducts);
   setActiveCategory(category);
   displayFilteredProducts(category, allProducts);

   // sets the selected products with the currently selected 
   selectedProducts = document.querySelectorAll(`.selected`);
   // sets the number of selected products to the currently selected ones
   selectedProductsCount = selectedProducts.length;
   productsCounter.innerHTML = `${itemsDisplayed}/${selectedProductsCount}`;
   if (category == "default"){
      categoryAndDescription.innerText = `All Products`;
   }
   else{
   categoryAndDescription.innerText = `${category}`;
   }
   sortingOptions.value = "default";

   let apparelSubcategories = document.querySelectorAll(".apparel");
   let footwearSubcategories = document.querySelectorAll(".footwear");
   if (category == "Apparel"){
      footwearSubcategories.forEach(subcat => {
         subcat.style.display = "none";
      })
      apparelSubcategories.forEach(subcat => {
         subcat.style.display = "block";
      })
      // apparelSubcategories.style.display = "block";
   }
   else if(category == "Footwear"){
      apparelSubcategories.forEach(subcat => {
         subcat.style.display = "none";
      })
      footwearSubcategories.forEach(subcat => {
         subcat.style.display = "block";
      })
      // footwearSubcategories.style.display = "block";
   }
   
}

function setActiveCategory(category){
   let categoriesLinks = document.querySelectorAll(".nav-bar ul li a");

   categoriesLinks.forEach((categoryLink) => {
      //check if value equals innerText
      if (categoryLink.innerText.toUpperCase().includes(category.toUpperCase())){
        categoryLink.classList.add("active-category");
      }
      else if(category == "default" && categoryLink.innerText == "All Products"){
         categoryLink.classList.add("active-category");
      } 
      else {
        categoryLink.classList.remove("active-category");
      }
    });
}

function displayFilteredProducts(filter, productsToSelectFrom){
   let elementsCount = 0;
   itemsDisplayed = 0;
   
   productsToSelectFrom.forEach((element) => {
   
      //Check if element contains category class or all products were chosen
      if (element.classList.contains(filter) || filter == "default")
      {
      // display element based on category
         element.classList.add("selected");    
         elementsCount += 1;
         showFilteredElement(elementsCount, element); 
         // console.log(element)     
      }

      else if (filter == "filter-by-price" && 
      (parseFloat(element.classList[4].split("-")[1]) >= minPriceInput.value &&
      parseFloat(element.classList[4].split("-")[1]) <= maxPriceInput.value)
      ){
         // display element based on category
         element.classList.add("selected");    
         elementsCount += 1;
         showFilteredElement(elementsCount, element); 
      }
      else {
      //hide other elements
         if(!element.classList.contains("hide")){
            element.classList.add("hide");
         }
         // if they were selected, unselects them
         if(element.classList.contains("selected")){
            element.classList.remove("selected");
         }
      }
      // if the displayed items are less than 15, hides the load more 
      if (itemsDisplayed < 15){
         loadMoreButton.style.display = "none";
      }
      // else shows it again
      else if (loadMoreButton.style.display == "none"){
         loadMoreButton.style.display = "";
      }
      
   });
   window.scrollTo(0, 0);
}

function showFilteredElement(counter, element){
   if (counter <= 15){
      itemsDisplayed += 1;
      element.classList.remove("hide");
   } 
   else{
      if(!element.classList.contains("hide")){
      element.classList.add("hide");
      }
   } 
}

// colorBtn.addEventListener("change", function(){
//    displayFilteredProducts(`${colorBtn.value}`, selectedProducts);
//    // sets the selected products with the currently selected 
//    filteredProducts = document.querySelectorAll(`.selected`);
//    // sets the number of selected products to the currently selected ones
//    selectedProductsCount = filteredProducts.length;
//    productsCounter.innerHTML = `${itemsDisplayed}/${selectedProductsCount}`;
// })

let colorFilter = document.querySelector("#color-filter");
let minPriceInput = document.querySelector("#min-price");
let maxPriceInput = document.querySelector("#max-price");
let brandFilter = document.querySelector("#brands-filter");
let subcategoriesFilter = document.querySelector("#subcategories-filter");
// let ratingFilter = document.querySelector("#rating-filter");
let resetFilterButtons = document.querySelectorAll(".reset-filters-button");
let allFilters = [colorFilter, minPriceInput, maxPriceInput, brandFilter, subcategoriesFilter]

function filterCurrentProducts(){
   let activeFilters = []
   allFilters.forEach(filter => {

      if (filter.value != "default" && filter.value != minPriceProduct && filter.value != maxPriceProduct){
         activeFilters.push(filter)
      }
      else if (filter.value == "default"){
         displayFilteredProducts(filter.value, selectedProducts);
      }
   })

   refreshProductGrid(selectedProducts);
   // console.log(activeFilters)
   filteredProducts = selectedProducts;
   

   activeFilters.forEach(filter => {
      // console.log(filter.value)
      if (filter == minPriceInput || filter == maxPriceInput){
         displayFilteredProducts("filter-by-price", filteredProducts);
      }
      // else if(filter == ratingFilter){
      //    displayFilteredProducts(parseFloat(filter.value), filteredProducts);
      // }
      else {
         displayFilteredProducts(filter.value, filteredProducts);
      }
      filteredProducts = document.querySelectorAll(".selected");
      
   })
   selectedProductsCount = filteredProducts.length;
   productsCounter.innerHTML = `${itemsDisplayed}/${selectedProductsCount}`;
   sortingOptions.value = "default";

   let sidebar = document.querySelector(".sidebar");
   if(sidebar.classList.contains("active")){
      sidebar.classList.toggle("active");
    }
}

function addFiltersBehaviour(){
   allFilters.forEach(filter => {
      if (filter == minPriceInput || filter == maxPriceInput){
         filter.addEventListener("input", 
            filterCurrentProducts);
      }
      else{
         filter.addEventListener("change", 
            filterCurrentProducts)
      }
   })
}
function removeFiltersBehaviour(){
   allFilters.forEach(filter => {
      if (filter == minPriceInput || filter == maxPriceInput){
         filter.removeEventListener("input", filterCurrentProducts);
      }
      else{
         filter.removeEventListener("change",filterCurrentProducts);
      }
   })
}

resetFilterButtons.forEach(resetButton => {
   resetButton.addEventListener("click", function(){   
      allFilters.forEach(filter => {
         if (filter == minPriceInput){
            filter.value =  minPriceProduct;
         }
         else if (filter == maxPriceInput){
            filter.value = maxPriceProduct;
         }
         else {
            filter.value = "default";
         }
      })
      filterCurrentProducts();
   })
})

let loadMoreButton = document.querySelector("#load-more-button");
loadMoreButton.addEventListener("click", function(){
      loadMore();
})

function loadMore(){  
   if (filteredProducts){
      setloadMoreButton(filteredProducts);
   }
   else{
      setloadMoreButton(selectedProducts);
   }
}

function setloadMoreButton(currentProducts){
   let currentItem = itemsDisplayed;
   selectedProductsCount = currentProducts.length;
   for (let i = currentItem; i< currentItem + 15; i++){
      currentProducts[i].classList.remove("hide");
      itemsDisplayed += 1;
      // console.log(selectedProductsCount);
      if (itemsDisplayed == selectedProductsCount){
         loadMoreButton.style.display = "none";         
         filteredProducts = null;
         break;
      }
   }
   productsCounter.innerHTML = `${itemsDisplayed}/${selectedProductsCount}`;
}

function getMax(arr, prop) {
   var max;
   for (let i=0 ; i<arr.length ; i++) {
       if (max == null || parseFloat(arr[i][prop]) > parseFloat(max[prop]))
           max = arr[i];
   }
   return max;
}
function getMin(arr, prop) {
   var min;
   for (let i=0 ; i<arr.length ; i++) {
       if (min == null || parseFloat(arr[i][prop]) < parseFloat(min[prop]))
           min = arr[i];
   }
   return min;
}

function sortAZ(nameA, nameB) {
   if (nameA.dataset.title.toUpperCase() < nameB.dataset.title.toUpperCase())
      return -1;
   if (nameA.dataset.title.toUpperCase() > nameB.dataset.title.toUpperCase())
      return 1;
   return 0;
}
function sortZA(nameA, nameB) {
   if (nameA.dataset.title.toUpperCase() > nameB.dataset.title.toUpperCase())
      return -1;
   if (nameA.dataset.title.toUpperCase() < nameB.dataset.title.toUpperCase())
      return 1;
   return 0;
}
function sortPriceAsc(priceA, priceB) {
   if (parseFloat(priceA.dataset.price) < parseFloat(priceB.dataset.price))
       return -1;
   if (parseFloat(priceA.dataset.price) > parseFloat(priceB.dataset.price))
       return 1;
   return 0;
}
function sortPriceDesc(priceA, priceB) {
   if (parseFloat(priceA.dataset.price) > parseFloat(priceB.dataset.price))
       return -1;
   if (parseFloat(priceA.dataset.price) < parseFloat(priceB.dataset.price))
       return 1;
   return 0;
} 
// Function to sort Data
function sortData(sortType) {
   let productsArray = Array.from(selectedProducts);
   itemsDisplayed = 0;

   if (filteredProducts && (filteredProducts !== selectedProducts))
   productsArray = Array.from(filteredProducts);


   let sorted = productsArray;
   if (sortType !== "default"){
      sorted = productsArray.sort(sortType);
   }
   let productGrid = document.querySelector(".product-grid");
   productGrid.innerHTML = "";
   
   let count = 0;
   sorted.forEach(productCard => {
      productGrid.appendChild(productCard);
      count += 1;
      if(count <= 15){
         productCard.classList.remove("hide");
         itemsDisplayed += 1;
      }
      else{
         productCard.classList.add("hide");
      }  
   })
   window.scrollTo(0, 0);
   // if (sortType == "Default"){
   //    selectedProductsCount = count;
   //    productsCounter.innerHTML = `${itemsDisplayed}/${selectedProductsCount}`;
   // }
}

let sortingOptions = document.querySelector("#sorting");
sortingOptions.addEventListener("change", function(){
   if(sortingOptions.value == "sort-az"){
      sortData(sortAZ);
   }
   else if(sortingOptions.value == "sort-za"){
      sortData(sortZA);
   }
   else if (sortingOptions.value == "price-asc"){
      sortData(sortPriceAsc);
   }
   else if(sortingOptions.value == "price-desc"){
      sortData(sortPriceDesc);
   }
   else{
      sortData("default");
   }

})

function refreshProductGrid(products){
   let currentProductGrid = document.querySelector(".product-grid");
   currentProductGrid.innerHTML = "";
   products.forEach(product => {
      currentProductGrid.appendChild(product); 
   })
}

window.onload = () => {
   loadAllProducts();
   addFiltersBehaviour();
}

function loadAllProducts(){
   fetch('myProducts.json')
   .then(res => res.json())
   .then(products => {
      for (let i in products){    
         // creates the div for each product card  
         let productCard = document.createElement("div");
         let colour = products[i].colour;
         let productPrice = parseFloat(products[i].price);
         let brand = products[i].brand;
         let subcategory = products[i].subcategory;
      
         
         if (brand.includes(" ")){
            brand = brand.replace(/\s/g, "-")
            // console.log(brand)
         }                 
         if (colour.includes(" ")){
            colour = colour.replace(/\s/g, "-")
            // console.log(colour)
         }
         if (subcategory.includes(" ")){
            subcategory = subcategory.replace(/\s/g, "-")
            // console.log(subcategory);
         }
         productCard.classList.add("product", products[i].category, subcategory, colour, `price-${productPrice}`, brand, "selected");
         productCard.setAttribute("data-title", products[i].productTitle);
         productCard.setAttribute("data-price", products[i].price);
         productCard.setAttribute("data-rating", products[i].rating);

         if(i < 15){
         itemsDisplayed += 1;
         }
         else{
            productCard.classList.add("hide");
         }
         // creates the element details for each product card
         let imageContainer = document.createElement("div");
         imageContainer.classList.add("image");

         let image = document.createElement("img");
         image.setAttribute("src", `${products[i].imageURL}`);

         let productDescription = document.createElement("div");
         productDescription.classList.add("product-description");
         
         let productTitleDiv = document.createElement("div");
         productTitleDiv.classList.add("product-title");
         let productTitle = document.createElement("h2");
         productTitle.innerText = `${products[i].productTitle}`;
         productTitleDiv.appendChild(productTitle)
         

         let description = document.createElement("h4");
         description.innerText = products[i].usage; 

         let price = document.createElement("h2");
         price.innerText = `$${products[i].price}`;
         
         let rating = document.createElement("h5");
         
         for (let j=0; j<products[i].rating; j++){
            rating.innerText += "⭐";
         }
         

         imageContainer.appendChild(image);

         productDescription.appendChild(productTitleDiv);
         productDescription.appendChild(description);
         productDescription.appendChild(price);
         productDescription.appendChild(rating);

         let addToCartBtn = document.createElement("button");
         addToCartBtn.classList.add("add-to-cart");
         addToCartBtn.innerText = "Add To Cart";
         addToCartBtn.addEventListener("click", function(){
            addToCartBtn.innerText = "Successfully Added To Cart";
            setTimeout(function(){
               addToCartBtn.innerText = "Add To Cart";                                     
            }, 2000)
         });

         productCard.appendChild(imageContainer);
         productCard.appendChild(productDescription);
         productCard.appendChild(addToCartBtn);

         document.querySelector(".product-grid").appendChild(productCard);
         
      };
      minPriceProduct = getMin(products, "price").price;
      minPriceInput.value = minPriceProduct;
      maxPriceProduct = getMax(products, "price").price;
      maxPriceInput.value = maxPriceProduct;

      allProducts = document.querySelectorAll(".product");
      // sets the currently selected products to a list of divs with all products
      selectedProducts = document.querySelectorAll(".selected");

      selectedProductsCount = selectedProducts.length;
      productsCounter.innerHTML = `${itemsDisplayed}/${selectedProductsCount}`;
      categoryAndDescription.innerText = "All Products";
   });
}

function checkWindowSize() {
   if (window.innerWidth < 900){
      removeFiltersBehaviour();
   }
   else{
      addFiltersBehaviour();
   }
 }
 
window.onresize = checkWindowSize;

let hamburger = document.querySelector(".hamburger");
let navBar = document.querySelector(".nav-bar");

hamburger.onclick = function(){
  navBar.classList.toggle("active");
}

let menu = navBar.querySelector("ul");
let menuItems = menu.querySelectorAll("li > a");

for (let item of menuItems){
  item.addEventListener("click", function(){
    if(navBar.classList.contains("active")){
      navBar.classList.toggle("active");
    }
  });

}
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

let hamburgerFilter = document.querySelector("#filter-button");
let sidebar = document.querySelector(".sidebar");
hamburgerFilter.onclick = function(){
  sidebar.classList.toggle("active");
}

let closeFilterButton = document.querySelector("#button-close");
closeFilterButton.onclick = function(){
  sidebar.classList.toggle("active");
}

if (window.innerWidth < 922){      
   let previousScrollPosition = window.scrollY;
   window.onscroll = function() {
      let currentScrollPosition = window.scrollY;
      if (previousScrollPosition > currentScrollPosition) {
         document.querySelector(".products-info").style.top = "12vh";
      } 
      else {
         document.querySelector(".products-info").style.top = "-50vh";
      }
      previousScrollPosition = currentScrollPosition;
   }
}
