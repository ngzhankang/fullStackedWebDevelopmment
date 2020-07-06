/** 
 ** title: the correct performance problem
 ** problem: to get the performanceId, the startTime and the endTime of the performance that is related to the festivalId when inputted
 ** in the process, check if the performances clash with one another or not, if it does rearrange, and if not possible, drop it.
**/

// require the necessary files
const database = require("./database");

// catch error here, else send result out
async function compute(festivalId) {
    try { return { result: await generateAllWays(festivalId) } }
    catch (error) { return { error, result: null }; }
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
    const furtherFilter = filteredPerformance.sort((a, b) => parseInt(a.endtime) - parseInt(b.endtime))  //sort the performances based on their finishing time and assign them to furtherFilter
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
    const newArray = performance.map(obj => mapOut(obj, ["festivalid",]))  //push the filteredarray to remove the festvialid
    return newArray;
};

// 4. iteratePerformance to iterate through each of the sorted performance
async function iteratePerformance(festivalId) {
    const performance = await maintainSortedPerformance(festivalId);
    const finalPerformances = []    //create a new list to push correct performances into it later
    finalPerformances.push(performance[0])  //push the 1st object into the array first

    for (i = 1; i < performance.length; i++) {  //do a for and a if loop to get those performances not clashed into the new list
        if (((performance[i]).starttime - (performance[i - 1].endtime)) < 0) {
            console.log('Nope!')
        }
        else if (((performance[i]).starttime - (performance[i - 1].endtime)) === 0) {
            finalPerformances.push(performance[i]);
        }
        else if (((performance[i]).starttime - (performance[i - 1].endtime)) > 0) {
            finalPerformances.push(performance[i]);
        }
    }
    const newerArray = new Array(finalPerformances)  //wrap the entire thing in a list
    return newerArray;
}

// 5. generateAllWays to generate all possible ways to select the performances(BRUTE FORCE)
async function generateAllWays(festivalId) {
    const performance = await maintainSortedPerformance(festivalId);  //do a await to get result from previous function
    var possibleCombinations = []   //declare a empty array to store the possible combinations later

    function* subsets(array, offset = 0) {  //calculate total number of possibilities
        while (offset < array.length) {
            let first = array[offset++];
            for (let subset of subsets(array, offset)) {
                subset.push(first);
                yield subset;
            }
        }
        yield [];
    }

    for (let subset of subsets(performance)) {  //throw the data into the function
        possibleCombinations.push(subset);
    }
    return possibleCombinations;
}

// 6. eliminateInvalid to get rid of invalid options(BRUTE FORCE)
async function eliminateInvalid(festivalId) {
    const possibilities = await generateAllWays(festivalId);  //do a await to get result from previous function


}

// // 7. getMostPerformance to get the subset with the most number of performances(BRUTE FORCE)
// async function getMostPerformance(festivalId) {
//     // do sth here
// }

// export modules
module.exports = {
    compute
}