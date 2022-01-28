const sql = require("./db.js");

// constructor
const ExtTable = function(extTable) {
    this.nom_table  = extTable.nomTable;
};

ExtTable.truncate = function (nomTable, result) {
    
    sql.query(`DELETE FROM ${nomTable}`, (err, delRes) => {
      if (err) {
        result({ kind: "table_name_error" }, null);
        return;
      }
      if(delRes.affectedRows != 0 ){
      sql.query(`ALTER TABLE ${nomTable} auto_increment = 1`, err,res => {
        console.log(`deleted ${delRes.affectedRows} ` + `rows`);
        result(null, res);
        return;
      });
    }else{ 
      result({kind: "empty_table"}, null); 
      return; 
    }
     
    });
  };

module.exports = ExtTable