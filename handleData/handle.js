import { Op } from "sequelize";

import initModels from "../models/init-models.js";
import database from "../config/database.js";

const models = initModels(database);

let condition = {};
function handleSpecialCase(filteredElem) {
  if (filteredElem.match(/==/g, []) != null) {
    let getOperatorArray = filteredElem.split("==");
    let multiConArray = [];
    multiConArray = getOperatorArray[0].split("|");
    multiConArray[0] = multiConArray[0].substring(1);
    const multiArrLen = multiConArray.length;
    multiConArray[multiArrLen - 1] = multiConArray[multiArrLen - 1].slice(0,-1);
    handleOperatorSpecial( multiConArray[0],multiConArray[1],getOperatorArray[1], "==");
  } else if (filteredElem.match(/=/g, []) != null) {
    let getOperatorArray = filteredElem.split("=");
    let multiConArray = [];
    let operator = getOperatorArray[0].slice(-1) + "=";
    getOperatorArray[0] = getOperatorArray[0].slice(0, -1);
    multiConArray = getOperatorArray[0].split("|");
    multiConArray[0] = multiConArray[0].substring(1);
    const multiArrLen = multiConArray.length;
    multiConArray[multiArrLen - 1] = multiConArray[multiArrLen - 1].slice( 0,-1);
    console.log("Here from =");
    handleOperatorSpecial(multiConArray[0],multiConArray[1],getOperatorArray[1],operator );
  } else if (filteredElem.match(/>/g, []) != null) {
    let getOperatorArray = filteredElem.split(">");
    let multiConArray = [];
    multiConArray = getOperatorArray[0].split("|");
    multiConArray[0] = multiConArray[0].substring(1);
    const multiArrLen = multiConArray.length;
    multiConArray[multiArrLen - 1] = multiConArray[multiArrLen - 1].slice( 0,-1);
    handleOperatorSpecial(multiConArray[0],multiConArray[1],getOperatorArray[1],">");
  } else {
    let getOperatorArray = filteredElem.split("<");
    let multiConArray = [];
    multiConArray = getOperatorArray[0].split("|");
    multiConArray[0] = multiConArray[0].substring(1);
    const multiArrLen = multiConArray.length;
    multiConArray[multiArrLen - 1] = multiConArray[multiArrLen - 1].slice( 0,-1);
  handleOperatorSpecial( multiConArray[0],multiConArray[1], getOperatorArray[1],"<");
  }
}

function handleNormalCase(filteredElem) {
  if (filteredElem.match(/=/g, []).length == 2) {
    let getOperatorArray = filteredElem.split("==");
    handleOperator(getOperatorArray[0], getOperatorArray[1], "==");
  } else {
    let getOperatorArray = filteredElem.split("=");
    let operator = getOperatorArray[0].slice(-1) + "=";
    getOperatorArray[0] = getOperatorArray[0].slice(0, -1);

    handleOperator(getOperatorArray[0], getOperatorArray[1], operator);
    console.log(getOperatorArray);
  }
}
function handleFilter(filter) {
    let condition = {};
  let filterSplit = [];
  if (filter.match(/,/g, []) != null) {
    filterSplit = filter.split(",");
    for (let x = 0; x < filterSplit.length; x++) {
      if (filterSplit[x].indexOf(")") != -1) {
        handleSpecialCase(condition,filterSplit[x]);
      } else if (filterSplit[x].match(/=/g, []) != null) {
        handleNormalCase(filterSplit[x]);
      } else if (filterSplit[x].match(/>/g, []) != null) {
        let getOperatorArray = filterSplit[x].split(">");
        handleOperator(getOperatorArray[0], getOperatorArray[1], ">");
      } else {
        let getOperatorArray = filterSplit[x].split("<");
        handleOperator(getOperatorArray[0], getOperatorArray[1], "<");
      }
    }
  } else {
    filterSplit = filter;
    if (filterSplit.indexOf(")") != -1) {
      handleSpecialCase(filterSplit);
    } else if (filterSplit.match(/=/g, []) != null) {
      handleNormalCase(filterSplit);
    } else if (filterSplit.match(/>/g, []) != null) {
      let getOperatorArray = filterSplit.split(">");
      handleOperator(getOperatorArray[0], getOperatorArray[1], ">");
    } else {
      let getOperatorArray = filterSplit.split("<");
      handleOperator(getOperatorArray[0], getOperatorArray[1], "<");
    }
    
  
  }
  
  
}

function handleOperator(ar1, ar2, operator) {
  switch (operator) {
    case "@=":
      if(ar2<'A'||ar2>'z'){
        //console.log("Normal");
        condition[ar1] = {[Op.substring]: ar2};
      }
      else if(ar2 === ar2.toLowerCase())
      //[Op.substring]: ar2
      {
      //  console.log("LowerCase");
        condition[ar1] = { [Op.or]:{[Op.substring]: ar2,[Op.substring]: ar2.toUpperCase()} };
      }
      else if (ar2 === ar2.toUpperCase()) {
       // console.log("UpperCase");
        condition[ar1] = { [Op.or]:{[Op.substring]: ar2,[Op.substring]: ar2.toLowerCase()} };
      }

      break;
    case "!=":
      condition[ar1] = { [Op.ne]: ar2 };
      break;
    case ">=":
      condition[ar1] = { [Op.gte]: ar2 };
      break;
    case "<=":
      condition[ar1] = { [Op.lte]: ar2 };
      break;
    case "_=":
      condition[ar1] = { [Op.startsWith]: ar2 };
      break;
    case "==":
      condition[ar1] = { [Op.eq]: ar2 };
      break;
    case ">":
      condition[ar1] = { [Op.gt]: ar2 };
      break;
    case "<":
      condition[ar1] = { [Op.lt]: ar2 };
      break;
  }
}

function handleOperatorSpecial(ar1, ar2, arResult, operator) {
  switch (operator) {
    case "@=":
      if(arResult<'A'||arResult>'z'){
        
        condition[Op.or] = [
          {
            [ar1]: {
              [Op.substring]: arResult,
            },
          },
          { [ar2]: 
            { [Op.substring]: arResult }
           },
        ];
      }
      else if(arResult === arResult.toLowerCase())  
      {
        console.log("LowerCase");
      condition[Op.or] = [
        {
          //[Op.substring]: arResult,
         // [Op.substring]: arResult.toUpperCase()
          [ar1]: {
            [Op.or]:[{[Op.substring]: arResult},{[Op.substring]: arResult.toUpperCase()}]
          },
        },
        { [ar2]: 
          { 
            [Op.or]:[{[Op.substring]: arResult},{[Op.substring]: arResult.toUpperCase()}]
           }
         },
      ];
      }
      else if (arResult === arResult.toUpperCase()) {
        console.log("UpperCase");
       condition[Op.or] = [
        {
          [ar1]: {
            [Op.or]:[{[Op.substring]: arResult},{[Op.substring]: arResult.toLowerCase()}]
          },
        },
        { [ar2]: 
          { 
            [Op.or]:[{[Op.substring]: arResult},{[Op.substring]: arResult.toLowerCase()}]
           }
         },
      ];
      }
      break;
    case "!=":
      condition[Op.or] = [
        {
          [ar1]: {
            [Op.ne]: arResult,
          },
        },
        { [ar2]: { [Op.ne]: arResult } },
      ];
      break;
    case ">=":
      condition[Op.or] = [
        {
          [ar1]: {
            [Op.gte]: arResult,
          },
        },
        { [ar2]: { [Op.gte]: arResult } },
      ];
      break;

    case "<=":
      condition[Op.or] = [
        {
          [ar1]: {
            [Op.lte]: arResult,
          },
        },
        { [ar2]: { [Op.lte]: arResult } },
      ];
      break;
    case "_=":
      condition[Op.or] = [
        {
          [ar1]: {
            [Op.startsWith]: arResult,
          },
        },
        { [ar2]: { [Op.startsWith]: arResult } },
      ];
      break;

    case "==":
      condition[Op.or] = [
        {
          [ar1]: {
            [Op.eq]: arResult,
          },
        },
        { [ar2]: { [Op.eq]: arResult } },
      ];
      break;
    case ">":
      condition[Op.or] = [
        {
          [ar1]: {
            [Op.gt]: arResult,
          },
        },
        { [ar2]: { [Op.gt]: arResult } },
      ];
      break;
    case "<":
      condition[Op.or] = [
        {
          [ar1]: {
            [Op.lt]: arResult,
          },
        },
        { [ar2]: { [Op.lt]: arResult } },
      ];
      break;
  }
}

export default {
  handleFilter(filter) {
    let filterSplit = [];
    if (filter.match(/,/g, []) != null) {
      filterSplit = filter.split(",");
      for (let x = 0; x < filterSplit.length; x++) {
        if (filterSplit[x].indexOf(")") != -1) {
          handleSpecialCase(filterSplit[x]);
        } else if (filterSplit[x].match(/=/g, []) != null) {
          handleNormalCase(filterSplit[x]);
        } else if (filterSplit[x].match(/>/g, []) != null) {
          let getOperatorArray = filterSplit[x].split(">");
          handleOperator(getOperatorArray[0], getOperatorArray[1], ">");
        } else {
          let getOperatorArray = filterSplit[x].split("<");
          handleOperator(getOperatorArray[0], getOperatorArray[1], "<");
        }
      }
    } else {
      filterSplit = filter;
      if (filterSplit.indexOf(")") != -1) {
        handleSpecialCase(filterSplit);
      } else if (filterSplit.match(/=/g, []) != null) {
        handleNormalCase(filterSplit);
      } else if (filterSplit.match(/>/g, []) != null) {
        let getOperatorArray = filterSplit.split(">");
        handleOperator(getOperatorArray[0], getOperatorArray[1], ">");
      } else {
        let getOperatorArray = filterSplit.split("<");
        handleOperator(getOperatorArray[0], getOperatorArray[1], "<");
      }
      
    }
    
  },
  condition
  
}

