# Math Learning World — Frontend

Frontend หลักกำลังพัฒนาเป็น **The Builder's Valley**: เกม 2D sandbox ที่ผู้เล่นสำรวจ เก็บวัตถุดิบ และสร้างสิ่งต่าง ๆ โดยคณิตศาสตร์เกิดจากกฎของโลก ไม่ใช่หน้าจอแบบฝึกหัด

## Runtime ที่เปิดเป็นค่าเริ่มต้น

`src/main.js` เปิด `src/sandbox/createSandboxGame.js`

Graybox Foundation รอบแรกประกอบด้วย:

- โลก grid ขนาดเล็กที่ใหญ่กว่าหน้าจอ
- ตัวละคร placeholder
- เดินด้วย WASD หรือปุ่มลูกศร
- วิ่งด้วย Shift
- collision กับต้นไม้และก้อนหิน
- กล้องติดตามผู้เล่น
- stream และ resource landmarks
- hotbar ภาษาภาพ 5 ช่อง

## Fraction Bridge

โค้ด Fraction Bridge เดิมยังอยู่ใน `src/game/` เพื่อเป็นต้นแบบกลไกการเรียนรู้ที่จบหนึ่ง flow แล้ว แต่ไม่ใช่ Product Runtime หลักของ Sandbox

## คำสั่ง Local Gate

```bash
cd frontend
npm install
npm test
npm run build
npm run dev
```

เปิด URL ที่ Vite แสดง แล้วตรวจ:

1. เดินได้ทั้ง WASD และปุ่มลูกศร
2. เดินเฉียงไม่เร็วกว่าเดินตรง
3. Shift ทำให้วิ่ง
4. ชนต้นไม้และหินแล้วผ่านไม่ได้
5. กล้องตามผู้เล่นและไม่ออกนอกขอบโลก
6. Hotbar อยู่กับหน้าจอ ไม่เลื่อนตามโลก

## Architecture Boundary

- `sandbox/config` — world/grid coordinate authority
- `sandbox/domain` — pure game rules
- `sandbox/input` — physical input adapters
- `sandbox/scenes` — Phaser presentation and orchestration
- `game/` — archived Fraction Bridge prototype

Prisma, Backend และ Learning Projection ยังไม่ถูกเชื่อมใน Slice นี้
