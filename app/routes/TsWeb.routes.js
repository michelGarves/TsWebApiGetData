module.exports = app => {
    const organismes = require("../controllers/TsWeb.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Tutorials
    router.get("/", organismes.findAll);
  
    // Retourne tout les organismes actifs
    router.get("/active", organismes.findAllActive);
  
    //Retourne tout les organismes activés
    router.get("/enable", organismes.findAllEnabled)

    //Retourne tout les organismes inactifs
    router.get("/unactive", organismes.findAllUnactive)

    //Retourne tout les organismes désactivés
    router.get("/disabled", organismes.findAllDisabled)

    // Retrieve a single Tutorial with id
    router.get("/:id", organismes.findOne);
  
    app.use('/api/organismes', router);
  };