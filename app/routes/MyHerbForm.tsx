import BookList from "./MyHerbList";
import React, { useState } from "react";
import axios from "axios";

const BookForm: React.FC = () => {
  const [hearbTitle, setHearbTitle] = useState("");
  const [hearbDesc, setHearbDesc] = useState("");
  const [hearbAuthor, setHearbAuthor] = useState("");
  const [hearbDetial, setHearbDetial] = useState("");
  const [hearbProducer, setHearbProducer] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // สถานะของ Popup

  // ฟังก์ชันในการส่งข้อมูลไปยัง server
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // เริ่มทำการส่งข้อมูล
    setResponseMessage("");

    try {
      // ส่งข้อมูลไปที่ API ของ server
      const response = await axios.post("http://localhost:3030/addbook", {
        hearbTitle,
        hearbDesc,
        hearbAuthor,
        hearbDetial,
        hearbProducer,
      });

      // หลังจากส่งข้อมูลสำเร็จ
      setResponseMessage(
        `Book added successfully. ID: ${response.data.hearbId}`
      );
      // เคลียร์ข้อมูลในฟอร์ม
      setHearbTitle("");
      setHearbDesc("");
      setHearbAuthor("");
      setHearbDetial("");
      setHearbProducer("");
    } catch (error) {
      setResponseMessage(`Failed to add hearb. Please try again. ${error}`);
    } finally {
      setIsSubmitting(false); // เลิกสถานะการส่งข้อมูล
      setShowPopup(true); // เปิด Popup หลังจากส่งข้อมูลเสร็จ
    }
  };

  // ฟังก์ชันในการปิด Popup
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-6">
        Herbs
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-8 shadow-xl rounded-lg"
      >
        <div className="mb-5">
          <label
            htmlFor="hearbTitle"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            สมุนไพร
          </label>
          <input
            id="hearbTitle"
            type="text"
            value={hearbTitle}
            onChange={(e) => setHearbTitle(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="bookDesc"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            รายละเอียด
          </label>
          <textarea
              id="hearbDesc"
              value={hearbDesc}
            onChange={(e) => setHearbDesc(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"

          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="bookDesc"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            สรรพคุณ
          </label>
          <textarea
            id="hearbDesc"
            value={hearbDetial}
            onChange={(e) => setHearbDetial(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"

          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="hearbAuthor"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            ผู้ผลิต
          </label>
          <input
            id="hearbAuthor"
            type="text"
            value={hearbProducer}
            onChange={(e) => setHearbProducer(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"

          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="hearbAuthor"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            ติดต่อผู้ผลิต
          </label>
          <input
            id="hearbAuthor"
            type="text"
            value={hearbAuthor}
            onChange={(e) => setHearbAuthor(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"

          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition duration-300"
        >
          {isSubmitting ? "Adding..." : "Add Herbs"}
        </button>
      </form>

      {/* Popup when hearb added successfully */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-center text-green-500">
              Success
            </h2>
            <p className="mt-4 text-lg text-center text-black">{responseMessage}</p>
            <div className="mt-6 flex justify-center">
              <button
                onClick={closePopup}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookForm;
