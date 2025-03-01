import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

import fs from "fs"; // ใช้ fs แทนการ import JSON

const serviceAccount = JSON.parse(
  fs.readFileSync("./firebase/lab04-setb-fbconfig.json", "utf8")
);

initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const dbFirebase = admin.firestore();

console.log("กำลังเริ่มต้น Firebase..");
dbFirebase
  .collection("Herbs_1607-9")
  .limit(1)
  .get()
  .then(() => {
    console.log("Connect Firebase Firestore success");
  })
  .catch((error) => {
    console.error("Connect Fail", error);
  });

const app = express();
const port = 3030; //ทำการ ประกาศ port
const name = "BIG";

app.use(cors());
app.use(express.json());



app.post("/addbook", async (req, res) => {
  const { hearbTitle, hearbDesc, hearbAuthor, hearbDetial, hearbProducer } = req.body; // ดึงข้อมูลจาก JSON body

  if (!hearbTitle || !hearbDesc || !hearbAuthor || !hearbDetial || !hearbProducer) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // สร้าง document ใหม่ใน Firestore
    const newhearbRef = dbFirebase.collection("Herbs_1607-9").doc();

   
    // ข้อมูลที่ต้องการเพิ่มใน Firestore
    const objHearb = {
      hearbId: newhearbRef.id,
      hearbTitle,
      hearbDesc,
      hearbDetial,
      hearbAuthor,
      hearbProducer,
    };

    // เพิ่มข้อมูลใน Firestore  
    await newhearbRef.set(objHearb);

    // ส่ง ID กลับให้ client
    res
      .status(201)
      .json({ message: "Book added successfully", hearbId: newhearbRef.id });
  } catch (error) {
    console.error("Error adding book:", error); 
    res.status(500).json({ message: "Failed to add book" });
  }
});

app.get("/getbooks", async (req, res) => {
  try {
    const result = await dbFirebase.collection("Herbs_1607-9").get(); // ดึงข้อมูลจากคอลเลกชัน test-book
    const books = [];

    // วนลูปผ่านแต่ละ document และเก็บข้อมูลใน array
    result.forEach((doc) => {
      books.push(doc.data()); // ใช้ doc.data() เพื่อดึงข้อมูลจาก document
    });

    // ส่งข้อมูลที่ได้กลับไปยัง client
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Failed to fetch books" }); // ถ้ามีข้อผิดพลาด
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    name: name,
    data: "success",
  });
}); // function นี้ เมื่อเข้าถึง locahost นี้ สำเร็จจะแสดงข้อมูล success ออกมา ในรูปแบบ json







app.delete("/deletebook/:bookId", async (req, res) => {
  const hearbId = req.params.bookId;
  await dbFirebase.collection("Herbs_1607-9").doc(hearbId).delete();
  res.status(200).json({ message: "hear deleted successfully" });
});

app.put("/updatebook/:bookId", async (req, res) => {
  const hearbId = req.params.bookId;
  const { hearbTitle, hearbDesc, hearbAuthor, hearbDetial, hearbProducer } = req.body;
  await dbFirebase.collection("Herbs_1607-9").doc(hearbId).update({
    hearbTitle,
    hearbDesc,
    hearbAuthor,
    hearbDetial,
    hearbProducer,
  });
  res.status(200).json({ message: "Book updated successfully" });
});

app.listen(port, () => {
  console.log(`SERVER IS RUNNING ON PORT [${port}]`); //ใช้เครื่องหมาย ` เพื่อที่จะ log ข้อมูลพร้อมตัวแปรได้
});
