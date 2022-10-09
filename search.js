var searchResultsElement = $("#search-results");
var submitBtn = $(".btn-primary");
/*
 *  Generates the search results that you see on the page when given a data blob representing the search results.
 */
function displaySearchResults(data) {
    /* First, we want to create the header that displays "Showing results for " */
    var searchQuery = data.search.query;
    console.log(searchQuery);
    var headerToAdd = $("<h2>");
    headerToAdd.attr("id", "search-results-header");
    headerToAdd.text("Showing results for " + searchQuery + ":");
    searchResultsElement.append(headerToAdd);

    /* Now, we go through each result in the data returned, and create a card for it. */
    var resultList = data.results;

    for (var i = 0; i < resultList.length; i++) {
        var cardToAdd = $("<div>");
        cardToAdd.addClass("card my-3");

        var cardBody = $("<div>");
        cardBody.addClass("card-body d-flex flex-column align-items-start");
        cardToAdd.append(cardBody);

        var resultTitle = resultList[i].title;
        var cardHeader = $("<h3>");
        cardHeader.addClass("card-title");
        cardHeader.text(resultTitle);
        cardBody.append(cardHeader);

        var date = resultList[i].date;
        var dateToAdd = $("<p>");
        dateToAdd.addClass("card-subtitle text-muted");
        dateToAdd.text("Date: " + date);
        cardBody.append(dateToAdd);

        /* Sometimes the result comes without a description. In that case, we'll set the subjects to none. */
        var subjects = resultList[i].subject;
        var subjectText = "Subjects: ";
        if (subjects) {
            subjectText = subjectText + subjects.join(", ");
        } else {
            subjectText = subjectText + "none";
        }
        var subjectsToAdd = $("<p>");
        subjectsToAdd.addClass("card-text");
        subjectsToAdd.text(subjectText);
        cardBody.append(subjectsToAdd);

        /* Sometimes a result comes with no description. In that case I set it to "No description for this entry" */
        var description = "Description: ";
        var descriptions = resultList[i].description;
        if (descriptions && (descriptions != "")) {
            description = description + descriptions[0];
        } else {
            description = description + "No description for this entry";
        }
        console.log(description);

        var descriptionToAdd = $("<p>");
        descriptionToAdd.addClass("card-text");
        descriptionToAdd.text(description);
        cardBody.append(description);

        /* 
         *  Sometimes the URL is delivered to us just as //{location}, so we have to check to see if that's the case and add an https: in 
         *  front of it.
         */
        var resultURL = resultList[i].url;
        if (resultURL.substring(0, 2) == "//") {
            //console.log(resultURL);
            resultURL = "https:" + resultURL;
        }
        //console.log(resultURL);

        /* Now we create and add the button that links to whatever the result is.  */
        var linkToAdd = $("<a>");
        linkToAdd.addClass("btn btn-primary mt-3");
        linkToAdd.attr("role", "button");
        linkToAdd.attr("href", resultURL);
        linkToAdd.attr("target", "_blank");
        linkToAdd.text("Read More");
        cardBody.append(linkToAdd);

        searchResultsElement.append(cardToAdd);
    }
}

function goBackButtonOnClick(event) {
    document.location.replace("./index.html");
}

function fetchData(searchQuery, searchFormat) {
    var url = "https://www.loc.gov/" + searchFormat + "/?q=" + searchQuery + "&fo=json";
    console.log(url);

    fetch(url)
        .then(function (response) {
            console.log("response", response);

            return response.json();
        })
        .then(function (data) {
            console.log("data", data);
            displaySearchResults(data);
        });
}

// fetchData("Chicago", "manuscripts");
//linking fetchData to button
$(function startSearch() {
    $(submitBtn).on("click", function (event) {
        event.preventDefault();
        var searchQuery = $("#exampleFormControlInput1").val();
        var searchFormat = $("#exampleFormControlSelect1").val();
        fetchData(searchQuery, searchFormat);
    })
});