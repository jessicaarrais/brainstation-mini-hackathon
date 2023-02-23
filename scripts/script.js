window.addEventListener("load", (_event) => {
  // Helper array to store data temporarilly
  let temp = [];

  const form = document.querySelector(".form");
  const recipesList = document.querySelector(".recipe-list");

  // Form to retrieve data from API
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!formInputAuth(e.target.searchbar)) return;
    const inputValue = e.target.searchbar.value;

    axios
      .get(`https://api.api-ninjas.com/v1/recipe?query=${inputValue}`, {
        headers: {
          "X-Api-Key": apiKey,
        },
      })
      .then((res) => {
        if (res.data.length === 0) {
          prompt("no results found");
        }
        recipesList.innerHTML = "";
        temp = res.data;
        res.data.forEach(createDrinkCard);
      })
      .catch((err) => console.log(err));

    form.reset();
  });

  // Validates the field of the form
  const formInputAuth = (targetName) => {
    const errorSpan = document.querySelector(".form__validity");

    if (!targetName.value.trim()) {
      targetName.classList.add("form__input--error");
      errorSpan.innerHTML = "Invalid input.";
      return false;
    }
    targetName.classList.remove("form__input--error");
    errorSpan.innerHTML = "";
    return true;
  };

  // Creates a HTML tag
  const createTagNode = (parent, tagType, classes, value = null) => {
    const tagNode = document.createElement(tagType);
    tagNode.className = classes;
    tagNode.innerText = value;
    parent.appendChild(tagNode);

    return tagNode;
  };

  // Creates a fake page to display the recipe
  const createRecipePage = (recipe) => {
    const recipeSection = createTagNode(recipesList, "div", "recipe-section");
    const recipeItem = createTagNode(recipesList, "li", "recipe-page");

    createTagNode(recipeSection, "h3", "recipe", recipe.title);
    createTagNode(recipeItem, "div", "recipe-page__ingredients-box");

    // Splits the ingredients string into an array
    const ingredients = recipe.ingredients.split("|");
    ingredients.forEach((ing) => {
      createTagNode(recipeItem, "p", "recipe-page__ingredients", ing);
    });

    createTagNode(
      recipeItem,
      "p",
      "recipe-page__instructions",
      recipe.instructions.replaceAll(".", ".\n")
    );

    createTagNode(recipeItem, "p", "recipe-page__servings", recipe.servings);

    createTagNode(recipeItem, "button", "recipe-page", "BACK").addEventListener(
      "click",
      (_e) => {
        recipesList.innerHTML = "";
        temp.forEach(createDrinkCard);
      }
    );
  };

  // Creates a Drink Card
  const createDrinkCard = (recipe) => {
    const recipeItem = createTagNode(recipesList, "li", "recipe-card");
    recipeItem.addEventListener("click", (_e) => {
      recipesList.innerHTML = "";
      createRecipePage(recipe);
    });

    createTagNode(recipeItem, "h3", "recipe-card__title", recipe.title);

    createTagNode(recipeItem, "p", "recipe-card__servings", recipe.servings);
  };
});
