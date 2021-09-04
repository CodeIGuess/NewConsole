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

# How do the games work?
The games are stored as bytecode instructions that are ran (yes, it's interpreted) as it goes.

# Can I make one?
Yes! I'm planning on making converters from other platforms to this, but that might prove to be a challenge. Who knows, maybe I could run gameboy carts on this thing? Only time will tell.
