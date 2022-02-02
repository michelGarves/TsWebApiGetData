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
      result(err, null);
      return;
    }

    if (res.length) {
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
      result(err, null);
    }
    if(res.length == 0){
      if(libelle){
        result({kind: "no_such_libelle"}, null)
        return;
      }
      result({kind: "no_results"})
      return;
    }


    result(null, res);
  });
};

Organisme.getAllEnabled = result => {
  sql.query("SELECT * FROM usd_organisme WHERE isenable = 1", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if(res.length == 0){
      result({kind: "no_result"})
    }
    result(null, res);
  });
};

Organisme.getAllDisabled = result => {
  sql.query("SELECT * FROM usd_organisme WHERE isenable = 0", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if(res.length == 0){
      result({kind: "no_result"})
      return;
    }
    result(null, res);
    return;
  });
};

Organisme.getAllActive = result => {
  sql.query("SELECT * FROM usd_organisme WHERE isactive = 1", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if(res.length == 0){
      result({kind: "no_result"})
      return
    }
    result(null, res);
    return;
  });
};

Organisme.getAllUnactive = result => {
  sql.query("SELECT * FROM usd_organisme WHERE isactive = 0", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if(res.length == 0){
      result({kind: "no_result"}, null)
      return;
    }
    result(null, res);
    return;
  });
};

Organisme.getAllEnabled = result => {
  sql.query("SELECT * FROM usd_organisme WHERE isenable = 1", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if(res.length == 0){
      result({kind: "no_result"})
      return;
    }
    result(null, res);
    return
  });
};

Organisme.getAllCaisse = function(codeCaisse, result){

    sql.query(`SELECT * FROM usd_organisme WHERE CAISSE_GESTIONNAIRE_CODE = ${codeCaisse}`, (err, res) =>{
      if(err){
        result({kind: "err_caisse"}, null);
        return;
      }
      if(res.length == 0){
        result({kind: "no_caisse"}, null);
        return;
      }
      result(null, res);
      return;
    })
  
}

Organisme.getCreatedBefore = function(year, result){

  if(!year){
    sql.query("SELECT * FROM usd_organisme", (err, result) => {
      if(err){
        result({kind: "err_get"}, null);
        return;
      }
      else{
        result(null, result);
        return;
      }
    })
  }else{
    sql.query(`SELECT * FROM usd_organisme WHERE YEAR(CREATEDDATE)<${year}`, (err, res) => {

      if(err){
        result({kind: "err_date"}, null);
        return
      }else{

        if(res.length == 0){
          result({kind: "no_result"}, null);
          return;
        }else{
          result(null, res);
          return;
        }

      }

    })
  }

}

Organisme.getCreatedAfter = function(year, result){

  if(!year){
    sql.query("SELECT * FROM usd_organisme", (err, result) => {
      if(err){
        result({kind: "err_get"}, null);
        return;
      }
      else{
        result(null, result);
        return;
      }
    })
  }else{
    sql.query(`SELECT * FROM usd_organisme WHERE YEAR(CREATEDDATE)>${year}`, (err, res) => {

      if(err){
        result({kind: "err_date"}, null);
        return
      }else{

        if(res.length == 0){
          result({kind: "no_result"}, null);
          return;
        }else{
          result(null, res);
          return;
        }

      }

    })
  }

}

Organisme.getUpdatedBefore = function(year, result){

  if(!year){
    sql.query("SELECT * FROM usd_organisme", (err, result) => {
      if(err){
        result({kind: "err_get"}, null);
        return;
      }
      else{
        result(null, result);
        return;
      }
    })
  }else{
    sql.query(`SELECT * FROM usd_organisme WHERE YEAR(UPDATEDDATE)<${year}`, (err, res) => {

      if(err){
        result({kind: "err_date"}, null);
        return
      }else{

        if(res.length == 0){
          result({kind: "no_result"}, null);
          return;
        }else{
          result(null, res);
          return;
        }

      }

    })
  }

}

Organisme.getUpdatedAfter = function(year, result){

  if(!year){
    sql.query("SELECT * FROM usd_organisme", (err, result) => {
      if(err){
        result({kind: "err_get"}, null);
        return;
      }
      else{
        result(null, result);
        return
      }
    })
  }else{
    sql.query(`SELECT * FROM usd_organisme WHERE YEAR(UPDATEDDATE)>${year}`, (err, res) => {

      if(err){
        result({kind: "err_date"}, null);
        return
      }else{

        if(res.length == 0){
          result({kind: "no_result"}, null);
          return;
        }else{
          result(null, res);
          return;
        }

      }

    })
  }

}



module.exports= Organisme
