var time = moment();
//Show date
$("#currentDay").text(time.format('dddd, MMMM Do'));
//element constants
const timeBlockEl = $(".time-block");
// variables
var hour = moment().hours();
var timeBlocks = [];
let chronoDictionary = ["past", "present", "future"];
//Create the timeblock elements
for (let i = 9, count = 0; i <= 17; i++, count++){
    let timeBlock = CreateTimeBlock(count, GetChronoOrder(time.diff(GetOffsetMoment(i), 'hours')));
    timeBlock.hourCol.text(ConvertTime(i));
    timeBlocks.push(timeBlock);
    timeBlockEl.append(timeBlock.row);
}

// Read local storage for saved text and write it
timeBlocks.forEach(element => {
    if (localStorage.getItem("TimeBlockData"+element.index)){
        element.textArea.text(JSON.parse(localStorage.getItem("TimeBlockData"+element.index)));
    }
});

timeBlockEl.on("click", SaveTextData);

function SaveTextData(event){
    if(event.target.tagName === "I"){
        let index = event.target.id;
        let text = timeBlocks[index].textArea[0].value;
        if (!localStorage.getItem("TimeBlockData"+index) && text === "") {return;}
        localStorage.setItem("TimeBlockData"+index, JSON.stringify(text));
        ClearEmptyStorage();
    }
}

function CreateTimeBlock(p_index, p_chronoRelation){
    let _row = $("<tr>");
    _row.attr("class", "row");
    // Hour Col
    let _hourCol = $("<td>");
    _hourCol.attr("class", "hour");
    // Text Input col
    let _textCol = $("<td>");
    _textCol.attr("class", "description " + chronoDictionary[p_chronoRelation]);
    let _textArea = $("<textarea>");
    _textCol.append(_textArea);
    // Save Col
    let _saveBtnCol = $("<td>");
    _saveBtnCol.attr("class", "saveBtn");
    let _saveIcon = $("<i>");
    _saveIcon.attr("class", "fa fa-save");
    _saveIcon.attr("style", "padding: 35px");
    _saveIcon.attr("id", p_index+"")
    _saveBtnCol.append(_saveIcon);
    // Append Cols
    _row.append(_hourCol);
    _row.append(_textCol);
    _row.append(_saveBtnCol);
    let timeBlock = {
        row: _row,
        hourCol: _hourCol,
        textCol: _textCol,
        textArea: _textArea,
        saveBtnCol: _saveBtnCol,
        saveIcon: _saveIcon,
        index: p_index
    };
    return timeBlock;
}

function ConvertTime(p_hour){
    let convertedTime;
    if (p_hour < 12) { convertedTime = p_hour + "am"; }
    else if (p_hour == 0 || p_hour == 24) { convertedTime = 12 + "am"; }
    else if (p_hour == 12) { convertedTime = p_hour + "pm"; }
    else { convertedTime = (p_hour-12) + "pm";} //anytime over 12
    return convertedTime;
}

//Returns 0 - past
// 1 - present
// 2 - future 
function GetChronoOrder(p_timeDiff){
    if (p_timeDiff < 0) { return 0; }
    else if (p_timeDiff === 0) { return 1; }
    else if (p_timeDiff > 0) { return 2; }
}

function GetOffsetMoment(p_offsetHours){
    let _currrentTime = moment();
    if (time.hours() == p_offsetHours){return _currrentTime;}
    else if (_currrentTime.hours() < p_offsetHours){return _currrentTime.add(p_offsetHours, 'hours')}
    else {return _currrentTime.subtract(p_offsetHours, 'hours')}
}

function ClearEmptyStorage(){
    timeBlocks.forEach(element => {
        if (localStorage.getItem("TimeBlockData"+element.index) && JSON.parse(localStorage.getItem("TimeBlockData"+element.index)) === ""){
            localStorage.removeItem("TimeBlockData"+element.index);
        }
    });
}