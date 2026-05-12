import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Bell,
  MessageCircle,
  CheckCircle2
} from "lucide-react";

export default function UserNotifications() {

  const userId = localStorage.getItem("userId");

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);

  // ================= FETCH =================

  const fetchMessages = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/contact/user/${userId}`
      );

      setMessages(res.data);

    } catch (err) {

      console.error("Error fetching notifications", err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchMessages();

  }, []);

  // ================= FILTER =================

  const unreadMessages = messages.filter(
    (msg) => msg.adminReply && !msg.isReadByUser
  );

  // ================= UI =================

  return (

    <div
      className="
      h-screen
      overflow-y-auto
      bg-gradient-to-br
      from-yellow-50
      via-amber-50
      to-orange-100
      px-4
      md:px-8
      py-8
    "
    >

      {/* HEADER */}
      <div className="w-full mb-8">

        <div
          className="
          bg-white
          rounded-[30px]
          shadow-md
          border
          border-yellow-200
          p-6
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-5
        "
        >

          {/* LEFT */}
          <div className="flex items-center gap-5">

            <div
              className="
              w-16
              h-16
              rounded-2xl
              bg-yellow-100
              flex
              items-center
              justify-center
            "
            >

              <Bell
                className="text-yellow-600"
                size={32}
              />

            </div>

            <div>

              <h1
                className="
                text-4xl
                font-bold
                text-gray-800
              "
              >

                Notifications

              </h1>

              <p className="text-gray-500 mt-2 text-lg">

                Latest updates & admin replies

              </p>

            </div>

          </div>

          {/* RIGHT */}
          <div
            className="
            bg-yellow-100
            text-yellow-700
            px-5
            py-3
            rounded-2xl
            text-sm
            font-semibold
            w-fit
          "
          >

            {unreadMessages.length} New Notifications

          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="w-full space-y-6">

        {/* LOADING */}
        {loading && (

          <div
            className="
            flex
            flex-col
            items-center
            justify-center
            py-24
          "
          >

            <div
              className="
              w-16
              h-16
              border-4
              border-yellow-200
              border-t-yellow-500
              rounded-full
              animate-spin
            "
            />

            <p className="mt-5 text-gray-500 text-lg">

              Loading notifications...

            </p>

          </div>

        )}

        {/* EMPTY */}
        {!loading && unreadMessages.length === 0 && (

          <div
            className="
            bg-white
            rounded-[35px]
            border
            border-yellow-200
            shadow-md
            p-16
            text-center
          "
          >

            <div
              className="
              w-28
              h-28
              rounded-full
              bg-yellow-100
              flex
              items-center
              justify-center
              mx-auto
              mb-8
            "
            >

              <CheckCircle2
                className="text-yellow-500"
                size={55}
              />

            </div>

            <h2
              className="
              text-4xl
              font-bold
              text-gray-800
            "
            >

              No New Notifications

            </h2>

            <p className="text-gray-500 mt-4 text-xl">

              You're all caught up 🎉

            </p>

          </div>

        )}

        {/* NOTIFICATION LIST */}
        {!loading && unreadMessages.map((msg) => (

          <div
            key={msg._id}
            className="
            bg-white
            rounded-[35px]
            border
            border-yellow-200
            shadow-md
            overflow-hidden
            hover:shadow-xl
            transition-all
            duration-300
          "
          >

            {/* TOP BAR */}
            <div
              className="
              bg-gradient-to-r
              from-yellow-400
              via-amber-500
              to-orange-500
              px-6
              py-5
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-4
            "
            >

              {/* LEFT */}
              <div className="flex items-center gap-4">

                <div
                  className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-white/20
                  flex
                  items-center
                  justify-center
                "
                >

                  <MessageCircle
                    className="text-white"
                    size={28}
                  />

                </div>

                <div>

                  <h2 className="text-white text-2xl font-semibold">

                    Admin Support Reply

                  </h2>

                  <p className="text-yellow-100 mt-1">

                    You received a new message

                  </p>

                </div>

              </div>

              {/* STATUS */}
              <span
                className="
                bg-white/20
                text-white
                px-5
                py-2
                rounded-full
                text-sm
                font-medium
                w-fit
              "
              >

                ● New Reply

              </span>

            </div>

            {/* BODY */}
            <div className="p-6 md:p-8">

              {/* USER MESSAGE */}
              <div className="mb-8">

                <p
                  className="
                  text-orange-500
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wide
                  mb-3
                "
                >

                  Your Message

                </p>

                <div
                  className="
                  bg-yellow-50
                  border
                  border-yellow-200
                  rounded-3xl
                  p-5
                "
                >

                  <p
                    className="
                    text-gray-700
                    leading-relaxed
                    text-lg
                  "
                  >

                    {msg.message}

                  </p>

                </div>

              </div>

              {/* ADMIN REPLY */}
              <div>

                <p
                  className="
                  text-amber-600
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wide
                  mb-3
                "
                >

                  Admin Reply

                </p>

                <div
                  className="
                  bg-amber-50
                  border
                  border-amber-200
                  rounded-3xl
                  p-5
                "
                >

                  <p
                    className="
                    text-amber-700
                    leading-relaxed
                    text-lg
                  "
                  >

                    {msg.adminReply}

                  </p>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}