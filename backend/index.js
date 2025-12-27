// const express = require('express');
// const app = express();
// const port = 3000;

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// app.get('/')

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
// });

import express from "express";

import getRouter from "./api_endpoints/get_endpoint.js";
import postRouter from "./api_endpoints/post_endpoint.js";
import patchRouter from "./api_endpoints/patch_endpoint.js";
import deleteRouter from "./api_endpoints/delete_endpoint.js";

const app = express();
app.use(express.json());

app.use("/api/tasks", getRouter);
app.use("/api/tasks", postRouter);
app.use("/api/tasks", patchRouter);
app.use("/api/tasks", deleteRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


export default app;
