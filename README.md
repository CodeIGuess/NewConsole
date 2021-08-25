# NewConsole
A Node-based console to play on LAN with.

# Getting started
First, install the dependencies using:
```
npm install ws
```

Once that's done, run the following to start the server:
```
node server.js
```

That's it!
Anyone on your LAN can now join and act as either a display, a controller, or both. The client devices aren't used for much (if any) game code, so even low-end devices can play complex games as long as the server device is fast enough.

It uses WebSockets to communicate between multiple clients and the server.
