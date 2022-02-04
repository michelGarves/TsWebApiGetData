'use strict';
 var Organisme = require("../models/Organisme.model.js");


// Retrieve all Organismes from the database (with condition).
exports.findAll = (req, res) => {
    const libelle = req.query.libelle;

    Organisme.getAll(libelle, (err, data) => {
      if (err) {
        if (err.kind === "no_such_libelle") {
          res.status(404).send({message: `no records containing ${libelle} in "ORGANISME_LIBELLE"`})
        }else if(err.kind ==="no_results"){
          res.status(404).send({message: "no records"});
        } 
        else {
          res.status(500).send({
            message: err.message || "Error retrieving Organisms"
          });
        }
       } else res.status(200).send(data);
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
              message: err.message || "Error retrieving Organism with id " + req.params.id
            });
          }
        } else res.status(200).send(data);
      });
};

// find all published Organismes
exports.findAllActive = (req, res) => {
    Organisme.getAllActive((err, data) => {
        if (err){
          if(err.kind === "no_result"){
            res.status(404).send({message: "not found active organism(s)"});
          }else{
          res.status(500).send({
            message:
              err.message || "error occured while searching for active organisms."
          });
        }
        }
        else res.status(200).send(data);
      });
};

// Update a Organisme identified by the id in the request
exports.findAllEnabled = (req, res) => {
    Organisme.getAllEnabled((err, data) => {
      if (err){
        if(err.kind === "no_result"){
          res.status(404).send({message: "not found enabled organism(s)"});
        }else{
        res.status(500).send({
          message:
            err.message || "error occured while searching for enabled organisms."
        });
      }
      }
        else res.status(200).send(data);
      });
};

// Update a Organisme identified by the id in the request
exports.findAllDisabled = (req, res) => {
    Organisme.getAllDisabled((err, data) => {
      if (err){
        if(err.kind === "no_result"){
          res.status(404).send({message: "not found disabled organism(s)"});
        }else{
        res.status(500).send({
          message:
            err.message || "error occured while searching for disabled organisms."
        });
      }
      }
        else res.status(200).send(data);
      });
};

// Update a Organisme identified by the id in the request
exports.findAllUnactive = (req, res) => {
    Organisme.getAllUnactive((err, data) => {
      if (err){
        if(err.kind === "no_result"){
          res.status(404).send({message: "not found unactive organism(s)"});
        }
        else{
        res.status(500).send({
          message:
            err.message || "error occured while searching for unactive organisms."
        });
      }
      }
        else res.status(200).send(data);
      });
};

exports.findAllCaisse = (req, res) => {
  Organisme.getAllCaisse(req.params.codecaisse, (err, data) => {
    if (err){
      if(err.king === "err_caisse"){
        res.status(400).send({
          message:
            err.message || `please enter a valid "caisse_gestionnaire_code".`
        });
      }
      else if(err.kind === "no_caisse"){
        res.status(404).send({message: `not found records with such "CAISSE_GESTIONNAIRE_CODE"`})
      }
      else{
        res.status(500).send({message: err.message || `error occured while trying to search for organisms according to 'CODE_GESTIONNAIRE_CODE'`})
      }
    }else res.status(200).send(data);
  })
}

exports.findCreatedBefore = (req, res) => {
  Organisme.getCreatedBefore(req.params.year, (err, data) => {
    if(err){
      if(err.kind === "err_get"){
        res.status(500).send({
          message:
            err.message || "error occured while searching for organisms according to their creation date."
        });
      }else if (err.kind === "err_date"){
        res.status(400).send({
          message:
            err.message || "wrong date format."
        });
      }
      else if (err.kind === "no_result"){
        res.status(404).send({message: `Not found Organisms created before ${req.params.year}`})
      }
    }else res.status(200).send(data);
  })
}

exports.findUpdatedBefore = (req, res) => {
  Organisme.getUpdatedBefore(req.params.year, (err, data) => {
    if(err){
      if(err.kind === "err_get"){
        res.status(500).send({
          message:
            err.message || "error occured while searching for organisms according to their update date."
        });
      }else if (err.kind === "err_date"){
        res.status(400).send({
          message:
            err.message || "wrong date format."
        });
      }
      else if (err.kind === "no_result"){
        res.status(404).send({message: `Not found Organisms updated before ${req.params.year}`})
      }
    }else res.status(200).send(data);
  })
}

exports.findCreatedAfter = (req, res) => {
  Organisme.getCreatedAfter(req.params.year, (err, data) => {
    if(err){
      if(err.kind === "err_get"){
        res.status(500).send({
          message:
            err.message || "error occured while searching for organisms according to their creation date."
        });
      }else if (err.kind === "err_date"){
        res.status(400).send({
          message:
            err.message || "wrong date format."
        });
      }
      else if (err.kind === "no_result"){
        res.status(404).send({message: `Not found Organisms created after ${req.params.year}`})
      }
    }else res.status(200).send(data);
  })
}

exports.findUpdatedAfter = (req, res) => {
  Organisme.getUpdatedAfter(req.params.year, (err, data) => {
    if(err){
      if(err.kind === "err_get"){
        res.status(500).send({
          message:
            err.message || "error occured while searching for organisms according to their update date."
        });
      }else if (err.kind === "err_date"){
        res.status(500).send({
          message:
            err.message || "wrong date format."
        });
      }
      else if (err.kind === "no_result"){
        res.status(404).send({message: `Not found Organisms updated after ${req.params.year}`})
      }
    }else res.status(200).send(data);
  })
}



