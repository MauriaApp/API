import { getAllNote } from "./notes.js";
import { getAllAbsence } from "./absences.js";
import { getPlanning } from "./planning.js";
import { PostStatsNotes, GetStatsNotes } from "./statsNotes.js";
import login from "./login.js";

import express from "express";
import cors from "cors";

import { getAssos } from "./assos.js";
import { getMsg } from "./msg.js";
import { getUpdate } from "./update.js";


const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());




app.get("/", function (req, res) {
    res.send("Hello World!  Il n'y a rien ici :'(");
});


app.get("/assos", function (req, res) {
    getAssos()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.send(err);
        });
});

app.get("/msg", function (req, res) {
    getMsg()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.send(err);
        });

});

app.get("/update", function (req, res) {
    getUpdate()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.send(err);
        });
});



app.post("/login", function (req, res) {
    // console.log(req.body);
    login(req.body.username, req.body.password)
        .then((result) => {
            res.sendStatus(result[1]);
        })
        .catch((err) => {
            res.send(err);
        });
});

app.post("/notes", function (req, res) {
    getAllNote(req.body.username, req.body.password)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.send(err);
        });
});

app.post("/absences", function (req, res) {
    getAllAbsence(req.body.username, req.body.password)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.send(err);
        });
});


app.post("/planning", function (req, res) {

    // console.log(req.body);
    getPlanning(req.body.username, req.body.password, req.query.start, req.query.end)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.send(err);
        });
});

app.post("/poststats", function (req, res) {
    PostStatsNotes(req.body.username, req.body.password, req.body.shared)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.send(err);
        });
});

app.post("/getstats", function (req, res) {
    GetStatsNotes(req.body.username, req.body.password)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.send(err);
        });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
