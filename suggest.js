
class suggestionTool{
    constructor(fileName){
        let fs = require("fs");
        this.content = fs.readFileSync(fileName,'utf-8').toLowerCase();
    }

    cleanWords(){
        this.cleanContent = this.content
                                .split(/[\s,]+/)
                                .map((eachWord) => {return eachWord.replace(/[|&;?.!#$%@"/*:<>()+,]/g, ' ')})
                                .join(" ")
                                .split(/[\s,]+/);
        return this;
    }

    createSuggestions(searchWords){
        this.allSuggestions = [];
        this.suggestionPriority = {};

        let matchCounter = 0;
        searchWords = searchWords.toLowerCase().replace(/^\s+|\s+$|\s+(?=\s)/g, "").split(" ")
        if (searchWords.length > 3 || searchWords.length == 0) throw new Error("Invalid search words.");

        this.cleanContent.map((contentWord, i, array) => {
            if (contentWord == searchWords[matchCounter]) matchCounter++;
            else matchCounter = 0;

            if (matchCounter == searchWords.length && i + 1 < array.length) {
                matchCounter = 0;
                let suggestion = searchWords.join(" ");
                let nextContentWord = array[i + 1];
                suggestion += " " + nextContentWord;

                if (suggestion in this.suggestionPriority) this.suggestionPriority[suggestion]++;
                else {
                    this.allSuggestions.push(suggestion);
                    this.suggestionPriority[suggestion] = 1;
                }
            }
        });

        return this;
    }

    sortSuggestions(){
        this.sortedSuggestions = this.allSuggestions.sort((first, second) => {
            return this.suggestionPriority[second] - this.suggestionPriority[first];
        })
        return this;
    }

    printSuggestions(n){
        let finalResults = this.sortedSuggestions.slice(0, n);
        finalResults.forEach(suggestion => {
            console.log(suggestion, "\t|Appears: ", this.suggestionPriority[suggestion], "times");
        });
        console.log("-------------");

        return finalResults;
    }

}

try{
    let tool = new suggestionTool("long.txt").cleanWords();

    tool.createSuggestions("I")
        .sortSuggestions()
        .printSuggestions(5);

    /*tool.createSuggestions("I am very hungry")
        .sortSuggestions()
        .printSuggestions(5);*/

    tool.createSuggestions("I'll be")
        .sortSuggestions()
        .printSuggestions(5);


    tool.createSuggestions("As you may")
        .sortSuggestions()
        .printSuggestions(5);


    tool.createSuggestions("help")
        .sortSuggestions()
        .printSuggestions(5);
}
catch(error){
    console.log(error.message)
}