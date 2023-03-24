class Socket {
  socketClosed: boolean
  listeners: Record <string, Array<(data?: any) => void>>
  forceFullDisconnect: boolean
  disconnectTimer: ReturnType<typeof setTimeout> | null
  socketConnectTimeout: ReturnType<typeof setTimeout> | null
  socket: WebSocket | undefined

  constructor () {
    this.socketClosed = true
    this.listeners = {}
    this.connect()
    this.forceFullDisconnect = false
    this.disconnectTimer = null
    this.socketConnectTimeout = null

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        if (this.disconnectTimer === null) {
          // Disconnect after 30min idle
          this.disconnectTimer = setTimeout(this.disconnect, 1_800_000)
        }
      } else {
        if (this.disconnectTimer !== null) {
          clearTimeout(this.disconnectTimer)
          this.disconnectTimer = null
        }
        if (this.socketClosed) {
          if (this.socketConnectTimeout !== null) {
            clearTimeout(this.socketConnectTimeout)
            this.socketConnectTimeout = null
          }
          this.forceFullDisconnect = false
          this.connect()
        }
      }
    })
  }

  disconnect = (): void => {
    this.forceFullDisconnect = true
    this.disconnectTimer = null
    if (this.socket === undefined) {
      return
    }
    this.socket.close(3010, 'Idle connection.')
  }

  connect = (callback?: () => void): void => {
    this.socket = new WebSocket(`${window.location.protocol.replace('http', 'ws')}//${window.location.host}`)
    // Connection opened
    this.socket.addEventListener('open', () => {
      this.socketClosed = false
      console.log('Websocket connected')
      this.emit('open', this.socket)
      if ((callback !== undefined) && typeof callback === 'function') {
        callback()
      }
    })

    let pingTimeout = this.ping()

    // Listen for messages
    this.socket.addEventListener('message', (event: MessageEvent) => {
      const data = JSON.parse(event.data)
      if (data.type === 'pong') {
        pingTimeout = this.ping()
      } else {
        this.emit(data.type, data.data)
      }
    })

    this.socket.addEventListener('close', () => {
      clearTimeout(pingTimeout)
      this.socketClosed = true
      if (!this.forceFullDisconnect) {
        this.socketConnectTimeout = setTimeout(this.connect, 10_000)
        console.log('Websocket disconnected, retying in 10s')
        this.emit('close')
      }
    })
  }

  ping = (): ReturnType<typeof setTimeout> => setTimeout(() => {
    this.send('ping')
  }, 45_000)

  send = (type: string, data?: any): void => {
    if (this.socketClosed) {
      if (this.socketConnectTimeout !== null) {
        clearTimeout(this.socketConnectTimeout)
      }
      this.socketConnectTimeout = null
      this.connect(() => {
        this.send(type, data)
      })
      return
    }
    const sendData = {
      type
    }
    if (data !== undefined) {
      Object.defineProperty(sendData, 'data', { value: data })
    }
    if (this.socket === undefined) {
      return
    }
    this.socket.send(JSON.stringify(sendData))
  }

  emit (key: string, data?: object): void {
    console.log(`ws emit: ${key}`)
    if (key in this.listeners) {
      this.listeners[key].forEach((listener) => { listener(data) })
    }
  }

  on (key: string, callback: (data: any) => void): void {
    if (!(key in this.listeners)) {
      this.listeners[key] = []
    }
    this.listeners[key].push(callback)
  }
}

export { Socket }
