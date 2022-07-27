const connection = require('../utils/db');

//Function to find elements from specific table on DB by Id
const findElementById = ( id , table ) => {
    
  return new Promise((resolve, reject) => {

      connection.query(

          `SELECT * FROM ${table} WHERE Id = ${id};`, (err,result) => {
  
              if (!err) {
                                      
                  resolve(result);
              
              } else {
              
                  console.log(`Ha ocurrido el siguiente ${err}`)
                  
                  reject(err);
              
              }
          }
      )     
  })
}

//Function to find specific users by Email
const findUserByEmail = ( email ) => {
  
  return new Promise( ( resolve , reject ) => {

      connection.query(

          `SELECT * FROM usuarios WHERE Email = '${email}';`, ( err , result ) => {
  
              if (!err) {
                                      
                  return resolve(result);
              
              } else {
              
                  console.log(`Ha ocurrido el siguiente ${err}`)
                  
                  return reject(err);
              
              }
          }
      )     
  })
}

//Function to find specific machine by all specs
const findMachineBySpecs = ( specs ) => {

  return new Promise( ( resolve , reject ) => {

      connection.query(

          `SELECT Id FROM equipos WHERE Numero = '${specs.number}' AND Referencia = '${specs.reference}' AND marca = '${specs.trademark}' AND cliente = '${specs.clients}';`, (err,result) => {
              
              if (!err) {
                  
                  return resolve(result);

              } else {
                  
                  console.log(`Ha ocurrido el siguiente ${err}`);
                  
                  return reject(err);
              };          
          }
      );    
         
  })
}

//Function to find specific client by name
const findClientByName = ( name ) => {
  
  return new Promise( ( resolve , reject ) => {

      connection.query(

          `SELECT * FROM clients WHERE Compania = '${name}';`, ( err , result ) => {
  
              if (!err) {
                                      
                  return resolve(result);
              
              } else {
              
                  console.log(`Ha ocurrido el siguiente ${err}`)
                  
                  return reject(err);
              
              }
          }
      )     
  })
}

//Function to find specific certificate by cc
const findCertificateByCc = ( cc ) => {
    
  return new Promise( ( resolve , reject ) => {

      connection.query(

          `SELECT * FROM certificates WHERE Cc = '${cc}';`, ( err , result ) => {
  
              if (!err) {
                                      
                  return resolve(result);
              
              } else {
              
                  console.log(`Ha ocurrido el siguiente ${err}`)
                  
                  return reject(err);
              
              }
          }
      )     
  })
}

//Function to find elements from extinguishers table on DB by Id
const findExtinguisherById = ( id , req ) => {
    
  return new Promise((resolve, reject) => {

      connection.query(

          `SELECT * FROM extintores WHERE Id_Extinguisher = ${id};`, (err,result) => {
  
              if (!err) {
                                      
                  resolve(result);
              
              } else {
              
                  console.log(`Ha ocurrido el siguiente ${err}`)
                  
                  reject(err);
              
              }
          }
      )     
  })
}

//Function to find specific Agent by id
const findAgentById = ( id ) => {
  
    return new Promise( ( resolve , reject ) => {
  
        connection.query(
  
            `SELECT * FROM agents WHERE Id_Agent = '${id}';`, ( err , result ) => {
    
                if (!err) {
                                        
                    return resolve(result);
                
                } else {
                
                    console.log(`Ha ocurrido el siguiente ${err}`)
                    
                    return reject(err);
                
                }
            }
        )     
    })
  }

module.exports = {
  findElementById,
  findUserByEmail,
  findMachineBySpecs,
  findClientByName,
  findCertificateByCc,
  findExtinguisherById,
  findAgentById,
}