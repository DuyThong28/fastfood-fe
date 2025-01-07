import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api-client";
import ProductItemCard from "../product/product-item-card";
import { ChatbotMessage } from "@/common/enums";
import { useNavigate } from "react-router-dom";
import { Order } from "@/types/order";
import { Product, ResProductDetail } from "@/types/product";
import SectionCard from "../shared/section-card";
import { ORDER_STATUS } from "@/common/constants/order";
import { Button } from "../ui/button";
import { toastSuccess } from "@/utils/toast";
import cartService from "@/services/cart.service";

type Message = {
  sender: string;
  text: string;
  results?: Order[] | Product[] | any[];
  type?: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Xin chào, tôi là trợ lí ảo FoodzyBot. Tôi có thể giúp gì cho bạn?",
    },
  ]);
  const [content, setContent] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const [item, setItem] = useState<ResProductDetail | any>();
  const navigate = useNavigate();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (content.trim() === "") return;

    const userMessage = { sender: "user", text: content };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setContent("");

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    try {
      const response = await api.post("/chatbot", { message: content });
      let type;
      Object.entries(ChatbotMessage).forEach(([key, message]) => {
        if (response.data.message.includes(message)) {
          type = key;
        }
      });
      const botMessage = {
        sender: "bot",
        text:
          response.data.message === ""
            ? "Xin lỗi, tôi không thể xử lý yêu cầu của bạn. Vui lòng thử lại!"
            : response.data.message,
        results:
          type === "TRACK_ORDER"
            ? Array.isArray(response.data.data)
              ? response.data.data
              : [response.data.data]
            : response.data.data,
        type: type,
      };
      console.log(botMessage);
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: "Xin lỗi, tôi không thể xử lý yêu cầu của bạn. Vui lòng thử lại.",
        },
      ]);

      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAddToCart = async (item: any) => {
    try {
      await cartService.addToCart({
        productId: item.id,
        quantity: 1,
      });
      toastSuccess("Thêm vào giỏ hàng thành công");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div>
      <button
        onClick={toggleChat}
        style={{
          boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.5)",
        }}
        className="absolute bottom-5 z-20 right-5 bg-[#FF7E00] text-white p-2 rounded-full shadow-lg transition-transform transform hover:scale-105"
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M18.1325 10.6375C19.1949 8.38847 20.8745 6.48767 22.9755 5.15648C25.0766 3.82529 27.5127 3.11853 30 3.11853C32.4873 3.11853 34.9234 3.82529 37.0244 5.15648C39.1255 6.48767 40.8051 8.38847 41.8675 10.6375C45.1144 10.4935 48.3142 11.4541 50.945 13.3626C53.5757 15.271 55.4822 18.0146 56.3532 21.1457C57.2242 24.2769 57.0085 27.6109 55.7412 30.6037C54.4739 33.5965 52.2298 36.0715 49.375 37.625V45.13C49.375 47.3775 49.375 49.25 49.175 50.735C48.965 52.305 48.5 53.7225 47.36 54.86C46.2225 56 44.805 56.465 43.235 56.675C41.75 56.875 39.875 56.875 37.63 56.875H22.37C20.125 56.875 18.25 56.875 16.765 56.675C15.195 56.465 13.7775 56 12.64 54.86C11.5 53.7225 11.035 52.305 10.825 50.735C10.625 49.25 10.625 47.3775 10.625 45.13V37.6275C7.77022 36.074 5.52612 33.599 4.25881 30.6062C2.99149 27.6134 2.77576 24.2794 3.6468 21.1482C4.51784 18.0171 6.42425 15.2735 9.05501 13.3651C11.6858 11.4566 14.8856 10.4935 18.1325 10.6375ZM17.0075 14.39C14.611 14.5007 12.3225 15.4193 10.5144 16.9962C8.70634 18.573 7.48517 20.7154 7.04961 23.0746C6.61405 25.4338 6.98974 27.871 8.11555 29.9896C9.24135 32.1081 11.051 33.7833 13.25 34.7425C13.5842 34.8883 13.8687 35.1285 14.0685 35.4335C14.2683 35.7386 14.3748 36.0953 14.375 36.46V43.125H45.625V36.46C45.6252 36.0953 45.7317 35.7386 45.9315 35.4335C46.1313 35.1285 46.4158 34.8883 46.75 34.7425C48.9482 33.7824 50.757 32.1068 51.8821 29.9883C53.0073 27.8699 53.3827 25.433 52.9472 23.0741C52.5118 20.7153 51.2911 18.5731 49.4838 16.9959C47.6764 15.4188 45.3886 14.4995 42.9925 14.3875C43.0808 14.9958 43.125 15.6166 43.125 16.25V17.5C43.125 17.9972 42.9275 18.4742 42.5758 18.8258C42.2242 19.1774 41.7473 19.375 41.25 19.375C40.7527 19.375 40.2758 19.1774 39.9242 18.8258C39.5725 18.4742 39.375 17.9972 39.375 17.5V16.25C39.3763 15.0184 39.1347 13.7988 38.664 12.6607C38.1934 11.5227 37.5029 10.4887 36.6321 9.6179C35.7612 8.74708 34.7272 8.05658 33.5892 7.58591C32.4512 7.11523 31.2315 6.87364 30 6.87496C27.5136 6.87496 25.129 7.86268 23.3709 9.62083C21.6127 11.379 20.625 13.7636 20.625 16.25V17.5C20.625 17.9972 20.4275 18.4742 20.0758 18.8258C19.7242 19.1774 19.2473 19.375 18.75 19.375C18.2527 19.375 17.7758 19.1774 17.4242 18.8258C17.0725 18.4742 16.875 17.9972 16.875 17.5V16.25C16.875 15.6166 16.9192 14.9983 17.0075 14.39ZM45.62 46.875H14.38C14.39 48.3 14.425 49.375 14.5425 50.2375C14.6975 51.39 14.965 51.885 15.2925 52.21C15.62 52.535 16.11 52.8025 17.2625 52.96C18.47 53.12 20.09 53.125 22.5 53.125H37.5C39.91 53.125 41.53 53.12 42.7375 52.9575C43.89 52.8025 44.385 52.535 44.71 52.2075C45.035 51.88 45.3025 51.39 45.46 50.2375C45.575 49.3725 45.61 48.2975 45.62 46.875Z"
            fill="#fff"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-5 w-80 bg-white shadow-lg rounded-lg flex flex-col z-20">
          <div className="flex justify-between items-center p-2 border-b border-gray-200">
            <div className="flex gap-x-1 items-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.1325 10.6375C19.1949 8.38847 20.8745 6.48767 22.9755 5.15648C25.0766 3.82529 27.5127 3.11853 30 3.11853C32.4873 3.11853 34.9234 3.82529 37.0244 5.15648C39.1255 6.48767 40.8051 8.38847 41.8675 10.6375C45.1144 10.4935 48.3142 11.4541 50.945 13.3626C53.5757 15.271 55.4822 18.0146 56.3532 21.1457C57.2242 24.2769 57.0085 27.6109 55.7412 30.6037C54.4739 33.5965 52.2298 36.0715 49.375 37.625V45.13C49.375 47.3775 49.375 49.25 49.175 50.735C48.965 52.305 48.5 53.7225 47.36 54.86C46.2225 56 44.805 56.465 43.235 56.675C41.75 56.875 39.875 56.875 37.63 56.875H22.37C20.125 56.875 18.25 56.875 16.765 56.675C15.195 56.465 13.7775 56 12.64 54.86C11.5 53.7225 11.035 52.305 10.825 50.735C10.625 49.25 10.625 47.3775 10.625 45.13V37.6275C7.77022 36.074 5.52612 33.599 4.25881 30.6062C2.99149 27.6134 2.77576 24.2794 3.6468 21.1482C4.51784 18.0171 6.42425 15.2735 9.05501 13.3651C11.6858 11.4566 14.8856 10.4935 18.1325 10.6375ZM17.0075 14.39C14.611 14.5007 12.3225 15.4193 10.5144 16.9962C8.70634 18.573 7.48517 20.7154 7.04961 23.0746C6.61405 25.4338 6.98974 27.871 8.11555 29.9896C9.24135 32.1081 11.051 33.7833 13.25 34.7425C13.5842 34.8883 13.8687 35.1285 14.0685 35.4335C14.2683 35.7386 14.3748 36.0953 14.375 36.46V43.125H45.625V36.46C45.6252 36.0953 45.7317 35.7386 45.9315 35.4335C46.1313 35.1285 46.4158 34.8883 46.75 34.7425C48.9482 33.7824 50.757 32.1068 51.8821 29.9883C53.0073 27.8699 53.3827 25.433 52.9472 23.0741C52.5118 20.7153 51.2911 18.5731 49.4838 16.9959C47.6764 15.4188 45.3886 14.4995 42.9925 14.3875C43.0808 14.9958 43.125 15.6166 43.125 16.25V17.5C43.125 17.9972 42.9275 18.4742 42.5758 18.8258C42.2242 19.1774 41.7473 19.375 41.25 19.375C40.7527 19.375 40.2758 19.1774 39.9242 18.8258C39.5725 18.4742 39.375 17.9972 39.375 17.5V16.25C39.3763 15.0184 39.1347 13.7988 38.664 12.6607C38.1934 11.5227 37.5029 10.4887 36.6321 9.6179C35.7612 8.74708 34.7272 8.05658 33.5892 7.58591C32.4512 7.11523 31.2315 6.87364 30 6.87496C27.5136 6.87496 25.129 7.86268 23.3709 9.62083C21.6127 11.379 20.625 13.7636 20.625 16.25V17.5C20.625 17.9972 20.4275 18.4742 20.0758 18.8258C19.7242 19.1774 19.2473 19.375 18.75 19.375C18.2527 19.375 17.7758 19.1774 17.4242 18.8258C17.0725 18.4742 16.875 17.9972 16.875 17.5V16.25C16.875 15.6166 16.9192 14.9983 17.0075 14.39ZM45.62 46.875H14.38C14.39 48.3 14.425 49.375 14.5425 50.2375C14.6975 51.39 14.965 51.885 15.2925 52.21C15.62 52.535 16.11 52.8025 17.2625 52.96C18.47 53.12 20.09 53.125 22.5 53.125H37.5C39.91 53.125 41.53 53.12 42.7375 52.9575C43.89 52.8025 44.385 52.535 44.71 52.2075C45.035 51.88 45.3025 51.39 45.46 50.2375C45.575 49.3725 45.61 48.2975 45.62 46.875Z"
                  fill="#FF7E00"
                />
              </svg>
              <p className="text-sm">Chatbot</p>
            </div>
            <button
              onClick={toggleChat}
              className="text-sm text-gray-500 hover:text-gray-800 p-2 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="h-96 overflow-y-auto p-3 shadow-inner rounded-lg">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="mb-2 flex gap-x-1 items-center">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 60 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M18.1325 10.6375C19.1949 8.38847 20.8745 6.48767 22.9755 5.15648C25.0766 3.82529 27.5127 3.11853 30 3.11853C32.4873 3.11853 34.9234 3.82529 37.0244 5.15648C39.1255 6.48767 40.8051 8.38847 41.8675 10.6375C45.1144 10.4935 48.3142 11.4541 50.945 13.3626C53.5757 15.271 55.4822 18.0146 56.3532 21.1457C57.2242 24.2769 57.0085 27.6109 55.7412 30.6037C54.4739 33.5965 52.2298 36.0715 49.375 37.625V45.13C49.375 47.3775 49.375 49.25 49.175 50.735C48.965 52.305 48.5 53.7225 47.36 54.86C46.2225 56 44.805 56.465 43.235 56.675C41.75 56.875 39.875 56.875 37.63 56.875H22.37C20.125 56.875 18.25 56.875 16.765 56.675C15.195 56.465 13.7775 56 12.64 54.86C11.5 53.7225 11.035 52.305 10.825 50.735C10.625 49.25 10.625 47.3775 10.625 45.13V37.6275C7.77022 36.074 5.52612 33.599 4.25881 30.6062C2.99149 27.6134 2.77576 24.2794 3.6468 21.1482C4.51784 18.0171 6.42425 15.2735 9.05501 13.3651C11.6858 11.4566 14.8856 10.4935 18.1325 10.6375ZM17.0075 14.39C14.611 14.5007 12.3225 15.4193 10.5144 16.9962C8.70634 18.573 7.48517 20.7154 7.04961 23.0746C6.61405 25.4338 6.98974 27.871 8.11555 29.9896C9.24135 32.1081 11.051 33.7833 13.25 34.7425C13.5842 34.8883 13.8687 35.1285 14.0685 35.4335C14.2683 35.7386 14.3748 36.0953 14.375 36.46V43.125H45.625V36.46C45.6252 36.0953 45.7317 35.7386 45.9315 35.4335C46.1313 35.1285 46.4158 34.8883 46.75 34.7425C48.9482 33.7824 50.757 32.1068 51.8821 29.9883C53.0073 27.8699 53.3827 25.433 52.9472 23.0741C52.5118 20.7153 51.2911 18.5731 49.4838 16.9959C47.6764 15.4188 45.3886 14.4995 42.9925 14.3875C43.0808 14.9958 43.125 15.6166 43.125 16.25V17.5C43.125 17.9972 42.9275 18.4742 42.5758 18.8258C42.2242 19.1774 41.7473 19.375 41.25 19.375C40.7527 19.375 40.2758 19.1774 39.9242 18.8258C39.5725 18.4742 39.375 17.9972 39.375 17.5V16.25C39.3763 15.0184 39.1347 13.7988 38.664 12.6607C38.1934 11.5227 37.5029 10.4887 36.6321 9.6179C35.7612 8.74708 34.7272 8.05658 33.5892 7.58591C32.4512 7.11523 31.2315 6.87364 30 6.87496C27.5136 6.87496 25.129 7.86268 23.3709 9.62083C21.6127 11.379 20.625 13.7636 20.625 16.25V17.5C20.625 17.9972 20.4275 18.4742 20.0758 18.8258C19.7242 19.1774 19.2473 19.375 18.75 19.375C18.2527 19.375 17.7758 19.1774 17.4242 18.8258C17.0725 18.4742 16.875 17.9972 16.875 17.5V16.25C16.875 15.6166 16.9192 14.9983 17.0075 14.39ZM45.62 46.875H14.38C14.39 48.3 14.425 49.375 14.5425 50.2375C14.6975 51.39 14.965 51.885 15.2925 52.21C15.62 52.535 16.11 52.8025 17.2625 52.96C18.47 53.12 20.09 53.125 22.5 53.125H37.5C39.91 53.125 41.53 53.12 42.7375 52.9575C43.89 52.8025 44.385 52.535 44.71 52.2075C45.035 51.88 45.3025 51.39 45.46 50.2375C45.575 49.3725 45.61 48.2975 45.62 46.875Z"
                        fill="#FF7E00"
                      />
                    </svg>
                    <p className="text-sm">FoodzyBot</p>
                  </div>
                )}
                <p
                  className={`inline-block p-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-[#FEE4CD] text-[#A93F15]"
                      : "bg-gray-200 text-black ml-8 w-5/6"
                  } `}
                >
                  {msg.text}
                </p>
                {msg.sender === "bot" &&
                  msg.results &&
                  ((Array.isArray(msg.results) && msg.type === "BEST_SELLER") ||
                    msg.type === "CATEGORY") && (
                    <div className="mt-3 ml-8 overflow-x-auto">
                      <div className="flex space-x-4 min-w-max pb-2">
                        {msg.results.map((result, index) => (
                          <div className="w-48">
                            <div className="flex flex-col gap-y-2">
                              <ProductItemCard key={index} data={result} />
                              <Button
                                onClick={() => {
                                  handleAddToCart(result);
                                }}
                                type="button"
                                className="bg-[#A93F15] hover:bg-[#FF7E00]"
                              >
                                Thêm vào giỏ hàng
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                {msg.sender === "bot" && msg.results && (
                  <>
                    {msg.type === "TRACK_ORDER" &&
                      (() => {
                        const tracking = msg.results as Order[];
                        const orderDetail = tracking[0];

                        return (
                          <div className="flex flex-col justify-center items-center gap-y-3">
                            <div className="ml-8 mt-3 flex flex-col gap-y-3 w-11/12">
                              <div className="flex flex-col space-y-2">
                                <SectionCard className="p-4 space-y-4">
                                  <div className="font-medium">Trạng thái</div>
                                  <div className="space-y-2 text-muted-foreground">
                                    <div>
                                      {ORDER_STATUS[orderDetail.status]}
                                    </div>
                                  </div>
                                </SectionCard>

                                <SectionCard className="p-4 space-y-4">
                                  <div className="font-medium">
                                    Địa chỉ nhận hàng
                                  </div>
                                  <div className="space-y-2 text-muted-foreground">
                                    <div>{`Người nhận: ${orderDetail.full_name}`}</div>
                                    <div>{`Số điện thoại: ${orderDetail.phone_number}`}</div>
                                    <div>{`Địa chỉ: ${orderDetail.address}`}</div>
                                  </div>
                                </SectionCard>
                              </div>
                            </div>
                            <button
                              className="px-6 py-2 rounded-lg text-sm bg-[#A93F15] hover:bg-[#FF7E00] w-fit text-white"
                              onClick={() =>
                                navigate(`/customer/purchase/${tracking[0].id}`)
                              }
                            >
                              Xem chi tiết
                            </button>
                          </div>
                        );
                      })()}
                  </>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex pb-4 border-t pt-2 pr-2">
            <input
              type="text"
              value={content}
              ref={inputRef}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow text-sm p-2 border-none focus:outline-none focus:ring-0"
              placeholder="Nhập tin nhắn..."
            />
            <button
              onClick={handleSend}
              className="bg-[#A93F15] text-white p-2 rounded-full hover:bg-[#FF7E00] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#fff"
                className="size-5"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
