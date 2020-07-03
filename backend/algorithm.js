/** 
 ** title: the correct performance problem
 *? problem: to get the performanceId, the startTime and the endTime of the performance that is related to the festivalId when inputted
 *? in the process, check if the performances clash with one another or not, if it does rearrange, and if not possible, drop it.
**/

// try to catch error here!
function compute (festivalIdTestInput,festivalId, performance) {
    try{
        return { error: null, result: selectPerformanceByFestivalId(festivalId, performance)}
    } catch (error) {
        return { error, result: null };
    }
}

/** 1. selectPerformance to correctly select set of performance for computation
 *! algorithm--> if performanceId belongs a specific festivalId, extract.
 *! selectedPerformance--> declare null array to store performanceId to be extracted.
 *! rawData--> [{ performanceId: 10digit, festivalId; 10digit, startTime: 4digit, endTime: 4digit }], get value of the id(or parseInt to id)
 *! l--> the length of the entire array
**/
function selectPerformanceByFestivalId(performance, festivalId, festivalIdInput) {
    const selectedPerformance = new Array(performance + 1).fill(null).map((_) => []);
    const rawData = performance.map(({ id }) => parseInt(id));
    // const l = performance.length;

    for (let i = 1; i < festivalId.length; i++) {   //iterate through all the festivalId
        if (festivalId[i] === festivalIdInput) {    //check if the festivalId input is equals to the festivalId tallied
            for (let u = 1; u < performance.length; u++) {
                performance[u].push(selectedPerformance);  //push the performance into the selectedPerformance array
            }
        }
    };
    return selectedPerformance; //return the array
};

// 2. sortPerformance to sort performance by increasing order of their finishing time
const sortedSelectedPerformance = async function sortPerformanceByFinishTime(endTime) {
    const performanceSelected = await selectedPerformance;  //do a await to take the data from the selectedPerformance
    const storeArray = []   //create a new array to reorder the stuff again
    for (i = 1; i < performance.length; i++) {
        if (performanceSelected.endTime[i] < performanceSelected.endTime[i + 1]) {
            storeArray.push(performanceSelected.endTime[i]);// store it into a new array
        };
    };
};

// 3. selectedPerformances to maintain a list of selected performance
const selectedPerformances = [];

// 4. iteratePerformance to iterate through each of the sorted performance
for (...) {
    const performance = sortedSelectedPerformance[i];
    if (doesNotClash(selectedPerformance, performance)) {
        // 4a add
        selectedPerformances.push(performance);
    }
}


// export modules
module.exports = {
    compute
}