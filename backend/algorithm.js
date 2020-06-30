function musicFestival(performanceId, festivalId, endTime) {
    // 1. selectPerformance to correctly select set of performance for computation
    const selectedPerformance =  function selectPerformanceByFestivalId(selectedPerformances,performanceId, festivalId) {
        for (i = 1; i < festivalId.length; i++) {   //do a for loop for festivals first to check performance against festvial
            for (n = 1; n < performanceId.length; n++) {    //do a for loop for performance
                if (performanceId[i].festival = festivalId) {    //add new performance into the array
                    selectedPerformances.push(performanceId[i]);    
                };
            };
        };
    };

    // 2. sortPerformance to sort performance by increasing order of their finishing time
    const sortedSelectedPerformance = async function sortPerformanceByFinishTime(endTime) {
        const performanceSelected = await selectedPerformance;  //do a await to take the data from the selectedPerformance
        const storeArray = []   //create a new array to reorder the stuff again
        for (i = 1; i < performance.length; i++) {
            if (performanceSelected.endTime[i] < performanceSelected.endTime[i+1]) {
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
}

// export modules
module.exports = {
    musicFestival
}