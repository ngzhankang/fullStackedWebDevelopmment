/** 
 ** title: the correct performance problem
 ** problem: to get the performanceId, the startTime and the endTime of the performance that is related to the festivalId when inputted
 ** in the process, check if the performances clash with one another or not, if it does rearrange, and if not possible, drop it.
**/

// require the necessary files
const database = require("./database");

// catch error here, else send result out(BASIC)
async function compute(festivalId) {
    try { return { result: await iteratePerformance(festivalId) } }
    catch (error) { return { error, result: null }; }
}

// catch error here, else send result out(ADVANCE)
async function computeAdvance(festivalId) {
    try { return { result: await gedRidClashes(festivalId) } }
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

// 5. selectPopularityByFestivalId to correctly select set of performance for computation (ADVANCE)
async function selectPopularityByFestivalId(festivalId) {
    const performances = await database.getPopularityByFestivalId(festivalId)
    const l = performances.length;  //length of performances
    const selectedPerformance = []; //create a new array selectedPerformance
    for (let i = 0; i < l; i++) {   //iterate through all the festivalId
        selectedPerformance.push(performances[i]);  //push filtered performance into the array
    };
    return selectedPerformance; //return the array
};

// 6. sortPopularityByFinishTime to sort performance by increasing order of their finishing time(ADVANCE)
async function sortPopularityByFinishTime(festivalId) {
    const filteredPerformance = await selectPopularityByFestivalId(festivalId);  //do a await to get result from previous function
    const furtherFilter = filteredPerformance.sort((a, b) => parseInt(a.endtime) - parseInt(b.endtime))  //sort the performances based on their finishing time and assign them to furtherFilter
    return furtherFilter;
};

// 7. remove key from objects to maintain the entire list (ADVANCE)
async function maintainSortedPopularity(festivalId) {
    const performance = await sortPopularityByFinishTime(festivalId);  //do a await to get result from previous function
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

// 8. generateAllWays to generate all possible ways to select the performances(ADVANCE)
async function generateAllWays(festivalId) {
    const performance = await maintainSortedPopularity(festivalId);  //do a await to get result from previous function
    const possibleCombinations = []   //declare a empty array to store the possible combinations later

    function* result(array, offset = 0) {  //calculate total number of possibilities
        while (offset < array.length) {
            let first = array[offset++];
            for (let subset of result(array, offset)) {
                subset.push(first);
                yield subset;
            }
        }
        yield [];
    }

    for (let subset of result(performance)) {  //throw the data into the function
        possibleCombinations.push(subset);
    }
    return possibleCombinations;
}

// 9a. getRidInvalids to remove null result
async function getRidInvalids(festivalId) {
    const result = await generateAllWays(festivalId)
    const newArray = [];
    for (h = 0; h < result.length; h++) {  //check if a subset is zero. if zero, discard
        if ((result[h]) === undefined || (result[h]) == 0) {
        }
        else {
            newArray.push(result[h])
        }
    }
    return newArray
};

// 9b. gedRidClashes to remove result with performance that clash
async function gedRidClashes(festivalId) {
    const result = await getRidInvalids(festivalId);    //all the possible subsets
    const finalresult = []    //create a new list to push correct result into it later
    const onlyOneObject = []    //create a new list to push those with only 1 object
    const manyObjects = []  //create a new list to push those with more than 1 object


    for (let i = 1; i < result.length; i++) { //loop thru the concated list in the big list
        if ((result[i]).length === 1) {
            onlyOneObject.push(result[i]);    // if size of inner list is 1 (1 object only) push to list
        }
        else if ((result[i].length > 1)) {
            manyObjects.push(result[i]);    // if size of inner list is more than 1, push to list
        }
    }

    for (let j = 1; j < manyObjects.length; j++) {  //loop thru list with inner lists including more than 1
        for (let k = 0; k < (manyObjects[j]).length; k++) { //loop thru inner list and accessing each object
            if ( ( ((manyObjects[j])[k]).starttime - ((manyObjects[j])[k+1]).endtime  < 0) || )
        }
    }

        // else {
        //     for (let j = 1; j < (result[i]).length; j++) {  //loop thru each concated list to access the objects
        //         if ((((result[i])[j]).starttime - (((result[i])[j - 1]).endtime)) < 0) {  //if 
        //             console.log('.')
        //         }
        //         else if ((((result[i])[j]).starttime - (((result[i])[j - 1]).endtime)) === 0) {
        //             finalresult.push(((result[i])[j]));
        //         }
        //         else if ((((result[i])[j]).starttime - (((result[i])[j - 1]).endtime)) > 0) {
        //             finalresult.push(((result[i])[j]));
        //         }
        //     }
        // }

    console.log(manyObjects)
    return manyObjects;
};

// // 6. eliminateInvalid to get rid of invalid options(BRUTE FORCE)
// async function eliminateInvalid(festivalId) {
//     const allPossibilities = await generateAllWays(festivalId);  //do a await to get result from previous function

//     // part1: remove results that has timing clash
//     const validPeformances = [] //create a new array to store the performance combinations that does not have clash at all
//     return (allPossibilities[0])
// }

// // 7. getMostPerformance to get the subset with the most number of performances(BRUTE FORCE)
// async function getMostPerformance(festivalId) {
//     // do sth here
// }

// export modules
module.exports = {
    compute,
    computeAdvance
}







// // 9b. onlyOnePerformance to get objects with only 1 performance and store it in a new array 
// async function onlyOnePerformance(festivalId) {
//     const data = await getRidInvalids(festivalId);
//     const onlyOne = [];
//     for (let i = 0; i < data.length; i++) {
//         if(data[i].length === 1) {
//             onlyOne.push(data[i])
//             data.splice(i, 1)
//         }
//     }
//     return onlyOne, data
// }

// // 9c. 

// // 9b. isPerformanceConflict to filter if the performance has clash
// async function isPerformanceConflict(performance1, performance2) {
//     if ((performance1.starttime - performance2.endtime) < 0) {  //if 
//         console.log('.')
//     }
//     else if ((performance1.starttime - performance2.endtime) === 0) {
//         finalresult.push(((result[i])[j]));
//     }
//     else if ((performance1.starttime - performance2.endtime) > 0) {
//         finalresult.push(((result[i])[j]));
//     }
// };

// // 9c. isSubsetConflict to do handler for isPerformanceConflict(takes in only 1 subset a time)
// async function isSubsetConflict(subset) {
//     for (let i = 0; i < subset.length; i++) {   //loop thru the subsets
//         if ((subset[i]).length === 1) {
//             return false;   //return false if there is only 1 object in the list
//         }
//     }
//     for (let j = 0; j < subset.length; j++) {   //determine if 2 performances conflict with one another
//         for (k = j; k < subset.length; k++) {
//             await isPerformanceConflict((subset[0]), (subset[1]))   //determine if 
//         }
//     }
//     return false;   //if no conflict return boolean false
// };

// // 9c. gedRidClashes to remove result with performance that clash
// async function gedRidClashes(festivalId) {
//     const result = await getRidInvalids(festivalId);
//     const finalresult = []    //create a new list to push correct result into it later

    

    

//     // for (let i = 1; i < result.length; i++) { //loop thru the concated list in the big list
//     //     if ((result[i]).length === 1) {
//     //         finalresult.push(result[i]);
//     //     }
//     //     else {
//     //         for (let j = 1; j < (result[i]).length; j++) {  //loop thru each concated list to access the objects
//     //             if ((((result[i])[j]).starttime - (((result[i])[j - 1]).endtime)) < 0) {  //if 
//     //                 console.log('.')
//     //             }
//     //             else if ((((result[i])[j]).starttime - (((result[i])[j - 1]).endtime)) === 0) {
//     //                 finalresult.push(((result[i])[j]));
//     //             }
//     //             else if ((((result[i])[j]).starttime - (((result[i])[j - 1]).endtime)) > 0) {
//     //                 finalresult.push(((result[i])[j]));
//     //             }
//     //         }
//     //     }
//     // }

//     // for (i = 0; i < subsets.length; i++) {
//     //     if isSubsetConflict(subset[i]) {

//     //     }
//     // }
//     //     if isSubsetConflict(subsets[i])
//     //         continue;
//     //     finalResult.push(subsets[i])

//     console.log(result.length)
//     return result;
// };