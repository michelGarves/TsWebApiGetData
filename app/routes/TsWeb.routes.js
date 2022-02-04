module.exports = app => {
    const organismes = require("../controllers/Organisme.controller.js");

    var router = require("express").Router();
    
    
    // Retourne tout les organismes
    router.get("/organismes", organismes.findAll)

    // Retourne un unique Organisme selon son id
    router.get("/organisme/:id", organismes.findOne)

    // Retourne tout les organismes actifs
    router.get("/organismes/active", organismes.findAllActive)
  
    //Retourne tout les organismes activés
    router.get("/organismes/enable", organismes.findAllEnabled)

    //Retourne tout les organismes inactifs
    router.get("/organismes/unactive", organismes.findAllUnactive)

    //Retourne tout les organismes désactivés
    router.get("/organismes/disable", organismes.findAllDisabled)

    //Retourne les organismes en fonction de leur code_caisse_gestionnaire 
    router.get("/organismes/caisse/:codecaisse", organismes.findAllCaisse)

    //Retourne tout les organismes désactivés
    router.get("/organismes/createdbefore/:year", organismes.findCreatedBefore)

    //Retourne tout les organismes désactivés
    router.get("/organismes/createdafter/:year", organismes.findCreatedAfter)

    //Retourne tout les organismes désactivés
    router.get("/organismes/updatedbefore/:year", organismes.findUpdatedBefore)

    //Retourne tout les organismes désactivés
    router.get("/organismes/updatedafter/:year", organismes.findUpdatedAfter)

    
    app.use('/', router);
  };
