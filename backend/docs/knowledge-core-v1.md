# Knowledge Core v1 — สารบบความรู้หลัก

## ภาพรวม

Knowledge Core v1 คือโครงสร้างข้อมูลหลักของ Mathematics Learning Engine
ประกอบด้วย 4 โมเดลที่สัมพันธ์กัน:

1. **Subject** — โดเมนความรู้
2. **Concept** — ความหมายทางคณิตศาสตร์ที่มั่นคง
3. **Skill** — ความสามารถของผู้เรียนที่สังเกตได้ในระดับอะตอม
4. **SkillDependency** — ความสัมพันธ์ระหว่างทักษะ

---

## Subject (วิชา)

Subject คือโดเมนความรู้ ไม่ใช่ตารางเรียนในโรงเรียน

**Active Subject v1 มีเพียง `MATH` (คณิตศาสตร์) เท่านั้น**

Algebra, Geometry, Number, Fraction และ Statistics เป็น Concept branches
ที่อยู่ภายใต้ Mathematics ไม่ใช่ Subject แยกต่างหาก

ในอนาคต Subject อาจเป็นศาสตร์อื่นที่แยกจากคณิตศาสตร์ เช่น `PHYSICS`
หรือ `COMPUTER_SCIENCE` แต่การออกแบบนี้อยู่นอกขอบเขตปัจจุบัน

Subject มี `code` และ `slug` ที่ไม่ซ้ำกัน
Subject สามารถมี Concept ได้หลาย Concept

---

## Concept (มโนทัศน์)

Concept คือความหมายทางคณิตศาสตร์ที่มั่นคงและไม่ขึ้นกับบริบทการสอน

Concept ถูกแยกจาก Skill เพราะ:

- Concept เดียวกันสามารถมี Skill ได้หลาย Skill
- Concept ไม่เปลี่ยนตามระดับชั้นหรือหลักสูตร
- Concept เป็นสิ่งที่อยู่นิ่ง ในขณะที่ Skill เป็นสิ่งที่ผู้เรียนทำได้

Concept ทุก Concept ต้องอยู่ภายใต้ Subject เดียว
Concept มี `semanticDefinition` เพื่อบันทึกความหมายที่แน่นอน

ตัวอย่าง:

- `MATH.FRACTION` — เศษส่วน

---

## Skill (ทักษะ)

Skill คือความสามารถที่สังเกตได้ในระดับอะตอม (atomic observable capability)

**ทำไม Skill ต้องเป็นอะตอม:**

- เพื่อให้สามารถวัดผลได้อย่างแม่นยำ
- เพื่อให้สามารถเรียงลำดับก่อนหลังได้ชัดเจน
- เพื่อให้ระบบแนะนำเนื้อหา (recommendation) ทำงานได้ละเอียด
- เพื่อป้องกันความกำกวมในการประเมิน

Skill ทุก Skill มี Concept หลักหนึ่ง Concept ใน Knowledge Core v1
(การประยุกต์ใช้หลาย Skill พร้อมกันจะอยู่ในโมเดล Activity ในอนาคต)

Skill มี:

- `capabilityStatement` — คำอธิบายความสามารถ
- `observableOutcome` — ผลลัพธ์ที่สังเกตได้

ตัวอย่างภายใต้ Concept `MATH.FRACTION`:

- `MATH.FRACTION.EQUAL_PARTS` — เข้าใจว่าตัวส่วนแบ่งจำนวนเต็มเป็นส่วนเท่าๆ กัน
- `MATH.FRACTION.IDENTIFY_FROM_VISUAL` — ระบุเศษส่วนจากภาพ
- `MATH.FRACTION.COMPARE_SAME_DENOMINATOR` — เปรียบเทียบเศษส่วนที่ตัวส่วนเท่ากัน

---

## SkillDependency (ความสัมพันธ์ระหว่างทักษะ)

SkillDependency เชื่อมโยงทักษะที่เป็นพื้นฐาน (prerequisite) ไปยังทักษะที่ต้องพึ่งพา (dependent)

**ทิศทาง: prerequisite → dependent**

- prerequisiteSkillId คือทักษะที่ต้องมีก่อน
- dependentSkillId คือทักษะที่ต้องพึ่งพา

### ประเภทของ Dependency

| ประเภท       | คำอธิบาย                                                              |
| ------------ | --------------------------------------------------------------------- |
| `REQUIRED`   | จำเป็นต้องมี prerequisite จึงจะเรียน dependent ได้                    |
| `SUPPORTING` | มี prerequisite แล้วจะช่วยให้เรียน dependent ได้ง่ายขึ้น แต่ไม่บังคับ |

### ตัวอย่าง

```
MATH.FRACTION.EQUAL_PARTS
  → MATH.FRACTION.IDENTIFY_FROM_VISUAL
  → MATH.FRACTION.COMPARE_SAME_DENOMINATOR
```

- `EQUAL_PARTS` เป็น REQUIRED prerequisite ของ `IDENTIFY_FROM_VISUAL`
- `IDENTIFY_FROM_VISUAL` เป็น REQUIRED prerequisite ของ `COMPARE_SAME_DENOMINATOR`

---

## สิ่งที่ไม่ได้อยู่ใน Knowledge Core

| สิ่งที่ไม่ได้อยู่        | เหตุผล                             |
| ------------------------ | ---------------------------------- |
| Grade / ระดับชั้น        | ความรู้ไม่ขึ้นกับระดับชั้น         |
| Country / ประเทศ         | ความรู้ทางคณิตศาสตร์เป็นสากล       |
| Curriculum / หลักสูตร    | หลักสูตรแยกจากตัวความรู้           |
| Theme / หัวข้อเกม        | เป็นเรื่องของ frontend             |
| Mastery / คะแนนความชำนาญ | เป็นผลลัพธ์ ไม่ใช่โครงสร้างความรู้ |
| Attempts / การลองทำ      | เป็น evidence ไม่ใช่ความรู้        |
| Billing / การเงิน        | เป็นคนละระบบ                       |
| Credits / เหรียญ         | เป็น gamification ไม่ใช่ความรู้    |

---

## Graph Invariants (กฎบังคับของกราฟความรู้)

1. **prerequisiteSkillId ต้องไม่เท่ากับ dependentSkillId**
   - ทักษะไม่สามารถพึ่งพาตัวเองได้

2. **REQUIRED dependency ต้องไม่มี cycle**
   - กราฟ REQUIRED ต้องเป็น Directed Acyclic Graph (DAG)

3. **ห้ามมี prerequisite/dependent pair ซ้ำ**
   - คู่เดียวกันต้องมี Dependency เดียว

4. **version ต้อง >= 1**
   - ทุกเรคคอร์ดเริ่มต้นที่ version 1

5. **ความรู้ที่ PUBLISHED แล้วต้องไม่ reference ความรู้ RETIRED ที่เป็น REQUIRED**
   - ป้องกันการอ้างอิงความรู้ที่ถูกลบ

6. **การเปลี่ยน slug ต้องได้รับการตรวจสอบ**
   - API และ content references อาจใช้ slug เป็นตัวอ้างอิง

7. **code คือ semantic identity ที่มั่นคง**
   - code ที่เคยใช้แล้วต้องไม่นำกลับมาใช้ใหม่

8. **การลบถูกจำกัด — ควรใช้ RETIRED แทน**
   - onDelete: Restrict ในทุก relation

### หมายเหตุ

Prisma ไม่สามารถตรวจสอบ self-reference หรือ graph cycle invariants ได้เต็มที่
กฎเหล่านี้จะถูกบังคับใช้ผ่าน:

- Application service policy
- Migration-level CHECK constraints (ถ้าเป็นไปได้)
- Graph validation verifier
- Publication Gate

---

## การแมปตารางฐานข้อมูล

| Prisma Model    | PostgreSQL Table   |
| --------------- | ------------------ |
| Subject         | subjects           |
| Concept         | concepts           |
| Skill           | skills             |
| SkillDependency | skill_dependencies |

ทุกฟิลด์ใช้ camelCase ใน Prisma และ snake_case ใน PostgreSQL ผ่าน `@map` และ `@@map`
ทุก timestamp ใช้ `Timestamptz(3)` (PostgreSQL TIMESTAMPTZ(3))
