/** 
 ** title: the correct performance problem
 ** problem: to get the performanceId, the startTime and the endTime of the performance that is related to the festivalId when inputted
 ** in the process, check if the performances clash with one another or not, if it does rearrange, and if not possible, drop it.
**/

// require the necessary files
const database = require("./database");

// catch error here, else send result out
async function compute (festivalId) {
    try{return { result: await iteratePerformance(festivalId)}} 
    catch (error) {return { error, result: null };}
} 

// 1. selectPerformanceByFestivalId to correctly select set of performance for computation
async function selectPerformanceByFestivalId(festivalId) {
    const performances = await database.getPerformanceByFestivalId(festivalId)
    const l = performances.length;  //length of performances
    const selectedPerformance = []; //create a new array selectedPerformance
    for (let i = 0; i < l; i++) {   //iterate through all the festivalId
        selectedPerformance.push(performances[i]);  //push filtered performance into the array
    };
    return selectedPerformance; //return the array
};

// 2. sortPerformanceByFinishTime to sort performance by increasing order of their finishing time
async function sortPerformanceByFinishTime(festivalId) {
    const filteredPerformance = await selectPerformanceByFestivalId(festivalId);  //do a await to get result from previous function
    const furtherFilter = filteredPerformance.sort((a,b) => parseInt(a.endtime) - parseInt(b.endtime))  //sort the performances based on their finishing time and assign them to furtherFilter
    return furtherFilter;
};

// 3. remove key from objects to maintain the entire list
async function maintainSortedPerformance(festivalId) {
    const performance = await sortPerformanceByFinishTime(festivalId);  //do a await to get result from previous function
    function mapOut(sourceObject, removeKeys = []) {    //create a function to remove festivalid key from all the arrays
        const sourceKeys = Object.keys(sourceObject);
        const returnKeys = sourceKeys.filter(k => !removeKeys.includes(k));
        let returnObject = {};
        returnKeys.forEach(k => {
          returnObject[k] = sourceObject[k];
        });
        return returnObject;
      }
    const newArray = performance.map(obj => mapOut(obj, ["festivalid", ]))  //push the filteredarray to remove the festvialid
    const newerArray = new Array(newArray)  //wrap the entire thing in a list
    return newerArray;
};

// 4. iteratePerformance to iterate through each of the sorted performance
// for (...) {
//     const performance = sortedSelectedPerformance[i];
//     if (doesNotClash(selectedPerformance, performance)) {
//         // 4a add
//         selectedPerformances.push(performance);
//     }
async function iteratePerformance(festivalId) {
    const performance = await maintainSortedPerformance(festivalId);
    // const finalPerformances = []    //create a new list to push correct performances into it later
    
    // performance.sort(function(a,b) {
    //     return parseFloat(parseFloat(a.festivalId) - parseFloat(b.festivalId));
    // })
    console.log(performance)
    return performance;
}

// export modules
module.exports = {
    compute
}