window.addEventListener("load", (_event) => {
  const form = document.querySelector(".form");
  const recipesList = document.querySelector(".container");

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
        recipesList.innerHTML = "";
        res.data.forEach(createDrinkCard);
      })
      .catch((err) => console.log(err));

    form.reset();
  });

  // Creates a function to validate the fields of the form
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

  const createTagNode = (parent, tagType, classes, value = null) => {
    const tagNode = document.createElement(tagType);
    tagNode.className = classes;
    tagNode.innerText = value;
    parent.appendChild(tagNode);

    return tagNode;
  };

  const createDrinkCard = (recipe) => {
    const recipeItem = createTagNode(recipesList, "li", "recipe-card");

    createTagNode(recipeItem, "h3", "recipe-card__title", recipe.title);

    createTagNode(recipeItem, "div", "recipe-card__ingredients-box");

    // Splits the ingredients string into an array
    const ingredients = recipe.ingredients.split("|");
    ingredients.forEach((ing) => {
      createTagNode(recipeItem, "p", "recipe-card__ingredients", ing);
    });

    createTagNode(
      recipeItem,
      "p",
      "recipe-card__instructions",
      recipe.instructions.replaceAll(".", ".\n")
    );

    createTagNode(recipeItem, "p", "recipe-card__servings", recipe.servings);
  };
});
