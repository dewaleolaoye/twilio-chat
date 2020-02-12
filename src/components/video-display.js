import React, { useEffect } from "react"
// import useTwilioVideo from "../hooks/use-twilio"
import { navigate } from "gatsby"
import useTwilioChat from "../hooks/use-twilio"
import MessageForm from "./MessageForm"
import MessageList from "./MessageList"

const VideoDisplay = ({ roomID }) => {
  // let videoRef = useRef();
  const { state, handleNewMessage } = useTwilioChat()
  // console.log("video Display", videoRef)

  useEffect(() => {
    // videoRef.current = document.querySelector('.chat');
    if (!state.token) {
      navigate("/", { state: { roomName: roomID } })
    }

    // if (!state.channel) {
    //   startVideo()
    // }
    // window.addEventListener("beforeunload", leaveRoom)

    // return () => {
    //   window.addEventListener("beforeunload", leaveRoom)
    // }
  }, [state, roomID])
  return (
    <>
      {/* <h1>Room: {roomID}</h1>
      {state.room && (
        <button className="leave-room" onClick={leaveRoom}>
          Leave Room
        </button>
      )} */}
      <MessageList messages={state.messages} />
      <MessageForm onMessageSend={handleNewMessage} />
    </>
  )
}

export default VideoDisplay
