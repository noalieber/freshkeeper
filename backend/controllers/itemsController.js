// controllers/itemsController.js

const itemsModel = require("../models/items");
const { successResponse, errorResponse } = require("../middleware/response");

const VALID_STORAGE_TYPES = ["fridge", "freezer", "pantry"];
const VALID_CATEGORIES = ["dairy", "meat", "vegetables", "fruits", "grains", "other"];

// GET /items  (supports ?storageType=fridge, ?category=dairy, ?userId=3, ?expiringSoon=true)
function getAllItems(req, res) {
  const filters = {};
  if (req.query.storageType) filters.storageType = req.query.storageType;
  if (req.query.category) filters.category = req.query.category;
  if (req.query.userId) filters.userId = req.query.userId;
  if (req.query.expiringSoon === "true") filters.expiringSoon = true;

  const items = itemsModel.getAll(filters);
  return successResponse(res, items);
}

// GET /items/:id
function getItemById(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "Invalid item ID.", { field: "id" });
  }
  const item = itemsModel.getById(id);
  if (!item) {
    return errorResponse(res, 404, "NOT_FOUND", `Item with ID ${id} not found.`, {});
  }
  return successResponse(res, item);
}

// POST /items
function createItem(req, res) {
  const { name, quantity, unit, expirationDate, storageType, category, userId } = req.body;

  if (!name || quantity === undefined) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "Missing required fields: name and quantity.", {
      missingFields: [!name && "name", quantity === undefined && "quantity"].filter(Boolean)
    });
  }

  if (typeof quantity !== "number" || quantity < 0) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "quantity must be a non-negative number.", { field: "quantity" });
  }

  if (storageType && !VALID_STORAGE_TYPES.includes(storageType)) {
    return errorResponse(res, 400, "VALIDATION_ERROR", `Invalid storageType. Allowed: ${VALID_STORAGE_TYPES.join(", ")}.`, {
      field: "storageType",
      allowedValues: VALID_STORAGE_TYPES
    });
  }

  if (category && !VALID_CATEGORIES.includes(category)) {
    return errorResponse(res, 400, "VALIDATION_ERROR", `Invalid category. Allowed: ${VALID_CATEGORIES.join(", ")}.`, {
      field: "category",
      allowedValues: VALID_CATEGORIES
    });
  }

  if (expirationDate && isNaN(Date.parse(expirationDate))) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "Invalid expirationDate format. Use YYYY-MM-DD.", { field: "expirationDate" });
  }

  const newItem = itemsModel.create({ name, quantity, unit, expirationDate, storageType, category, userId });
  return successResponse(res, { itemId: newItem.itemId }, 201);
}

// PUT /items/:id
function updateItem(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "Invalid item ID.", { field: "id" });
  }

  const { name, quantity, unit, expirationDate, storageType, category } = req.body;

  if (quantity !== undefined && (typeof quantity !== "number" || quantity < 0)) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "quantity must be a non-negative number.", { field: "quantity" });
  }

  if (storageType && !VALID_STORAGE_TYPES.includes(storageType)) {
    return errorResponse(res, 400, "VALIDATION_ERROR", `Invalid storageType. Allowed: ${VALID_STORAGE_TYPES.join(", ")}.`, {
      field: "storageType",
      allowedValues: VALID_STORAGE_TYPES
    });
  }

  if (category && !VALID_CATEGORIES.includes(category)) {
    return errorResponse(res, 400, "VALIDATION_ERROR", `Invalid category. Allowed: ${VALID_CATEGORIES.join(", ")}.`, {
      field: "category",
      allowedValues: VALID_CATEGORIES
    });
  }

  if (expirationDate && isNaN(Date.parse(expirationDate))) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "Invalid expirationDate format. Use YYYY-MM-DD.", { field: "expirationDate" });
  }

  const updated = itemsModel.update(id, { name, quantity, unit, expirationDate, storageType, category });
  if (!updated) {
    return errorResponse(res, 404, "NOT_FOUND", `Item with ID ${id} not found.`, {});
  }
  return successResponse(res, { itemId: updated.itemId });
}

// DELETE /items/:id
function deleteItem(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return errorResponse(res, 400, "VALIDATION_ERROR", "Invalid item ID.", { field: "id" });
  }
  const removed = itemsModel.remove(id);
  if (!removed) {
    return errorResponse(res, 404, "NOT_FOUND", `Item with ID ${id} not found.`, {});
  }
  return successResponse(res, { itemId: removed.itemId });
}

module.exports = { getAllItems, getItemById, createItem, updateItem, deleteItem };
