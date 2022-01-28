const sql = require("./db.js");

// constructor
const Organisme = function(organisme) {
  this.id_ext_organisme = organisme.id_ext_organisme;
  this.id_wrk_adresse = organisme.id_wrk_adresse;
  this.id_ts_type_organisme = organisme.id_ts_type_organisme;
  this.regime_code = organisme.regime_code;
  this.caisse_gestionnaire_code = organisme.caisse_gestionnaire_code;
  this.centre_gestionnaire_code = organisme.centre_gestionnaire_code;
  this.organisme_libelle = organisme.organisme_libelle;
  this.organisme_dest_code = organisme.organisme_dest_code;
  this.centre_info_code = organisme.centre_info_code;
  this.routage_code = organisme.routage_code;
  this.num_organisme = organisme.num_organisme;
  this.domaine = organisme.domaine;
  this.indicateur_traitement_amc = organisme.indicateur_traitement_amc;
  this.id_hote_gestion = organisme.id_hote_gestion;
  this.isactive = organisme.isactive;
  this.isenable = organisme.isenable;
  this.createddate = organisme.createddate;
  this.updateddate = organisme.updateddate;

};


Organisme.findById = function (id, result) {
  sql.query(`SELECT * FROM usd_organisme WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found organisme: ", res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Organisme.getAll = function (libelle, result)  {
  let query = "SELECT * FROM usd_organisme";

  if (libelle) {
    query += ` WHERE organisme_libelle LIKE '%${libelle}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      
    }

    console.log("organismes: ", res);
    result(null, res);
  });
};

Organisme.getAllEnabled = result => {
  sql.query("SELECT * FROM usd_organisme WHERE isenable = 1", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("organismes: ", res);
    result(null, res);
  });
};

Organisme.getAllDisabled = result => {
  sql.query("SELECT * FROM usd_organisme WHERE isenable = 0", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("organismes: ", res);
    result(null, res);
  });
};

Organisme.getAllActive = result => {
  sql.query("SELECT * FROM usd_organisme WHERE isactive = 1", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("organismes: ", res);
    result(null, res);
  });
};

Organisme.getAllUnactive = result => {
  sql.query("SELECT * FROM usd_organisme WHERE isactive = 0", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("organismes: ", res);
    result(null, res);
  });
};

Organisme.getAllEnabled = result => {
  sql.query("SELECT * FROM usd_organisme WHERE isenable = 1", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("organismes: ", res);
    result(null, res);
  });
};

module.exports= Organisme
