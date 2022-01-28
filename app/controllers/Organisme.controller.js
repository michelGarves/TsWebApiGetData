'use strict';
 var Organisme = require("../models/Organisme.model.js");


// Retrieve all Organismes from the database (with condition).
exports.findAll = (req, res) => {
    const libelle = req.query.libelle;

    Organisme.getAll(libelle, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "error occured while searching for organisms."
        });
      else res.send(data);
    });
};

// Find a single Organisme with a id
exports.findOne = (req, res) => {
    Organisme.findById(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Organism with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Organism with id " + req.params.id
            });
          }
        } else res.send(data);
      });
};

// find all published Organismes
exports.findAllActive = (req, res) => {
    Organisme.getAllActive((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "error occured while searching for active organisms."
          });
        else res.send(data);
      });
};

// Update a Organisme identified by the id in the request
exports.findAllEnabled = (req, res) => {
    Organisme.getAllEnabled((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "error occured while searching for enabled organisms."
          });
        else res.send(data);
      });
};

// Update a Organisme identified by the id in the request
exports.findAllDisabled = (req, res) => {
    Organisme.getAllDisabled((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "error occured while searching for disabled organisms."
          });
        else res.send(data);
      });
};

// Update a Organisme identified by the id in the request
exports.findAllUnactive = (req, res) => {
    Organisme.getAllUnactive((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "error occured while searching for unactive organisms."
          });
        else res.send(data);
      });
};



