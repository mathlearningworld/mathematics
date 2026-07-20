# ความคงอยู่ของความรู้ v1 (Knowledge Persistence v1)

## ภาพรวม

เอกสารนี้อธิบายชั้นการคงอยู่ของข้อมูล (Persistence Layer) สำหรับ Knowledge Core v1
ซึ่งประกอบด้วย schema.prisma ที่เป็นต้นแบบการออกแบบ และ migration.sql ที่เป็นคำสั่งเปลี่ยน
แปลงฐานข้อมูลตามเวอร์ชัน

---

## schema.prisma คือ Source of Truth

`schema.prisma` เป็นไฟล์ออกแบบฐานข้อมูลเพียงแหล่งเดียว (Single Source of Truth)
การเปลี่ยนแปลงโครงสร้างฐานข้อมูลทั้งหมดต้องเริ่มต้นที่ schema.prisma ก่อนเสมอ

Prisma จะอ่าน schema.prisma และเปรียบเทียบกับสถานะปัจจุบันของฐานข้อมูล
เพื่อสร้าง migration.sql ที่ถูกต้อง

---

## migration.sql คือการเปลี่ยนแปลงฐานข้อมูลตามเวอร์ชัน

`migration.sql` เป็นไฟล์คำสั่ง SQL ที่ Prisma สร้างขึ้นโดยอัตโนมัติ
เมื่อรัน `prisma migrate dev --create-only`

ไฟล์นี้จะถูกควบคุมด้วย Git และเป็นประวัติการเปลี่ยนแปลงฐานข้อมูล
ที่สามารถตรวจสอบย้อนหลังได้

---

## create-only กับการใช้ migration จริง

### --create-only

```bash
npx prisma migrate dev --name init_knowledge_core_v1 --create-only
```

คำสั่งนี้จะ:
- อ่าน schema.prisma ปัจจุบัน
- เปรียบเทียบกับฐานข้อมูล
- สร้างไฟล์ migration.sql **โดยไม่รันคำสั่ง SQL จริง**
- สร้าง migration_lock.toml

ประโยชน์: ทีมสามารถตรวจสอบ migration.sql ก่อนนำไปใช้จริง

### การใช้ migration จริง

```bash
prisma migrate dev          # สำหรับพัฒนา — รัน migration ทันที
prisma migrate deploy       # สำหรับ production — รัน migration ที่ยังไม่ได้รัน
```

ในการพัฒนาจริง ขั้นตอนคือ:
1. แก้ไข schema.prisma
2. รัน `prisma migrate dev --create-only` เพื่อสร้าง migration.sql
3. ตรวจสอบ migration.sql
4. รัน `prisma migrate dev` หรือ `prisma migrate deploy` เพื่อใช้ migration จริง

---

## migration_lock.toml

ไฟล์ `migration_lock.toml` ถูกสร้างโดย Prisma โดยอัตโนมัติ
เพื่อบันทึกว่าโปรเจกต์นี้ใช้ฐานข้อมูลชนิดใด

ตัวอย่างเนื้อหา:

```toml
provider = "postgresql"
```

ไฟล์นี้ห้ามแก้ไขด้วยตนเอง และควรถูกควบคุมด้วย Git

---

## ทำไมต้อง commit migrations

1. **ประวัติการเปลี่ยนแปลง** — ทุกคนในทีมเห็นว่าฐานข้อมูลเปลี่ยนไปอย่างไร
2. **การทำงานร่วมกัน** — สมาชิกทีมทุกคนมี migration ชุดเดียวกัน
3. **การย้อนกลับ** — สามารถย้อนกลับไปยังเวอร์ชันก่อนหน้าได้
4. **การตรวจสอบ** — migration.sql สามารถตรวจสอบด้วยเครื่องมืออัตโนมัติ

---

## ทำไม knowledge-db เก่าถึงไม่ถูกแตะต้อง

- **knowledge-db** (พอร์ต 5432) เป็นฐานข้อมูลของโปรเจกต์เก่า
- **mathematics-postgres** (พอร์ต 5433) เป็นฐานข้อมูลใหม่ของแพลตฟอร์มคณิตศาสตร์
- การแยกพอร์ตทำให้ทั้งสองระบบทำงานพร้อมกันได้โดยไม่รบกวนกัน
- เราไม่ลบ แก้ไข หรือหยุด knowledge-db เพื่อความปลอดภัยของข้อมูลเดิม

---

## สถานะปัจจุบัน

| รายการ | สถานะ |
|--------|--------|
| schema.prisma | ✅ เสร็จสมบูรณ์ |
| migration.sql | ✅ สร้างแล้ว (ยังไม่รัน) |
| migration_lock.toml | ✅ สร้างแล้ว |
| ฐานข้อมูล mathematics | ✅ พร้อมใช้งาน (พอร์ต 5433) |
| การใช้ migration จริง | ⏳ รอดำเนินการ |

**ขณะนี้ migration ถูกเตรียมไว้แล้วแต่ยังไม่ได้รัน**
ฐานข้อมูล mathematics ยังไม่มีตารางใด ๆ

---

## การตรวจสอบ

ใช้คำสั่งต่อไปนี้เพื่อตรวจสอบ migration:

```bash
npm run verify:knowledge-persistence
```

สคริปต์นี้จะตรวจสอบโดยไม่ต้องเชื่อมต่อฐานข้อมูล:
- migration.sql มีอยู่และอ่านได้
- โครงสร้าง SQL ถูกต้องตามสัญญา (enum, table, index, foreign key)
- ไม่มีคำสั่ง INSERT, UPDATE, DELETE, DROP, TRUNCATE
- จำนวน foreign keys ครบถ้วน
- ON DELETE RESTRICT ON UPDATE CASCADE ถูกต้อง
