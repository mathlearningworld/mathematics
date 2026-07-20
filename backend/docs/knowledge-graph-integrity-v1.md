# Knowledge Graph Integrity v1 — ความสมบูรณ์ของกราฟความรู้

## ทำไม Prisma Constraints ถึงไม่พอ

Prisma สามารถตรวจสอบ:
- ชนิดข้อมูล (type)
- ค่าซ้ำ (unique)
- ความสัมพันธ์ (relation)
- ค่าเริ่มต้น (default)

แต่ Prisma **ไม่สามารถ** ตรวจสอบ:
- State lifecycle — DRAFT → REVIEW → PUBLISHED → RETIRED
- Cycle ใน REQUIRED dependency graph
- Self-dependency
- Publication prerequisites (parent ต้อง PUBLISHED ก่อน)
- Retirement impact (ไม่มี PUBLISHED REQUIRED edge ค้างอยู่)
- Semantic code immutability

Knowledge Graph Integrity Module จึงเป็น **pure business logic layer**
ที่ทำงานโดยไม่ต้องเชื่อมต่อฐานข้อมูล

---

## State Lifecycle (วงจรสถานะ)

```
DRAFT ──→ REVIEW ──→ PUBLISHED ──→ RETIRED
  ↑         │
  └─────────┘
```

| จาก | ไป | อนุญาต |
|-----|-----|--------|
| DRAFT | REVIEW | ✅ |
| REVIEW | DRAFT | ✅ |
| REVIEW | PUBLISHED | ✅ |
| PUBLISHED | RETIRED | ✅ |
| อื่นๆ | — | ❌ |

**กฎสำคัญ:**
- RETIRED ไม่มีทางออก — เมื่อ retired แล้วไม่สามารถกลับมาได้
- DRAFT ไม่สามารถข้ามไป PUBLISHED ได้โดยตรง
- PUBLISHED ไม่สามารถกลับไป REVIEW หรือ DRAFT ใน v1

---

## REQUIRED vs SUPPORTING

| ลักษณะ | REQUIRED | SUPPORTING |
|--------|----------|------------|
| จำเป็นต้องมีก่อน | ✅ ใช่ | ❌ ไม่จำเป็น |
| ตรวจสอบ cycle | ✅ ใช่ | ❌ ไม่ตรวจ |
| ป้องกัน retirement | ✅ ป้องกัน | ❌ ไม่ป้องกัน |
| ความหมาย | ต้องมี prerequisite จึงจะเรียน dependent ได้ | มี prerequisite แล้วช่วยให้เข้าใจง่ายขึ้น |

---

## Cycle Detection (การตรวจสอบวงจร)

REQUIRED dependencies ต้องเป็น Directed Acyclic Graph (DAG)

```
A ──REQUIRED──→ B ──REQUIRED──→ C
```

การเพิ่ม C → A จะถูกปฏิเสธเพราะสร้าง cycle

**อัลกอริทึม:**
1. สร้าง adjacency list จาก REQUIRED edges ที่ไม่ใช่ RETIRED
2. เพิ่ม proposed edge เข้าไป
3. DFS จาก dependentSkillId เพื่อหาว่าสามารถไปถึง prerequisiteSkillId ได้หรือไม่
4. ถ้าเจอ → KNOWLEDGE_REQUIRED_CYCLE พร้อม cycle path

---

## Publication Gate (ประตูการเผยแพร่)

ก่อนที่จะ PUBLISHED entity ใดๆ ต้องผ่านการตรวจสอบ:

### Subject
- state ต้องเป็น REVIEW
- code, slug, internalName ต้องไม่ว่าง
- version ต้องเป็น positive integer

### Concept
- state ต้องเป็น REVIEW
- Subject แม่ต้อง PUBLISHED
- code, slug, internalName, semanticDefinition ต้องไม่ว่าง
- version ต้องเป็น positive integer

### Skill
- state ต้องเป็น REVIEW
- Concept แม่ต้อง PUBLISHED
- code, slug, internalName, capabilityStatement, observableOutcome ต้องไม่ว่าง
- version ต้องเป็น positive integer

### SkillDependency
- state ต้องเป็น REVIEW
- Skill ปลายทางทั้งสองต้อง PUBLISHED
- rationale ต้องไม่ว่าง
- version ต้องเป็น positive integer
- ต้องผ่าน endpoint, self-dependency, duplicate, และ cycle checks

---

## Retirement Gate (ประตูการเลิกใช้)

Skill จะถูก RETIRED ได้ต่อเมื่อไม่มี PUBLISHED REQUIRED edge
ที่อ้างถึง Skill นั้น (ทั้งในฐานะ prerequisite หรือ dependent)

SUPPORTING edges, DRAFT/REVIEW REQUIRED edges, และ RETIRED edges
**ไม่ปิดกั้น** การ retirement ใน v1

---

## Error Identity (รหัสข้อผิดพลาด)

| รหัส | ความหมาย |
|------|----------|
| KNOWLEDGE_INVALID_STATE_TRANSITION | การเปลี่ยนสถานะไม่ถูกต้อง |
| KNOWLEDGE_CODE_IMMUTABLE | พยายามเปลี่ยน semantic code |
| KNOWLEDGE_VERSION_CONFLICT | version ไม่ตรงกับ optimistic lock |
| KNOWLEDGE_ENDPOINT_NOT_FOUND | Skill ปลายทางไม่มีอยู่ |
| KNOWLEDGE_ENDPOINT_RETIRED | Skill ปลายทางถูก retired แล้ว |
| KNOWLEDGE_DUPLICATE_DEPENDENCY | prerequisite/dependent pair ซ้ำ |
| KNOWLEDGE_SELF_DEPENDENCY | Skill อ้างถึงตัวเอง |
| KNOWLEDGE_REQUIRED_CYCLE | การเพิ่ม REQUIRED edge จะสร้าง cycle |
| KNOWLEDGE_PUBLICATION_BLOCKED | ไม่สามารถ publish ได้ |
| KNOWLEDGE_RETIREMENT_BLOCKED | ไม่สามารถ retire ได้ |

---

## ทำไม Module นี้ถึงเป็น Pure และ Database-Independent

1. **ไม่มี Prisma import** — รับข้อมูลเป็น plain objects
2. **ไม่มี HTTP** — ไม่รู้จัก request/response
3. **ไม่มี logger** — ไม่เขียน log
4. **ไม่มี process.exit** — ไม่จบ process
5. **ไม่มี Date.now** — ไม่พึ่งพาเวลา
6. **ไม่มี UUID generation** — ไม่สร้าง ID
7. **ไม่มี environment variable** — ไม่พึ่งพา .env
8. **Deterministic** — input เดียวกันได้ output เดียวกันเสมอ
9. **No mutation** — ไม่แก้ไข input arrays หรือ objects

---

## สิ่งที่รอการ implement ใน Runtime/Persistence

| ความสามารถ | จะอยู่ที่ |
|-------------|----------|
| Database queries | Repository layer |
| HTTP endpoints | Controller/Routes |
| Transaction management | Service layer |
| Prisma Client lifecycle | lib/prisma.js |
| Input validation (Zod) | Validator layer |
| Authorization | Policy layer |
