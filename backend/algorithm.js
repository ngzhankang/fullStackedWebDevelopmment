/** 
 ** title: the correct performance problem
 *? problem: to get the performanceId, the startTime and the endTime of the performance that is related to the festivalId when inputted
 *? in the process, check if the performances clash with one another or not, if it does rearrange, and if not possible, drop it.
**/

// try to catch error here!
function compute (allThePerformances) {
    try{
        return { error: null, result: selectPerformanceByFestivalId(allThePerformances)}
    } catch (error) {
        return { error, result: null };
    }
}

// 1. selectPerformance to correctly select set of performance for computation
function selectPerformanceByFestivalId(performances) {
    const l = performances.length;  //length of performances
    const selectedPerformance = []; //create a new array selectedPerformance
    for (let i = 0; i < l; i++) {   //iterate through all the festivalId
        selectedPerformance.push(performances[i]);  //push filtered performance into the array
    };
    return selectedPerformance; //return the array
};

// // 2. sortPerformance to sort performance by increasing order of their finishing time
// const sortedSelectedPerformance = async function sortPerformanceByFinishTime(endTime) {
//     const performanceSelected = await selectedPerformance;  //do a await to take the data from the selectedPerformance
//     const storeArray = []   //create a new array to reorder the stuff again
//     for (i = 1; i < performance.length; i++) {
//         if (performanceSelected.endTime[i] < performanceSelected.endTime[i + 1]) {
//             storeArray.push(performanceSelected.endTime[i]);// store it into a new array
//         };
//     };
// };

// // 3. selectedPerformances to maintain a list of selected performance
// const selectedPerformances = [];

// // 4. iteratePerformance to iterate through each of the sorted performance
// for (...) {
//     const performance = sortedSelectedPerformance[i];
//     if (doesNotClash(selectedPerformance, performance)) {
//         // 4a add
//         selectedPerformances.push(performance);
//     }
// }


// export modules
module.exports = {
    compute
}