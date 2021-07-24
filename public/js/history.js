function renderDate (){
    
    let mydate = new Date();
    let year = mydate.getYear();
        if(year < 1000){
            year +=1900
        }
    let day = mydate.getDay();
    let month = mydate.getMonth();
    let daymonth = mydate.getDate();
    let dayarray = new Array("Sunday,", "Monday,", "Tuesday,", "Wednesday,", "Thursday,", "Friday,", "Saturday,");
    let montharray = new Array("January", "February", "March", "April", "May", "June", "July", 
                                "August", "September", "October", "November", "December");
 
    let myCalendar = document.getElementById("currentDate");
    myCalendar.textContent = " " +dayarray[day]+ " " +montharray[month]+ " " +daymonth+ ", " +year+ " - Today";
    myCalendar.innerText = " " +dayarray[day]+ " " +montharray[month]+ " " +daymonth+ ", " +year+ " - Today";

    setTimeout("renderDate()", 1000);

}
renderDate();