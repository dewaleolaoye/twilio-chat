import React, {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from "react"
import axios from "axios"
import TwilioChat from "twilio-chat"
import { ChatContext, ChatProvider } from "../components/context"

// const TWILIO_TOKEN_URL = process.env.TWILIO_TOKEN_URL
const TWILIO_TOKEN_URL = "http://localhost:4000/chat/token"
const DEFAULT_STATE = {
  identity: false,
  roomName: false,
  token: false,
  channel: false,
  messages: [],
  // sessionId: false,
}

const reducer = (state, action) => {
  console.log("actions", action)
  switch (action.type) {
    case "join":
      return {
        ...state,
        token: action.token,
        identity: action.identity,
        roomName: action.roomName,
        channel: action.channel,
      }

    case "set-active-room":
      return { ...state, channel: action.channel }

    case "add-message":
      return { ...state, messages: action.messages }

    case "disconnect":
      state.channel && state.channel.disconnect()
      return DEFAULT_STATE

    default:
      return DEFAULT_STATE
  }
}

const TwilioVideoContext = createContext()

const TwilioVideoProvider = ({ children }) => (
  <TwilioVideoContext.Provider value={useState(DEFAULT_STATE)}>
    {children}
  </TwilioVideoContext.Provider>
)

export const wrapRootElement = ({ element }) => (
  // <TwilioVideoProvider>{element}</TwilioVideoProvider>
  <ChatProvider>{element}</ChatProvider>
)

const useTwilioChat = () => {
  const [state, setState] = useContext(ChatContext)
  const [state_, dispatch] = useContext(TwilioVideoContext)

  useEffect(() => {
    return () => DEFAULT_STATE
  }, [state])

  const getToken = async ({ identity, roomName }) => {
    const result = await axios.post(TWILIO_TOKEN_URL, {
      identity,
      room: roomName ? roomName : null,
      // sessionId: sessionId ? sessionId : null,
    })

    console.log(result.data, "info reg")
    dispatch(state => {
      console.log("state for dispatch", state)
      return {
        token: result.data.token,
        identity,
        roomName: roomName ? roomName : result.data.room,
      }
    })

    console.log("from the states", state)

    return state.token
  }

  const createChatClient = token => {
    const chatClient = new TwilioChat(token)
    return chatClient
  }

  const addMessage = message => {
    const messageData = {
      ...message,
      me: message.author === state.identity,
    }
    dispatch({
      messages: [...state.messages, messageData],
    })
  }

  const joinChannel = async chatClient => {
    const subscribedChannels = await chatClient.getSubscribedChannels()
    if (!subscribedChannels) {
      throw new Error("Could not get channel list.")
    }
    console.log("channel list", subscribedChannels)
    // const channel = await chatClient.getChannelByUniqueName(state.roomName)
    // if (!channel) {
    //   createChannel(chatClient)
    // }
    // addMessage({ body: `Joining ${state.roomName} channel...` })
    // dispatch({ type: "set-active-room", channel })

    // //join the channel if one exist already
    // const joinedChannel = await channel.join()
    // if (!joinedChannel) {
    //   throw new Error(`Could not join ${state.roomName} channel.`)
    // }
    // addMessage({
    //   body: `Joined ${state.roomName} channel as ${state.identity}`,
    // })
    // window.addEventListener("beforeunload", () => channel.leave())

    // return channel
  }

  const createChannel = async chatClient => {
    addMessage({ body: `Creating ${state.roomName} channel...` })
    const createdChannel = await chatClient.createChannel({
      uniqueName: state.roomName,
      friendlyName: `${state.roomName} Chat`,
    })

    if (!createdChannel) {
      throw new Error(`Could not create ${state.roomName} channel.`)
    }

    console.log("Created Channel", createChannel)
    joinChannel(chatClient)
  }

  const handleNewMessage = text => {
    if (state.channel) {
      console.log("message", state.channel)
      state.channel.sendMessage(text)
    }
  }

  const configureChannelEvents = channel => {
    channel.on("messageAdded", ({ author, body }) => {
      addMessage({ author, body })
    })

    channel.on("memberJoined", member => {
      addMessage({ body: `${member.identity} has joined the channel.` })
    })

    channel.on("memberLeft", member => {
      addMessage({ body: `${member.identity} has left the channel.` })
    })
  }

  // const startVideo = () => connectToRoom()
  const leaveRoom = () => dispatch({ type: "disconnect" })

  const joinChat = async ({ identity, roomName }) => {
    const token = await getToken({ identity, roomName })
    console.log("token", state)
    const chatClient = await createChatClient(token)
    const channel = await joinChannel(chatClient)
    console.log("channel", channel)

    // return getToken({ identity, roomName })
    //   .then(createChatClient)
    //   .then(joinChannel)
    //   .then(configureChannelEvents)
    //   .catch(error => {
    //     addMessage({ body: `Error: ${error.message}` })
    //   })
  }

  return { state, getToken, joinChat, handleNewMessage }
}

export default useTwilioChat

// getToken = async () => {
//   const token = await (await axios.get(url)).data;
//   console.log(token);
//   if (!token) {
//     console.log("Unable to get token from server");
//   }

//   this.setState({ username: token.username });
//   return token;
// };
