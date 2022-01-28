var ExtTable = require("../models/Ext.model.js");


// Truncate the expected table
exports.truncateTable = (req, res) => {
    ExtTable.truncate(req.query.table, (err, data) => {
      if (err != null) {
        if (err.kind === "table_name_erro") {
          res.status(404).send({
            message: `Could not get a right table name`
          });
        } 
        else if (err.kind === "empty_table"){
          res.status(501).send({
            message: `The table is already empty`
          });
        }
        else {
          res.status(500).send({
            message: "Could not truncate table " + req.query.table
          });
        }
      } else res.send({message: `Table ${req.query.table} successfully truncated`});
    });
  };

