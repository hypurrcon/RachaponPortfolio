# Rachapon Thatprasert — Portfolio

## แก้เนื้อหาเว็บ (ไม่ต้องเขียนโค้ด)

เข้า **https://www.rachaponthat-portfolio.com/admin** → แก้ → กด **Publish**
ประมาณ 1 นาทีเว็บจริงจะอัปเดตเอง

แก้ได้ทุกอย่าง: Showreel, ผลงาน (วิดีโอ YouTube / รูปภาพ, ลากเรียงลำดับ), About, Skills, Social, รูปโปรไฟล์, Resume, โลโก้ และสีหลักของเว็บ

### ล็อกอินครั้งแรก (ทำครั้งเดียวต่อเครื่อง)

1. เปิด https://github.com/settings/tokens/new
2. Note: `portfolio admin` · Expiration: เลือก **No expiration** (หรือ 1 ปี)
3. ติ๊ก **repo** ช่องเดียว → กด **Generate token** → คัดลอก (ขึ้นต้นด้วย `ghp_`)
4. ที่หน้า `/admin` กด **Sign In with Token** → วาง token

> token นี้เหมือนรหัสผ่าน — อย่าส่งให้ใคร และล็อกอินเฉพาะเครื่องตัวเอง
> คนอื่นเปิด `/admin` ได้แค่หน้าล็อกอิน แก้อะไรไม่ได้

## โครงสร้าง (สำหรับอ้างอิง)

| ไฟล์ | หน้าที่ |
|---|---|
| `content/site.json` | เนื้อหาทั้งหมด — `/admin` แก้ไฟล์นี้ |
| `build.mjs` | Vercel รันตอน deploy เพื่อสร้างหน้าเว็บจาก `site.json` |
| `style.css`, `script.js` | หน้าตาและการทำงานของเว็บ |
| `admin/config.yml` | กำหนดช่องต่างๆ ในหน้า `/admin` |
| `img/uploads/` | รูป/ไฟล์ที่อัปโหลดผ่าน `/admin` |
