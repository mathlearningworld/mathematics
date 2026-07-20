# Fraction Knowledge Seed V1 — ความรู้เรื่องเศษส่วนเท่ากัน

## ภาพรวม

Fraction Knowledge Seed V1 คือชุดข้อมูลความรู้ทางคณิตศาสตร์ชุดแรกที่ผ่านการทบทวนแล้ว
สำหรับระบบ Mathematics Platform โดยเน้นที่ **ความเท่ากันของเศษส่วน (Fraction Equivalence)**

ชุดข้อมูลนี้เป็น **seed definition** บริสุทธิ์ — ไม่มีการเชื่อมต่อฐานข้อมูล
ไม่มี UUID ไม่มี timestamp และไม่มี grade/country/theme/mastery/price/credit/age

## ทำไมต้องเป็นเศษส่วน?

เศษส่วนเป็นแนวคิดที่เป็นอุปสรรคสำคัญสำหรับผู้เรียนจำนวนมาก
ความเข้าใจเรื่องเศษส่วนเท่ากันเป็นรากฐานสำคัญก่อนที่จะเรียนการบวก ลบ คูณ หารเศษส่วน
การเลือกเศษส่วนเป็น slice แรกช่วยให้ระบบสามารถ:

- ทดสอบโครงสร้าง knowledge graph ในขอบเขตที่จำกัดแต่มีความหมาย
- สร้าง visual/game activities ที่สอดคล้องกัน
- วัด understanding debt ได้ตั้งแต่เนิ่นๆ

## Concept กับ Skill ต่างกันอย่างไร?

| มิติ | Concept | Skill |
|------|---------|-------|
| ความหมาย | กรอบแนวคิด (what) | ความสามารถที่วัดได้ (how) |
| ขอบเขต | semanticDefinition + boundaryNotes | capabilityStatement + observableOutcome |
| จำนวน | 3 concepts | 10 skills |
| การทดสอบ | ไม่ได้ทดสอบโดยตรง | ทดสอบผ่าน observable outcome |

**Concept** คือ "ความเข้าใจ" — เช่น "เศษส่วนคือปริมาณ" (Fraction as Quantity)
**Skill** คือ "ความสามารถที่สังเกตได้" — เช่น "ระบุ unit fraction 1/b บนภาพที่แบ่งเท่าๆ กัน"

## ทำไม Skills ถึงเป็น Atomic?

แต่ละ Skill ถูกออกแบบให้:

1. **ทดสอบได้อิสระ** — observableOutcome ชัดเจน ไม่กำกวม
2. **เรียงลำดับก่อนหลังได้** — dependency graph ชัดเจน
3. **ไม่ซับซ้อนเกินไป** — ถ้า Skill หนึ่งล้มเหลว เรารู้ว่าผู้เรียนขาดอะไร
4. **ประกอบกันเป็นความสามารถที่ใหญ่ขึ้น** — เช่น JUSTIFY_EQUIVALENCE ต้องอาศัยหลาย Skills

## REQUIRED กับ SUPPORTING ต่างกันอย่างไร?

| ลักษณะ | REQUIRED | SUPPORTING |
|--------|----------|------------|
| ความจำเป็น | ต้องมีก่อน | ช่วยเสริมความเข้าใจ |
| การเรียงลำดับ | บังคับตามลำดับ | ไม่บังคับ |
| ผลกระทบถ้าขาด | ไม่สามารถเรียนต่อได้ | เรียนได้แต่ยากขึ้น |
| จำนวนใน seed นี้ | 9 edges | 2 edges |

**REQUIRED** = ถ้าไม่มี prerequisite ผู้เรียนจะไม่สามารถทำ dependent skill ได้
**SUPPORTING** = ช่วยให้เข้าใจ dependent skill ได้ดีขึ้น แต่ไม่จำเป็นต้องมีก่อน

## กราฟ Dependency

```
MATH.WHOLE.PARTITION_EQUAL_GROUPS (REQUIRED)
  └─→ MATH.FRACTION.RECOGNIZE_EQUAL_PARTITION (REQUIRED)
       └─→ MATH.FRACTION.IDENTIFY_UNIT_FRACTION (REQUIRED)
            └─→ MATH.FRACTION.COMPOSE_FROM_UNIT_FRACTIONS (REQUIRED)
                 ├─→ MATH.FRACTION.CONNECT_REPRESENTATIONS (REQUIRED)
                 │    └─→ MATH.FRACTION.EQUIVALENCE_VISUAL (REQUIRED)
                 │         └─→ MATH.FRACTION.EQUIVALENCE_SCALE (REQUIRED)
                 │              └─→ MATH.FRACTION.JUSTIFY_EQUIVALENCE (REQUIRED)
                 └─→ MATH.FRACTION.LOCATE_ON_NUMBER_LINE (REQUIRED)
                      ├─→ MATH.FRACTION.EQUIVALENCE_VISUAL (SUPPORTING)
                      └─→ MATH.FRACTION.JUSTIFY_EQUIVALENCE (SUPPORTING)

MATH.WHOLE.RECOGNIZE_MULTIPLICATIVE_SCALE (REQUIRED)
  └─→ MATH.FRACTION.EQUIVALENCE_SCALE (REQUIRED)
```

### เส้นทางหลัก (REQUIRED)

1. **แบ่งกลุ่มเท่าๆ กัน** → รู้จักการแบ่งเท่า → ระบุ unit fraction → ประกอบเศษส่วนจาก unit fractions
2. **ประกอบเศษส่วน** → เชื่อมโยงตัวแทนต่างๆ → เห็นภาพเศษส่วนเท่ากัน → สร้างเศษส่วนเท่ากันโดยการ scale → พิสูจน์ความเท่ากัน
3. **ประกอบเศษส่วน** → วางบนเส้นจำนวน
4. **รู้จักการ scale ด้วยจำนวนเต็ม** → สร้างเศษส่วนเท่ากันโดยการ scale

### เส้นทางเสริม (SUPPORTING)

- **เส้นจำนวน** → ช่วยให้เห็นภาพเศษส่วนเท่ากัน
- **เส้นจำนวน** → ช่วยพิสูจน์ความเท่ากัน

## การตรวจจับ Understanding Debt

Understanding debt คือช่องว่างความรู้ที่ผู้เรียนควรมีแต่ยังไม่มี
กราฟ dependency ช่วยให้ระบบตรวจจับได้ว่า:

- ถ้าผู้เรียนทำ **JUSTIFY_EQUIVALENCE** ไม่ได้ → ตรวจสอบ EQUIVALENCE_SCALE และ EQUIVALENCE_VISUAL
- ถ้าผู้เรียนทำ **EQUIVALENCE_SCALE** ไม่ได้ → ตรวจสอบ EQUIVALENCE_VISUAL และ RECOGNIZE_MULTIPLICATIVE_SCALE
- ถ้าผู้เรียนทำ **EQUIVALENCE_VISUAL** ไม่ได้ → ตรวจสอบ CONNECT_REPRESENTATIONS และ LOCATE_ON_NUMBER_LINE
- วนย้อนกลับไปเรื่อยๆ จนถึง PARTITION_EQUAL_GROUPS

## ทำไมไม่มี Grade/Country?

- **Grade** — ความรู้เรื่องเศษส่วนเท่ากันเป็นสากล ไม่ขึ้นกับระดับชั้น
- **Country** — หลักสูตรคณิตศาสตร์ทั่วโลกสอนเศษส่วนเท่ากัน
- **Theme/Mastery/Price/Credit/Age** — เป็นข้อมูลของ product layer ไม่ใช่ knowledge layer

การแยก knowledge layer ออกจาก product layer ทำให้:
- ความรู้สามารถ reuse ได้กับทุกระดับชั้นและทุกประเทศ
- ระบบสามารถปรับ visual/game activities ตามผู้เรียนแต่ละคน
- การเปลี่ยนแปลง product ไม่กระทบโครงสร้างความรู้

## สถานะปัจจุบัน: REVIEW

Seed นี้อยู่ในสถานะ **REVIEW** หมายถึง:
- automated structural checks passed
- awaiting human/Architect content approval
- not yet PUBLISHED
- ยังไม่มีการเขียนข้อมูลลง PostgreSQL
- สามารถแก้ไขก่อนเผยแพร่ได้

## ข้อควรทราบ

- **ไม่มีข้อมูลถูกเขียนลง PostgreSQL** — seed นี้เป็น pure definition เท่านั้น
- **Visual/game activities เป็น layer ถัดไป** — ไม่ได้อยู่ใน seed นี้
- **UUIDs และ timestamps ถูกสร้างโดยฐานข้อมูล** — seed ไม่มี ID หรือ timestamp
- **Prisma schema ไม่ถูกเปลี่ยนแปลง** — seed ใช้ schema ที่มีอยู่แล้ว

## สถิติ

| รายการ | จำนวน |
|--------|-------|
| Subject | 1 (MATH) |
| Concepts | 3 |
| Skills | 10 |
| REQUIRED dependencies | 9 |
| SUPPORTING dependencies | 2 |
| รวม dependencies | 11 |
