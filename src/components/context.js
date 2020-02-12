import React, { createContext, Component } from "react"

export const ChatContext = createContext({ state: null, setState: null })

const DEFAULT_STATE = {
  identity: false,
  roomName: false,
  token: false,
  channel: false,
  messages: [],
  // sessionId: false,
}

export class ChatProvider extends Component {
  constructor() {
    super()
    this.state = DEFAULT_STATE
  }

  render() {
    return (
      <ChatContext.Provider
        value={{ state: this.state, setState: this.setState }}
      >
        {this.props.children}
      </ChatContext.Provider>
    )
  }
}
