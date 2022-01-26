const express = require('express')
const mysql = require('mysql')
const fs = require('fs');
const app = express()
const path = require("path");
const bodyParser = require('body-parser');
const csv = require("csvtojson")
const upload = require("express-fileupload");



app.use(upload());
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "vues"));
app.use(express.static(path.join(__dirname, "public")));

var db = mysql.createConnection({
  host : 'localhost',
  database : 'bddtsxcare',
  user : 'root',
  password : ''
})


app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/update", (req, res, next) => {
  res.render("update")
});


/*
Intégration du fichier envoyé via formulaire dans le répertoire /ext_data/deposit pour pouvoir le traiter
Chargement du fichier CSV à utiliser pour l'import dans la table ext_organisme
Traitement du fichier depuis le répertoire, puis déplacement du fichier dans :

      -> /ext_data/succes , si l'opération a bien fonctionnée
      -> /ext_data/echec , si une erreur est detectée 

(+ horodatage intégré au nom du fichier)

Mise à jour de la table usd_organisme depuis la table ext_organisme


*/
app.post("/loadFile", (req, res, next) => {
   
  var uploadedFile = req.files.file;
  var newpath  = `${__dirname}\\ext_data\\depot\\${uploadedFile.name}`
  try{uploadedFile.mv(newpath);}catch(error){throw error};
  
  res.render('confirmLoad', {'fileName' : uploadedFile.name});
 
});

app.get("/cancelImport", (req, res, next) => {
   
  
  fs.unlinkSync(`${__dirname}\\ext_data\\depot\\centrepayeur-export.csv`);
  
 res.render('index', {'cancel' : "Votre import a bien été annulé"});
 
});
app.post("/import", (req, res, next) => {
  var depositFiles = fs.readdirSync(__dirname + "\\ext_data\\depot");
  var depositFile = depositFiles[0];
  var laDate = new Date();
  var state;
  var fileDate = laDate.getFullYear() +"-"+ parseInt(laDate.getMonth()+1) + "-" + laDate.getDate() + "-" + laDate.getHours() + "h" + laDate.getMinutes() ;
  var filePath = path.join(__dirname, "/ext_data/depot/" + depositFile);
  var pathSuccess = path.join(__dirname, "/ext_data/succes/"+ fileDate + depositFile);
  var pathFailure = path.join(__dirname, "/ext_data/echec/"+ fileDate + depositFile);
    try{
    var json = JSON.parse(csvtojson(filePath)); 
    json.sort(function(el1,el2){
      return compare(el1, el2, '"libellé"')
    });
  }catch(error){
    state = false;
  }
    if(state != false){
    try{
  
    db.query("DELETE from ext_organisme WHERE ID >= 0", function(err, results){
      console.log(results);
    });
    
    db.query("ALTER TABLE ext_organisme auto_increment = 1", function(err, results){
      console.log(results);
    });
    
    json.forEach(e => {
      try{
        importExt(e, req.body.commentaire, function(err){
          if(err) throw err;
        })
      }
        catch(error){
          throw error;
        }

    });
    state = true;
}catch(error){
    console.error(error)
    state = false;
}
}

//Si l'opération est un succès alors nous lancons l'update de la table usd_organisme 
  if(state){
    fs.rename(filePath, pathSuccess, function(err){
      if (err) throw err;
    })
    try{
      updateUSD()
    }
    catch(error){
      console.error(error)
    }
  res.render('confirmUpdate');
  }else{
    fs.rename(filePath, pathFailure, function(err){
      if (err) throw err;
    })
    res.render('errUpdate');
  }
  
});
 

app.get("/showTable", (req, res, next) => {

 

  db.query("SELECT * FROM usd_organisme", function(err, rows, fields){

  res.render("organismes", {'organismes' : rows});

});
});


app.listen(3000, () => {     
  console.log("Serveur lancé (http://localhost:3000/) ! ")
});

//Fonction utilisée afin de trier un fichier json par ordre alphabétique selon la clé choisie
function compare(el1, el2, clé) {
  return el1[clé] == el2[clé] ? 0 : (el1[clé] < el2[clé] ? -1 : 1);
}

//Retourne un tableau format json,
// format obligatoire de CSV : 
//"clé1";"clé2";....
//"valeur1";"valeur2";...
//"valeur1";"valeur2";... etc
function csvtojson(path){
  let csv = fs.readFileSync(path, 'latin1')
 
// Convert the data to String and
// split it in an array
  var array = csv.toString().split("\r\n");
  let result = [];
 
// The array[0] contains all the
// header columns so we store them
// in headers array
let headers = array[0].split(";")
 
// Since headers are separated, we
// need to traverse remaining n-1 rows.
for (let i = 1; i < array.length - 1; i++) {
  let obj = {}
 
  // Create an empty object to later add
  // values of the current row to it
  // Declare string str as current array
  // value to change the delimiter and
  // store the generated string in a new
  // string s
  let str = array[i]
  let s = ''
 
  // By Default, we get the comma separated
  // values of a cell in quotes " " so we
  // use flag to keep track of quotes and
  // split the string accordingly
  // If we encounter opening quote (")
  // then we keep commas as it is otherwise
  // we replace them with pipe |
  // We keep adding the characters we
  // traverse to a String s
  let flag = 0
  for (let ch of str) {
    if (ch === '"' && flag === 0) {
      flag = 1
    }
    else if (ch === '"' && flag == 1) flag = 0
    if (ch === ';' && flag === 0) ch = '|'
    if (ch !== '"') s += ch
  }
 
  // Split the string using pipe delimiter |
  // and store the values in a properties array
  let properties = s.split("|")
 
  // For each header, if the value contains
  // multiple comma separated data, then we
  // store it in the form of array otherwise
  // directly the value is stored
  for (let j in headers) {
    if (properties[j].includes(";")) {
      obj[headers[j]] = properties[j]
        .split(";").map(item => item.trim())
    }
    else obj[headers[j]] = properties[j]
  }
 
  // Add the generated object to our
  // result array
  result.push(obj)
}
 
// Convert the resultant array to json and
// generate the JSON output file.
let json = JSON.stringify(result);
return json;
}

//Effectue l'insert dans la table ext_organisme en prenant en paramètre un objet json, un commentaire pour la version
function importExt(element, commentaire ){
  var laDate = new Date();
  var sqlDate = laDate.getFullYear() +"-"+ parseInt(laDate.getMonth()+1) + "-" + laDate.getDate() + " " + laDate.getHours() + "-" + laDate.getMinutes() + "-" + laDate.getSeconds();
  var columns = [`SOURCE_IMPORT`, `VERSION_IMPORT`, `DATE_IMPORT`, `REGIME_CODE`,
  `REGIME_DESCR`, `CAISSE_GESTIONNAIRE_CODE`, `CENTRE_GESTIONNAIRE_CODE`,
  `ORGANISME_LIBELLE`, `ORGANISME_DEST_CODE`, `CENTRE_INFO_CODE`, 
  `ADRESSE_1`, `ADRESSE_2`, `COMMUNE`, `CODE_POSTAL`, `CEDEX`, `TELEPHONE`, `FAX`];
  let     SOURCE_IMPORT = "centrepayeur-export.csv",
              VERSION_IMPORT = commentaire,
              DATE_IMPORT = sqlDate ,
              REGIME_CODE = element['"code régime"'] ,
              REGIME_DESCR = element['"régime"'] ,
              CAISSE_GESTIONNAIRE_CODE = element['"caisse gestionnaire"'] ,
              CENTRE_GESTIONNAIRE_CODE = element['"centre gestionnaire"'] ,
              ORGANISME_LIBELLE = element['"libellé"'] ,
              ORGANISME_DEST_CODE = element['"organisme destinataire"'] ,
              CENTRE_INFO_CODE = element['"code centre informatique"'] ,
              ADRESSE_1 = element['"adresse 1"'] ,
              ADRESSE_2 = element['"adresse 2"'],
              COMMUNE = element['"commune"'],
              CODE_POSTAL = element['"code postal"'] ,
              CEDEX = element['"cédex"'],
              TELEPHONE = element['"téléphone"'] ,
              FAX = element['"fax"'] ;

              var insertStatement = 
            'INSERT INTO ext_organisme (' + columns + ') VALUES (';
          
          insertStatement +='" ' +
                    SOURCE_IMPORT + '" , "' + VERSION_IMPORT + '" , "' + DATE_IMPORT + '" , "' + parseInt(REGIME_CODE) + '" , "' + REGIME_DESCR + '" , "' +
                    parseInt(CAISSE_GESTIONNAIRE_CODE) + '" , "' + CENTRE_GESTIONNAIRE_CODE + '" , "' + ORGANISME_LIBELLE + '" , "' + parseInt(ORGANISME_DEST_CODE) + '" , "' + CENTRE_INFO_CODE 
                    + '" , "' + ADRESSE_1 + '" , "' + ADRESSE_2 + '" , "' + COMMUNE + '" , "' + CODE_POSTAL + '" , "' + CEDEX + '" , "' + TELEPHONE + '" , "' + FAX + '")';
                  
                    db.query(insertStatement,(err, results, fields) => {
                      if(err) throw err;
                      console.log(results)
                    });
                    
}

function updateUSD(){
  // Pour chaque enregistrement dans la table ext_organisme, nous vérifions s'il existe dans la table usd_organisme
// S'il existe, nous mettons à jour les champs de l'enregistrement dans la table usd_organisme
// S'il n'existe pas, nous le créons
db.query("SELECT * FROM ext_organisme " ,(err, rows, fields)=> {
  if(err) throw err;
  rows.forEach(row => {
         
    db.query("SELECT * FROM usd_organisme WHERE REGIME_CODE = '" + row["REGIME_CODE"] +"' AND ORGANISME_DEST_CODE = '" + row["ORGANISME_DEST_CODE"] + "' AND CENTRE_GESTIONNAIRE_CODE = '" + row["CENTRE_GESTIONNAIRE_CODE"] + "'" ,(err, usd, fields)=> {
      if(err) throw err;
      var laDate = new Date();
      var date = laDate.getFullYear() +"-"+ parseInt(laDate.getMonth()+1) + "-" + laDate.getDate() + " " + laDate.getHours() + "-" + laDate.getMinutes() + "-" + laDate.getSeconds();
      
      if(usd[0] != null && row["REGIME_CODE"] != null && row["ORGANISME_DEST_CODE"] != null){
          
        //UPDATE des données de l'enregistrement dans la table usd_organisme
        let queryUpdateUsdExists = "UPDATE `usd_organisme` SET `CAISSE_GESTIONNAIRE_CODE` = '" + row["CAISSE_GESTIONNAIRE_CODE"] + "', " + 
                                   "`ORGANISME_LIBELLE` = '" + row["ORGANISME_LIBELLE"] + "', " + 
                                   "`CENTRE_INFO_CODE` = '" + row["CENTRE_INFO_CODE"] + "', " + 
                                   "`ISENABLE` = '" + 1 + "', " +
                                   "`ISACTIVE` = '" + 1 + "', ";
       if( row["ORGANISME_LIBELLE"] == "Version de la table") {queryUpdateUsdExists += "`REGIME_CODE` = '" + row["REGIME_CODE"] + "', ";}
            
       queryUpdateUsdExists += "`UPDATEDDATE` = '" + date + "' WHERE `REGIME_CODE` = '" + row["REGIME_CODE"] +"'" +
                                   "AND `ORGANISME_DEST_CODE` = '" + row["ORGANISME_DEST_CODE"] + "'" + 
                                   "AND `CENTRE_GESTIONNAIRE_CODE` = '" + row["CENTRE_GESTIONNAIRE_CODE"] + "'";

            
            
          db.query(queryUpdateUsdExists ,(err, results, fields)=> {
            if(err) throw err; 
          });  
      }
        else if(usd[0] != null && row["REGIME_CODE"] == null || row["ORGANISME_DEST_CODE"] == null){
          
            //UPDATE des données de l'enregistrement dans la table usd_organisme
            let queryUpdateUsdExists = "UPDATE `usd_organisme` SET `CAISSE_GESTIONNAIRE_CODE` = '" + row["CAISSE_GESTIONNAIRE_CODE"] + "', " + 
                                       "`ORGANISME_LIBELLE` = '" + row["ORGANISME_LIBELLE"] + "', " + 
                                       "`CENTRE_INFO_CODE` = '" + row["CENTRE_INFO_CODE"] + "', " + 
                                       "`ISENABLE` = '" + 0 + "', " +
                                       "`ISACTIVE` = '" + 0 + "', ";
           if( row["ORGANISME_LIBELLE"] == "Version de la table") {queryUpdateUsdExists += "`REGIME_CODE` = '" + row["REGIME_CODE"] + "', ";}
                
           queryUpdateUsdExists += "`UPDATEDDATE` = '" + date + "' WHERE `REGIME_CODE` = '" + row["REGIME_CODE"] +"'" +
                                       "AND `ORGANISME_DEST_CODE` = '" + row["ORGANISME_DEST_CODE"] + "'" + 
                                       "AND `CENTRE_GESTIONNAIRE_CODE` = '" + row["CENTRE_GESTIONNAIRE_CODE"] + "'";
    
                
                
              db.query(queryUpdateUsdExists ,(err, results, fields)=> {
                if(err) throw err; 
              });  
          }
        else{
          
          //INSERT de l'enregistrement dans la table usd_organisme
          var COLUMNS_USD = [`ID_WRK_ADRESSE`, `ID_TS_TYPE_ORGANISME`, `REGIME_CODE`, `CAISSE_GESTIONNAIRE_CODE`,
                            `CENTRE_GESTIONNAIRE_CODE`, `ORGANISME_LIBELLE`, `ORGANISME_DEST_CODE`, 
                            `CENTRE_INFO_CODE`, `CREATEDDATE`, `ISACTIVE`, `ISENABLE`];
          
          
          var VALUES = [`1`, `91`, "'" + row["REGIME_CODE"] + "'", "'" + row["CAISSE_GESTIONNAIRE_CODE"] + "'" , 
                        "'" + row["CENTRE_GESTIONNAIRE_CODE"] + "'", "'" + row["ORGANISME_LIBELLE"] + "'", 
                        "'" + row["ORGANISME_DEST_CODE"] + "'" , "'" + row["CENTRE_INFO_CODE"]+"'", "'" + date + "'",
                        "'" + 1 + "'",  "'" + 1 + "'"];
          queryInsertUsd = 'INSERT INTO `usd_organisme` (' + COLUMNS_USD + ') VALUES (' + VALUES + ')';
          
            
          db.query(queryInsertUsd ,(err, results, fields)=> {
            if(err) throw err;
            
          });
          
        }

    });

  });

  });


// Pour chaque enregistrement dans la table usd_organisme, nous vérifions s'il existe dans la table ext_organisme
// Si ce n'est pas le cas nous passons les colonnes "ISACTIVE" et "ISENABLE" a 0 et changeons la date de "UPDATEDDATE"
  db.query("SELECT * FROM usd_organisme " ,(err, rows, fields)=> {
  if(err) throw err;
  rows.forEach(row => {
    
    db.query("SELECT * FROM ext_organisme WHERE REGIME_CODE = '" + row["REGIME_CODE"] +"' AND ORGANISME_DEST_CODE = '" + row["ORGANISME_DEST_CODE"] + "' AND CENTRE_GESTIONNAIRE_CODE = '" + row["CENTRE_GESTIONNAIRE_CODE"] + "'" ,(err, ext, fields)=> {
      if(err) throw err;
      if(typeof ext[0] == "undefined"){
        
       var laDate = new Date();
       var date = laDate.getFullYear() +"-"+ parseInt(laDate.getMonth()+1) + "-" + laDate.getDate() + " " + laDate.getHours() + "-" + laDate.getMinutes() + "-" + laDate.getSeconds();
       let queryUpdateUsdNoExists = "UPDATE `usd_organisme` SET `ISACTIVE` = '" + 0 + "', " + 
                            "`ISENABLE` = '" + 0 + "', " + 
                            "`UPDATEDDATE` = '" + date + "' WHERE `ID` = '" + row["ID"] + "'";
       
        
        db.query(queryUpdateUsdNoExists ,(err, results, fields)=> {
          if(err) throw err; 
        });
      } 
     
     
    });

  });

  });
}
