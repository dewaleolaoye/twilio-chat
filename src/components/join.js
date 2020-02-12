import React, { useEffect, useState } from "react"
import useTwilioChat from "../hooks/use-twilio"
import { navigate } from "gatsby"

const Join = ({ location }) => {
  const defaultRoom =
    (location && location.state && location.state.roomName) || ""
  // const defaultSession =
  //   (location && location.state && location.state.sessionId) || null;
  const { state, getToken, joinChat } = useTwilioChat()
  const [identity, setIdentity] = useState("")
  const [roomName, setRoomName] = useState(defaultRoom)

  useEffect(() => {
    if (state.token && state.roomName) {
      navigate(`/room/${state.roomName}`)
    }
  }, [state, joinChat, getToken])

  const handleSubmit = event => {
    event.preventDefault()
    console.log(identity, roomName)

    joinChat({ identity, roomName })
  }

  return (
    <>
      <h1>Start or Join Chat</h1>

      {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
      <form className="start-form" onSubmit={handleSubmit}>
        <label htmlFor="identity">
          Display Name:
          <input
            type="text"
            id="identity"
            value={identity}
            onChange={event => setIdentity(event.target.value)}
          />
        </label>
        <label htmlFor="roomName">
          Which room do you want to join?
          <input
            type="text"
            id="roomName"
            value={roomName}
            onChange={event => setRoomName(event.target.value)}
          />
        </label>
        <button type="submit">Join Chat</button>
      </form>
    </>
  )
}

export default Join
