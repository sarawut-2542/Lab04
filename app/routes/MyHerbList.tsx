import React, { useEffect, useState } from "react";
import axios from "axios";

interface Hearb {
  hearbId: string;
  hearbTitle: string;
  hearbDesc: string;
  hearbAuthor: string;
  hearbDetial: string;
  hearbProducer: string;
}

const BookList = () => {
  const [hearbs, setHearbs] = useState<Hearb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [updatedBook, setUpdatedBook] = useState<Hearb | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:3030/getbooks");
        setHearbs(response.data);
      } catch (err) {
        setError("Failed to fetch books.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const openDeleteModal = (hearbId: string) => {
    setSelectedBookId(hearbId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedBookId(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    if (selectedBookId) {
      try {
        await axios.delete(
          `http://localhost:3030/deletebook/${selectedBookId}`
        );
        setHearbs(hearbs.filter((hearb) => hearb.hearbId !== selectedBookId));
        closeDeleteModal();
      } catch (err) {
        console.error("Error deleting book:", err);
          setError("Failed to delete book.");
      }
    }
  };

  const openUpdateModal = (hearbId: string) => {
    const hearbToUpdate = hearbs.find((hearb) => hearb.hearbId === hearbId);
    if (hearbToUpdate) {
      setUpdatedBook(hearbToUpdate);
      setShowUpdateModal(true);
    }
  };

  const closeUpdateModal = () => {
    setUpdatedBook(null);
    setShowUpdateModal(false);
  };

  const handleUpdate = async () => {
    if (updatedBook) {
      try {
        await axios.put(
          `http://localhost:3030/updatebook/${updatedBook.hearbId}`,
          {
            hearbTitle: updatedBook.hearbTitle,
            hearbDesc: updatedBook.hearbDesc,
            hearbAuthor: updatedBook.hearbAuthor,
            hearbDetial: updatedBook.hearbDetial,
            hearbProducer: updatedBook.hearbProducer,
          }
        );
        setHearbs(
          hearbs.map((hearb) =>
            hearb.hearbId === updatedBook.hearbId ? updatedBook : hearb
          )
        );
        closeUpdateModal();
      } catch (err) {
        console.error("Error updating book:", err);
        setError("Failed to update book.");
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (updatedBook) {
      setUpdatedBook({
        ...updatedBook,
        [name]: value,
      });
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-10">
        Herbs Collection
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {hearbs.map((hearb) => (
          <div
            key={hearb.hearbId}
            className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {hearb.hearbTitle}
              </h2>
              <p className="text-gray-600 text-sm mb-2">รายละเอียด: {hearb.hearbDesc}</p>
              <p className="text-gray-500 text-sm">
                สรรพคุณ: <span className="font-semibold">{hearb.hearbDetial}</span>
              </p>
              <p className="text-gray-500 text-sm">
                ผู้ผลิต: <span className="font-semibold">{hearb.hearbProducer}</span>
              </p>
              <p className="text-gray-500 text-sm">
                ติดต่อผู้ผลิต: <span className="font-semibold"> {hearb.hearbAuthor}</span>
              </p>

            </div>
            <div className="px-6 pb-6">
              <button className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300">
                Read More
              </button>
              <button
                onClick={() => openDeleteModal(hearb.hearbId)}
                className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 mt-2"
              >
                Delete
              </button>
              <button
                onClick={() => openUpdateModal(hearb.hearbId)}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 mt-2"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal สำหรับยืนยันการลบ */}
      {showDeleteModal && selectedBookId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              คุณแน่ใจหรือไม่ว่าต้องการลบหนังสือเล่มนี้?
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <span className="font-semibold">ชื่อสมุนไพร:</span>{" "}
                {
                  hearbs.find((hearb) => hearb.hearbId === selectedBookId)
                    ?.hearbTitle
                }
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">สรรพคุณ:</span>{" "}
                {
                  hearbs.find((hearb) => hearb.hearbId === selectedBookId)
                    ?.hearbDetial
                }
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">รายละเอียด:</span>{" "}
                {hearbs.find((hearb) => hearb.hearbId === selectedBookId)?.hearbDesc}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">ผู้ผลิต:</span>{" "}
                {hearbs.find((hearb) => hearb.hearbId === selectedBookId)?.hearbProducer}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">ติดต่อผู้ผลิต:</span>{" "}
                {hearbs.find((hearb) => hearb.hearbId === selectedBookId)?.hearbAuthor}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeDeleteModal}
                className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal สำหรับการอัปเดต */}
      {showUpdateModal && updatedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              อัปเดตสมุนไพร
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="hearbTitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  ชื่อสมุนไพร
                </label>
                <input
                  id="hearbTitle"
                  type="text"
                  name="hearbTitle"
                  value={updatedBook.hearbTitle}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                />
              </div>
              <div>
                <label
                  htmlFor="hearbDesc"
                  className="block text-sm font-medium text-gray-700"
                >
                  รายละเอียด
                </label>
                <textarea   
                  id="hearbDesc"
                  name="hearbDesc"
                  value={updatedBook.hearbDesc}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                />
              </div>
              <div>
                <label
                  htmlFor="hearbDesc"
                  className="block text-sm font-medium text-gray-700"
                >
                  รายละเอียด
                </label>
                <textarea   
                  id="hearbDetial"
                  name="hearbDetial"
                  value={updatedBook.hearbDetial}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                />
              </div>

              <div>
                <label
                  htmlFor="hearbAuthor"
                  className="block text-sm font-medium text-gray-700"
                >
                  คนคิดค้น
                </label>
                <input
                  id="hearbAuthor"
                  type="text"
                  name="hearbAuthor"
                  value={updatedBook.hearbAuthor}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                />
              </div>
              <div>
                <label
                  htmlFor="hearbAuthor"
                  className="block text-sm font-medium text-gray-700"
                >
                  ผู้ผลิต
                </label>
                <input
                  id="hearbProducer"
                  type="text"
                  name="hearbProducer"
                  value={updatedBook.hearbProducer}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeUpdateModal}
                className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                อัปเดต
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;
