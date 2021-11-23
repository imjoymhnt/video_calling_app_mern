const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.json({
    msg: "Alive",
  });
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callended");
  });

  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("calluser", { signal: signalData, from: name });
  });

  socket.on("answercall", (data) => {
    io.to(data.io).emit("callaccepted", data.signal);
  });
});

app.listen(PORT, () => {
  console.log(`Server is listining on ${PORT}`);
});
