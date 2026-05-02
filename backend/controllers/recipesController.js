// controllers/recipesController.js

const recipesModel = require("../models/recipes");
const { successResponse, errorResponse } = require("../middleware/response");

// GET /recipes  (supports ?tags=vegetarian,gluten-free)
function getAllRecipes(req, res) {
  const filters = {};
  if (req.query.tags) {
    filters.tags = req.query.tags.split(",").map(t => t.trim());
  }
  const recipes = recipesModel.getAll(filters);
  return successResponse(res, recipes);
}

// GET /recipes/:id
function getRecipeById(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "Invalid recipe ID.", { field: "id" });
  }
  const recipe = recipesModel.getById(id);
  if (!recipe) {
    return errorResponse(res, 404, "NOT_FOUND", `Recipe with ID ${id} not found.`, {});
  }
  return successResponse(res, recipe);
}

// POST /recipes
function createRecipe(req, res) {
  const { name, ingredients, instructions, prepTime, cookTime, servings, tags } = req.body;

  if (!name || !ingredients || !instructions) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "Missing required fields: name, ingredients, instructions.", {
      missingFields: [!name && "name", !ingredients && "ingredients", !instructions && "instructions"].filter(Boolean)
    });
  }

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "ingredients must be a non-empty array of strings.", { field: "ingredients" });
  }

  const newRecipe = recipesModel.create({ name, ingredients, instructions, prepTime, cookTime, servings, tags });
  return successResponse(res, { recipeId: newRecipe.recipeId }, 201);
}

// PUT /recipes/:id
function updateRecipe(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "Invalid recipe ID.", { field: "id" });
  }

  const { name, ingredients, instructions, prepTime, cookTime, servings, tags } = req.body;

  if (ingredients !== undefined && (!Array.isArray(ingredients) || ingredients.length === 0)) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "ingredients must be a non-empty array of strings.", { field: "ingredients" });
  }

  const updated = recipesModel.update(id, { name, ingredients, instructions, prepTime, cookTime, servings, tags });
  if (!updated) {
    return errorResponse(res, 404, "NOT_FOUND", `Recipe with ID ${id} not found.`, {});
  }
  return successResponse(res, { recipeId: updated.recipeId });
}

// DELETE /recipes/:id
function deleteRecipe(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "Invalid recipe ID.", { field: "id" });
  }
  const removed = recipesModel.remove(id);
  if (!removed) {
    return errorResponse(res, 404, "NOT_FOUND", `Recipe with ID ${id} not found.`, {});
  }
  return successResponse(res, { recipeId: removed.recipeId });
}

// POST /recipes/suggest
function suggestRecipes(req, res) {
  const { ingredients, preferences } = req.body;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "ingredients must be a non-empty array of strings.", { field: "ingredients" });
  }

  const prefs = Array.isArray(preferences) ? preferences : [];
  const suggestions = recipesModel.suggest(ingredients, prefs);
  return successResponse(res, { suggestions, total: suggestions.length });
}

// POST /recipes/predict-expiration
function predictExpiration(req, res) {
  const { category, storageType } = req.body;

  if (!category || !storageType) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "Missing required fields: category and storageType.", {
      missingFields: [!category && "category", !storageType && "storageType"].filter(Boolean)
    });
  }

  const result = recipesModel.predictExpiration(category, storageType);
  return successResponse(res, result);
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  suggestRecipes,
  predictExpiration
};
