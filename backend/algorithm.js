/** 
 ** title: the correct performance problem
 ** problem: to get the performanceId, the startTime and the endTime of the performance that is related to the festivalId when inputted
 ** in the process, check if the performances clash with one another or not, if it does rearrange, and if not possible, drop it.
**/

const database = require("./database");

// catch error here
async function compute (festivalId) {
    try{return { error: null, result: await sortPerformanceByFinishTime(festivalId)}} 
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

// // 3. selectedPerformances to maintain a list of selected performance
// const selectedPerformances = [];

// // 4. iteratePerformance to iterate through each of the sorted performance
// for (...) {
//     const performance = sortedSelectedPerformance[i];
//     if (doesNotClash(selectedPerformance, performance)) {
//         // 4a add
//         selectedPerformances.push(performance);
//     }

// export modules
module.exports = {
    compute
}