# 15E — Merchant Economy Production Guide

**Project:** Math Learning World  
**World Slice:** Builder's Valley  
**Phase:** 15 — NPC & Population System  
**Document Type:** Production Guide / Merchant Economy Authority  
**Status:** Production Ready  
**Parent Authority:** `15-NPC-AND-POPULATION-SYSTEM-GUIDE.md`  
**Direct Dependencies:** `15A-POPULATION-DISTRIBUTION-PRODUCTION-GUIDE.md`, `15B-DAILY-SCHEDULE-PRODUCTION-GUIDE.md`, `15C-NPC-ROLES-PRODUCTION-GUIDE.md`, `15D-PROFESSION-SYSTEM-PRODUCTION-GUIDE.md`

---

## 1. Purpose

This guide defines how merchants, shops, inventory, pricing, demand, supply, currency, production, and distribution operate as one coherent economy inside Builder's Valley.

It converts the profession and population foundations into a production-ready merchant economy covering:

- merchant taxonomy;
- shop ownership and operating authority;
- inventory authority and stock lifecycle;
- production, procurement, transport, and retail flow;
- item valuation and pricing;
- scarcity, demand, and substitution;
- currency movement and transaction integrity;
- restocking and service continuity;
- player-facing trade;
- education, profession, and economy integration;
- runtime state, simulation tiers, save/load, recovery, and validation.

This document is the authoritative production reference for deciding **who may sell, what may be sold, where goods come from, how prices are determined, how stock moves, how shortages affect the world, how transactions remain auditable, and how the economy stays believable when actors or locations are offstage**.

It does not define full dialogue behavior, reputation scoring, generic interaction policy, or event participation policy. Those responsibilities belong to later Phase 15 documents.

---

## 2. Production Outcome

A conforming implementation must produce an economy that:

1. connects merchant behavior to real professions, schedules, workplaces, and population distribution;
2. preserves clear ownership and authority over shops, stock, currency, and transaction records;
3. distinguishes physical inventory from projected availability;
4. prevents item duplication, negative stock, and unbacked currency creation;
5. supports believable supply, demand, scarcity, and substitution;
6. keeps prices explainable and bounded rather than arbitrary;
7. allows local shortages to matter without making the world permanently unusable;
8. exposes economic state through low-language visual cues;
9. supports deterministic validation and recovery;
10. scales from nearby simulation to offstage aggregation without changing economic meaning.

---

## 3. Economy Authority Hierarchy

Merchant economy decisions must obey this order:

1. transaction integrity;
2. ownership and custody authority;
3. protected-item and safety policy;
4. stock existence and reservation state;
5. merchant and workplace authorization;
6. price policy and allowed bounds;
7. active contract or order obligations;
8. supply and demand state;
9. schedule and location availability;
10. simulation optimization.

A lower authority must never override a higher one.

Examples:

- A high demand signal must not sell stock already reserved for an existing order.
- A merchant shortage must not create inventory from nothing.
- A price modifier must not bypass a protected-item access rule.
- Offstage simulation must not complete a transaction that would fail under full simulation.

---

## 4. Economic Model Boundaries

The Builder's Valley economy is a bounded world economy, not a speculative financial simulation.

The system models:

- useful goods and services;
- production and transformation;
- local trade;
- household and workplace consumption;
- learning-related tools and materials;
- inventory scarcity;
- merchant cash flow;
- service access;
- contract fulfillment.

The system does not require:

- securities markets;
- compound debt systems;
- predatory lending;
- gambling mechanics;
- uncontrolled inflation simulation;
- real-money exchange;
- player-to-player speculative trading.

Economic mechanics must support learning, world believability, and operational consequences rather than financial exploitation.

---

## 5. Merchant Taxonomy

### 5.1 Retail Merchant

A retail merchant sells finished goods directly to households, learners, workers, or the player.

Examples:

- general store keeper;
- tool shop merchant;
- stationery merchant;
- food stall operator;
- clothing merchant;
- repair-parts seller.

Primary responsibilities:

- display available goods;
- maintain retail stock;
- accept payment;
- issue transaction evidence;
- manage reservations and returns;
- request restock.

### 5.2 Wholesale Merchant

A wholesale merchant sells larger quantities to workplaces, shops, institutions, or production operators.

Primary responsibilities:

- bulk order management;
- allocation across buyers;
- contract pricing;
- delivery coordination;
- shortage communication;
- supplier relationships.

### 5.3 Service Merchant

A service merchant sells access to skilled work rather than transferring only a physical item.

Examples:

- repair shop;
- tailoring service;
- tool sharpening;
- tutoring session;
- transport service;
- inspection service.

Service sales must bind to:

- a qualified professional;
- a valid time window;
- required materials;
- service capacity;
- completion evidence.

### 5.4 Mobile Merchant

A mobile merchant operates through a cart, stall, route, or temporary location.

Rules:

- inventory remains attached to a mobile custody container;
- location availability follows schedule and route authority;
- disappearance from a location must not destroy open orders;
- mobile merchants require clear next-availability projection.

### 5.5 Institutional Merchant

An institutional merchant represents a school, workshop, cooperative, town office, or community store.

Institutional trade may use:

- allocated budgets;
- approved catalogs;
- role-based purchasing authority;
- internal stock transfer;
- reduced or zero retail markup.

### 5.6 Producer-Merchant

A producer-merchant creates and sells their own output.

Examples:

- carpenter selling furniture;
- farmer selling produce;
- craft instructor selling training kits;
- toolmaker selling tools.

Production and retail records must remain distinct even when the same NPC controls both.

### 5.7 Broker or Coordinator

A coordinator matches buyers and suppliers without necessarily holding physical stock.

A coordinator may:

- expose supplier availability;
- create purchase orders;
- reserve future delivery capacity;
- collect a bounded service fee.

A coordinator must never project stock as immediately available unless custody or confirmed fulfillment authority exists.

---

## 6. Merchant Identity and Authorization

Merchant identity must be separate from merchant profession, workplace role, and shop ownership.

A merchant actor requires:

- stable `merchantId`;
- linked `npcId` or institutional actor ID;
- active merchant authorization;
- one or more permitted merchant categories;
- assigned sales location or route;
- transaction authority scope;
- currency custody account;
- suspension and audit state.

Recommended authorization states:

- `PENDING`;
- `ACTIVE`;
- `LIMITED`;
- `SUSPENDED`;
- `REVOKED`;
- `RETIRED`.

Rules:

- A shop employee may operate a register without owning the shop.
- A shop owner may own inventory but lack authority to sell protected goods personally.
- A substitute merchant must receive explicit temporary authority.
- Authorization expiry must stop new sales while preserving existing transaction history.

---

## 7. Shop Model

A shop is an economic workplace with explicit ownership, custody, operating state, and service area.

Required shop identity:

```text
shopId
shopType
ownerActorId
operatingAuthorityId
locationId
inventoryAccountId
currencyAccountId
pricePolicyId
scheduleId
serviceAreaId
status
version
```

Recommended shop states:

- `PLANNED`;
- `SETUP`;
- `OPEN`;
- `LIMITED_SERVICE`;
- `CLOSED_SCHEDULED`;
- `CLOSED_STOCKOUT`;
- `SUSPENDED`;
- `RELOCATING`;
- `RETIRED`.

State rules:

- `OPEN` requires an authorized operator, valid location, and active sale catalog.
- `LIMITED_SERVICE` may expose only categories with available staff and stock.
- `CLOSED_STOCKOUT` must communicate shortage rather than appearing broken.
- `RETIRED` forbids new transactions but preserves historical records.

---

## 8. Ownership, Custody, and Control

The economy must distinguish:

- legal or world ownership;
- physical custody;
- operational control;
- sale authorization;
- reservation authority;
- accounting responsibility.

These may belong to different actors.

Example:

- A cooperative owns the goods.
- A warehouse holds physical custody.
- A shop manager controls allocation.
- A clerk performs the sale.
- A courier temporarily holds transport custody.

Every stock movement must identify:

- source custody;
- destination custody;
- authorizing actor;
- quantity;
- item identity;
- movement reason;
- timestamp;
- correlation or order ID.

---

## 9. Item and Catalog Authority

A sellable item definition must include:

```text
itemDefinitionId
categoryId
unitType
stackPolicy
qualityPolicy
shelfLifePolicy
protectedAccessPolicy
baseValuePolicy
substitutionGroupId
productionRecipeId?
```

A catalog entry must include:

```text
catalogEntryId
shopId
itemDefinitionId
saleUnit
minimumQuantity
maximumQuantity
pricePolicyOverride?
visibilityState
availabilityProjection
```

Catalog presence does not prove stock availability.

The runtime must distinguish:

- `LISTED` — item can be offered when available;
- `IN_STOCK` — physical unreserved stock exists;
- `LOW_STOCK` — quantity is below policy threshold;
- `RESERVED_ONLY` — stock exists but is fully reserved;
- `BACKORDER` — future supply is accepted;
- `OUT_OF_STOCK` — no current sale quantity;
- `DISCONTINUED` — no new supply expected.

---

## 10. Inventory Ledger

Inventory is authoritative only through a ledger or equivalent auditable state transition model.

Required quantity dimensions:

- physical quantity;
- reserved quantity;
- available quantity;
- damaged quantity;
- in-transit quantity;
- expired quantity;
- pending-inspection quantity.

Invariant:

```text
available = physical - reserved - blocked
```

Where `blocked` may include damaged, expired, quarantined, or inspection-pending stock.

Core inventory operations:

- receive;
- inspect;
- accept;
- reject;
- reserve;
- release reservation;
- sell;
- transfer;
- consume;
- return;
- damage;
- expire;
- adjust with evidence.

Negative available stock is forbidden.

Manual adjustment requires:

- authorized actor;
- reason code;
- before and after quantity;
- evidence note;
- audit marker.

---

## 11. Stock Units and Quality

Items may be tracked as:

- fungible quantity;
- batch;
- serialized unit;
- quality-graded batch;
- perishable lot;
- crafted unique object.

Quality may affect:

- allowed use;
- sale price;
- durability;
- learner suitability;
- profession requirements;
- substitution eligibility.

Quality must not be reduced to hidden randomness. The player should receive understandable cues such as:

- condition icon;
- quality tier;
- durability bar;
- inspection mark;
- expiry indicator.

---

## 12. Reservation Authority

Reservations protect stock from double sale.

Reservation sources include:

- active cart;
- confirmed order;
- workplace requisition;
- school allocation;
- service job material hold;
- delivery contract.

A reservation must include:

```text
reservationId
inventoryAccountId
itemDefinitionId
quantity
ownerContext
expiresAt
priority
status
```

Reservation states:

- `HELD`;
- `CONFIRMED`;
- `CONSUMED`;
- `RELEASED`;
- `EXPIRED`;
- `CANCELLED`.

Rules:

- Expired reservations release stock deterministically.
- Higher priority does not silently steal confirmed stock.
- Reallocation requires an explicit cancellation or negotiated substitution.
- Save/load must restore reservation expiry consistently.

---

## 13. Supply Chain

The standard material flow is:

```text
Resource Source
→ Producer
→ Processor
→ Warehouse or Wholesaler
→ Retailer or Service Workplace
→ Consumer
```

Not every item requires every stage.

Supply chain records must support:

- source identity;
- production batch;
- transformation output;
- transport custody;
- delivery acceptance;
- rejection or loss;
- final sale or consumption.

The system must be able to explain why an item is unavailable.

Valid shortage causes include:

- producer interruption;
- missing input material;
- transport delay;
- failed inspection;
- demand spike;
- schedule closure;
- merchant absence;
- reservation pressure;
- spoilage;
- event allocation.

---

## 14. Production-to-Market Integration

Profession output from 15D becomes economic supply only after an accepted output event.

Required transition:

```text
WORK_STARTED
→ MATERIALS_CONSUMED
→ OUTPUT_CREATED
→ OUTPUT_INSPECTED
→ OUTPUT_ACCEPTED
→ INVENTORY_RECEIVED
→ AVAILABLE_FOR_ALLOCATION
```

Rules:

- Starting work does not create sellable stock.
- Failed output must not enter normal inventory.
- Rework must preserve material and labor evidence.
- Output quality must reflect validated production evidence.
- Educational practice output may be restricted from commercial sale unless approved.

---

## 15. Procurement

Procurement creates intentional supply rather than ambient replenishment.

Procurement types:

- routine restock;
- low-stock reorder;
- customer backorder;
- workplace requisition;
- seasonal preparation;
- emergency supply;
- educational allocation.

A purchase order must include:

```text
purchaseOrderId
buyerActorId
supplierActorId
itemLines
agreedPricePolicy
deliveryWindow
paymentTerms
substitutionPolicy
status
```

Purchase order states:

- `DRAFT`;
- `SUBMITTED`;
- `ACCEPTED`;
- `PARTIALLY_FULFILLED`;
- `FULFILLED`;
- `REJECTED`;
- `CANCELLED`;
- `EXPIRED`.

---

## 16. Logistics and Delivery

Goods in transit must remain visible to the economy.

Delivery states:

- `PLANNED`;
- `PICKING`;
- `READY_FOR_DISPATCH`;
- `IN_TRANSIT`;
- `ARRIVED`;
- `INSPECTION_PENDING`;
- `ACCEPTED`;
- `PARTIALLY_ACCEPTED`;
- `REJECTED`;
- `FAILED`.

Rules:

- Dispatch transfers custody but not final acceptance.
- In-transit stock cannot be sold as on-hand stock.
- Projected arrival may support backorders.
- Delivery failure must restore or resolve custody explicitly.
- Fast travel or time skip must not bypass required acceptance states.

---

## 17. Demand Model

Demand represents expected consumption pressure, not guaranteed purchases.

Demand signals may come from:

- household needs;
- workplace consumption;
- school activities;
- profession production requirements;
- player purchases;
- seasonal change;
- public events;
- repair incidents;
- population growth;
- substitution failure.

Demand should be modeled by category and time window rather than by simulating every invisible purchase.

Recommended demand dimensions:

- baseline demand;
- current observed demand;
- unmet demand;
- reserved demand;
- forecast demand;
- event demand;
- protected allocation demand.

Demand must decay or be fulfilled. It must not accumulate forever without explanation.

---

## 18. Scarcity

Scarcity exists when available supply is insufficient for active demand within the relevant service area and time window.

Scarcity levels:

- `NORMAL`;
- `TIGHT`;
- `LOW`;
- `CRITICAL`;
- `UNAVAILABLE`.

Scarcity consequences may include:

- visible low-stock signals;
- bounded price increase;
- purchase quantity limits;
- backorder availability;
- substitute recommendations;
- priority allocation;
- production requests;
- event or quest activation.

Scarcity must not:

- remove essential learning access permanently;
- create runaway price escalation;
- punish the player without visible cause;
- bypass protected household or school allocations.

---

## 19. Substitution

A substitution group contains items that may satisfy a similar functional need.

Substitution policy must consider:

- functional equivalence;
- quality threshold;
- profession compatibility;
- learner suitability;
- safety restrictions;
- customer acceptance;
- price difference.

Substitution outcomes:

- exact replacement;
- lower-cost alternative;
- higher-quality alternative;
- partial substitute;
- no valid substitute.

The system must never silently substitute a protected or materially different item.

---

## 20. Pricing Authority

Price must be explainable as a bounded result of policy and current economic state.

Recommended price composition:

```text
finalPrice =
  baseValue
  + productionCostComponent
  + transportComponent
  + serviceComponent
  + boundedScarcityAdjustment
  + qualityAdjustment
  + policyAdjustment
  - approvedDiscount
```

Price must remain within configured minimum and maximum bounds.

Price inputs may include:

- material cost;
- labor effort;
- tool and facility use;
- transport distance;
- spoilage risk;
- quality;
- demand pressure;
- stock level;
- institutional subsidy;
- relationship or reputation benefit defined by later authority.

Price inputs must not include hidden discrimination based on protected identity or arbitrary NPC preference.

---

## 21. Price Policy Types

Supported price policies may include:

- fixed price;
- bounded dynamic price;
- contract price;
- institutional cost price;
- regulated essential price;
- bulk price;
- service quote;
- donation or zero-price allocation.

### 21.1 Fixed Price

Used for stable, common, low-volatility goods.

### 21.2 Bounded Dynamic Price

Used where scarcity and transport meaningfully affect value.

A bounded dynamic price must expose a reason code such as:

- `LOW_STOCK`;
- `HIGH_TRANSPORT_COST`;
- `HIGH_QUALITY`;
- `SEASONAL_SUPPLY`;
- `EVENT_DEMAND`.

### 21.3 Regulated Essential Price

Essential learning or household goods may use:

- maximum markup;
- reserved quantity;
- subsidy;
- free baseline allocation;
- purchase limits.

### 21.4 Service Quote

A service quote may include labor, required materials, expected duration, and uncertainty range.

The final charge must reconcile against actual authorized work.

---

## 22. Currency and Accounts

Currency must move through explicit accounts.

Account types:

- household account;
- player account;
- shop cash account;
- merchant operating account;
- workplace budget;
- school allocation account;
- cooperative account;
- treasury or system sink/source account when explicitly authorized.

Currency operations:

- credit;
- debit;
- transfer;
- hold;
- release hold;
- settle;
- refund;
- authorized grant;
- authorized sink.

Invariant:

```text
Every completed transfer has one debit and one credit.
```

Currency creation and destruction require named policy authority and reason codes.

---

## 23. Transaction Lifecycle

Standard sale lifecycle:

```text
INITIATED
→ PRICE_CONFIRMED
→ STOCK_RESERVED
→ PAYMENT_HELD
→ SALE_COMMITTED
→ STOCK_TRANSFERRED
→ PAYMENT_SETTLED
→ RECEIPT_ISSUED
→ COMPLETED
```

Failure paths must resolve both stock and currency.

Examples:

- Payment failure releases stock reservation.
- Stock transfer failure releases or reverses payment hold.
- Duplicate commit request returns the existing result.
- Timeout recovery re-reads authoritative transaction state before retrying.

Transaction states:

- `INITIATED`;
- `PENDING`;
- `COMMITTED`;
- `COMPLETED`;
- `CANCELLED`;
- `FAILED`;
- `REFUNDED`;
- `PARTIALLY_REFUNDED`.

---

## 24. Idempotency and Concurrency

Every transaction command must include:

- command ID;
- actor ID;
- shop ID;
- expected version where relevant;
- correlation ID;
- timestamp;
- item lines;
- price snapshot or quote reference.

Rules:

- Repeating the same command ID must not create a second sale.
- Competing purchases must resolve through atomic stock reservation.
- Stale price quotes must be rejected or reconfirmed.
- Inventory version conflicts must return an explicit retryable failure.
- A client timeout must not imply that a transaction failed.

---

## 25. Returns and Refunds

Return eligibility depends on:

- item category;
- condition;
- elapsed time;
- proof of purchase;
- damage cause;
- protected-item policy;
- consumable status.

Return states:

- `REQUESTED`;
- `INSPECTION_PENDING`;
- `APPROVED`;
- `PARTIALLY_APPROVED`;
- `REJECTED`;
- `REFUNDED`;
- `RESTOCKED`;
- `DISPOSED`.

Rules:

- Returned stock must not become available before inspection.
- Refunds must reference the original transaction.
- Partial refunds require line-level evidence.
- Used educational materials may follow special access-preserving policy.

---

## 26. Restocking

Restocking is driven by policy, not instant magical replenishment.

Restock triggers:

- reorder point reached;
- forecast shortage;
- confirmed backorder;
- seasonal preparation;
- event allocation;
- safety stock breach;
- school or workplace request.

Restock policy fields:

```text
minimumStock
targetStock
maximumStock
reorderPoint
leadTime
preferredSuppliers
substitutionPolicy
priorityClass
```

The system may aggregate offstage restocking, but must preserve:

- elapsed time;
- supplier capacity;
- transport delay;
- cost;
- resulting inventory quantity.

---

## 27. Merchant Schedule Integration

A merchant can transact only when merchant authority, shop state, and schedule allow it.

Schedule integration must resolve:

- opening time;
- closing time;
- breaks;
- staffing changes;
- delivery windows;
- inventory count periods;
- market days;
- emergency closure;
- substitute coverage.

A shop may remain physically present while unavailable.

Player-facing unavailable states should explain:

- closed until a known time;
- merchant away;
- delivery in progress;
- stock count in progress;
- sold out;
- service capacity full.

---

## 28. Population Distribution Integration

Merchant placement must reflect the service area defined in 15A.

Rules:

- Essential goods require reasonable population coverage.
- Specialized shops may serve wider areas.
- Mobile merchants may close distribution gaps.
- Population growth may create new demand and shop opportunities.
- A district must not appear economically active without credible workers and supply access.
- Named merchants must not be duplicated by ambient population simulation.

Coverage indicators may include:

- travel distance;
- service capacity;
- opening overlap;
- stock reliability;
- affordability;
- essential-item availability.

---

## 29. Profession Integration

Merchant economy actions must map to profession capability from 15D.

Examples:

- A shopkeeper may sell general goods.
- A certified tool specialist may inspect and sell protected equipment.
- A purchasing agent may negotiate and approve procurement.
- An inventory clerk may count and receive stock.
- A delivery coordinator may dispatch shipments.
- A repair professional may quote and complete service work.

A merchant role must not grant unrelated professional capability.

---

## 30. Education Integration

The economy should teach mathematical understanding through authentic use.

Possible learning surfaces:

- counting stock;
- comparing quantities;
- unit conversion;
- price comparison;
- change calculation;
- budgeting;
- ratio and proportion;
- percentage discount;
- area and material estimation;
- production planning;
- demand forecasting;
- graph interpretation.

Educational integration rules:

- Mathematics must remain real, not decorative.
- Learners should see quantities and relationships visually.
- The system should permit estimation before exact calculation.
- Mistakes should create recoverable feedback, not irreversible punishment.
- Essential progress must not be blocked solely by currency scarcity.

---

## 31. Learner and Child Safety Boundaries

Learner-facing commerce must avoid exploitative design.

Forbidden patterns:

- real-money purchase pressure;
- randomized paid rewards;
- artificial urgency designed to induce spending;
- hidden recurring charges;
- manipulative scarcity;
- loss of core learning access through economic failure.

Allowed learning-oriented mechanics:

- earning in-world credits through demonstrated work;
- budgeting for optional tools or customization;
- comparing alternatives;
- community contribution;
- mentorship rewards;
- parent-visible transaction history.

---

## 32. Service Economy

Services require both capacity and completion evidence.

A service offering must define:

- service type;
- qualified profession;
- estimated duration;
- required materials;
- capacity unit;
- price policy;
- booking rules;
- completion evidence;
- cancellation policy.

Service lifecycle:

```text
REQUESTED
→ QUOTED
→ BOOKED
→ MATERIALS_RESERVED
→ IN_PROGRESS
→ INSPECTION_OR_REVIEW
→ COMPLETED
→ SETTLED
```

A missed appointment must not consume materials or payment without policy evidence.

---

## 33. Crafting Economy

Crafting connects learning, profession practice, and market output.

Crafting records must distinguish:

- practice craft;
- personal-use craft;
- commissioned craft;
- commercial production;
- supervised apprentice output;
- failed or rework output.

Commercial eligibility may require:

- quality threshold;
- mentor approval;
- safety inspection;
- certification;
- material traceability;
- workplace authorization.

Crafting must not duplicate materials or output during retry or save recovery.

---

## 34. Household Consumption

Households consume goods based on bounded needs rather than unlimited background drain.

Consumption categories:

- food;
- household maintenance;
- clothing;
- learning supplies;
- profession tools;
- health and safety supplies;
- discretionary goods.

Household simulation must preserve dignity and access.

Shortage consequences should favor:

- substitution;
- delayed discretionary purchases;
- community support;
- public allocation;
- repair and reuse;
- visible assistance opportunities.

---

## 35. Institutional Consumption

Schools, workshops, and public services may consume inventory through budgets and allocation rules.

Institutional purchase flow:

```text
NEED_IDENTIFIED
→ REQUEST_CREATED
→ AUTHORIZED
→ BUDGET_RESERVED
→ ORDER_PLACED
→ GOODS_RECEIVED
→ DISTRIBUTED
→ CONSUMPTION_RECORDED
```

Institutional stock must remain separate from merchant retail stock unless an explicit transfer occurs.

---

## 36. Economy Runtime State

Recommended economy aggregate state:

```text
EconomyRuntimeState {
  economyVersion
  serviceAreaStates
  shopStates
  inventorySummaries
  demandSignals
  supplySignals
  priceSnapshots
  openOrders
  openDeliveries
  activeShortages
  lastSimulatedAt
}
```

Runtime projections may be rebuilt from authoritative ledgers and durable records.

The projection is not itself the transaction authority unless explicitly designed as such.

---

## 37. Merchant Runtime State Machine

Recommended merchant operation states:

```text
OFF_DUTY
→ PREPARING
→ OPEN_FOR_TRADE
→ BUSY
→ LIMITED_SERVICE
→ CLOSING
→ RECONCILING
→ OFF_DUTY
```

Interruption states:

- `AWAY_TEMPORARILY`;
- `SUPPLY_INTERRUPTION`;
- `SYSTEM_RECOVERY`;
- `SUSPENDED`.

State transitions must respect daily schedule, shop status, merchant authority, and transaction completion.

---

## 38. Simulation Tiers

### 38.1 Tier 0 — Dormant

No active simulation. Durable economic state remains stored.

### 38.2 Tier 1 — Aggregate

Used for distant regions.

Simulates:

- summarized production;
- summarized consumption;
- scheduled deliveries;
- bounded price drift;
- shortage progression.

### 38.3 Tier 2 — Operational

Used for active but off-camera locations.

Simulates:

- shop opening state;
- merchant staffing;
- order fulfillment;
- stock movement;
- service capacity.

### 38.4 Tier 3 — Full

Used near the player.

Includes:

- individual merchant actions;
- visible customers;
- physical item transfer;
- interaction prompts;
- detailed transaction feedback.

Tier transitions must preserve the same authoritative stock, currency, order, and price meaning.

---

## 39. Time Skip

Time skip must process economic obligations in deterministic order.

Recommended order:

1. expire reservations and quotes;
2. process scheduled production;
3. process household and institutional consumption;
4. dispatch and advance deliveries;
5. receive eligible deliveries;
6. update stock levels;
7. update demand and scarcity;
8. recalculate bounded price projections;
9. evaluate shop operating states;
10. emit shortage, completion, or recovery events.

Time skip must not:

- create duplicate deliveries;
- sell inventory without a buyer context;
- settle uncommitted transactions;
- skip protected inspection;
- erase unmet orders.

---

## 40. Save and Load

Save state must include or reconstruct:

- shop identity and status;
- merchant authorization;
- inventory ledger position;
- reservations;
- open carts where durable;
- purchase orders;
- deliveries;
- transaction state;
- currency balances and holds;
- active price quotes;
- demand and scarcity summaries;
- simulation timestamp;
- version markers.

Load procedure:

1. validate schema version;
2. restore authoritative ledgers;
3. restore open obligations;
4. reconcile expired holds and reservations;
5. rebuild projections;
6. verify account and inventory invariants;
7. resume simulation from last safe timestamp.

---

## 41. Recovery Architecture

Recovery must prioritize correctness over visual continuity.

Recovery sequence:

1. identify incomplete transaction or movement;
2. re-read authoritative stock and currency records;
3. determine the last committed state;
4. complete, reverse, or quarantine the operation;
5. rebuild affected projections;
6. emit recovery evidence;
7. resume normal simulation.

Recovery must never guess that a transaction succeeded based only on client response or animation completion.

---

## 42. Failure Codes

Recommended failure codes:

```text
MERCHANT_NOT_AUTHORIZED
SHOP_NOT_OPEN
SHOP_SUSPENDED
ITEM_NOT_LISTED
ITEM_OUT_OF_STOCK
INSUFFICIENT_AVAILABLE_STOCK
STOCK_ALREADY_RESERVED
RESERVATION_EXPIRED
PRICE_QUOTE_EXPIRED
PRICE_CHANGED
PAYMENT_INSUFFICIENT
PAYMENT_HOLD_FAILED
TRANSACTION_VERSION_CONFLICT
DUPLICATE_TRANSACTION
DELIVERY_NOT_FOUND
DELIVERY_NOT_ACCEPTABLE
PROTECTED_ITEM_RESTRICTED
RETURN_NOT_ELIGIBLE
REFUND_FAILED
INVENTORY_INVARIANT_VIOLATION
ACCOUNT_INVARIANT_VIOLATION
ECONOMY_RECOVERY_REQUIRED
```

Failures must be categorized as:

- user-correctable;
- retryable;
- policy-blocked;
- data-integrity critical;
- recovery-required.

---

## 43. Observability

Required economic telemetry should include:

- shop open-rate;
- stockout frequency;
- low-stock duration;
- order fulfillment rate;
- delivery delay;
- reservation expiry rate;
- transaction failure rate;
- refund rate;
- price-bound hit rate;
- essential-goods availability;
- average service travel distance;
- inventory reconciliation mismatch count;
- currency reconciliation mismatch count.

Observability must avoid exposing private learner or household information unnecessarily.

---

## 44. Player-Facing Signals

The player should understand economic state without reading long explanations.

Recommended signals:

- stocked shelf;
- empty shelf marker;
- low-stock icon;
- delivery cart or crate;
- opening-hours sign;
- price trend arrow within bounds;
- reserved label;
- backorder clock;
- substitute comparison panel;
- merchant busy indicator;
- service queue length;
- receipt summary.

The world must show cause before consequence whenever practical.

---

## 45. Validation Invariants

A production implementation must continuously preserve:

1. stock quantity never becomes negative;
2. reserved quantity never exceeds eligible physical stock;
3. completed sale transfers both stock and currency exactly once;
4. cancelled sale releases holds and reservations;
5. every inventory adjustment has authority and reason;
6. every currency creation or destruction has policy authority;
7. in-transit stock is not counted as on-hand stock;
8. retired shops cannot accept new transactions;
9. protected goods require valid authorization;
10. simulation tier changes do not alter economic totals;
11. save/load does not duplicate orders, stock, or currency;
12. price remains within configured bounds.

---

## 46. Required Validation Scenarios

### Scenario A — Normal Retail Sale

Given available stock and sufficient funds, the sale must reserve stock, hold payment, commit once, transfer custody, settle payment, issue a receipt, and complete.

### Scenario B — Competing Buyers

Two buyers attempt to purchase the final unit. Exactly one succeeds. The other receives an explicit stock failure or backorder option.

### Scenario C — Payment Failure

Payment fails after reservation. The reservation is released and stock remains available.

### Scenario D — Client Timeout

The client loses the response after commit. Retrying with the same command ID returns the existing transaction result without a second debit or stock transfer.

### Scenario E — Delivery Acceptance

A shipment arrives. Stock becomes available only after required inspection and acceptance.

### Scenario F — Partial Delivery

A supplier fulfills only part of an order. Received quantity, remaining obligation, payment, and projected availability remain correct.

### Scenario G — Scarcity

Demand exceeds supply. The system exposes shortage, applies bounded policy, offers valid substitutes, and protects essential allocation.

### Scenario H — Merchant Absence

The scheduled merchant is unavailable. A qualified substitute activates or the shop enters an explicit limited or closed state.

### Scenario I — Return

A valid return moves the item to inspection, issues the correct refund, and restores stock only after acceptance.

### Scenario J — Save During Transaction

Save occurs while a transaction is pending. Load recovers to one authoritative result without duplication or silent loss.

### Scenario K — Time Skip

Several days pass. Production, consumption, delivery, reservation expiry, and restock are processed in deterministic order.

### Scenario L — Simulation Tier Transition

A shop moves from aggregate to full simulation. Inventory, orders, prices, balances, and operating state remain equivalent.

---

## 47. Test Layers

Required test layers:

### 47.1 Contract Tests

Validate command, result, failure, and event shapes.

### 47.2 Domain Tests

Validate inventory, price, reservation, account, and transaction invariants.

### 47.3 Application Tests

Validate orchestration across merchant, inventory, payment, order, and delivery boundaries.

### 47.4 Persistence Tests

Validate optimistic concurrency, idempotency, durable ledgers, and recovery queries.

### 47.5 Simulation Tests

Validate time skip, aggregation, scarcity, restock, and tier transitions.

### 47.6 UX Tests

Validate low-language state communication, error recovery, and transaction clarity.

### 47.7 Operational Tests

Validate player-to-merchant flow through UI, API, application runtime, persistence, projection, and return to UI.

---

## 48. Evidence Package

The 15E evidence package must include:

- merchant and shop contract definitions;
- inventory ledger tests;
- transaction idempotency tests;
- currency reconciliation tests;
- price-bound tests;
- reservation conflict tests;
- delivery lifecycle tests;
- scarcity and substitution tests;
- schedule integration evidence;
- profession authorization evidence;
- save/load recovery tests;
- simulation tier equivalence tests;
- screenshots or recordings of player-facing trade states;
- failure-code coverage report;
- known limitation list.

---

## 49. Implementation Slices

Recommended delivery slices:

### Slice 1 — Merchant and Shop Contracts

Define identity, authority, shop state, catalog, and public failure contracts.

### Slice 2 — Inventory Ledger

Implement receive, reserve, release, transfer, sell, return, damage, and adjustment invariants.

### Slice 3 — Currency and Transaction Runtime

Implement account holds, settlement, idempotent sale orchestration, and receipts.

### Slice 4 — Procurement and Delivery

Implement purchase orders, transport custody, acceptance, and partial fulfillment.

### Slice 5 — Demand, Scarcity, and Pricing

Implement bounded demand signals, shortage levels, substitution, and explainable pricing.

### Slice 6 — Schedule and Profession Integration

Bind shops to merchants, workplaces, qualifications, opening hours, and substitution coverage.

### Slice 7 — Simulation, Save/Load, and Recovery

Implement time skip, aggregation, tier transitions, reconciliation, and restart safety.

### Slice 8 — Player Experience and Evidence

Implement low-language merchant UX, validation scenarios, telemetry, and final evidence package.

---

## 50. Non-Goals for 15E

15E does not own:

- full conversation content;
- general NPC interaction priority;
- reputation scoring formulas;
- festival or event participation policy;
- national or global macroeconomics;
- real-money monetization;
- player-to-player market speculation;
- unrestricted procedural price generation.

These boundaries prevent the economy module from absorbing unrelated world behavior.

---

## 51. Exit Gate

15E is complete only when:

- merchant and shop authority are explicit;
- stock and currency ledgers preserve all invariants;
- sale operations are idempotent and recoverable;
- procurement and delivery create believable supply;
- scarcity and substitution are bounded and understandable;
- prices are explainable and policy constrained;
- schedules, professions, and population coverage are integrated;
- education use cases preserve authentic mathematics;
- save/load and simulation tiers preserve economic totals;
- required validation scenarios pass;
- evidence package is complete;
- no unresolved critical integrity failure remains.

Documentation alone is Repository evidence. Runtime and Operational completion still require their respective verification gates.

---

## 52. Handoff to 15F — Conversation Rules

15F may consume the following merchant economy projections:

- shop open or unavailable state;
- merchant role and authorization;
- item availability;
- price and price reason;
- reservation or order state;
- shortage and substitution options;
- transaction completion or failure;
- delivery expectation;
- service capacity;
- return eligibility.

15F must not mutate stock, currency, prices, or transaction state directly. It may request authorized economy commands and present their results through conversation.

---

## 53. Final Production Doctrine

Builder's Valley must not treat commerce as a decorative menu attached to an NPC.

A merchant is part of a living operational chain:

```text
Population
→ Schedule
→ Role
→ Profession
→ Production
→ Supply
→ Merchant
→ Transaction
→ Consumption
→ New Demand
```

The economy is credible only when every visible item has a believable source, every sale has real stock and payment authority, every shortage has a traceable cause, and every recovery returns to one consistent world state.

The purpose of 15E is therefore not merely to let the player buy things. It is to make trade, quantity, value, planning, work, and mathematical reasoning visible as one understandable system inside the world.
