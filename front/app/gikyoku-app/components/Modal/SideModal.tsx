import { useState, useEffect } from "react";

const SideModal = ({ closeModal }: any) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const tabs = ["Tab 1", "Tab 2", "Tab 3", "Close"];

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleCloseModal = () => {
    setIsOpen(false);
    setTimeout(closeModal, 300); // モーダルが閉じるアニメーション後に閉じる
  };

  const handleTabClick = (index: any) => {
    if (index === 3) {
      handleCloseModal();
    } else {
      setActiveTab(index);
    }
  };

  return (
    <div className="lg:w-1/2 m-5">
      <div className="h-3/4 bg-white rounded-xl shadow-md">
        <div className="flex justify-end">
          <button
            className="text-gray-500 hover:text-gray-700 p-2"
            onClick={handleCloseModal}
          >
            Close
          </button>
        </div>
        <div className="flex">
          <div className="w-1/4 bg-gray-100">
            <ul className="space-y-2">
              {tabs.map((tab, index) => (
                <li
                  key={index}
                  onClick={() => handleTabClick(index)}
                  className={`cursor-pointer ${
                    activeTab === index
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  } p-2`}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-3/4 p-4">
            <div className="bg-white p-4 h-3/4 overflow-y-auto">
              {activeTab === 0 && <p>Tab 1 content goes here.</p>}
              {activeTab === 1 && <p>Tab 2 content goes here.</p>}
              {activeTab === 2 && <p>Tab 3 content goes here.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideModal;
