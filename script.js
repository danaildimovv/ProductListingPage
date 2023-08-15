// a global variable for the displayed items
let itemsDisplayed = 0;
// a global variable for the number of currently selected products
let selectedProductsCount = 0;

// a global variable for the selector of the products counter
let productsCounter = document.querySelector(".number-of-items");
// a global variable for the selector for the category name
let categoryAndDescription = document.querySelector(".category-and-description");

// a global variable for the currently selected products based on the main categories
let selectedProducts;
// a global variable to store the currently filtered products
let filteredProducts;
// a global variable to store all products
let allProducts;
// a global variable for sortedProducts
let sortedProducts;
// a global variable for the sorting options
let sortingOptions = document.querySelector(".sorting");
// a global variable for the "Load More" button
let loadMoreButton = document.querySelector("#load-more-button");
// global variable to store the minimum and maximum price
let maxPriceProduct;
let minPriceProduct;
// global variables for the filters
let colorFilter = document.querySelector(".color-filter");
let minPriceInput = document.querySelector("#min-price");
let maxPriceInput = document.querySelector("#max-price");
let brandFilter = document.querySelector(".brands-filter");
let subcategoriesFilter = document.querySelector(".subcategories-filter");
let ratingFilter = document.querySelector(".rating-filter");
let resetFilterButtons = document.querySelectorAll(".reset-filters-button");
// a global variable for all of the "sidebar" filters
let allFilters = [subcategoriesFilter, colorFilter, brandFilter, ratingFilter, minPriceInput, maxPriceInput]

let itemsToDisplay;

// a function to filter the products on the two main categories - Apparel and Footwear 
function filterProducts(category){
   // refreshes the product grid, placing all products on the web page in order to filter products accurately
   refreshProductGrid(allProducts);
   // set the currently active category
   setActiveCategory(category);
   // displays the selected products
   displayFilteredProducts("filter-by-category", allProducts);

   // sets the global variable for the selected products with the currently selected main category 
   selectedProducts = document.querySelectorAll(`.selected`);
   // sets the number of selected products to the currently selected ones
   selectedProductsCount = selectedProducts.length;
   productsCounter.innerHTML = `${itemsDisplayed}/${selectedProductsCount}`;
   
   // display the name of the selected category
   if (category == "default"){
      categoryAndDescription.innerText = `All Products`;
   }
   else{
   categoryAndDescription.innerText = `${category}`;
   }
   let ind=0;
   let currentCategory = document.querySelector("#current-category");
   currentCategory.innerHTML = document.querySelector(".active-category").innerHTML;
   // resets the sorting option
   sortingOptions.value = "default";
   // resets the "sidebar" filters
   allFilters.forEach(filter => {
      if (filter == minPriceInput){
         filter.value = minPriceProduct;
      }
      else if (filter == maxPriceInput){
         filter.value = maxPriceProduct;
      }
      else{
         let allFilterOptions = document.querySelectorAll(`${allFiltersClasses[ind]} input`)
         allFilterOptions.forEach(filt => {
            if (filt.checked)
            filt.click();
         });
         ind += 1;
      }
      
   });

   // specifies the subcategories depending on the currently selected category
   let apparelSubcategories = document.querySelectorAll(".apparelSubcategory");
   let footwearSubcategories = document.querySelectorAll(".footwearSubcategory");
   if (category == "Apparel"){
     displayRelevantSubcategories(apparelSubcategories, footwearSubcategories, false);
   }
   else if(category == "Footwear"){
      displayRelevantSubcategories(footwearSubcategories, apparelSubcategories, false);
   }
   else {
      displayRelevantSubcategories(apparelSubcategories, footwearSubcategories, true);
   }
   // sets the filtered and sorted products to null to specify the load more button
   filteredProducts = null;
   sortedProducts = null;   
}
// a function to set the current active category
function setActiveCategory(currentCategory){
   // storing the categories links from the header menu
   let categoriesLinks = document.querySelectorAll(".nav-bar ul li a");

   categoriesLinks.forEach((categoryLink) => {
      // checks if value equals innerText
      if (categoryLink.innerText.toUpperCase().includes(currentCategory.toUpperCase())){
        categoryLink.classList.add("active-category");
      }
      else if(currentCategory == "default" && categoryLink.innerText == "All Products"){
         categoryLink.classList.add("active-category");
      } 
      else {
        categoryLink.classList.remove("active-category");
      }
    });
}
// a function to show and hide the relevant and irrelevant subcategories
function displayRelevantSubcategories(shownSubcategories, hiddenSubcategories, bothSubcategories){   
   if (!bothSubcategories){
      shownSubcategories.forEach(subcategory => {
         subcategory.style.display = "block";
      })
      hiddenSubcategories.forEach(subcategory => {
         subcategory.style.display = "none";
      })
   }
   else {
      shownSubcategories.forEach(subcategory => {
         subcategory.style.display = "block";
      });
      hiddenSubcategories.forEach(subcategory => {
         subcategory.style.display = "block";
      });
   }
}

// a function to display the currently selected products, used for all types of filtering
// including main categories from the header and the filters from the sidebar
let productsCount;
let subfilteredProducts;
let subcatInd;
let checkedFilterValues = [];
function displayFilteredProducts(filter, productsToSelectFrom){
   // a variable to track the number of products
   itemsDisplayed = 0;
   productsCount = 0;
   productsToSelectFrom.forEach((product) => {   

      if (filter == "default"){
         displayProduct(product);
      }

      else if(filter == "filter-by-category"){
         let selectedCategory = document.querySelector(".active-category").innerHTML;
         let currentProductCategory = product.dataset.category;
         displayFilter(selectedCategory, currentProductCategory, product)
      }
      
      else if (filter == "filter-by-price"){
         let price = parseFloat(product.dataset.price);
         if (price >= minPriceInput.value && price <= maxPriceInput.value){
            displayProduct(product);
         }
         else {
            hideProduct(product);
         }
      }

      else if (filter == "filter-by-subcategory"){
         let selectedSubcategories = document.querySelectorAll(".subcategories-filter input");
         let checkedSubcategories = [];
         selectedSubcategories.forEach(subcategory => {
            if (subcategory.checked){
               checkedSubcategories.push(subcategory);
            }
         })
         let currentProductSubcategory = product.dataset.subcategory;
         subcatInd = 0;
         for (let subcategory of checkedSubcategories){
            displayFilter(subcategory.value, currentProductSubcategory, product);
            subcatInd = subcatInd + 1;
         }
      }

      else if (filter == "filter-by-color"){
         let currentColors = document.querySelectorAll(".color-filter input");
         let checkedColours = [];
         currentColors.forEach(color => {
            if(color.checked){
               checkedColours.push(color);
            }
         })

         let currentProductColor = product.dataset.colour;
         subcatInd = 0;
         for (let color of checkedColours){
            displayFilter(color.value, currentProductColor, product);
            subcatInd = subcatInd + 1;
         }
         
      }

      else if (filter == "filter-by-brand"){
         let currentBrands = document.querySelectorAll(".brands-filter input");
         let checkedBrands = [];
         currentBrands.forEach(brand => {
            if (brand.checked){
               checkedBrands.push(brand);
            }
         })

         let currentProductBrand = product.dataset.brand;
         subcatInd = 0;
         for (let brand of checkedBrands){
         displayFilter(brand.value, currentProductBrand, product);
         subcatInd = subcatInd + 1;
         }
      }

      else if(filter == "filter-by-rating"){
         let currentRatings = document.querySelectorAll(".rating-filter input");
         let checkedRatings = [];
         currentRatings.forEach(rating => {
            if (rating.checked){
               checkedRatings.push(rating);
            }
         })

         let currentProductRating = product.dataset.rating;
         subcatInd = 0;
         for (let rating of checkedRatings){
            
            displayFilter(rating.value, currentProductRating, product);
            subcatInd = subcatInd + 1;
         }
      }
      
      else {
        hideProduct(product);
      }

      // if the displayed items are less than 15, hides the "Load More" button 

      if (itemsDisplayed < itemsToDisplay){
         loadMoreButton.style.display = "none";
      }
      // else shows it again
      else if (loadMoreButton.style.display == "none"){
         loadMoreButton.style.display = "";
      }      
   });
   // scrolls to the top of the page after applying any filter
   window.scrollTo(0, 0);
}

function displayFilter(selectedFilter, currentProductFilter, currentProduct){
      if(selectedFilter == currentProductFilter || selectedFilter == "All Products"){
         displayProduct(currentProduct);
      }
      else if(subcatInd > 0 && currentProduct.classList.contains("selected")){   
         displayProduct(currentProduct);
      }
      else {
         hideProduct(currentProduct);
      }
   
}

function displayProduct(product){
   product.classList.add("selected");
   productsCount += 1;
   showFilteredElement(productsCount, product);
}
function hideProduct(product){
      // hides other elements
      if(!product.classList.contains("hide")){
         product.classList.add("hide");
      }
      // if they were selected, unselects them
      if(product.classList.contains("selected")){
         product.classList.remove("selected");
      }
}
function showFilteredElement(productsNumber, element){
   if (productsNumber <= itemsToDisplay){
      itemsDisplayed += 1;
      element.classList.remove("hide");
   } 
   else{
      if(!element.classList.contains("hide")){
      element.classList.add("hide");
      }
   } 
}

function refreshProductGrid(products){
   let currentProductGrid = document.querySelector(".product-grid");
   currentProductGrid.innerHTML = "";
   products.forEach(product => {
      currentProductGrid.appendChild(product); 
   })
}
// a function to filter the products accoding to the currently applied filters
function filterCurrentProducts(){
   // an arr to track the currently active filters 
   let activeFilters = [];
   // checks each of the filters on the sidebar
   let filterIndex = 0; 
   let allFilterOptions;
   allFilters.forEach(filter => {
      allFilterOptions = document.querySelectorAll(`${allFiltersClasses[filterIndex]} input`);
      for (let option of allFilterOptions){
         if (option.checked){
            activeFilters.push(filter);
            break;
         }
      }
      console.log(activeFilters);
      if (!isNaN(filter.value)){
         activeFilters.push(filter)
      }
      // else if (filter.value == "default"){
      //    displayFilteredProducts(filter.value, selectedProducts);
      // }
      filterIndex += 1;
   })
   filterIndex = 0;
   // refreshes the product grid with the currently selected products of category to filter accurately
   refreshProductGrid(selectedProducts);
   if (activeFilters.length){
      // sets the initial value of the filtered products to the selected products
      filteredProducts = selectedProducts;
      
      // goes over every active filter
      activeFilters.forEach(filter => {
         if (filter == minPriceInput || filter == maxPriceInput){
            displayFilteredProducts("filter-by-price", filteredProducts);
         }
         // else if(filter == ratingFilter){
         //    displayFilteredProducts(parseFloat(filter.value), filteredProducts);
         // }
         else if (filter == subcategoriesFilter){
            displayFilteredProducts("filter-by-subcategory", filteredProducts);
         }
         else if (filter == colorFilter){
            displayFilteredProducts("filter-by-color", filteredProducts);
         }
         else if (filter == brandFilter){
            displayFilteredProducts("filter-by-brand", filteredProducts);
         }
         else if(filter == ratingFilter){
            displayFilteredProducts("filter-by-rating", filteredProducts);
         }
         filteredProducts = document.querySelectorAll(".selected");      
      })
      selectedProductsCount = filteredProducts.length;
      // let selectedFilters = document.querySelector(".filter-values");
      // selectedFilters.style.display = "block";
      // selectedFilters.innerHTML = "";
      // checkedFilterValues.forEach( filter => {
      //    selectedFilters.innerHTML += filter.value;
      // })
      // if (!checkedFilterValues.length){
      //    selectedFilters.style.display = "none";
      // }
      
      
   }
   else{
      displayFilteredProducts("default", selectedProducts);
      selectedProductsCount = selectedProducts.length;
   }
   productsCounter.innerHTML = `${itemsDisplayed}/${selectedProductsCount}`;
   sortingOptions.value = "default";
   
   // a quick check if there is a "hamburger" sidebar
   // let sidebar = document.querySelector(".sidebar");
   // if(sidebar.classList.contains("active")){
   //    sidebar.classList.toggle("active");
   // }
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

function sortAZ(productA, productB) {
   productA = productA.dataset.producttitle.toUpperCase();
   productB = productB.dataset.producttitle.toUpperCase();

   if (productA < productB)
      return -1;
   if (productA > productB)
      return 1;
   return 0;
}
function sortZA(productA, productB) {
   productA = productA.dataset.producttitle.toUpperCase();
   productB = productB.dataset.producttitle.toUpperCase();

   if (productA > productB)
      return -1;
   if (productA < productB)
      return 1;
   return 0;
}
function sortPriceAsc(productA, productB) {
   productA = parseFloat(productA.dataset.price);
   productB = parseFloat(productB.dataset.price);

   if (productA < productB)
       return -1;
   if (productA > productB)
       return 1;
   return 0;
}
function sortPriceDesc(productA, productB) {
   productA = parseFloat(productA.dataset.price);
   productB = parseFloat(productB.dataset.price);

   if (productA > productB)
       return -1;
   if (productA < productB)
       return 1;
   return 0;
} 
// Function to sort Data
function sortProducts(sortType) {
   let productsToSort = Array.from(selectedProducts);
   itemsDisplayed = 0;

   if (filteredProducts && (filteredProducts !== selectedProducts))
   productsToSort = Array.from(filteredProducts);


   sortedProducts = productsToSort;
   if (sortType !== "default"){
      sortedProducts.sort(sortType);
   }
   let productGrid = document.querySelector(".product-grid");
   productGrid.innerHTML = "";
   
   let productsCount = 0;
   sortedProducts.forEach(productCard => {
      productGrid.appendChild(productCard);
      productsCount += 1;
      if(productsCount <= itemsToDisplay){
         productCard.classList.remove("hide");
         itemsDisplayed += 1;
      }
      else{
         productCard.classList.add("hide");
      }  
   })
   // sets the sorted products to the currently sorted
   sortedProducts = document.querySelectorAll(".selected");

   productsCounter.innerHTML = `${itemsDisplayed}/${selectedProductsCount}`;
   window.scrollTo(0, 0);
}

window.onload = () => {
   decideItemsToDisplay();
   loadAllProducts();
   setFilters();
   addFiltersBehaviour();
   setResetFilterButtons();
   setSortingOptions();
   setHamburgerNavbarButtons();
   setHamburgerFilterButtons();   
   loadMoreButton.addEventListener("click", loadMore);
   setStickyMobile();
}
function loadAllProducts(){
   fetch('myProducts.json')
   .then(res => res.json())
   .then(products => {
      for (let i in products){    
         // creates the div for each product card  
         let productCard = document.createElement("div");

         productCard.classList.add("product", "selected");

         let productAttributes = Object.keys(products[i]);
         for (let k in productAttributes){
            let currentProduct = products[i];
            let attribute = productAttributes[k];
            let value = currentProduct[attribute];
            
            if (isNaN(value) && value.includes(" ")){
               value = value.replace(/\s/g, "-")
            } 
            productCard.setAttribute(`data-${attribute}`, value);
         }
         // productCard.setAttribute("data-title", title);
         // productCard.setAttribute("data-category", productCategory);
         // productCard.setAttribute("data-subcategory", productSubcategory);
         // productCard.setAttribute("data-colour", colour);
         // productCard.setAttribute("data-price", productPrice);
         // productCard.setAttribute("data-brand", brand);
         // productCard.setAttribute("data-productRating", productRating);
         // productCard.setAttribute("data-productGender", gender);
         // productCard.setAttribute("data-productType", productType);
         // productCard.setAttribute("data-productUsage", productUsage);

         if(i < itemsToDisplay){
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
         let productCardTitle = document.createElement("h2");
         productCardTitle.innerText = products[i].productTitle;
         productTitleDiv.appendChild(productCardTitle);
         

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
      let currentCategory = document.querySelector("#current-category");
      currentCategory.innerHTML = document.querySelector(".active-category").innerHTML;
   });
}
function setResetFilterButtons(){
   resetFilterButtons.forEach(resetButton => {
      resetButton.addEventListener("click", function(){
         let ind=0;   
         allFilters.forEach(filter => {
            if (filter == minPriceInput){
               filter.value =  minPriceProduct;
            }
            else if (filter == maxPriceInput){
               filter.value = maxPriceProduct;
            }
            else {
               let allFilterOptions = document.querySelectorAll(`${allFiltersClasses[ind]} input`)
               allFilterOptions.forEach(filt => {
                  if (filt.checked)
                  filt.click();
               });
               ind += 1;
            }
         })
         filteredProducts = null;
         sortedProducts = null;
         filterCurrentProducts();

         let sidebar = document.querySelector(".sidebar");
         if (sidebar.classList.contains("active")){
            sidebar.classList.remove("active");
         }
      })
   });
}
function loadMore(){  
   if (sortedProducts){
      setloadMoreButton(sortedProducts);
   }
   else if(filteredProducts){
      setloadMoreButton(filteredProducts);
   }
   else{
      setloadMoreButton(selectedProducts);
   }
}
// sets the "Load More" button behaviour
function setloadMoreButton(currentProducts){
   let currentItem = itemsDisplayed;
   selectedProductsCount = currentProducts.length;
   for (let i = currentItem; i< currentItem + itemsToDisplay; i++){
      currentProducts[i].classList.remove("hide");
      itemsDisplayed += 1;

      if (itemsDisplayed == selectedProductsCount){
         loadMoreButton.style.display = "none";         
         // filteredProducts = null;
         break;
      }
   }
   productsCounter.innerHTML = `${itemsDisplayed}/${selectedProductsCount}`;
}
function setSortingOptions(){
   sortingOptions.addEventListener("change", function(){
      if(sortingOptions.value == "sort-az"){
         sortProducts(sortAZ);
      }
      else if(sortingOptions.value == "sort-za"){
         sortProducts(sortZA);
      }
      else if (sortingOptions.value == "price-asc"){
         sortProducts(sortPriceAsc);
      }
      else if(sortingOptions.value == "price-desc"){
         sortProducts(sortPriceDesc);
      }
      else{
         sortProducts("default");
      }
   })
}
function addFiltersBehaviour(){
   allFilters.forEach(filter => {
      if (filter == minPriceInput || filter == maxPriceInput){
         filter.addEventListener("input", 
            filterCurrentProducts);
      }
      else{
         filter.addEventListener("change", filterCurrentProducts)
      }
   })
} 
function setHamburgerNavbarButtons(){
   let hamburgerMenuIcon = document.querySelector(".hamburger");
   let navBar = document.querySelector(".nav-bar");
   hamburgerMenuIcon.addEventListener("click", function(){
      navBar.classList.toggle("active");
   })
   
   let hamburgerMenuItems = document.querySelectorAll(".nav-bar ul li a");
   for (let menuItem of hamburgerMenuItems){
      setHamburgerCloseButton(menuItem, navBar);
   }
}
function setHamburgerFilterButtons(){
   let hamburgerFilterButton = document.querySelector("#filter-button");
   let sidebar = document.querySelector(".sidebar");
   hamburgerFilterButton.addEventListener("click", function(){
      sidebar.classList.toggle("active");
   });

   let closeFilterButton = document.querySelector("#button-close");
   let submitFiltersButton = document.querySelector("#submit-filter-button");
   setHamburgerCloseButton(closeFilterButton, sidebar);
   setHamburgerCloseButton(submitFiltersButton, sidebar);
}
function setHamburgerCloseButton(button, bar){
   button.addEventListener("click", function(){
      if (bar.classList.contains("active"))
         bar.classList.remove("active");
   })
}
function setStickyMobile(){
   if (window.innerWidth < 550){      
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
}
function decideItemsToDisplay(){
   if (window.innerWidth < 1222){
      itemsToDisplay = 10;
   }
   else{
      itemsToDisplay = 15;
   }
}

let allFiltersClasses = [".subcategories-filter", ".color-filter", ".brands-filter", ".rating-filter", ".price-filter"];
function setFilters(){
   let sidebarFilters = document.querySelectorAll(".sidebar ul li.checkbox-filter label.filter-box")
   
   for (let ind = 0; ind < sidebarFilters.length; ind ++){
      if (window.innerWidth < 922){
         document.querySelector(`${allFiltersClasses[ind]}-toggle i`).classList.remove("fa-minus");
         document.querySelector(`${allFiltersClasses[ind]}-toggle i`).classList.add("fa-plus");
         document.querySelector(allFiltersClasses[ind]).classList.add("hide");
         if (ind == 0){
            document.querySelector("#current-category").classList.add("hide");
         }
         document.querySelector(`${allFiltersClasses[ind]}-line`).classList.add("hide");
      }
      else{
         document.querySelector(allFiltersClasses[ind]).classList.remove("hide");
         if (ind == 0){
            document.querySelector("#current-category").classList.remove("hide");
         }
         document.querySelector(`${allFiltersClasses[ind]}-line`).classList.remove("hide");
      }

      sidebarFilters[ind].addEventListener("click", function(){
         document.querySelector(allFiltersClasses[ind]).classList.toggle("hide");
         if (ind == 0){
            document.querySelector("#current-category").classList.toggle("hide");
         }
         document.querySelector(`${allFiltersClasses[ind]}-line`).classList.toggle("hide");
         if (document.querySelector(`${allFiltersClasses[ind]}-toggle`).innerHTML == '<i class="fa-solid fa-minus" style="color:#fff"></i>')
         document.querySelector(`${allFiltersClasses[ind]}-toggle`).innerHTML = '<i class="fa-solid fa-plus" style="color:#fff"></i>'; 
         else
         document.querySelector(`${allFiltersClasses[ind]}-toggle`).innerHTML = '<i class="fa-solid fa-minus" style="color:#fff"></i>';
      })
   }
}

let allColors = document.querySelectorAll(".color-filter .color-checkbox span");
allColors.forEach(color => {
   document.getElementById(color.id).style.backgroundColor = color.id.split("-")[0];
})