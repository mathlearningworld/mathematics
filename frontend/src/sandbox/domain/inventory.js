const RESOURCE_TYPES = Object.freeze(["wood", "stone"]);

export function createInventory(initial = {}) {
  return Object.freeze(
    Object.fromEntries(
      RESOURCE_TYPES.map((type) => [type, normalizeCount(initial[type])]),
    ),
  );
}

export function addResource(inventory, resourceType, amount = 1) {
  assertResourceType(resourceType);
  assertPositiveAmount(amount);

  return createInventory({
    ...inventory,
    [resourceType]: inventory[resourceType] + amount,
  });
}

export function consumeResource(inventory, resourceType, amount = 1) {
  assertResourceType(resourceType);
  assertPositiveAmount(amount);

  if (inventory[resourceType] < amount) {
    return Object.freeze({ inventory, consumed: false });
  }

  return Object.freeze({
    inventory: createInventory({
      ...inventory,
      [resourceType]: inventory[resourceType] - amount,
    }),
    consumed: true,
  });
}

export function getResourceCount(inventory, resourceType) {
  assertResourceType(resourceType);
  return inventory[resourceType];
}

function normalizeCount(value) {
  return Number.isInteger(value) && value >= 0 ? value : 0;
}

function assertResourceType(resourceType) {
  if (!RESOURCE_TYPES.includes(resourceType)) {
    throw new Error(`Unsupported resource type: ${resourceType}`);
  }
}

function assertPositiveAmount(amount) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Resource amount must be a positive integer");
  }
}
