document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/recipes');
    const recipes = await response.json();

    const recipesDiv = document.getElementById('recipes');
    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.innerHTML = `<h3>${recipe.title}</h3>
                               <p>${recipe.ingredients}</p>
                               <p>${recipe.instructions}</p>
                               <p>Cooking time: ${recipe.cooking_time} mins</p>
                               <p>Serving size: ${recipe.serving_size}</p>`;
        recipesDiv.appendChild(recipeDiv);
    });
});
