/**
 ** title: the correct performance problem
 ** problem: to get the performanceId, the startTime and the endTime of the performance that is related to the festivalId when inputted
 ** in the process, check if the performances clash with one another or not, if it does rearrange, and if not possible, drop it.
 **/

// require the necessary files
const database = require("./database");

// catch error here, else send result out(BASIC)
async function compute(festivalId) {
  try {
    const performance = await iteratePerformance(festivalId);
    if (performance.error) {
      return { error: performance.error };
    }
    return { result: performance.finalPerformances };
  } catch (error) {
    return { error, result: null };
  }
}

// catch error here, else send result out(ADVANCE)
async function computeAdvance(festivalId) {
  try {
    var selectedHighestPopularityObject = await selectHighestPopularity(festivalId)
    if (selectedHighestPopularityObject.error) {
      return { error: selectedHighestPopularityObject.error };
    }
    return { result: selectedHighestPopularityObject.bestSubset, totalPopularity: selectedHighestPopularityObject.bestPopularity };
  } catch (error) {
    return { error, result: null };
  }
}

// 1. selectPerformanceByFestivalId to correctly select set of performance for computation(BASIC)
async function selectPerformanceByFestivalId(festivalId) {
  const performances = await database.getPerformanceByFestivalId(festivalId);
  if (performances.error) {
    return performances;
  }
  const l = performances.rows.length; //length of performances 
  const selectedPerformance = []; //create a new array selectedPerformance
  for (let i = 0; i < l; i++) { //iterate through all the festivalId
    selectedPerformance.push(performances.rows[i]); //push filtered performance into the array
  }
  return { selectedPerformance }; //return the array

}

// 2. sortPerformanceByFinishTime to sort performance by increasing order of their finishing time(BASIC)
async function sortPerformanceByFinishTime(festivalId) {
  const filteredPerformance = await selectPerformanceByFestivalId(festivalId);  //do a await to get result from previous function
  if (filteredPerformance.error) {
    return filteredPerformance;
  }
  const furtherFilter = filteredPerformance.selectedPerformance.sort( //sort the performances based on their finishing time and assign them to furtherFilter
    (a, b) => parseInt(a.endtime) - parseInt(b.endtime)
  );
  return { furtherFilter };
}

// split this function out. Will be used later.
function mapOut(sourceObject, removeKeys = []) {  //create a function to remove festivalid key from all the arrays
  const sourceKeys = Object.keys(sourceObject);
  const returnKeys = sourceKeys.filter((k) => !removeKeys.includes(k));
  let returnObject = {};
  returnKeys.forEach((k) => {
    returnObject[k] = sourceObject[k];
  });
  return returnObject;
}

// 3. remove key from objects to maintain the entire list(BASIC)
async function maintainSortedPerformance(festivalId) {
  const performance = await sortPerformanceByFinishTime(festivalId);  //do a await to get result from previous function
  if (performance.error) {
    return performance;
  }
  const newArray = performance.furtherFilter.map((obj) => mapOut(obj, ["festivalid"])); //push the filteredarray to remove the festvialid
  return { newArray };
}

// 4. iteratePerformance to iterate through each of the sorted performance(BASIC)
async function iteratePerformance(festivalId) {
  const sortedPerformance = await maintainSortedPerformance(festivalId);
  if (sortedPerformance.error) {
    return sortedPerformance;
  }
  const performance = sortedPerformance.newArray
  const finalPerformances = []; //create a new list to push correct performances into it later
  finalPerformances.push(performance[0]); //push the 1st object into the array first
  for (i = 1; i < performance.length; i++) {  //do a for and a if loop to get those performances not clashed into the new list
    if (performance[i].startTime - performance[i - 1].endTime < 0) {
      console.log("Nope!");
    } else if (performance[i].startTime - performance[i - 1].endTime === 0) {
      finalPerformances.push(performance[i]);
    } else if (performance[i].startTime - performance[i - 1].endTime > 0) {
      finalPerformances.push(performance[i]);
    }
  }
  for (let count = 0; count < finalPerformances.length; count++) {  // to convert performanceId from string to int
    finalPerformances[count].performanceId = parseInt(finalPerformances[count].performanceId)
  }
  return { finalPerformances };
}

// 5. selectPopularityByFestivalId to correctly select set of performance for computation (ADVANCE)
async function selectPopularityByFestivalId(festivalId) {
  const performances = await database.getPopularityByFestivalId(festivalId);
  if (performances.error) {
    return performances;
  }
  const l = performances.rows.length; //length of performances
  const selectedPerformance = []; //create a new array selectedPerformance
  for (let i = 0; i < l; i++) { //iterate through all the festivalId
    selectedPerformance.push(performances.rows[i]); //push filtered performance into the array
  }
  return { selectedPerformance };
}

// 6. sortPopularityByFinishTime to sort performance by increasing order of their finishing time(ADVANCE)
async function sortPopularityByFinishTime(festivalId) {
  const filteredPerformance = await selectPopularityByFestivalId(festivalId); //do a await to get result from previous function
  if (filteredPerformance.error) {
    return filteredPerformance;
  }
  const furtherFilter = filteredPerformance.selectedPerformance.sort( //sort the performances based on their finishing time and assign them to furtherFilter
    (a, b) => parseInt(a.endtime) - parseInt(b.endtime)
  );
  return { furtherFilter };
}

// split this function out. Will be used later.
function mapOut(sourceObject, removeKeys = []) {  //create a function to remove festivalid key from all the arrays
  const sourceKeys = Object.keys(sourceObject);
  const returnKeys = sourceKeys.filter((k) => !removeKeys.includes(k));
  let returnObject = {};
  returnKeys.forEach((k) => {
    returnObject[k] = sourceObject[k];
  });
  return returnObject;
}

// 7. remove key from objects to maintain the entire list (ADVANCE)
async function maintainSortedPopularity(festivalId) {
  const performance = await sortPopularityByFinishTime(festivalId); //do a await to get result from previous function
  if (performance.error) {
    return performance;
  }
  const newArray = performance.furtherFilter.map((obj) => mapOut(obj, ["festivalid"])); //push the filteredarray to remove the festvialid
  return { newArray };
}

// 8. generateAllWays to generate all possible ways to select the performances(ADVANCE)
async function generateAllWays(festivalId) {
  const performance = await maintainSortedPopularity(festivalId); //do a await to get result from previous function
  if (performance.error) {
    return performance;
  }
  const possibleCombinations = []; //declare a empty array to store the possible combinations later

  function* result(array, offset = 0) { //calculate total number of possibilities
    while (offset < array.length) {
      let first = array[offset++];
      for (let subset of result(array, offset)) {
        subset.push(first);
        yield subset;
      }
    }
    yield [];
  }

  for (let subset of result(performance.newArray)) {  //throw the data into the function
    possibleCombinations.push(subset);
  }
  return { possibleCombinations };
}

// 9a. getRidInvalids to remove null result (ADVANCE)
async function getRidInvalids(festivalId) {
  const originResult = await generateAllWays(festivalId);
  if (originResult.error) {
    return originResult;
  }
  const result = originResult.possibleCombinations
  const newArray = [];
  for (h = 0; h < result.length; h++) { //check if a subset is zero. if zero, discard
    if (result[h] === undefined || result[h] == 0) {
    } else {
      newArray.push(result[h]);
    }
  }
  return { newArray };
}

// 9b. gedRidClashes to remove result with performance that clash (ADVANCE)
async function gedRidClashes(festivalId) {
  const originResult = await getRidInvalids(festivalId); //all the possible subsets
  // result is a array of subsets of the original array of performances
  // and all the entries are valid.
  if (originResult.error) {
    return originResult;
  }
  const result = originResult.newArray
  const finalresult = []; //create a new list to push subsets that have no clashes within itself into it later
  const manyObjects = []; //create a new list to push those with more than 1 object
  for (let i = 0; i < result.length; i++) { //loop thru the concatenated list in the big list
    if (result[i].length === 1) {
      finalresult.push(result[i]); // if size of inner list is 1 (1 object only) push to list
    } else if (result[i].length > 1) {
      manyObjects.push(result[i]); // if size of inner list is more than 1, push to list
    }
  }
  // Want to check if performances within a particular subset has conflicts.
  for (let j = 0; j < manyObjects.length; j++) {
    //for every subset.
    const currentSubset = manyObjects[j];
    let skip = false;
    for (let k = 0; k < currentSubset.length; k++) {
      // for every performance in the subset
      const currentPerformance = currentSubset[k];
      for (let l = k + 1; l < currentSubset.length; l++) {
        const performanceToCompareWith = currentSubset[l];
        if (
          (currentPerformance.startTime - performanceToCompareWith.endTime <=
            0 &&
            performanceToCompareWith.startTime - currentPerformance.startTime <=
            0) ||
          (performanceToCompareWith.startTime - currentPerformance.endTime <
            0 &&
            currentPerformance.startTime - performanceToCompareWith.startTime <=
            0)
        ) {
          skip = true;
          break;
        }
      }
      if (skip) break; //performances do not clash
    }
    //performances do not clash
    if (!skip) finalresult.push(currentSubset); //push it into finalresult
  }
  return { finalresult };
}

// 9c. selectHighestPopularity to retrieve all popularity score and select the subset that gives the highest score (ADVANCE)
async function selectHighestPopularity(festivalId) {
  const originResult = await gedRidClashes(festivalId); //all the good subsets
  if (originResult.error) {
    return originResult
  }
  const finalresult = originResult.finalresult;
  function functionCurrentPopularity(finalresult) {
    //create a inner function to get the respective scores
    const allTheScores = []; //create a list to store the respective scores

    for (let i = 0; i < finalresult.length; i++) {
      //do a for loop to detect if subset has 1 performance or more than 1 performance in the list
      //if subset has more than 1 performance
      const manyObjects = finalresult[i]; //declare manyObjects
      totalScore = 0;
      for (let j = 0; j < manyObjects.length; j++) {  // get the sum of popularity for manyObjects
        const currentList = manyObjects[j]; //to simplify the index of each list i am attending to
        totalScore += currentList.popularity;
      }
      const manyTotalScore = totalScore; //declare it as another const to call it later
      allTheScores.push(parseInt(manyTotalScore)); //push total popularity into allTheScores
    }
    return allTheScores;
  }

  let bestPopularity = 0; //initialize bestPopularity
  let bestSubset = []; //create an array to store the best subset
  const currentPopularity = functionCurrentPopularity(finalresult); //compute score for that subset[i]. should return popularity score for that subset
  for (let i = 0; i < finalresult.length; i++) {
    const currentSubset = finalresult[i]; //extract the 1st selected subset from finalresult
    const rightNowThePopularity = currentPopularity[i]; //extract the ith popularity score from currentPopularity
    if (rightNowThePopularity > bestPopularity) { //check if the currentPopularity is more than the highest popularity so far captured
      bestSubset = currentSubset; //update the current subset to the best subset
      bestPopularity = rightNowThePopularity; //update bestPopularity to the current best popularity score
    }
  }
  for (let count = 0; count < bestSubset.length; count++) { // to convert performanceId from string to int
    bestSubset[count].performanceId = parseInt(bestSubset[count].performanceId)
  }
  return { bestSubset, bestPopularity }
}

// export modules
module.exports = {
  compute,
  computeAdvance,
};
