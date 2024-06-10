document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/categories');
    const categories = await response.json();

    const categorySelect = document.getElementById('category');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });

    // Load user recipes
    loadMyRecipes();
});

document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const ingredients = document.getElementById('ingredients').value;
    const instructions = document.getElementById('instructions').value;
    const cooking_time = document.getElementById('cooking_time').value;
    const serving_size = document.getElementById('serving_size').value;
    const category_id = document.getElementById('category').value;

    const response = await fetch('/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, ingredients, instructions, cooking_time, serving_size, category_id, user_id: 1 }) // Assuming user_id is 1 for now
    });

    if (response.ok) {
        alert('Recipe saved');
        loadMyRecipes();
    } else {
        alert('Failed to save recipe');
    }
});

async function loadMyRecipes() {
    const response = await fetch('/recipes');
    const recipes = await response.json();

    const myRecipesDiv = document.getElementById('myRecipes');
    myRecipesDiv.innerHTML = '';
    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.innerHTML = `<h3>${recipe.title}</h3>
                               <p>${recipe.ingredients}</p>
                               <p>${recipe.instructions}</p>
                               <p>Cooking time: ${recipe.cooking_time} mins</p>
                               <p>Serving size: ${recipe.serving_size}</p>`;
        myRecipesDiv.appendChild(recipeDiv);
    });
}
