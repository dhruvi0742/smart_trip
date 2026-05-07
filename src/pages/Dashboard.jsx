import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatListPanel from "../components/ChatListPanel";
import ChatPanel from "../components/ChatPanel";
import MapPanel from "../components/MapPanel";
import Profile from "../components/Profile";
import Trips from "./Trips";
import Explore from "./Explore";
import History from "./History";
import CreateTrip from "./CreateTrip";
import Updates from "./Updates";
import Weather from "./Weather";

export default function Dashboard() {

  const [chatOpen, setChatOpen] = useState(false);
  const [showTrips, setShowTrips] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
const [refreshChats, setRefreshChats] = useState(false);
  // 🔥 WEATHER STATE
  const [showWeather, setShowWeather] = useState(false);

  const [messages, setMessages] = useState([]);

  // ⭐ NEW: selected place state
  const [selectedPlace, setSelectedPlace] = useState("");

  // 🔥 ADD: chatId state
  const [chatId, setChatId] = useState(null);

  const startNewChat = () => {
    setMessages([]);
    setSelectedPlace("");
    setChatId(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">

      <Sidebar
        onChatClick={() => {
          setChatOpen(!chatOpen);
          resetViews();
        }}
        onTripsClick={() => {
          resetViews();
          setShowTrips(true);
        }}
        onSavedClick={() => {
          resetViews();
          setShowSaved(true);
        }}
        onExploreClick={() => {
          resetViews();
          setShowExplore(true);
        }}
        onProfileClick={() => {
          resetViews();
          setShowProfile(true);
        }}

        // 🔥 WEATHER CLICK (History replaced)
        onHistoryClick={() => {
          resetViews();
          setShowWeather(true);
        }}

        onCreateClick={() => {
          resetViews();
          setShowCreate(true);
        }}
        onUpdatesClick={() => {
          resetViews();
          setShowUpdates(true);
        }}
        onNewChat={startNewChat}
      />

      <ChatListPanel
        open={chatOpen}
        setMessages={setMessages}
        setChatId={setChatId}
        refreshChats={refreshChats}
      />

      <div className="ml-64 flex flex-1 overflow-hidden">

        {/* 🔥 ADD WEATHER CONDITION HERE */}
        {showWeather ? (
  <Weather city={selectedPlace} />
) : showHistory ? (
          <History />
        ) : showExplore ? (
          <Explore />
        ) : showSaved ? (
          <Trips onlyFavorites />
        ) : showTrips ? (
          <Trips />
        ) : showProfile ? (
          <Profile />
        ) : showUpdates ? (
          <Updates />
        ) : showCreate ? (
          <CreateTrip
            onTripGenerated={() => {
              resetViews();
              setShowTrips(true);
            }}
          />
          
        ) : (
          <>
            <ChatPanel
              messages={messages}
              setMessages={setMessages}
              setSelectedPlace={setSelectedPlace}
              chatId={chatId}
              setChatId={setChatId}
              setRefreshChats={setRefreshChats} 
            />

            <MapPanel place={selectedPlace} />
          </>
        )}

      </div>
    </div>
  );

  function resetViews() {
    setShowTrips(false);
    setShowSaved(false);
    setShowExplore(false);
    setShowProfile(false);
    setShowHistory(false);
    setShowCreate(false);
    setShowUpdates(false);

    // 🔥 IMPORTANT (add this)
    setShowWeather(false);
  }
}